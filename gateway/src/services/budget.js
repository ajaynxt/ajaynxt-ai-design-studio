/**
 * AJAYNXT AI Design Studio — Project-Level Budget & Spending Controller
 * Enforces hard spending caps and triggers warnings at 80% threshold.
 */

const config = require('../config');
const metering = require('./metering');

class BudgetController {
  constructor() {
    this.monthlyLimitUSD = config.budget.monthlySpendingLimitUSD;
    this.warningThresholdPercent = config.budget.warningThresholdPercent;
    this.enforceHardStop = config.budget.enforceHardStop;
  }

  getBudgetStatus() {
    const currentSpend = metering.getMonthlySpend();
    const percentUsed = (currentSpend / this.monthlyLimitUSD) * 100;
    const isExceeded = currentSpend >= this.monthlyLimitUSD;
    const isWarning = percentUsed >= this.warningThresholdPercent && !isExceeded;

    return {
      monthlyLimitUSD: this.monthlyLimitUSD,
      currentSpendUSD: currentSpend,
      percentUsed: parseFloat(percentUsed.toFixed(2)),
      isWarning: isWarning,
      isExceeded: isExceeded,
      status: isExceeded ? 'EXCEEDED' : (isWarning ? 'WARNING' : 'HEALTHY'),
      message: isExceeded
        ? `Monthly budget limit ($${this.monthlyLimitUSD}) exceeded. Generation halted.`
        : (isWarning ? `Monthly budget at ${percentUsed.toFixed(1)}% of limit ($${this.monthlyLimitUSD}).` : 'Within monthly budget.')
    };
  }

  setMonthlyLimit(newLimitUSD) {
    if (typeof newLimitUSD === 'number' && newLimitUSD > 0) {
      this.monthlyLimitUSD = newLimitUSD;
      return true;
    }
    return false;
  }

  checkCanExecute(estimatedCostUSD = 0) {
    const currentSpend = metering.getMonthlySpend();
    if (this.enforceHardStop && (currentSpend + estimatedCostUSD) > this.monthlyLimitUSD) {
      return {
        allowed: false,
        reason: `Operation rejected. Adding $${estimatedCostUSD} would exceed monthly spending limit ($${this.monthlyLimitUSD}). Current spend: $${currentSpend}.`
      };
    }
    return { allowed: true };
  }
}

module.exports = new BudgetController();
