/**
 * AJAYNXT AI Design Studio — AI Brief & Image Understanding Routes
 */

const express = require('express');
const router = express.Router();
const gemini = require('../providers/gemini');
const providerRegistry = require('../services/provider-registry');
const metering = require('../services/metering');
const enforceBudget = require('../middleware/quota');

// 1. Refine Design Brief via Gemini API
router.post('/refine-brief', enforceBudget(0.0005), async (req, res) => {
  try {
    const { prompt, brand, projectType, audience, exactText, currentStyle } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'INVALID_ARGUMENT', message: 'Prompt field is required.' });
    }

    // Explicit provider resolution
    const { provider } = providerRegistry.resolveProvider('gemini', 'llm_and_vision', false);

    const result = await gemini.refineDesignBrief({
      prompt,
      brand,
      projectType,
      audience,
      exactText,
      currentStyle
    });

    // Record usage & estimated cost
    await metering.recordUsage({
      userId: req.user ? req.user.uid : 'dev_user',
      providerId: 'gemini',
      operation: 'ai_refine_brief',
      units: 1,
      estimatedCostUSD: 0.00025,
      metadata: { brand: brand || 'Diamond Bakery', projectType }
    });

    res.json({
      success: true,
      provider: provider.name,
      brief: result.data || result
    });
  } catch (err) {
    res.status(500).json({
      error: 'AI_REFINEMENT_FAILED',
      message: err.message
    });
  }
});

// 2. Multimodal Image Understanding via Gemini Vision
router.post('/understand-image', enforceBudget(0.001), async (req, res) => {
  try {
    const { imageBase64, mimeType, instruction } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'INVALID_ARGUMENT', message: 'imageBase64 payload is required.' });
    }

    const { provider } = providerRegistry.resolveProvider('gemini', 'llm_and_vision', false);

    const result = await gemini.understandImage({
      imageBase64,
      mimeType,
      instruction
    });

    await metering.recordUsage({
      userId: req.user ? req.user.uid : 'dev_user',
      providerId: 'gemini',
      operation: 'ai_understand_image',
      units: 1,
      estimatedCostUSD: 0.0008
    });

    res.json({
      success: true,
      provider: provider.name,
      analysis: result.analysis
    });
  } catch (err) {
    res.status(500).json({
      error: 'IMAGE_UNDERSTANDING_FAILED',
      message: err.message
    });
  }
});

module.exports = router;
