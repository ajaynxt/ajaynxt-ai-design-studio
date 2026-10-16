/**
 * AJAYNXT AI Design Studio — Enterprise Budget & Atomic Reservation Controller
 * Enforces ₹300 INR total monthly budget, ₹200 INR AI sub-budget,
 * atomic reservation, timeout reconciliation, concurrency locks, and Kill Switches.
 */

const crypto = require('crypto');
const config = require('../config');
const metering = require('./metering');

class BudgetController {
  constructor() {
    this.currency = config.currency.baseCurrency; // 'INR'
    this.usdToInrRate = config.currency.usdToInrRate; // 84.00
    this.monthlyBudgetINR = config.currency.monthlyBudgetINR; // 300.00
    this.aiSubBudgetINR = config.currency.aiSubBudgetINR; // 200.00
    this.safetyBufferINR = config.currency.safetyBufferINR; // 100.00

    // Master & Granular Kill Switches
    this.masterPaidOpsEnabled = config.killSwitches.masterPaidOpsEnabled; // default false
    this.providerSwitches = { ...config.killSwitches.providers };
    this.operationSwitches = { ...config.killSwitches.operations };

    // Active in-flight reservations: Map<requestId, Reservation>
    this.activeReservations = new Map();

    // Completed jobs cache for Idempotency: Map<fingerprint, CachedResult>
    this.idempotencyCache = new Map();

    // Jobs requiring manual / async reconciliation (e.g. on provider timeout)
    this.unreconciledJobs = new Map();
  }

  /**
   * Helper to convert USD to INR and vice-versa
   */
  usdToInr(usd) {
    return parseFloat((usd * this.usdToInrRate).toFixed(2));
  }

  inrToUsd(inr) {
    return parseFloat((inr / this.usdToInrRate).toFixed(4));
  }

  /**
   * Calculates dynamic estimated cost based on operation, provider, resolution, and input units
   */
  calculateDynamicEstimatedCostUSD({ operation, providerId, resolution = '1024x1024', inputTokens = 0, outputTokens = 0, units = 1 }) {
    if (operation === 'prompt_refinement') {
      // If Gemini free tier is used on Google AI Studio, cost is 0.00
      if (providerId === 'gemini') {
        return 0.00;
      }
      // If paid API tier
      const costIn = (inputTokens / 1000) * (config.providers.gemini.costPer1kTokensIn || 0.00010);
      const costOut = (outputTokens / 1000) * (config.providers.gemini.costPer1kTokensOut || 0.00040);
      return Math.max(0.0001, parseFloat((costIn + costOut).toFixed(5)));
    }

    if (operation === 'image_generation') {
      if (providerId === 'nvidia_nim') {
        // Free trial developer quota
        return 0.00; // Free developer credits
      }
      if (providerId === 'gemini_image' || providerId === 'google_imagen') {
        const rates = config.providers.geminiImage.resolutionPricingUSD || {
          '512x512': 0.015,
          '1024x1024': 0.030,
          '2048x2048': 0.060
        };
        return rates[resolution] || rates['1024x1024'];
      }
      return 0.030; // conservative default
    }

    if (operation === 'background_removal') {
      if (providerId === 'photoroom') {
        return config.providers.photoroom.costPerCall || 0.050;
      }
      if (providerId === 'remove_bg') {
        return config.providers.removeBg.costPerCall || 0.120;
      }
      return 0.050;
    }

    if (operation === 'ocr') {
      // Google Cloud Vision: 1st 1,000 units are free
      return 0.00;
    }

    return 0.010;
  }

  /**
   * Generates a deterministic SHA-256 fingerprint for request deduplication
   */
  generateRequestFingerprint(userId, operation, params = {}) {
    const canonical = JSON.stringify({
      userId: userId || 'anonymous',
      operation,
      params
    });
    return crypto.createHash('sha256').update(canonical).digest('hex');
  }

