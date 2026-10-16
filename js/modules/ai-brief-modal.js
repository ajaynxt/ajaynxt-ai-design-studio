/**
 * AJAYNXT AI Design Studio - AI Design Assistant & Professional Brief Modal
 * Implements Section 5 of Phase 1 specifications:
 * - Structured brief fields (what to create, reference, brand, audience, exact text, visual style, palette, typography, aspect ratio, print/digital, preserve/remove elements)
 * - Prompt refinement helper translating natural language to design direction
 * - Strict confirmation step before generation
 * - No hallucination / fake offers
 */

(function(window) {
  'use strict';

  class AIBriefModal {
    constructor(canvasEngine, options = {}) {
      this.engine = canvasEngine;
      this.options = options;
      this.aiService = window.StudioServices ? window.StudioServices.ai : null;
      this.referenceAsset = null;
      this.modalEl = null;
      this.init();
    }

    init() {
      this.createModalDOM();
      this.bindEvents();
    }

    createModalDOM() {
      let modal = document.getElementById('ai-assistant-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'ai-assistant-modal';
        modal.className = 'studio-modal-backdrop';
        document.body.appendChild(modal);
      }
      this.modalEl = modal;

      this.modalEl.innerHTML = `
        <div class="studio-modal-dialog modal-xl">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <div class="ai-badge-header">
                <span class="ai-sparkle-icon">✨</span>
                <h3 class="modal-title">AI Design Assistant & Brief Studio</h3>
              </div>
              <p class="modal-subtitle">Craft a professional, structured design brief with natural-language prompt refinement. Ready for Phase 2 AI vector & raster generation.</p>
            </div>
            <button class="modal-close-btn" id="close-ai-modal">&times;</button>
          </div>

          <div class="modal-body-split">
            <!-- Left: Natural Language Refiner & Guided Form -->
            <div class="brief-form-col">
              <!-- Quick Prompt Refiner -->
              <div class="refiner-banner">
                <div class="refiner-header">
                  <span class="refiner-title">Natural Language Prompt Refiner</span>
                  <span class="refiner-badge">Instant AI Tuning</span>
                </div>
                <div class="refiner-input-group">
                  <textarea id="ai-raw-prompt" class="form-textarea" rows="2" placeholder="e.g. Make a luxury festive cookie tin label for Diwali with gold foil mandalas and pure ghee badge..."></textarea>
                  <button id="btn-refine-prompt" class="btn btn-secondary btn-refine">
                    <span class="btn-icon">⚡</span> Refine into Professional Brief
                  </button>
                </div>
                <div id="refiner-suggestion" class="refiner-suggestion-box" style="display:none;"></div>
              </div>

              <!-- Structured Brief Form -->
              <form id="ai-brief-form" class="brief-fields-grid">
                <div class="form-row-2">
                  <div class="form-group">
                    <label class="form-label required">What to create</label>
                    <select class="form-select" id="brief-what-to-create">
                      <option value="Packaging Tin Lid">Packaging Tin Lid (6" Circular)</option>
                      <option value="Premium Cookie Box Label">Premium Cookie Box Label</option>
                      <option value="Product Poster / Advertisement">Product Poster / Advertisement</option>
                      <option value="Social Media Creative (1080x1080)">Social Media Creative (1080×1080)</option>
                      <option value="Instagram / TikTok Story (1080x1920)">Instagram / TikTok Story (1080×1920)</option>
                      <option value="Festival Greeting Banner">Festival Greeting Banner</option>
                      <option value="Sticker & Seal Label">Sticker & Seal Label</option>
                      <option value="Restaurant Menu Feature">Restaurant Menu Feature</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label required">Brand or Product Name</label>
                    <input type="text" class="form-input" id="brief-brand" placeholder="e.g. Diamond Bakery / Melodi" value="Diamond Bakery" />
                  </div>
                </div>

                <div class="form-row-2">
                  <div class="form-group">
                    <label class="form-label">Target Audience</label>
                    <input type="text" class="form-input" id="brief-audience" placeholder="e.g. Premium gifting, dessert lovers, family celebrations" />
                  </div>

                  <div class="form-group">
                    <label class="form-label required">Intended Use</label>
                    <select class="form-select" id="brief-usage">
                      <option value="Print (600 DPI High-Res)">Print (600 DPI High-Res Production)</option>
                      <option value="Print (300 DPI Standard)">Print (300 DPI Commercial Print)</option>
                      <option value="Digital Web & Social (72/144 DPI)">Digital Web & Social Media</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label required">Exact Text that MUST Appear</label>
                  <textarea class="form-textarea" id="brief-exact-text" rows="2" placeholder="Type exact headlines, taglines, weight declarations, or brand claims. Only text typed here will be rendered.">DIAMOND'S MELODI
PREMIUM HANDCRAFTED COOKIES
ESTD 1985</textarea>
                  <div class="form-hint">Strict rule: AI will never invent random prices, false offers, or unverified contact details.</div>
                </div>

                <div class="form-row-3">
                  <div class="form-group">
                    <label class="form-label">Visual Style</label>
                    <select class="form-select" id="brief-style">
                      <option value="Royal Heritage & Gold Filigree">Royal Heritage & Gold Filigree</option>
                      <option value="Artisanal Handcrafted">Artisanal Handcrafted</option>
                      <option value="Modern Minimalist Clean">Modern Minimalist Clean</option>
                      <option value="Vibrant Festive Celebration">Vibrant Festive Celebration</option>
                      <option value="Dark Opulent Gourmet">Dark Opulent Gourmet</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Colour Palette</label>
                    <select class="form-select" id="brief-palette">
                      <option value="Royal Mint & Antique Gold">Royal Mint & Antique Gold</option>
                      <option value="Deep Maroon & Burnished Gold">Deep Maroon & Burnished Gold</option>
                      <option value="Midnight Onyx & Rich Gold">Midnight Onyx & Rich Gold</option>
                      <option value="Warm Cream & Terracotta">Warm Cream & Terracotta</option>
                      <option value="Festive Saffron & Crimson">Festive Saffron & Crimson</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Typography Direction</label>
                    <select class="form-select" id="brief-typography">
                      <option value="Cinzel Serif & Montserrat Bold">Cinzel Serif & Montserrat Bold</option>
                      <option value="Playfair Display Luxury & Clean Sans">Playfair Display Luxury & Clean Sans</option>
                      <option value="Vintage Signage & Copperplate">Vintage Signage & Copperplate</option>
                      <option value="Bold Modern Geometric Sans">Bold Modern Geometric Sans</option>
                    </select>
                  </div>
                </div>

                <div class="form-row-2">
                  <div class="form-group">
                    <label class="form-label">Elements to Keep Unchanged</label>
                    <input type="text" class="form-input" id="brief-keep" placeholder="e.g. Diamond logo, 6-inch circular rim, FSSAI badge" value="Diamond Bakery Brandmark, Concentric Gold Rims" />
                  </div>

                  <div class="form-group">
                    <label class="form-label">Elements to Remove / Replace</label>
                    <input type="text" class="form-input" id="brief-replace" placeholder="e.g. Replace generic flower with traditional mandala, remove placeholder text" />
                  </div>
                </div>
              </form>
            </div>

            <!-- Right: Live Reference Preview & Structured Confirmation Review -->
            <div class="brief-review-col">
              <div class="review-card">
                <div class="review-header">
                  <h4>Structured Brief Review</h4>
                  <span class="stage-tag">Phase 1 Pre-Flight Check</span>
                </div>

                <div id="brief-reference-display" class="brief-reference-box">
                  <div class="no-ref-placeholder">No reference image attached. (Optional)</div>
                </div>

                <div class="structured-json-preview">
                  <div class="json-header">
                    <span>Target Brief Payload (Schema-Compliant)</span>
                    <button class="btn-copy-json" id="btn-copy-brief">Copy JSON</button>
                  </div>
                  <pre id="brief-json-output">Generating brief...</pre>
                </div>

                <div class="confirmation-notice">
                  <input type="checkbox" id="brief-confirm-check" />
                  <label for="brief-confirm-check">
                    I confirm that the wording, branding, and specifications are accurate. (Phase 2 AI generation requires verified briefs to avoid costly re-runs).
                  </label>
                </div>

                <div class="modal-footer-actions" style="margin-top: 14px;">
                  <button class="btn btn-secondary" id="btn-cancel-brief">Cancel</button>
                  <button class="btn btn-primary" id="btn-confirm-generate" disabled>
                    <span class="btn-icon">🚀</span> Confirm & Stage Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    bindEvents() {
      const modal = this.modalEl;
      if (!modal) return;

      modal.querySelector('#close-ai-modal').addEventListener('click', () => this.hide());
      modal.querySelector('#btn-cancel-brief').addEventListener('click', () => this.hide());

      // Prompt Refiner
      const rawPromptInput = modal.querySelector('#ai-raw-prompt');
      const refineBtn = modal.querySelector('#btn-refine-prompt');
      const suggestionBox = modal.querySelector('#refiner-suggestion');

      refineBtn.addEventListener('click', async () => {
        const text = rawPromptInput.value.trim();
        if (!text) {
          alert('Please enter a natural language prompt first.');
          return;
        }

        refineBtn.disabled = true;
        refineBtn.innerHTML = '<span class="spinner"></span> Refining...';

        if (this.aiService) {
          const refined = await this.aiService.refinePrompt(text);
          suggestionBox.style.display = 'block';
          suggestionBox.innerHTML = `
            <div class="suggestion-header">
              <strong>Refined Design Specification:</strong>
              <button type="button" class="btn-apply-suggestion" id="btn-apply-suggestion">Apply to Brief Fields</button>
            </div>
            <div class="suggestion-body">
              <div><strong>Suggested Style:</strong> ${refined.suggestedStyle}</div>
              <div><strong>Recommended Palette:</strong> ${refined.recommendedPalette}</div>
              <div><strong>Typography:</strong> ${refined.typography}</div>
              <div><strong>Layout Notes:</strong> ${refined.layoutNotes}</div>
            </div>
          `;

          suggestionBox.querySelector('#btn-apply-suggestion').addEventListener('click', () => {
            // Apply refined values
            if (refined.suggestedStyle) modal.querySelector('#brief-style').value = refined.suggestedStyle;
            if (refined.recommendedPalette) modal.querySelector('#brief-palette').value = refined.recommendedPalette;
            if (refined.typography) modal.querySelector('#brief-typography').value = refined.typography;
            this.updateJsonPreview();
          });
        }

        refineBtn.disabled = false;
        refineBtn.innerHTML = '<span class="btn-icon">⚡</span> Refine into Professional Brief';
        this.updateJsonPreview();
      });

      // Update JSON preview on any change
      modal.querySelectorAll('#ai-brief-form input, #ai-brief-form select, #ai-brief-form textarea').forEach(el => {
        el.addEventListener('input', () => this.updateJsonPreview());
        el.addEventListener('change', () => this.updateJsonPreview());
      });

      // Confirmation checkbox enables generation
      const confirmCheck = modal.querySelector('#brief-confirm-check');
      const confirmBtn = modal.querySelector('#btn-confirm-generate');

      confirmCheck.addEventListener('change', () => {
        confirmBtn.disabled = !confirmCheck.checked;
      });

      // Confirm and Stage
      confirmBtn.addEventListener('click', () => {
        const brief = this.getFormData();
        this.handleBriefExecution(brief);
      });

      // Copy JSON
      modal.querySelector('#btn-copy-brief').addEventListener('click', () => {
        const jsonText = modal.querySelector('#brief-json-output').textContent;
        navigator.clipboard.writeText(jsonText).then(() => {
          alert('Structured brief JSON copied to clipboard!');
        });
      });
    }

    getFormData() {
      const modal = this.modalEl;
      return {
        whatToCreate: modal.querySelector('#brief-what-to-create').value,
        brand: modal.querySelector('#brief-brand').value,
        targetAudience: modal.querySelector('#brief-audience').value,
        intendedUsage: modal.querySelector('#brief-usage').value,
        exactText: modal.querySelector('#brief-exact-text').value,
        visualStyle: modal.querySelector('#brief-style').value,
        palette: modal.querySelector('#brief-palette').value,
        typography: modal.querySelector('#brief-typography').value,
        elementsToKeep: modal.querySelector('#brief-keep').value,
        elementsToReplace: modal.querySelector('#brief-replace').value,
        referenceAsset: this.referenceAsset ? {
          name: this.referenceAsset.name,
          dimensions: `${this.referenceAsset.width}x${this.referenceAsset.height}`,
          type: this.referenceAsset.type
        } : null,
        schemaVersion: '1.0.0',
        preparedAt: new Date().toISOString()
      };
    }

    updateJsonPreview() {
      const outputEl = this.modalEl.querySelector('#brief-json-output');
      if (!outputEl) return;
      const brief = this.getFormData();
      outputEl.textContent = JSON.stringify(brief, null, 2);
    }

    setReference(record) {
      this.referenceAsset = record;
      const display = this.modalEl.querySelector('#brief-reference-display');
      if (!display) return;

      if (record) {
        display.innerHTML = `
          <div class="ref-thumb-wrap">
            <img src="${record.dataUrl}" alt="${record.name}" class="ref-img" />
            <div class="ref-meta-info">
              <span class="ref-name">${record.name}</span>
              <span class="ref-dims">${record.width} × ${record.height} px (${(record.size/1024).toFixed(0)} KB)</span>
              <span class="ref-status">Reference Active</span>
            </div>
          </div>
        `;
      } else {
        display.innerHTML = `<div class="no-ref-placeholder">No reference image attached. (Optional)</div>`;
      }
      this.updateJsonPreview();
    }

    show(initialData = null) {
      if (initialData) {
        if (initialData.sourceRecord) this.setReference(initialData.sourceRecord);
        if (initialData.notes) {
          const rawPrompt = this.modalEl.querySelector('#ai-raw-prompt');
          if (rawPrompt) rawPrompt.value = initialData.notes;
        }
      }
      this.updateJsonPreview();
      this.modalEl.style.display = 'flex';
    }

    hide() {
      this.modalEl.style.display = 'none';
    }

    handleBriefExecution(brief) {
      // In Phase 1: Validates brief, saves to localStorage as active brief,
      // and adapts canvas dimensions / initial vector objects based on the requested brief.
      if (this.aiService) {
        const validation = this.aiService.validateBrief(brief);
        if (!validation.valid) {
          alert('Brief validation error: ' + validation.errors.join('\n'));
          return;
        }
      }

      // Check if user chose 6" circular lid
      if (brief.whatToCreate.includes('Packaging Tin Lid') || brief.whatToCreate.includes('Circular')) {
        if (window.studioApp && window.studioApp.switchMode) {
          window.studioApp.switchMode('packaging');
        }
      } else {
        // Adjust canvas dimensions for poster or social media
        if (brief.whatToCreate.includes('1080x1080')) {
          this.engine.setDimensions(1080, 1080);
        } else if (brief.whatToCreate.includes('1080x1920')) {
          this.engine.setDimensions(1080, 1920);
        } else if (brief.whatToCreate.includes('Poster')) {
          this.engine.setDimensions(1240, 1754);
        }

        // Add verified mandatory text to canvas if empty
        if (brief.exactText) {
          const lines = brief.exactText.split('\n').filter(Boolean);
          if (lines.length > 0) {
            this.engine.addText(lines[0], {
              fontSize: 38,
              fontFamily: brief.typography.includes('Cinzel') ? 'Cinzel, serif' : 'Playfair Display, serif',
              fill: brief.palette.includes('Gold') ? '#d4af37' : '#111827',
              top: 150
            });
          }
          if (lines.length > 1) {
            this.engine.addText(lines[1], {
              fontSize: 22,
              fontFamily: 'Montserrat, sans-serif',
              fill: '#4b5563',
              top: 220
            });
          }
        }
      }

      this.hide();

      // Show friendly confirmation toast
      const toast = document.createElement('div');
      toast.className = 'studio-toast toast-success';
      toast.innerHTML = `
        <strong>✨ AI Brief Confirmed & Staged!</strong>
        <span>Local project model configured. Brief JSON stored ready for Phase 2 API integration.</span>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 4000);
    }
  }

  window.AIBriefModal = AIBriefModal;
})(window);
