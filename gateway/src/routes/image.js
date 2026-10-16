/**
 * AJAYNXT AI Design Studio — Image Generation Routes
 * Explicit routing between NVIDIA NIM, Google Imagen 3, and Hugging Face.
 */

const express = require('express');
const router = express.Router();
const imageGen = require('../providers/image-gen');
const huggingFace = require('../providers/huggingface');
const providerRegistry = require('../services/provider-registry');
const metering = require('../services/metering');
const enforceBudget = require('../middleware/quota');

router.post('/generate', enforceBudget(0.005), async (req, res) => {
  try {
    const { prompt, provider: requestedProvider = 'nvidia_nim', allowFallback = false, negativePrompt, width, height, aspectRatio } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'INVALID_ARGUMENT', message: 'Prompt field is required.' });
    }

    let targetCategory = 'image_generation';
    if (requestedProvider === 'hugging_face') {
      targetCategory = 'experimental_generation';
    }

    // Explicit provider resolution
    const { provider, isFallback } = providerRegistry.resolveProvider(requestedProvider, targetCategory, allowFallback);

    let output;
    let cost = 0.002;

    if (provider.id === 'nvidia_nim') {
      output = await imageGen.generateWithNvidiaNIM({ prompt, negativePrompt, width, height });
      cost = output.costEstimatedUSD || 0.002;
    } else if (provider.id === 'google_imagen') {
      output = await imageGen.generateWithGoogleImagen({ prompt, aspectRatio });
      cost = output.costEstimatedUSD || 0.030;
    } else if (provider.id === 'hugging_face') {
      output = await huggingFace.generateExperiment({ prompt });
      cost = 0.0;
    } else {
      return res.status(400).json({ error: 'UNSUPPORTED_PROVIDER', message: `Unknown provider ${provider.id}` });
    }

    // Record usage
    await metering.recordUsage({
      userId: req.user ? req.user.uid : 'dev_user',
      providerId: provider.id,
      operation: 'image_generation',
      units: 1,
      estimatedCostUSD: cost,
      metadata: { prompt: prompt.substring(0, 100), isFallback }
    });

    res.json({
      success: true,
      provider: provider.name,
      isFallback: isFallback,
      result: output
    });
  } catch (err) {
    res.status(500).json({
      error: 'IMAGE_GENERATION_FAILED',
      message: err.message
    });
  }
});

module.exports = router;