  /**
   * Returns current budget status in both INR and USD
   */
  getBudgetStatus() {
    const currentSpendUSD = metering.getMonthlySpend();
    const currentSpendINR = this.usdToInr(currentSpendUSD);

    // Calculate total reserved across in-flight & unreconciled jobs
    let totalReservedUSD = 0;
    for (const res of this.activeReservations.values()) {
      totalReservedUSD += res.reservedCostUSD;
    }
    for (const unrec of this.unreconciledJobs.values()) {
      totalReservedUSD += unrec.reservedCostUSD;
    }
    const totalReservedINR = this.usdToInr(totalReservedUSD);

    const committedSpendINR = currentSpendINR + totalReservedINR;
    const aiSubBudgetRemainingINR = Math.max(0, parseFloat((this.aiSubBudgetINR - committedSpendINR).toFixed(2)));
    const totalRemainingBudgetINR = Math.max(0, parseFloat((this.monthlyBudgetINR - committedSpendINR).toFixed(2)));
    const percentUsed = parseFloat(((committedSpendINR / this.aiSubBudgetINR) * 100).toFixed(2));

    const isExceeded = committedSpendINR >= this.aiSubBudgetINR;
    const isWarning = percentUsed >= config.currency.warningThresholdPercent && !isExceeded;

    return {
      currency: this.currency,
      usdToInrRate: this.usdToInrRate,
      // Total Project Budget Cap
      monthlyBudgetINR: this.monthlyBudgetINR,
      aiSubBudgetINR: this.aiSubBudgetINR,
      safetyBufferINR: this.safetyBufferINR,
      // Spend & Reservations
      currentSpendINR,
      currentSpendUSD,
      totalReservedINR,
      totalReservedUSD,
      committedSpendINR,
      aiSubBudgetRemainingINR,
      totalRemainingBudgetINR,
      percentUsed,
      // Status Flags
      isWarning,
      isExceeded,
      status: isExceeded ? 'EXCEEDED' : (isWarning ? 'WARNING' : 'HEALTHY'),
      // Master & Provider Kill Switches
      masterPaidOpsEnabled: this.masterPaidOpsEnabled,
      providerSwitches: this.providerSwitches,
      operationSwitches: this.operationSwitches,
      unreconciledCount: this.unreconciledJobs.size,
      message: isExceeded
        ? `Monthly AI budget cap (₹${this.aiSubBudgetINR} INR) reached. Paid operations blocked.`
        : (isWarning ? `Monthly budget at ${percentUsed}% of AI limit (₹${this.aiSubBudgetINR} INR).` : 'Within safe low-cost budget.')
    };
  }

  /**
   * Sets Master Kill Switch or individual provider/operation switch
   */
  setKillSwitch({ masterPaidOps, providerId, providerEnabled, operation, operationEnabled }) {
    if (typeof masterPaidOps === 'boolean') {
      this.masterPaidOpsEnabled = masterPaidOps;
    }
    if (providerId && typeof providerEnabled === 'boolean') {
      this.providerSwitches[providerId] = providerEnabled;
    }
    if (operation && typeof operationEnabled === 'boolean') {
      this.operationSwitches[operation] = operationEnabled;
    }
    return this.getBudgetStatus();
  }

