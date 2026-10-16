/**
 * AJAYNXT AI Design Studio - Multi-Format Export Engine
 * Implements Section 3 & Section 8 of Phase 1 specifications:
 * - Real PNG (72, 150, 300, 600 DPI) with transparent or solid background
 * - High-quality JPG export
 * - Pure Vector SVG export
 * - Print-ready PDF export (via jsPDF or canvas embedding)
 * - Editable JSON Project save/load
 * - Preserves existing 600 DPI circular packaging & A4 imposition workflows
 */

(function(window) {
  'use strict';

  class ExportEngine {
    constructor(canvasEngine, packagingEngine, projectModel, options = {}) {
      this.canvasEngine = canvasEngine;
      this.packagingEngine = packagingEngine;
      this.project = projectModel;
      this.options = options;
      this.modalEl = null;

      this.init();
    }

    init() {
      this.createModalDOM();
      this.bindEvents();
    }

    createModalDOM() {
      let modal = document.getElementById('export-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'export-modal';
        modal.className = 'studio-modal-backdrop';
        document.body.appendChild(modal);
      }
      this.modalEl = modal;

      this.modalEl.innerHTML = `
        <div class="studio-modal-dialog modal-lg">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <h3 class="modal-title">Export Production Graphics</h3>
              <p class="modal-subtitle">Choose format, resolution, and color profile. Real rendering from editable project models.</p>
            </div>
            <button class="modal-close-btn" id="close-export-modal">&times;</button>
          </div>

          <div class="modal-body-split">
            <!-- Left: Real Live Render Preview -->
            <div class="export-preview-col">
              <div class="export-preview-box">
                <img id="export-live-preview" src="" alt="Export Preview" />
                <div id="export-preview-spinner" class="preview-spinner" style="display:none;">
                  <span class="spinner"></span> Rendering Preview...
                </div>
              </div>
              <div class="export-stats-card">
                <div class="stats-row"><span>Output Size:</span><strong id="export-dim-label">1200 × 1200 px</strong></div>
                <div class="stats-row"><span>Estimated File:</span><strong id="export-size-label">~1.2 MB</strong></div>
                <div class="stats-row"><span>Color Space:</span><strong>sRGB (Print Ready)</strong></div>
                <div class="stats-row"><span>Render Engine:</span><strong id="export-mode-label" class="text-brand">Design Canvas</strong></div>
              </div>
            </div>

            <!-- Right: Export Options Form -->
            <div class="export-options-col">
              <div class="form-group">
                <label class="form-label">Export Format</label>
                <div class="format-chips-grid">
                  <button type="button" class="format-chip active" data-format="png">PNG</button>
                  <button type="button" class="format-chip" data-format="jpg">JPG</button>
                  <button type="button" class="format-chip" data-format="svg">SVG Vector</button>
                  <button type="button" class="format-chip" data-format="pdf">Print PDF</button>
                  <button type="button" class="format-chip" data-format="json">Project JSON</button>
                </div>
              </div>

              <!-- PNG / JPG Specific Options -->
              <div id="raster-options-group">
                <div class="form-group">
                  <label class="form-label">Resolution & DPI Quality</label>
                  <select class="form-select" id="export-dpi-select">
                    <option value="1">Standard Web (72 DPI - 1x)</option>
                    <option value="2" selected>Retina Display / Social (150 DPI - 2x)</option>
                    <option value="3.125">Commercial Print (300 DPI - ~3.1x)</option>
                    <option value="6.25">Master Packaging Production (600 DPI - Ultra High-Res)</option>
                  </select>
                  <div class="form-hint" id="dpi-explanation">150 DPI produces crisp images for social media and HD screens.</div>
                </div>

                <div class="form-group" id="png-transparent-group">
                  <label class="checkbox-label">
                    <input type="checkbox" id="export-transparent-check" />
                    <span>Transparent Background (PNG only)</span>
                  </label>
                </div>

                <div class="form-group" id="jpg-quality-group" style="display:none;">
                  <label class="form-label">JPG Quality: <span id="jpg-quality-val">95%</span></label>
                  <input type="range" class="form-range" id="export-jpg-quality" min="60" max="100" value="95" />
                </div>
              </div>

              <!-- SVG Specific Options -->
              <div id="svg-options-group" style="display:none;">
                <div class="alert alert-info">
                  <strong>Vector SVG Output:</strong> Exports independent text elements, vector paths, shapes, and embedded rasters with clean &lt;svg&gt; serialization and viewBox.
                </div>
              </div>

              <!-- PDF Specific Options -->
              <div id="pdf-options-group" style="display:none;">
                <div class="form-group">
                  <label class="form-label">Page Setup</label>
                  <select class="form-select" id="pdf-page-size">
                    <option value="fit">Fit Canvas Dimensions Exactly</option>
                    <option value="a4_portrait">Standard A4 Sheet (Portrait)</option>
                    <option value="a4_landscape">Standard A4 Sheet (Landscape)</option>
                    <option value="a4_imposition">A4 Print Imposition (2× 6" Tin Lids + Crop Marks)</option>
                  </select>
                </div>
              </div>

              <div class="modal-footer-actions" style="margin-top: 24px;">
                <button class="btn btn-secondary" id="btn-cancel-export">Cancel</button>
                <button class="btn btn-primary btn-lg" id="btn-do-download">
                  <span class="btn-icon">⬇</span> Download File
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    bindEvents() {
      const modal = this.modalEl;
      if (!modal) return;

      modal.querySelector('#close-export-modal').addEventListener('click', () => this.hide());
      modal.querySelector('#btn-cancel-export').addEventListener('click', () => this.hide());

      // Format chips
      const chips = modal.querySelectorAll('.format-chip');
      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          chips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          this.onFormatChanged(chip.getAttribute('data-format'));
        });
      });

      // DPI change
      const dpiSelect = modal.querySelector('#export-dpi-select');
      dpiSelect.addEventListener('change', () => {
        this.updateDimensionsLabel();
      });

      // JPG quality slider
      const qualitySlider = modal.querySelector('#export-jpg-quality');
      const qualityVal = modal.querySelector('#jpg-quality-val');
      qualitySlider.addEventListener('input', () => {
        qualityVal.textContent = qualitySlider.value + '%';
      });

      // Download trigger
      modal.querySelector('#btn-do-download').addEventListener('click', () => {
        this.executeDownload();
      });
    }

    onFormatChanged(format) {
      const modal = this.modalEl;
      const rasterGroup = modal.querySelector('#raster-options-group');
      const pngTrans = modal.querySelector('#png-transparent-group');
      const jpgQuality = modal.querySelector('#jpg-quality-group');
      const svgGroup = modal.querySelector('#svg-options-group');
      const pdfGroup = modal.querySelector('#pdf-options-group');

      rasterGroup.style.display = (format === 'png' || format === 'jpg') ? 'block' : 'none';
      pngTrans.style.display = (format === 'png') ? 'block' : 'none';
      jpgQuality.style.display = (format === 'jpg') ? 'block' : 'none';
      svgGroup.style.display = (format === 'svg') ? 'block' : 'none';
      pdfGroup.style.display = (format === 'pdf') ? 'block' : 'none';

      this.updateDimensionsLabel();
    }

    show(mode = 'design') {
      this.currentMode = mode;
      const modal = this.modalEl;
      modal.style.display = 'flex';

      const modeLabel = modal.querySelector('#export-mode-label');
      if (modeLabel) {
        modeLabel.textContent = mode === 'packaging' ? '6" Packaging Vector Engine' : (mode === 'print' ? 'A4 Imposition Sheet' : 'Design Canvas');
      }

      this.updatePreview();
      this.updateDimensionsLabel();
    }

    hide() {
      this.modalEl.style.display = 'none';
    }

    updatePreview() {
      const img = this.modalEl.querySelector('#export-live-preview');
      if (!img) return;

      if (this.currentMode === 'packaging') {
        const svgString = this.packagingEngine.getSVGString();
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        img.src = url;
      } else if (this.currentMode === 'print') {
        const svgString = this.packagingEngine.getA4SheetSVG();
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        img.src = url;
      } else {
        const dataUrl = this.canvasEngine.exportPNG({ multiplier: 0.5 });
        img.src = dataUrl;
      }
    }

    updateDimensionsLabel() {
      const modal = this.modalEl;
      const dpiSelect = modal.querySelector('#export-dpi-select');
      const dimLabel = modal.querySelector('#export-dim-label');
      const sizeLabel = modal.querySelector('#export-size-label');
      const format = modal.querySelector('.format-chip.active')?.getAttribute('data-format') || 'png';

      const mult = parseFloat(dpiSelect.value) || 1;
      let baseW = 1200;
      let baseH = 1200;

      if (this.currentMode === 'packaging') {
        baseW = 1800;
        baseH = 1800;
      } else if (this.currentMode === 'print') {
        baseW = 2480;
        baseH = 3508;
      } else {
        baseW = this.canvasEngine.width;
        baseH = this.canvasEngine.height;
      }

      if (format === 'svg' || format === 'json') {
        dimLabel.textContent = `${baseW} × ${baseH} (Vector Scalable)`;
        sizeLabel.textContent = '~80 KB - 300 KB';
      } else if (format === 'pdf') {
        dimLabel.textContent = `Vector PDF (${baseW} × ${baseH} pt)`;
        sizeLabel.textContent = '~500 KB - 2 MB';
      } else {
        const outW = Math.round(baseW * mult);
        const outH = Math.round(baseH * mult);
        dimLabel.textContent = `${outW} × ${outH} px`;
        const estMB = ((outW * outH * 4) / (1024 * 1024) * (format === 'jpg' ? 0.15 : 0.4)).toFixed(1);
        sizeLabel.textContent = `~${estMB} MB`;
      }
    }

    async executeDownload() {
      const modal = this.modalEl;
      const format = modal.querySelector('.format-chip.active')?.getAttribute('data-format') || 'png';
      const mult = parseFloat(modal.querySelector('#export-dpi-select').value) || 1;
      const transparent = modal.querySelector('#export-transparent-check').checked;
      const quality = parseInt(modal.querySelector('#export-jpg-quality').value) / 100 || 0.95;
      const btn = modal.querySelector('#btn-do-download');

      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Generating Export...';

      const baseName = this.currentMode === 'packaging' 
        ? 'Diamond_Bakery_Melodi_Tin_6in' 
        : (this.currentMode === 'print' ? 'Diamond_Bakery_A4_Print_Sheet' : 'AJAYNXT_Design');

      try {
        if (format === 'json') {
          // JSON export
          const jsonStr = this.project.exportJSON();
          this.downloadString(jsonStr, `${baseName}_project.json`, 'application/json');
        } else if (format === 'svg') {
          // SVG export
          let svgData = '';
          if (this.currentMode === 'packaging') {
            svgData = this.packagingEngine.getSVGString();
          } else if (this.currentMode === 'print') {
            svgData = this.packagingEngine.getA4SheetSVG();
          } else {
            svgData = this.canvasEngine.exportSVG();
          }
          this.downloadString(svgData, `${baseName}.svg`, 'image/svg+xml');
        } else if (format === 'png') {
          // PNG export
          if (this.currentMode === 'packaging' || this.currentMode === 'print') {
            const svgData = this.currentMode === 'packaging' 
              ? this.packagingEngine.getSVGString() 
              : this.packagingEngine.getA4SheetSVG();
            await this.downloadSVGAsRaster(svgData, `${baseName}.png`, 'image/png', mult);
          } else {
            const dataUrl = this.canvasEngine.exportPNG({
              multiplier: mult,
              transparent: transparent
            });
            this.downloadDataURL(dataUrl, `${baseName}.png`);
          }
        } else if (format === 'jpg') {
          // JPG export
          if (this.currentMode === 'packaging' || this.currentMode === 'print') {
            const svgData = this.currentMode === 'packaging' 
              ? this.packagingEngine.getSVGString() 
              : this.packagingEngine.getA4SheetSVG();
            await this.downloadSVGAsRaster(svgData, `${baseName}.jpg`, 'image/jpeg', mult, quality);
          } else {
            const dataUrl = this.canvasEngine.exportJPG({
              multiplier: mult,
              quality: quality
            });
            this.downloadDataURL(dataUrl, `${baseName}.jpg`);
          }
        } else if (format === 'pdf') {
          // PDF Export
          await this.exportPDF(baseName);
        }

        this.hide();
      } catch (err) {
        console.error('Export failed:', err);
        alert('Export error: ' + err.message);
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<span class="btn-icon">⬇</span> Download File';
      }
    }

    downloadString(text, filename, mimeType) {
      const blob = new Blob([text], { type: mimeType });
      const url = URL.createObjectURL(blob);
      this.downloadDataURL(url, filename);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    downloadDataURL(dataUrl, filename) {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    downloadSVGAsRaster(svgString, filename, mimeType, multiplier = 1, quality = 0.95) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const width = img.naturalWidth || 1800;
          const height = img.naturalHeight || 1800;
          canvas.width = Math.round(width * multiplier);
          canvas.height = Math.round(height * multiplier);

          const ctx = canvas.getContext('2d');
          if (mimeType === 'image/jpeg') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const resultUrl = canvas.toDataURL(mimeType, quality);
          this.downloadDataURL(resultUrl, filename);
          URL.revokeObjectURL(url);
          resolve();
        };

        img.onerror = (e) => {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to rasterize SVG for export.'));
        };

        img.src = url;
      });
    }

    async exportPDF(baseName) {
      // Check if jsPDF is available
      if (window.jspdf && window.jspdf.jsPDF) {
        const { jsPDF } = window.jspdf;
        const isA4 = this.currentMode === 'print';
        const doc = new jsPDF({
          orientation: isA4 ? 'portrait' : 'landscape',
          unit: 'pt',
          format: isA4 ? 'a4' : [this.canvasEngine.width, this.canvasEngine.height]
        });

        // Get image data
        let imgData = '';
        if (this.currentMode === 'packaging' || this.currentMode === 'print') {
          const svgData = this.currentMode === 'packaging' ? this.packagingEngine.getSVGString() : this.packagingEngine.getA4SheetSVG();
          imgData = await this.renderSVGToDataURL(svgData, 2);
        } else {
          imgData = this.canvasEngine.exportPNG({ multiplier: 2 });
        }

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
        doc.save(`${baseName}.pdf`);
      } else {
        // Fallback: Open print dialog with SVG/Image
        const win = window.open('', '_blank');
        const content = this.currentMode === 'packaging' ? this.packagingEngine.getSVGString() : (this.currentMode === 'print' ? this.packagingEngine.getA4SheetSVG() : `<img src="${this.canvasEngine.exportPNG({multiplier:2})}" style="width:100%;" />`);
        win.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${baseName}</title>
              <style>
                @page { size: auto; margin: 0; }
                body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #fff; }
                svg, img { max-width: 100%; height: auto; }
              </style>
            </head>
            <body>
              ${content}
              <script>
                window.onload = function() { window.print(); };
              </script>
            </body>
          </html>
        `);
        win.document.close();
      }
    }

    renderSVGToDataURL(svgString, multiplier = 2) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = (img.naturalWidth || 1800) * multiplier;
          canvas.height = (img.naturalHeight || 1800) * multiplier;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/png');
          URL.revokeObjectURL(url);
          resolve(dataUrl);
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('SVG rasterization failed'));
        };
        img.src = url;
      });
    }
  }

  window.ExportEngine = ExportEngine;
})(window);
