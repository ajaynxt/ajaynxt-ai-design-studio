/**
 * AJAYNXT AI Design Studio — Layers Panel Module
 * Controls layer ordering, visibility, locking, renaming, duplication, and deletion.
 */

(function(window) {
  'use strict';

  class LayersPanel {
    constructor(canvasEngineOrContainer, options = {}) {
      if (typeof canvasEngineOrContainer === 'string' || (canvasEngineOrContainer && canvasEngineOrContainer.nodeType)) {
        this.container = typeof canvasEngineOrContainer === 'string' ? document.getElementById(canvasEngineOrContainer) : canvasEngineOrContainer;
        this.canvasEngine = options.canvasEngine || null;
      } else {
        this.canvasEngine = canvasEngineOrContainer;
        this.container = options.container || document.getElementById('layers-tree-container');
      }
      this.options = options;
    }

    setCanvasEngine(engine) {
      this.canvasEngine = engine;
    }

    updateLayersList(objects) {
      this.render();
    }

    highlightLayer(layerId) {
      this.render();
    }

    render() {
      if (!this.container || !this.canvasEngine || !this.canvasEngine.fabric) return;

      const objects = this.canvasEngine.fabric.getObjects().slice().reverse(); // Top layer first
      const activeObject = this.canvasEngine.fabric.getActiveObject();

      if (objects.length === 0) {
        this.container.innerHTML = `
          <div style="padding: 24px 16px; text-align: center; color: var(--text-muted); font-size: 12px; display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <span style="font-size: 24px; opacity: 0.6;">📑</span>
            <span>No layers on canvas yet.</span>
            <span style="font-size: 10px;">Add text, shapes, or templates to start designing.</span>
          </div>
        `;
        return;
      }

      let html = '<div class="layers-stack-list" style="display: flex; flex-direction: column; gap: 4px; padding: 6px;">';
      objects.forEach((obj, idx) => {
        const realIndex = objects.length - 1 - idx;
        const isSelected = activeObject === obj;
        const layerName = obj.name || obj.type || `Layer ${realIndex + 1}`;
        const isLocked = !obj.selectable;
        const isVisible = obj.visible !== false;

        let icon = '🔷';
        if (obj.type === 'i-text' || obj.type === 'text') icon = '✍️';
        else if (obj.type === 'image') icon = '🖼️';
        else if (obj.type === 'circle') icon = '⭕';
        else if (obj.type === 'rect') icon = '⬛';
        else if (obj.type === 'group') icon = '📦';

        html += `
          <div class="layer-item-row ${isSelected ? 'selected' : ''}" data-index="${realIndex}"
               style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; border-radius: var(--radius-sm); font-size: 12px; cursor: pointer; border: 1px solid ${isSelected ? 'var(--brand-gold)' : 'var(--border-subtle)'}; background: ${isSelected ? 'rgba(212,175,55,0.12)' : 'var(--bg-card)'};">
            
            <div style="display: flex; align-items: center; gap: 8px; overflow: hidden;">
              <span>${icon}</span>
              <span style="font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px;" title="${layerName}">${layerName}</span>
            </div>

            <div style="display: flex; align-items: center; gap: 2px;">
              <button class="btn-ghost btn-sm btn-layer-vis" data-index="${realIndex}" title="${isVisible ? 'Hide' : 'Show'}">
                ${isVisible ? '👁️' : '🙈'}
              </button>
              <button class="btn-ghost btn-sm btn-layer-lock" data-index="${realIndex}" title="${isLocked ? 'Unlock' : 'Lock'}">
                ${isLocked ? '🔒' : '🔓'}
              </button>
              <button class="btn-ghost btn-sm btn-layer-up" data-index="${realIndex}" title="Move Up">▲</button>
              <button class="btn-ghost btn-sm btn-layer-down" data-index="${realIndex}" title="Move Down">▼</button>
              <button class="btn-ghost btn-sm btn-layer-del" data-index="${realIndex}" title="Delete">🗑️</button>
            </div>
          </div>
        `;
      });
      html += '</div>';

      this.container.innerHTML = html;

      // Bind row actions
      this.container.querySelectorAll('.layer-item-row').forEach(row => {
        row.addEventListener('click', () => {
          const idx = parseInt(row.getAttribute('data-index'));
          const objs = this.canvasEngine.fabric.getObjects();
          if (objs[idx]) {
            this.canvasEngine.fabric.setActiveObject(objs[idx]);
            this.canvasEngine.fabric.renderAll();
          }
        });
      });

      this.container.querySelectorAll('.btn-layer-vis').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.getAttribute('data-index'));
          const objs = this.canvasEngine.fabric.getObjects();
          if (objs[idx]) {
            objs[idx].visible = !objs[idx].visible;
            this.canvasEngine.fabric.renderAll();
            this.render();
          }
        });
      });

      this.container.querySelectorAll('.btn-layer-lock').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.getAttribute('data-index'));
          const objs = this.canvasEngine.fabric.getObjects();
          if (objs[idx]) {
            objs[idx].selectable = !objs[idx].selectable;
            objs[idx].evented = objs[idx].selectable;
            this.canvasEngine.fabric.renderAll();
            this.render();
          }
        });
      });

      this.container.querySelectorAll('.btn-layer-up').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.getAttribute('data-index'));
          const objs = this.canvasEngine.fabric.getObjects();
          if (objs[idx]) {
            this.canvasEngine.fabric.bringForward(objs[idx]);
            this.render();
          }
        });
      });

      this.container.querySelectorAll('.btn-layer-down').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.getAttribute('data-index'));
          const objs = this.canvasEngine.fabric.getObjects();
          if (objs[idx]) {
            this.canvasEngine.fabric.sendBackwards(objs[idx]);
            this.render();
          }
        });
      });

      this.container.querySelectorAll('.btn-layer-del').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.getAttribute('data-index'));
          const objs = this.canvasEngine.fabric.getObjects();
          if (objs[idx]) {
            this.canvasEngine.fabric.remove(objs[idx]);
            this.canvasEngine.fabric.renderAll();
            this.render();
          }
        });
      });
    }
  }

  window.LayersPanel = LayersPanel;
})(window);
