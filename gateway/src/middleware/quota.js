/**
 * AJAYNXT AI Design Studio — Quota & Budget Enforcement Middleware
 */

const budget = require('../services/budget');
const metering = require('../services/metering');

module.exports = function enforceBudget(estimatedCost = 0.005) {
  return function(req, res, next) {
    const budgetStatus = budget.getBudgetStatus();

    // Attach budget metadata to response headers
    res.setHeader('X-Budget-Status', budgetStatus.status);
    res.setHeader('X-Current-Spend-USD', budgetStatus.currentSpendUSD.toString());
    res.setHeader('X-Monthly-Limit-USD', budgetStatus.monthlyLimitUSD.toString());

    // Check project spending limit
    const check = budget.checkCanExecute(estimatedCost);
    if (!check.allowed) {
      return res.status(402).json({
        error: 'BUDGET_LIMIT_EXCEEDED',
        message: check.reason,
        budget: budgetStatus
      });
    }

    req.estimatedCostUSD = estimatedCost;
    next();
  };
};
