/**
 * AJAYNXT AI Design Studio — Low-Cost Image Generation Routes
 * Atomic cost reservation, resolution-based pricing, and emergency kill switches.
 */

const express = require('express');
const router = express.Router();
const imageGen = require('../providers/image-gen');
const huggingFace = require('../providers/huggingface');
const providerRegistry = require('../services/provider-registry');
const budget = require('../services/budget');

router.post('/generate', async (req, res) => {
  let reservation = null;
  try {
    const {
      prompt,
      provider: requestedProvider = 'nvidia_nim',
      allowFallback = false,
      negativePrompt,
      width = 1024,
      height = 1024,
      aspectRatio
    } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'INVALID_ARGUMENT', message: 'Prompt field is required.' });
    }

    let targetCategory = 'image_generation';
    if (requestedProvider === 'hugging_face') {
      targetCategory = 'experimental_generation';
    }

    // 1. Explicit provider resolution & state check
    const { provider, isFallback } = providerRegistry.resolveProvider(requestedProvider, targetCategory, allowFallback);

    // 2. Atomic Budget Reservation
    const isPaid = (provider.id === 'gemini_image' || provider.id === 'google_imagen');
    reservation = await budget.reserveBudget({
      userId: req.user ? req.user.uid : 'dev_user',
      providerId: provider.id,
      operation: 'image_generation',
      isPaid,
      params: {
        prompt: prompt.trim(),
        resolution: `${width}x${height}`,
        aspectRatio
      }
    });

    if (reservation.cached) {
      return res.json({
        success: true,
        cached: true,
        message: reservation.message,
        result: reservation.result
      });
    }

    // 3. Provider Execution
    let output;
    let cost = 0.0;

    if (provider.id === 'nvidia_nim') {
      output = await imageGen.generateWithNvidiaNIM({ prompt, negativePrompt, width, height });
      cost = output.costEstimatedUSD || 0.002;
    } else if (provider.id === 'gemini_image' || provider.id === 'google_imagen') {
      output = await imageGen.generateWithGoogleImagen({ prompt, aspectRatio, width, height });
      cost = output.costEstimatedUSD || budget.calculateDynamicEstimatedCostUSD({
        operation: 'image_generation',
        providerId: provider.id,
        resolution: `${width}x${height}`
      });
    } else if (provider.id === 'hugging_face') {
      output = await huggingFace.generateExperiment({ prompt });
      cost = 0.0;
    } else {
      throw new Error(`Unsupported provider ${provider.id}`);
    }

    // 4. Reconcile Success
    await budget.reconcileBudget({
      requestId: reservation.requestId,
      status: 'SUCCESS',
      actualCostUSD: cost,
      result: output
    });

    res.json({
      success: true,
      provider: provider.name,
      isFallback,
      estimatedCostUSD: cost,
      estimatedCostINR: budget.usdToInr(cost),
      result: output
    });
  } catch (err) {
    if (reservation && reservation.requestId) {
      const isTimeout = err.code === 'ETIMEDOUT' || err.message.toLowerCase().includes('timeout');
      await budget.reconcileBudget({
        requestId: reservation.requestId,
        status: isTimeout ? 'TIMEOUT' : 'FAILED',
        error: err.message
      });
    }

    res.status(500).json({
      error: 'IMAGE_GENERATION_FAILED',
      message: err.message
    });
  }
});

module.exports = router;
