/**
 * AJAYNXT AI Design Studio - Upload & Source Recovery Workflow
 * Supports PNG, JPG, WebP, SVG.
 * Manages original source preservation, dimension inspection, intended outcome selection,
 * side-by-side comparison, and direct canvas placement or AI brief transfer.
 */

(function(window) {
  'use strict';

  class UploadWorkflow {
    constructor(canvasEngine, options = {}) {
      this.engine = canvasEngine;
      this.options = options;
      this.uploadedFiles = [];
      this.activeRecord = null;

      this.container = options.container || document.getElementById('upload-panel');
      this.compareModal = options.compareModal || document.getElementById('compare-modal');
      this.onSendToAI = options.onSendToAI || null;

      this.init();
    }

    init() {
      if (!this.container) return;
      this.renderUploadZone();
      this.bindEvents();
    }

    renderUploadZone() {
      this.container.innerHTML = `
        <div class="panel-section">
          <div class="section-title">Upload & Recover Sources</div>
          <p class="section-hint">Upload PNG, JPG, WebP, or SVG. Source dimensions and originals are always preserved for recovery and comparison.</p>
          
          <div class="drop-zone" id="upload-drop-zone">
            <svg class="drop-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <div class="drop-text">Drag & drop image or <label class="browse-link" for="upload-file-input">Browse</label></div>
            <div class="drop-subtext">Supports PNG, JPG, WebP, SVG (up to 25MB)</div>
            <input type="file" id="upload-file-input" accept="image/png,image/jpeg,image/webp,image/svg+xml" style="display:none;" />
          </div>
        </div>

        <div class="panel-section" id="uploaded-list-section" style="display:none;">
          <div class="section-title">Uploaded Media (<span id="upload-count">0</span>)</div>
          <div class="upload-gallery-grid" id="uploaded-gallery-grid"></div>
        </div>
      `;
    }

    bindEvents() {
      const dropZone = this.container.querySelector('#upload-drop-zone');
      const fileInput = this.container.querySelector('#upload-file-input');

      if (!dropZone || !fileInput) return;

      ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.add('drag-over');
        });
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.remove('drag-over');
        });
      });

      dropZone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
          this.handleFile(files[0]);
        }
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          this.handleFile(e.target.files[0]);
          fileInput.value = ''; // allow re-selection
        }
      });
    }

    async handleFile(file) {
      if (!file) return;

      const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(png|jpe?g|webp|svg)$/i)) {
        alert('Unsupported format. Please upload PNG, JPG, WebP, or SVG.');
        return;
      }

      const reader = new FileReader();
      const isSvg = file.type === 'image/svg+xml' || file.name.endsWith('.svg');

      reader.onload = async (e) => {
        const dataUrl = e.target.result;
        
        let width = 0;
        let height = 0;
        let svgContent = null;

        if (isSvg) {
          svgContent = typeof dataUrl === 'string' && dataUrl.startsWith('data:') 
            ? atob(dataUrl.split(',')[1]) 
            : dataUrl;
          
          // Parse SVG to get dimensions
          const parser = new DOMParser();
          const doc = parser.parseFromString(svgContent, 'image/svg+xml');
          const svgEl = doc.querySelector('svg');
          if (svgEl) {
            width = parseInt(svgEl.getAttribute('width')) || 800;
            height = parseInt(svgEl.getAttribute('height')) || 800;
            if (svgEl.viewBox && svgEl.viewBox.baseVal) {
              width = svgEl.viewBox.baseVal.width || width;
              height = svgEl.viewBox.baseVal.height || height;
            }
          }
        } else {
          const dims = await this.getImageDimensions(dataUrl);
          width = dims.width;
          height = dims.height;
        }

        const record = {
          id: 'up_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          name: file.name,
          size: file.size,
          type: file.type,
          isSvg: isSvg,
          width: width,
          height: height,
          dataUrl: dataUrl,
          svgContent: svgContent,
          timestamp: new Date().toISOString()
        };

        this.uploadedFiles.unshift(record);
        this.activeRecord = record;
        this.refreshGallery();
        this.openSourceModal(record);
      };

      if (isSvg) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsDataURL(file);
      }
    }

    getImageDimensions(dataUrl) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.naturalWidth || img.width, height: img.naturalHeight || img.height });
        img.onerror = () => resolve({ width: 800, height: 600 });
        img.src = dataUrl;
      });
    }

    refreshGallery() {
      const section = this.container.querySelector('#uploaded-list-section');
      const grid = this.container.querySelector('#uploaded-gallery-grid');
      const countEl = this.container.querySelector('#upload-count');

      if (!section || !grid) return;

      if (this.uploadedFiles.length === 0) {
        section.style.display = 'none';
        return;
      }

      section.style.display = 'block';
      if (countEl) countEl.textContent = this.uploadedFiles.length;

      grid.innerHTML = this.uploadedFiles.map(item => `
        <div class="upload-item-card" data-id="${item.id}">
          <div class="upload-thumb-wrap">
            <img src="${item.dataUrl}" alt="${item.name}" loading="lazy" />
            <span class="upload-type-badge">${item.isSvg ? 'SVG' : item.type.split('/')[1]?.toUpperCase()}</span>
          </div>
          <div class="upload-item-info">
            <div class="upload-item-title" title="${item.name}">${item.name}</div>
            <div class="upload-item-meta">${item.width} × ${item.height} px • ${(item.size / 1024).toFixed(0)} KB</div>
          </div>
          <div class="upload-card-actions">
            <button class="btn-sm btn-outline btn-add-canvas" data-id="${item.id}" title="Place onto canvas">Add to Canvas</button>
            <button class="btn-sm btn-ghost btn-inspect" data-id="${item.id}" title="Inspect & compare">Inspect</button>
          </div>
        </div>
      `).join('');

      grid.querySelectorAll('.btn-add-canvas').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-id');
          this.placeOnCanvas(id);
        });
      });

      grid.querySelectorAll('.btn-inspect').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-id');
          const rec = this.uploadedFiles.find(f => f.id === id);
          if (rec) this.openSourceModal(rec);
        });
      });
    }

    placeOnCanvas(recordId) {
      const rec = this.uploadedFiles.find(f => f.id === recordId);
      if (!rec) return;

      if (rec.isSvg && rec.svgContent) {
        this.engine.loadSVG(rec.svgContent);
      } else {
        this.engine.addImage(rec.dataUrl, {
          name: rec.name.replace(/\.[^/.]+$/, ''),
          width: Math.min(rec.width, 500)
        });
      }
    }

    /**
     * Requirement 4: Display original image, actual dimensions, keep source recoverable,
     * let user select intended outcome, accept detailed brief, provide controls for canvas size,
     * layout, style, typography direction, and prepare structured brief for Phase 2 AI.
     */
    openSourceModal(record) {
      let modal = document.getElementById('upload-intent-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'upload-intent-modal';
        modal.className = 'studio-modal-backdrop';
        document.body.appendChild(modal);
      }

      modal.innerHTML = `
        <div class="studio-modal-dialog modal-xl">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <h3 class="modal-title">Source Asset & Design Intent</h3>
              <p class="modal-subtitle">Review original source asset, select target use case, or prepare an AI Design Brief.</p>
            </div>
            <button class="modal-close-btn" id="close-intent-modal">&times;</button>
          </div>

          <div class="modal-body-split">
            <!-- Left: Source Preview & Verification -->
            <div class="source-inspect-col">
              <div class="source-preview-box">
                <img src="${record.dataUrl}" alt="${record.name}" class="source-img-preview" />
              </div>
              <div class="source-meta-table">
                <div class="meta-row"><span>File Name:</span><strong>${record.name}</strong></div>
                <div class="meta-row"><span>Native Dimensions:</span><strong>${record.width} × ${record.height} px</strong></div>
                <div class="meta-row"><span>File Size:</span><strong>${(record.size / 1024).toFixed(1)} KB</strong></div>
                <div class="meta-row"><span>Format:</span><strong class="tag-badge">${record.isSvg ? 'Vector SVG' : record.type}</strong></div>
                <div class="meta-row"><span>Original State:</span><strong class="text-success">Preserved & Recoverable</strong></div>
              </div>
              <div class="source-action-links">
                <a href="${record.dataUrl}" download="${record.name}" class="btn-link">Download Original Asset</a>
              </div>
            </div>

            <!-- Right: Outcome & AI Brief Selector -->
            <div class="intent-controls-col">
              <div class="form-group">
                <label class="form-label">What is the intended outcome?</label>
                <div class="intent-choice-grid">
                  <label class="intent-card selected" data-value="custom_poster">
                    <input type="radio" name="intent_type" value="custom_poster" checked />
                    <span class="intent-name">Custom Poster</span>
                    <span class="intent-desc">Eye-catching layout for events, ads or store display</span>
                  </label>
                  <label class="intent-card" data-value="food_ad">
                    <input type="radio" name="intent_type" value="food_ad" />
                    <span class="intent-name">Food & Bakery Ad</span>
                    <span class="intent-desc">Appetizing composition for culinary promotions</span>
                  </label>
                  <label class="intent-card" data-value="packaging_label">
                    <input type="radio" name="intent_type" value="packaging_label" />
                    <span class="intent-name">Packaging Label</span>
                    <span class="intent-desc">Circular tin lid or box sticker label</span>
                  </label>
                  <label class="intent-card" data-value="social_creative">
                    <input type="radio" name="intent_type" value="social_creative" />
                    <span class="intent-name">Social Media Post</span>
                    <span class="intent-desc">Square or vertical feed/story creative</span>
                  </label>
                  <label class="intent-card" data-value="festival_promo">
                    <input type="radio" name="intent_type" value="festival_promo" />
                    <span class="intent-name">Festival Greeting</span>
                    <span class="intent-desc">Traditional motifs & festive celebrations</span>
                  </label>
                  <label class="intent-card" data-value="product_showcase">
                    <input type="radio" name="intent_type" value="product_showcase" />
                    <span class="intent-name">Product Showcase</span>
                    <span class="intent-desc">Clean background with focal typography</span>
                  </label>
                </div>
              </div>

              <div class="form-row-2">
                <div class="form-group">
                  <label class="form-label">Target Canvas Size</label>
                  <select class="form-select" id="intent-canvas-size">
                    <option value="original">Match Original (${record.width} × ${record.height})</option>
                    <option value="poster_a4">Poster A4 (1240 × 1754 px)</option>
                    <option value="square_1080">Instagram Square (1080 × 1080 px)</option>
                    <option value="story_1080">Story / Portrait (1080 × 1920 px)</option>
                    <option value="tin_1800">6" Circular Tin Lid (1800 × 1800 px)</option>
                    <option value="banner_1200">Landscape Banner (1200 × 630 px)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Visual Style Direction</label>
                  <select class="form-select" id="intent-style">
                    <option value="luxury_heritage">Luxury Heritage & Gold Foil</option>
                    <option value="modern_minimalist">Modern Minimalist</option>
                    <option value="vibrant_festive">Vibrant & Festive</option>
                    <option value="fresh_organic">Fresh & Organic Bakery</option>
                    <option value="dark_elegance">Dark Elegance</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Design Brief / Special Instructions</label>
                <textarea class="form-textarea" id="intent-brief" rows="3" placeholder="Describe the desired design, mandatory headlines, offers, or elements to preserve or highlight..."></textarea>
                <div class="form-hint">Note: Uploaded images are never overwritten. You can compare the original source against the design at any time.</div>
              </div>

              <div class="modal-footer-actions">
                <button class="btn btn-outline" id="btn-extract-ocr-text">
                  <span class="btn-icon">👁️</span> Extract Text (Cloud Vision OCR)
                </button>
                <button class="btn btn-secondary" id="btn-insert-direct">Place on Canvas</button>
                <button class="btn btn-primary" id="btn-open-brief-builder">Prepare AI Design Brief →</button>
              </div>
            </div>
          </div>
        </div>
      `;

      modal.style.display = 'flex';

      // Radio selection highlight
      modal.querySelectorAll('.intent-card').forEach(card => {
        card.addEventListener('click', () => {
          modal.querySelectorAll('.intent-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
        });
      });

      modal.querySelector('#close-intent-modal').addEventListener('click', () => {
        modal.style.display = 'none';
      });

      modal.querySelector('#btn-insert-direct').addEventListener('click', () => {
        this.placeOnCanvas(record.id);
        modal.style.display = 'none';
      });

      // Google Cloud Vision OCR Text Extraction
      const ocrBtn = modal.querySelector('#btn-extract-ocr-text');
      if (ocrBtn) {
        ocrBtn.addEventListener('click', async () => {
          const originalText = ocrBtn.innerHTML;
          ocrBtn.disabled = true;
          ocrBtn.innerHTML = '<span>Processing OCR...</span>';

          try {
            const gateway = window.StudioServices ? window.StudioServices.gateway : null;
            if (gateway) {
              const res = await gateway.extractTextOCR(record.dataUrl);
              const textResult = res.result ? res.result.fullText : (res.fullText || '');
              
              if (textResult) {
                // Populate into design brief notes
                const briefTextarea = modal.querySelector('#intent-brief');
                if (briefTextarea) {
                  briefTextarea.value = textResult;
                }

                // Add to canvas option
                if (confirm(`Extracted Text via ${res.provider || 'Cloud Vision OCR'}:\n\n"${textResult.substring(0, 160)}..."\n\nAdd this text to active canvas artboard?`)) {
                  this.engine.addText(textResult.split('\n')[0] || textResult, {
                    fontSize: 32,
                    fontFamily: 'Cinzel, serif',
                    fill: '#f8fafc'
                  });
                  modal.style.display = 'none';
                }
              } else {
                alert('No readable text detected in this image.');
              }
            }
          } catch (ocrErr) {
            alert('OCR extraction notice: ' + ocrErr.message);
          } finally {
            ocrBtn.disabled = false;
            ocrBtn.innerHTML = originalText;
          }
        });
      }

      modal.querySelector('#btn-open-brief-builder').addEventListener('click', () => {
        const selectedIntent = modal.querySelector('input[name="intent_type"]:checked')?.value || 'custom_poster';
        const canvasSize = modal.querySelector('#intent-canvas-size')?.value || 'original';
        const style = modal.querySelector('#intent-style')?.value || 'luxury_heritage';
        const briefNotes = modal.querySelector('#intent-brief')?.value || '';

        modal.style.display = 'none';

        if (this.onSendToAI) {
          this.onSendToAI({
            sourceRecord: record,
            outcomeType: selectedIntent,
            canvasSize: canvasSize,
            styleDirection: style,
            notes: briefNotes
          });
        }
      });
    }

    /**
     * Requirement 4: Compare original source against generated/edited design side-by-side
     */
    openComparisonModal(originalRecord, currentCanvasDataUrl) {
      let modal = document.getElementById('side-by-side-compare-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'side-by-side-compare-modal';
        modal.className = 'studio-modal-backdrop';
        document.body.appendChild(modal);
      }

      modal.innerHTML = `
        <div class="studio-modal-dialog modal-xl">
          <div class="modal-header">
            <h3 class="modal-title">Source vs Design Comparison</h3>
            <button class="modal-close-btn" id="close-compare-modal">&times;</button>
          </div>
          <div class="compare-container">
            <div class="compare-col">
              <div class="compare-header">
                <span class="compare-label">Original Source Asset</span>
                <span class="compare-meta">${originalRecord.width} × ${originalRecord.height} px • ${(originalRecord.size/1024).toFixed(0)} KB</span>
              </div>
              <div class="compare-viewport">
                <img src="${originalRecord.dataUrl}" alt="Original" />
              </div>
            </div>
            <div class="compare-divider"></div>
            <div class="compare-col">
              <div class="compare-header">
                <span class="compare-label">Current Editable Design</span>
                <span class="compare-meta">Active Project Canvas</span>
              </div>
              <div class="compare-viewport">
                <img src="${currentCanvasDataUrl}" alt="Current Design" />
              </div>
            </div>
          </div>
          <div class="modal-footer" style="padding: 14px 20px; display: flex; justify-content: flex-end;">
            <button class="btn btn-secondary" id="btn-close-compare">Back to Editor</button>
          </div>
        </div>
      `;

      modal.style.display = 'flex';
      modal.querySelector('#close-compare-modal').addEventListener('click', () => modal.style.display = 'none');
      modal.querySelector('#btn-close-compare').addEventListener('click', () => modal.style.display = 'none');
    }
  }

  window.UploadWorkflow = UploadWorkflow;
})(window);
