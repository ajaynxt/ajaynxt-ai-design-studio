/**
 * AJAYNXT AI Design Studio — Provider & Budget Dashboard Module
 * Displays live configuration state, free quotas, costs, licenses, and monthly spending.
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
                <span class="ai-sparkle-icon">⚙️</span>
                <h3 class="modal-title">AI Provider & Budget Gateway Status</h3>
              </div>
              <p class="modal-subtitle">Live multi-provider status, free tiers, costs, and project spending limits.</p>
            </div>
            <button class="modal-close-btn" id="close-provider-modal">&times;</button>
          </div>

          <div style="padding: 24px; max-height: calc(85vh - 120px); overflow-y: auto;">
            <!-- Budget & Spending Limit Card -->
            <div class="budget-card" id="budget-card-container">
              <div class="budget-card-header">
                <div>
                  <h4 style="font-size: 15px; color: #fff;">Monthly Cloud Spending Cap</h4>
                  <p style="font-size: 12px; color: #94a3b8;">Hard stop prevents unexpected charges when monthly budget is reached.</p>
                </div>
                <span class="badge badge-gold" id="budget-status-pill">HEALTHY</span>
              </div>
              <div class="budget-meter-wrap" style="margin: 14px 0 8px 0;">
                <div class="budget-progress-bar">
                  <div class="budget-progress-fill" id="budget-fill" style="width: 0%;"></div>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:12px; color:#cbd5e1; margin-top:6px;">
                  <span id="budget-current-text">Current Spend: $0.00</span>
                  <span id="budget-limit-text">Monthly Limit: $25.00</span>
                </div>
              </div>
            </div>

            <!-- Provider Status Table -->
            <h4 style="font-size: 15px; color: #fff; margin: 24px 0 12px 0;">Integrated AI Provider Adapters</h4>
            <div class="providers-table-wrap">
              <table class="table-dark" style="width: 100%; border-collapse: collapse; font-size: 12px;">
                <thead>
                  <tr style="border-bottom: 1px solid #334155; text-align: left; color: #94a3b8;">
                    <th style="padding: 10px 8px;">Provider / Adapter</th>
                    <th style="padding: 10px 8px;">Category</th>
                    <th style="padding: 10px 8px;">Status</th>
                    <th style="padding: 10px 8px;">Free Tier</th>
                    <th style="padding: 10px 8px;">Cost Structure</th>
                    <th style="padding: 10px 8px;">License / Terms</th>
                  </tr>
                </thead>
                <tbody id="providers-table-body">
                  <tr>
                    <td colspan="6" style="padding: 20px; text-align: center; color: #94a3b8;">Loading live provider statuses...</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Fallback & Privacy Policy Notice -->
            <div class="provider-policy-notice" style="margin-top: 20px; background: rgba(15, 23, 42, 0.6); border: 1px solid #334155; border-radius: 8px; padding: 14px;">
              <h5 style="color: #d4af37; font-size: 13px; margin-bottom: 6px;">🔒 Strict Routing & Fallback Policy</h5>
              <p style="font-size: 12px; color: #94a3b8; line-height: 1.5;">
                Every generation request is dispatched to its explicitly configured provider. The gateway strictly prevents silent failovers to paid providers (e.g. falling back from free NVIDIA NIM to paid Google Imagen) unless you explicitly check "Allow alternative provider". Credentials and API keys are stored exclusively in Cloud Run Secret Manager and are never exposed to browser code.
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

      if (fillEl && budgetData) {
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
          statusPill.className = 'badge badge-gold';
          statusPill.textContent = 'HEALTHY';
        }
        currentText.textContent = `Current Spend: $${(budgetData.currentSpendUSD || 0).toFixed(4)}`;
        limitText.textContent = `Monthly Limit: $${(budgetData.monthlyLimitUSD || 25).toFixed(2)}`;
      }

      // 2. Fetch Provider Statuses
      const providersData = await gateway.getProviderStatuses();
      const tbody = this.modalEl.querySelector('#providers-table-body');
      if (tbody && providersData && providersData.providers) {
        tbody.innerHTML = providersData.providers.map(p => {
          let badgeClass = 'badge-gold';
          if (p.state === 'CONFIGURED') badgeClass = 'badge-green';
          else if (p.state === 'UNCONFIGURED') badgeClass = 'badge-gray';
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
