/**
 * AJAYNXT AI Design Studio — Budget & Kill Switch Routes
 */

const express = require('express');
const router = express.Router();
const budget = require('../services/budget');
const metering = require('../services/metering');

// GET /api/v1/budget/status
router.get('/status', (req, res) => {
  const status = budget.getBudgetStatus();
  const recentEvents = metering.getRecentEvents(15);
  res.json({
    ...status,
    recentEvents
  });
});

// POST /api/v1/budget/kill-switch
router.post('/kill-switch', (req, res) => {
  const { masterPaidOps, providerId, providerEnabled, operation, operationEnabled } = req.body;

  const updatedStatus = budget.setKillSwitch({
    masterPaidOps,
    providerId,
    providerEnabled,
    operation,
    operationEnabled
  });

  res.json({
    success: true,
    message: 'Kill switch state updated successfully.',
    status: updatedStatus
  });
});

// POST /api/v1/budget/limit
router.post('/limit', (req, res) => {
  const { limitINR, aiSubBudgetINR } = req.body;

  if (typeof limitINR === 'number' && limitINR > 0) {
    budget.monthlyBudgetINR = limitINR;
  }
  if (typeof aiSubBudgetINR === 'number' && aiSubBudgetINR > 0) {
    budget.aiSubBudgetINR = aiSubBudgetINR;
    budget.safetyBufferINR = Math.max(0, budget.monthlyBudgetINR - budget.aiSubBudgetINR);
  }

  res.json({
    success: true,
    status: budget.getBudgetStatus()
  });
});

module.exports = router;
