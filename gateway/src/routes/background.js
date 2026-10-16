/**
 * AJAYNXT AI Design Studio — Background Removal Routes
 * Primary: Photoroom API. Alternative: remove.bg API.
 */

const express = require('express');
const router = express.Router();
const bgRemoval = require('../providers/bg-removal');
const providerRegistry = require('../services/provider-registry');
const metering = require('../services/metering');
const enforceBudget = require('../middleware/quota');

router.post('/remove', enforceBudget(0.05), async (req, res) => {
  try {
    const { imageBase64, provider: requestedProvider = 'photoroom', allowAlternativeProvider = false } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'INVALID_ARGUMENT', message: 'imageBase64 field is required.' });
    }

    // Resolve provider explicitly
    const { provider, isFallback } = providerRegistry.resolveProvider(
      requestedProvider,
      'background_removal',
      allowAlternativeProvider
    );

    let output;
    let cost = 0.05;

    if (provider.id === 'photoroom') {
      output = await bgRemoval.removeWithPhotoroom({ imageBase64 });
      cost = output.costEstimatedUSD || 0.05;
    } else if (provider.id === 'remove_bg') {
      output = await bgRemoval.removeWithRemoveBg({ imageBase64 });
      cost = output.costEstimatedUSD || 0.12;
    } else {
      return res.status(400).json({ error: 'UNSUPPORTED_PROVIDER', message: `Unknown provider ${provider.id}` });
    }

    // Record usage
    await metering.recordUsage({
      userId: req.user ? req.user.uid : 'dev_user',
      providerId: provider.id,
      operation: 'background_removal',
      units: 1,
      estimatedCostUSD: cost,
      metadata: { isFallback }
    });

    res.json({
      success: true,
      provider: provider.name,
      isFallback: isFallback,
      result: output
    });
  } catch (err) {
    res.status(500).json({
      error: 'BACKGROUND_REMOVAL_FAILED',
      message: err.message
    });
  }
});

module.exports = router;
