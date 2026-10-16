/**
 * AJAYNXT AI Design Studio — Low-Cost Background Removal Routes
 * Primary: Photoroom API. Alternative: remove.bg API.
 * Protected by atomic cost reservations and emergency kill switches.
 */

const express = require('express');
const router = express.Router();
const bgRemoval = require('../providers/bg-removal');
const providerRegistry = require('../services/provider-registry');
const budget = require('../services/budget');

router.post('/remove', async (req, res) => {
  let reservation = null;
  try {
    const { imageBase64, provider: requestedProvider = 'photoroom', allowAlternativeProvider = false } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'INVALID_ARGUMENT', message: 'imageBase64 field is required.' });
    }

    // 1. Explicit provider resolution
    const { provider, isFallback } = providerRegistry.resolveProvider(
      requestedProvider,
      'background_removal',
      allowAlternativeProvider
    );

    // 2. Atomic Budget Reservation (both Photoroom and remove.bg are paid services)
    reservation = await budget.reserveBudget({
      userId: req.user ? req.user.uid : 'dev_user',
      providerId: provider.id,
      operation: 'background_removal',
      isPaid: true,
      params: {
        providerId: provider.id,
        imageLength: imageBase64.length
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

    // 3. Execution
    let output;
    let cost = 0.05;

    if (provider.id === 'photoroom') {
      output = await bgRemoval.removeWithPhotoroom({ imageBase64 });
      cost = output.costEstimatedUSD || 0.05;
    } else if (provider.id === 'remove_bg') {
      output = await bgRemoval.removeWithRemoveBg({ imageBase64 });
      cost = output.costEstimatedUSD || 0.12;
    } else {
      throw new Error(`Unsupported background removal provider ${provider.id}`);
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
      error: 'BACKGROUND_REMOVAL_FAILED',
      message: err.message
    });
  }
});

module.exports = router;
