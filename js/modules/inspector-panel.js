/**
 * AJAYNXT AI Design Studio — Inspector Panel Module
 * Contextual properties editor for typography, shapes, colors, shadows, alignment,
 * and direct 1-click AI Background Removal for image layers.
 */

(function(window) {
  'use strict';

  class InspectorPanel {
    constructor(canvasEngineOrContainer, options = {}) {
      if (typeof canvasEngineOrContainer === 'string' || (canvasEngineOrContainer && canvasEngineOrContainer.nodeType)) {
        this.container = typeof canvasEngineOrContainer === 'string' ? document.getElementById(canvasEngineOrContainer) : canvasEngineOrContainer;
        this.canvasEngine = options.canvasEngine || null;
      } else {
        this.canvasEngine = canvasEngineOrContainer;
        this.container = options.container || document.getElementById('inspector-content-box');
      }
      this.options = options;
      this.render(null);
    }

    setCanvasEngine(engine) {
      this.canvasEngine = engine;
    }

    updateForSelection(activeObject) {
      this.render(activeObject);
    }

    render(activeObject) {
      if (!this.container) return;

      if (!activeObject) {
        this.container.innerHTML = `
          <div style="padding: 32px 20px; text-align: center; color: var(--text-muted); font-size: 13px; display: flex; flex-direction: column; align-items: center; gap: 10px;">
            <span style="font-size: 28px; opacity: 0.5;">👆</span>
            <strong style="color: var(--text-secondary);">No Object Selected</strong>
            <span style="font-size: 11px; max-width: 200px;">Click on any text, shape, or image layer on the canvas to inspect and edit its properties.</span>
          </div>
        `;
        return;
      }

      const isText = activeObject.type === 'i-text' || activeObject.type === 'text';
      const isImage = activeObject.type === 'image';
      const isShape = ['rect', 'circle', 'triangle', 'line', 'path'].includes(activeObject.type);

      let html = `<div class="inspector-fields-stack" style="padding: 16px; display: flex; flex-direction: column; gap: 16px;">`;

      // Header: Object Type & Name
      html += `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
          <div>
            <span class="tag-badge" style="font-size: 10px;">${activeObject.type.toUpperCase()}</span>
            <strong style="display: block; font-size: 13px; color: #fff; margin-top: 4px;">${activeObject.name || activeObject.type}</strong>
          </div>
          <button class="btn btn-ghost btn-sm" id="btn-inspector-delete" title="Delete Object">🗑️ Delete</button>
        </div>
      `;

      // Image Layer Specific Tools (AI Background Remover!)
      if (isImage) {
        html += `
          <div class="panel-card" style="background: rgba(212,175,55,0.08); border: 1px solid rgba(212,175,55,0.3); padding: 12px; border-radius: var(--radius-sm);">
            <strong style="font-size: 12px; color: var(--brand-gold); display: block; margin-bottom: 6px;">AI Image Actions</strong>
            <button class="btn btn-primary btn-block btn-sm" id="btn-inspector-remove-bg">
              <span class="btn-icon">✂️</span> Remove Background
            </button>
          </div>
        `;
      }

      // Typography Controls
      if (isText) {
        html += `
          <div class="form-group">
            <label class="form-label">Font Family</label>
            <select class="form-select" id="prop-font-family">
              <option value="Cinzel, serif" ${activeObject.fontFamily?.includes('Cinzel') ? 'selected' : ''}>Cinzel (Royal Serif)</option>
              <option value="Playfair Display, serif" ${activeObject.fontFamily?.includes('Playfair') ? 'selected' : ''}>Playfair Display</option>
              <option value="Montserrat, sans-serif" ${activeObject.fontFamily?.includes('Montserrat') ? 'selected' : ''}>Montserrat (Modern)</option>
              <option value="Alex Brush, cursive" ${activeObject.fontFamily?.includes('Alex') ? 'selected' : ''}>Alex Brush (Script)</option>
              <option value="Inter, sans-serif" ${activeObject.fontFamily?.includes('Inter') ? 'selected' : ''}>Inter Clean</option>
            </select>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">Size (px)</label>
              <input type="number" class="form-input" id="prop-font-size" value="${Math.round(activeObject.fontSize || 24)}" />
            </div>
            <div class="form-group">
              <label class="form-label">Weight</label>
              <select class="form-select" id="prop-font-weight">
                <option value="normal" ${activeObject.fontWeight === 'normal' ? 'selected' : ''}>Normal</option>
                <option value="bold" ${activeObject.fontWeight === 'bold' ? 'selected' : ''}>Bold</option>
                <option value="800" ${activeObject.fontWeight === '800' ? 'selected' : ''}>Heavy</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Text Align</label>
            <div style="display: flex; gap: 4px;">
              <button class="btn btn-outline btn-sm ${activeObject.textAlign === 'left' ? 'active' : ''}" id="btn-align-left" style="flex:1;">Left</button>
              <button class="btn btn-outline btn-sm ${activeObject.textAlign === 'center' ? 'active' : ''}" id="btn-align-center" style="flex:1;">Center</button>
              <button class="btn btn-outline btn-sm ${activeObject.textAlign === 'right' ? 'active' : ''}" id="btn-align-right" style="flex:1;">Right</button>
            </div>
          </div>
        `;
      }

      // Color & Opacity (Fill & Stroke)
      html += `
        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Fill Color</label>
            <input type="color" class="form-input" id="prop-fill-color" value="${typeof activeObject.fill === 'string' && activeObject.fill.startsWith('#') ? activeObject.fill : '#d4af37'}" style="height: 38px; padding: 2px 4px; cursor: pointer;" />
          </div>
          <div class="form-group">
            <label class="form-label">Opacity (${Math.round((activeObject.opacity ?? 1) * 100)}%)</label>
            <input type="range" class="form-range" id="prop-opacity" min="0" max="100" value="${Math.round((activeObject.opacity ?? 1) * 100)}" style="width: 100%; margin-top: 10px;" />
          </div>
        </div>
      `;

      // Transform & Positioning
      html += `
        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Width</label>
            <input type="number" class="form-input" id="prop-width" value="${Math.round((activeObject.width || 0) * (activeObject.scaleX || 1))}" />
          </div>
          <div class="form-group">
            <label class="form-label">Height</label>
            <input type="number" class="form-input" id="prop-height" value="${Math.round((activeObject.height || 0) * (activeObject.scaleY || 1))}" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Canvas Alignment</label>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
            <button class="btn btn-outline btn-sm" id="btn-align-c-h">Center H</button>
            <button class="btn btn-outline btn-sm" id="btn-align-c-v">Center V</button>
            <button class="btn btn-outline btn-sm" id="btn-duplicate-obj">Duplicate</button>
          </div>
        </div>
      `;

      html += `</div>`;
      this.container.innerHTML = html;

      // Bind Event Listeners
      this.bindInputs(activeObject);
    }

    bindInputs(activeObject) {
      const container = this.container;

      // Delete Object
      container.querySelector('#btn-inspector-delete')?.addEventListener('click', () => {
        if (this.canvasEngine) {
          this.canvasEngine.deleteActiveObject();
          this.render(null);
        }
      });

      // Remove Background Trigger
      container.querySelector('#btn-inspector-remove-bg')?.addEventListener('click', () => {
        if (window.studioApp && window.studioApp.bgRemover) {
          window.studioApp.bgRemover.openForImageLayer(activeObject);
        }
      });

      // Font Family
      container.querySelector('#prop-font-family')?.addEventListener('change', (e) => {
        activeObject.set('fontFamily', e.target.value);
        this.canvasEngine.fabric.renderAll();
      });

      // Font Size
      container.querySelector('#prop-font-size')?.addEventListener('input', (e) => {
        activeObject.set('fontSize', parseInt(e.target.value) || 16);
        this.canvasEngine.fabric.renderAll();
      });

      // Font Weight
      container.querySelector('#prop-font-weight')?.addEventListener('change', (e) => {
        activeObject.set('fontWeight', e.target.value);
        this.canvasEngine.fabric.renderAll();
      });

      // Align buttons
      container.querySelector('#btn-align-left')?.addEventListener('click', () => {
        activeObject.set('textAlign', 'left');
        this.canvasEngine.fabric.renderAll();
      });
      container.querySelector('#btn-align-center')?.addEventListener('click', () => {
        activeObject.set('textAlign', 'center');
        this.canvasEngine.fabric.renderAll();
      });
      container.querySelector('#btn-align-right')?.addEventListener('click', () => {
        activeObject.set('textAlign', 'right');
        this.canvasEngine.fabric.renderAll();
      });

      // Fill Color
      container.querySelector('#prop-fill-color')?.addEventListener('input', (e) => {
        activeObject.set('fill', e.target.value);
        this.canvasEngine.fabric.renderAll();
      });

      // Opacity
      container.querySelector('#prop-opacity')?.addEventListener('input', (e) => {
        activeObject.set('opacity', parseInt(e.target.value) / 100);
        this.canvasEngine.fabric.renderAll();
      });

      // Align Center H & V
      container.querySelector('#btn-align-c-h')?.addEventListener('click', () => {
        activeObject.centerH();
        this.canvasEngine.fabric.renderAll();
      });
      container.querySelector('#btn-align-c-v')?.addEventListener('click', () => {
        activeObject.centerV();
        this.canvasEngine.fabric.renderAll();
      });

      // Duplicate
      container.querySelector('#btn-duplicate-obj')?.addEventListener('click', () => {
        if (this.canvasEngine) {
          this.canvasEngine.duplicateSelected();
        }
      });
    }
  }

  window.InspectorPanel = InspectorPanel;
})(window);
