/**
 * AJAYNXT AI Design Studio — Low-Cost Provider & Budget Dashboard Module
 * Displays verified provider models, INR/USD spending, atomic reservations,
 * and Owner Master & Granular Kill Switches.
 */

(function(window) {
  'use strict';

  class ProviderDashboard {
    constructor() {
      this.modalEl = null;
      this.gateway = window.StudioServices ? window.StudioServices.gateway : null;
      this.init();
    }

    init() {
      this.createModalDOM();
      this.bindEvents();
    }

    createModalDOM() {
      let modal = document.getElementById('provider-dashboard-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'provider-dashboard-modal';
        modal.className = 'studio-modal-backdrop';
        document.body.appendChild(modal);
      }
      this.modalEl = modal;

      this.modalEl.innerHTML = `
        <div class="studio-modal-dialog modal-lg">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <div class="ai-badge-header">
                <span class="ai-sparkle-icon">🛡️</span>
                <h3 class="modal-title">Low-Cost AI Gateway & Budget Guard</h3>
              </div>
              <p class="modal-subtitle">Real-time spend tracking in INR (₹300 Cap), atomic reservations, and Master Kill Switch.</p>
            </div>
            <button class="modal-close-btn" id="close-provider-modal">&times;</button>
          </div>

          <div style="padding: 24px; max-height: calc(85vh - 120px); overflow-y: auto;">
            <!-- Emergency Kill Switch Banner -->
            <div id="kill-switch-banner" style="background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.35); border-radius: 8px; padding: 14px 18px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h5 style="color: #ef4444; font-size: 14px; margin: 0 0 4px 0; font-weight: 600;">
                  🛑 Master Paid AI Kill Switch: <span id="master-switch-state">ENGAGED (SAFE)</span>
                </h5>
                <p style="color: #cbd5e1; font-size: 12px; margin: 0;">
                  All paid external image generation & background removal are locked. Zero billable calls can occur without owner approval.
                </p>
              </div>
              <button id="toggle-master-kill-switch" class="btn btn-sm" style="background: #ef4444; color: #fff; font-weight: 600; padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer;">
                Toggle Master Switch
              </button>
            </div>

            <!-- Budget & Spending Limit Card -->
            <div class="budget-card" id="budget-card-container">
              <div class="budget-card-header">
                <div>
                  <h4 style="font-size: 15px; color: #fff; margin: 0;">Monthly Development Budget: ₹300.00 INR (~$3.57 USD)</h4>
                  <p style="font-size: 12px; color: #94a3b8; margin: 4px 0 0 0;">
                    AI Sub-Budget: <strong style="color:#d4af37;">₹200.00 INR</strong> | Reserved Buffer: <strong style="color:#38bdf8;">₹100.00 INR</strong> (Hosting, Storage & Taxes)
                  </p>
                </div>
                <span class="badge badge-gold" id="budget-status-pill">HEALTHY</span>
              </div>
              <div class="budget-meter-wrap" style="margin: 14px 0 8px 0;">
                <div class="budget-progress-bar">
                  <div class="budget-progress-fill" id="budget-fill" style="width: 0%;"></div>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:12px; color:#cbd5e1; margin-top:6px;">
                  <span id="budget-current-text">Committed Spend: ₹0.00 INR ($0.00 USD)</span>
                  <span id="budget-limit-text">AI Sub-Budget Remaining: ₹200.00 INR</span>
                </div>
              </div>
            </div>

            <!-- Provider Status Table -->
            <h4 style="font-size: 15px; color: #fff; margin: 24px 0 12px 0;">Verified AI Provider Adapters & Operational Readiness</h4>
            <div class="providers-table-wrap">
              <table class="table-dark" style="width: 100%; border-collapse: collapse; font-size: 12px;">
                <thead>
                  <tr style="border-bottom: 1px solid #334155; text-align: left; color: #94a3b8;">
                    <th style="padding: 10px 8px;">Provider / Adapter</th>
                    <th style="padding: 10px 8px;">Category</th>
                    <th style="padding: 10px 8px;">Status</th>
                    <th style="padding: 10px 8px;">Free Tier Quota</th>
                    <th style="padding: 10px 8px;">Pricing Structure</th>
                    <th style="padding: 10px 8px;">License / Terms</th>
                  </tr>
                </thead>
                <tbody id="providers-table-body">
                  <tr>
                    <td colspan="6" style="padding: 20px; text-align: center; color: #94a3b8;">Loading verified provider statuses...</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Fallback & Privacy Policy Notice -->
            <div class="provider-policy-notice" style="margin-top: 20px; background: rgba(15, 23, 42, 0.6); border: 1px solid #334155; border-radius: 8px; padding: 14px;">
              <h5 style="color: #d4af37; font-size: 13px; margin-bottom: 6px;">🔒 Atomic Reservation & Cost Guard Policy</h5>
              <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin: 0;">
                Every paid generation request is preceded by a server-side atomic reservation in INR. If a request times out, the reservation is retained in escrow until billing reconciliation, protecting against hidden charges. No universal fixed pricing is used: image generation is dynamically estimated by resolution (512px, 1024px, 2048px). All credentials reside exclusively in Cloud Run Secret Manager.
              </p>
            </div>
          </div>
        </div>
      `;
    }

    bindEvents() {
      const modal = this.modalEl;
      if (!modal) return;

      modal.querySelector('#close-provider-modal').addEventListener('click', () => this.hide());

      // Master Kill Switch Toggle
      const toggleBtn = modal.querySelector('#toggle-master-kill-switch');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', async () => {
          const gateway = window.StudioServices ? window.StudioServices.gateway : this.gateway;
          const currentStatus = await (gateway ? gateway.getBudgetStatus() : null);
          const nextState = !Boolean(currentStatus && currentStatus.masterPaidOpsEnabled);

          if (confirm(`Are you sure you want to ${nextState ? 'ENABLE' : 'DISABLE'} the Master Paid AI Switch?`)) {
            try {
              const res = await fetch(`${gateway.baseUrl}/budget/kill-switch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ masterPaidOps: nextState })
              });
              if (res.ok) {
                alert(`Master Paid AI Switch is now ${nextState ? 'ENABLED' : 'DISABLED'}.`);
                this.refresh();
              }
            } catch (err) {
              alert('Could not toggle switch: ' + err.message);
            }
          }
        });
      }
    }

    async refresh() {
      const gateway = window.StudioServices ? window.StudioServices.gateway : this.gateway;
      if (!gateway) return;

      // 1. Fetch Budget Status
      const budgetData = await gateway.getBudgetStatus();
      const fillEl = this.modalEl.querySelector('#budget-fill');
      const statusPill = this.modalEl.querySelector('#budget-status-pill');
      const currentText = this.modalEl.querySelector('#budget-current-text');
      const limitText = this.modalEl.querySelector('#budget-limit-text');
      const switchStateEl = this.modalEl.querySelector('#master-switch-state');
      const toggleBtn = this.modalEl.querySelector('#toggle-master-kill-switch');

      if (budgetData) {
        if (switchStateEl && toggleBtn) {
          if (budgetData.masterPaidOpsEnabled) {
            switchStateEl.textContent = 'ENGAGED (PAID OPS PERMITTED)';
            switchStateEl.style.color = '#10b981';
            toggleBtn.textContent = 'Engage Emergency Stop';
            toggleBtn.style.background = '#ef4444';
          } else {
            switchStateEl.textContent = 'ENGAGED (PAID OPS BLOCKED)';
            switchStateEl.style.color = '#ef4444';
            toggleBtn.textContent = 'Enable Paid Ops (Owner Only)';
            toggleBtn.style.background = '#3b82f6';
          }
        }

        if (fillEl) {
          fillEl.style.width = `${Math.min(100, budgetData.percentUsed || 0)}%`;
          if (budgetData.isExceeded) {
            fillEl.style.backgroundColor = '#ef4444';
            statusPill.className = 'badge badge-red';
            statusPill.textContent = 'EXCEEDED (STOPPED)';
          } else if (budgetData.isWarning) {
            fillEl.style.backgroundColor = '#f59e0b';
            statusPill.className = 'badge badge-gold';
            statusPill.textContent = 'WARNING (80%)';
          } else {
            fillEl.style.backgroundColor = '#10b981';
            statusPill.className = 'badge badge-green';
            statusPill.textContent = 'HEALTHY';
          }
          currentText.textContent = `Committed: ₹${(budgetData.committedSpendINR || 0).toFixed(2)} INR ($${(budgetData.currentSpendUSD || 0).toFixed(4)} USD)`;
          limitText.textContent = `Remaining: ₹${(budgetData.aiSubBudgetRemainingINR || 200).toFixed(2)} INR of ₹${(budgetData.aiSubBudgetINR || 200).toFixed(2)}`;
        }
      }

      // 2. Fetch Provider Statuses
      const providersData = await gateway.getProviderStatuses();
      const tbody = this.modalEl.querySelector('#providers-table-body');
      if (tbody && providersData && providersData.providers) {
        tbody.innerHTML = providersData.providers.map(p => {
          let badgeClass = 'badge-gold';
          if (p.state === 'CONFIGURED') badgeClass = 'badge-green';
          else if (p.state === 'UNCONFIGURED') badgeClass = 'badge-gray';
          else if (p.state === 'DISABLED_BY_ADMIN') badgeClass = 'badge-red';
          else if (p.state === 'QUOTA_EXHAUSTED') badgeClass = 'badge-gold';
          else if (p.state === 'UNAVAILABLE') badgeClass = 'badge-red';

          return `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
              <td style="padding: 12px 8px; font-weight: 600; color: #fff;">${p.name}</td>
              <td style="padding: 12px 8px; color: #cbd5e1;"><code>${p.category}</code></td>
              <td style="padding: 12px 8px;">
                <span class="badge ${badgeClass}">${p.state}</span>
              </td>
              <td style="padding: 12px 8px; color: #94a3b8;">${p.freeTierDetails || (p.hasFreeTier ? 'Yes' : 'No Free Tier')}</td>
              <td style="padding: 12px 8px; color: #cbd5e1;">${p.costStructure || 'Metered'}</td>
              <td style="padding: 12px 8px; color: #94a3b8; font-size: 11px;">${p.license || 'Commercial API'}</td>
            </tr>
          `;
        }).join('');
      }
    }

    show() {
      this.refresh();
      this.modalEl.style.display = 'flex';
    }

    hide() {
      this.modalEl.style.display = 'none';
    }
  }

  window.ProviderDashboard = ProviderDashboard;
})(window);
