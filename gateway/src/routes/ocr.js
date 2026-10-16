/**
 * AJAYNXT AI Design Studio — Google Cloud Vision OCR Routes
 */

const express = require('express');
const router = express.Router();
const ocr = require('../providers/ocr');
const providerRegistry = require('../services/provider-registry');
const metering = require('../services/metering');
const enforceBudget = require('../middleware/quota');

router.post('/extract', enforceBudget(0.0015), async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'INVALID_ARGUMENT', message: 'imageBase64 payload is required.' });
    }

    const { provider } = providerRegistry.resolveProvider('cloud_vision', 'ocr', false);

    const result = await ocr.extractText({ imageBase64 });

    await metering.recordUsage({
      userId: req.user ? req.user.uid : 'dev_user',
      providerId: 'cloud_vision',
      operation: 'ocr_text_extraction',
      units: 1,
      estimatedCostUSD: result.costEstimatedUSD || 0.0015
    });

    res.json({
      success: true,
      provider: provider.name,
      result: result
    });
  } catch (err) {
    res.status(500).json({
      error: 'OCR_EXTRACTION_FAILED',
      message: err.message
    });
  }
});

module.exports = router;