  /**
   * Pre-Request Atomic Reservation
   * Enforces kill switches, concurrency locks, idempotency, and INR budget ceilings.
   */
  async reserveBudget({ userId, providerId, operation, isPaid = false, params = {} }) {
    const fingerprint = this.generateRequestFingerprint(userId, operation, params);

    // 1. Check Idempotency: Return cached result if already completed within 10 minutes
    const cached = this.idempotencyCache.get(fingerprint);
    if (cached && (Date.now() - cached.timestamp < 10 * 60 * 1000)) {
      return {
        cached: true,
        result: cached.result,
        message: 'Returning idempotent cached result (no repeat charge)'
      };
    }

    // 2. Prevent concurrent duplicate requests with identical fingerprint
    for (const res of this.activeReservations.values()) {
      if (res.fingerprint === fingerprint) {
        throw new Error('A concurrent identical request is already in progress. Please wait for it to complete.');
      }
    }

    // 3. Free operations (Gemini prompt refinement, Cloud Vision under 1k) bypass paid guards
    if (!isPaid) {
      const freeRequestId = 'free_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 4);
      return {
        allowed: true,
        requestId: freeRequestId,
        isPaid: false,
        estimatedCostUSD: 0.00,
        estimatedCostINR: 0.00
      };
    }

    // 4. Verify Master Kill Switch
    if (!this.masterPaidOpsEnabled) {
      throw new Error('Paid AI operations are disabled by administrator. Contact owner to approve paid generation.');
    }

    // 5. Verify Granular Operation Kill Switch
    if (this.operationSwitches[operation] === false) {
      throw new Error(`Operation "${operation}" is currently disabled by administrator kill switch.`);
    }

    // 6. Verify Granular Provider Kill Switch
    if (this.providerSwitches[providerId] === false) {
      throw new Error(`Provider "${providerId}" is currently disabled by administrator kill switch.`);
    }

    // 7. Calculate dynamic estimated cost
    const estimatedCostUSD = this.calculateDynamicEstimatedCostUSD({
      operation,
      providerId,
      resolution: params.resolution || '1024x1024',
      inputTokens: params.inputTokens || 0,
      outputTokens: params.outputTokens || 0,
      units: params.units || 1
    });
    const estimatedCostINR = this.usdToInr(estimatedCostUSD);

    // 8. Atomic Budget Check: Current Spend + Total In-Flight Reservations + Max Estimated Cost <= AI Sub-Budget
    const currentSpendUSD = metering.getMonthlySpend();
    const currentSpendINR = this.usdToInr(currentSpendUSD);

    let totalReservedUSD = 0;
    for (const r of this.activeReservations.values()) {
      totalReservedUSD += r.reservedCostUSD;
    }
    for (const u of this.unreconciledJobs.values()) {
      totalReservedUSD += u.reservedCostUSD;
    }
    const totalReservedINR = this.usdToInr(totalReservedUSD);

    if ((currentSpendINR + totalReservedINR + estimatedCostINR) > this.aiSubBudgetINR) {
      throw new Error(
        `Operation rejected: Adding ₹${estimatedCostINR} INR ($${estimatedCostUSD} USD) would exceed the monthly AI sub-budget cap (₹${this.aiSubBudgetINR} INR). ` +
        `Current committed: ₹${(currentSpendINR + totalReservedINR).toFixed(2)} INR.`
      );
    }

    // 9. Atomic Reservation Lock
    const requestId = 'res_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6);
    const reservation = {
      requestId,
      fingerprint,
      userId,
      providerId,
      operation,
      reservedCostUSD: estimatedCostUSD,
      reservedCostINR: estimatedCostINR,
      createdAt: Date.now(),
      params
    };

    this.activeReservations.set(requestId, reservation);

    return {
      allowed: true,
      requestId,
      isPaid: true,
      estimatedCostUSD,
      estimatedCostINR,
      fingerprint
    };
  }

  /**
   * Post-Execution Reconciliation
   * Reconciles actual cost, releases reservation, updates metering, or marks uncertain timeouts.
   */
  async reconcileBudget({ requestId, status, actualCostUSD = null, result = null, error = null }) {
    const reservation = this.activeReservations.get(requestId);
    if (!reservation) {
      // Might be a free operation or already reconciled
      return;
    }

    // Remove from active in-flight map
    this.activeReservations.delete(requestId);

    if (status === 'SUCCESS') {
      const finalCostUSD = actualCostUSD !== null ? actualCostUSD : reservation.reservedCostUSD;
      const finalCostINR = this.usdToInr(finalCostUSD);

      // Record to metering audit log
      await metering.recordUsage({
        userId: reservation.userId,
        providerId: reservation.providerId,
        operation: reservation.operation,
        units: 1,
        estimatedCostUSD: finalCostUSD,
        metadata: {
          requestId,
          costINR: finalCostINR,
          resolution: reservation.params.resolution
        }
      });

      // Cache idempotent result for 10 minutes
      if (result && reservation.fingerprint) {
        this.idempotencyCache.set(reservation.fingerprint, {
          timestamp: Date.now(),
          result
        });
      }

      return {
        reconciled: true,
        status: 'SUCCESS',
        finalCostUSD,
        finalCostINR
      };
    }

    if (status === 'FAILED') {
      // Normal failure: zero cost incurred, release reservation completely
      return {
        reconciled: true,
        status: 'FAILED',
        costIncurred: 0
      };
    }

    if (status === 'TIMEOUT' || status === 'UNCERTAIN') {
      // A provider timeout does NOT mean 0 cost was incurred. Keep reservation until reconciled!
      const unreconciledRecord = {
        ...reservation,
        markedAt: Date.now(),
        reason: error || 'Provider connection timeout - awaiting billing reconciliation'
      };
      this.unreconciledJobs.set(requestId, unreconciledRecord);

      return {
        reconciled: false,
        status: 'RECONCILIATION_REQUIRED',
        message: 'Operation timed out. Reservation held in escrow until billing confirmation.'
      };
    }
  }
}

module.exports = new BudgetController();
