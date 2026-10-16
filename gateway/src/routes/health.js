/**
 * AJAYNXT AI Design Studio — Health & Provider Status Routes
 */

const express = require('express');
const router = express.Router();
const providerRegistry = require('../services/provider-registry');
const budget = require('../services/budget');

router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'ajaynxt-ai-studio-gateway',
    timestamp: new Date().toISOString(),
    budgetStatus: budget.getBudgetStatus().status
  });
});

router.get('/providers/status', (req, res) => {
  const statuses = providerRegistry.getAllStatuses();
  res.json({
    count: statuses.length,
    timestamp: new Date().toISOString(),
    providers: statuses
  });
});

module.exports = router;
