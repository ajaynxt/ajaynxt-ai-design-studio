/**
 * AJAYNXT AI Design Studio — Budget Management Routes
 */

const express = require('express');
const router = express.Router();
const budget = require('../services/budget');
const metering = require('../services/metering');

router.get('/status', (req, res) => {
  const status = budget.getBudgetStatus();
  const recentEvents = metering.getRecentEvents(10);
  res.json({
    ...status,
    recentEvents
  });
});

router.post('/limit', (req, res) => {
  const { limitUSD } = req.body;
  if (typeof limitUSD !== 'number' || limitUSD <= 0) {
    return res.status(400).json({ error: 'INVALID_ARGUMENT', message: 'limitUSD must be a positive number.' });
  }

  const updated = budget.setMonthlyLimit(limitUSD);
  res.json({
    success: updated,
    newLimitUSD: limitUSD,
    status: budget.getBudgetStatus()
  });
});

module.exports = router;
