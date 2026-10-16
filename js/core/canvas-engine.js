(function(window) {
  'use strict';

  class CanvasEngine {
  constructor(canvasElementId, options = {}) {
    this.canvasId = canvasElementId;
    this.options = options;
    this.fabric = null;
    this.zoom = 1.0;
    this.gridEnabled = false;
    this.snapThreshold = 8;
    this.width = options.width || 1200;
    this.height = options.height || 1200;
    this.onSelectionChange = options.onSelectionChange || null;
    this.onObjectModified = options.onObjectModified || null;
    this.onLayersChange = options.onLayersChange || null;

    // Auto-initialize canvas
    this.init(this.width, this.height);
  }

  onSelectionChanged(callback) {
    this.onSelectionChange = callback;
    if (this.fabric) {
      this.fabric.on('selection:created', (e) => callback(e.selected ? e.selected[0] : null));
      this.fabric.on('selection:updated', (e) => callback(e.selected ? e.selected[0] : null));
      this.fabric.on('selection:cleared', () => callback(null));
    }
  }

  onCanvasModified(callback) {
    this.onObjectModified = callback;
    if (this.fabric) {
      this.fabric.on('object:modified', () => callback());
      this.fabric.on('object:added', () => callback());
      this.fabric.on('object:removed', () => callback());
    }
  }

  getObjects() {
    return this.fabric ? this.fabric.getObjects() : [];
  }

  clear() {
    if (this.fabric) {
      this.fabric.clear();
      this.fabric.backgroundColor = '#ffffff';
      this.fabric.renderAll();
    }
  }

  addRect(opts = {}) {
    return this.addShape('rect', opts);
  }

  addCircle(opts = {}) {
    return this.addShape('circle', opts);
  }

  addTriangle(opts = {}) {
    return this.addShape('triangle', opts);
  }

  addLine(opts = {}) {
    return this.addShape('line', opts);
  }

  loadSVG(svgString, callback) {
    return this.importSVG(svgString, callback);
  }

  deleteActiveObject() {
    return this.deleteSelected();
  }

  /**
   * Initialise the Fabric canvas
   */
  init(width = 1080, height = 1080) {
    if (typeof fabric === 'undefined') {
      console.error('Fabric.js library not loaded');
      return false;
    }

    const canvasEl = document.getElementById(this.canvasId);
    if (!canvasEl) return false;

    // Dispose old canvas if re-initializing
    if (this.fabric) {
      this.fabric.dispose();
    }

    this.fabric = new fabric.Canvas(this.canvasId, {
      width: width,
      height: height,
      backgroundColor: '#0F172A',
      preserveObjectStacking: true,
      selection: true,
      uniformScaling: false
    });

    this.setupEvents();
    this.setupSnappingGuides();
    return true;
  }

  /**
   * Setup event listeners for selection and modifications
   */
  setupEvents() {
    if (!this.fabric) return;

    this.fabric.on('selection:created', (e) => {
      if (this.onSelectionChange) this.onSelectionChange(e.selected ? e.selected[0] : null);
    });

    this.fabric.on('selection:updated', (e) => {
      if (this.onSelectionChange) this.onSelectionChange(e.selected ? e.selected[0] : null);
    });

    this.fabric.on('selection:cleared', () => {
      if (this.onSelectionChange) this.onSelectionChange(null);
    });

    this.fabric.on('object:modified', () => {
      if (this.onObjectModified) this.onObjectModified();
      if (this.onLayersChange) this.onLayersChange();
    });

    this.fabric.on('object:added', () => {
      if (this.onLayersChange) this.onLayersChange();
    });

    this.fabric.on('object:removed', () => {
      if (this.onLayersChange) this.onLayersChange();
    });
  }

  /**
   * Set canvas dimensions
   */
  setDimensions(width, height) {
    this.width = width;
    this.height = height;
    if (!this.fabric) return;
    this.fabric.setWidth(width);
    this.fabric.setHeight(height);
    this.fabric.renderAll();
  }

  /**
   * Set canvas background color or gradient
   */
  setBackgroundColor(color) {
    if (!this.fabric) return;
    this.fabric.setBackgroundColor(color, () => this.fabric.renderAll());
  }

  /**
   * Add Editable Text Object
   */
  addText(text = 'Heading Text', options = {}) {
    if (!this.fabric) return null;
    const defaultOptions = {
      left: this.fabric.width / 2,
      top: this.fabric.height / 2,
      originX: 'center',
      originY: 'center',
      fontFamily: options.fontFamily || 'Cinzel Decorative',
      fontSize: options.fontSize || 56,
      fontWeight: options.fontWeight || 'bold',
      fill: options.fill || '#FFFDF0',
      textAlign: 'center',
      padding: 8,
      name: text.length > 20 ? text.substring(0, 18) + '...' : text
    };

    const textObj = new fabric.IText(text, Object.assign(defaultOptions, options));
    this.fabric.add(textObj);
    this.fabric.setActiveObject(textObj);
    this.fabric.renderAll();
    return textObj;
  }

  /**
   * Add Shape: Rectangle, Circle, Line, Star
   */
  addShape(type, options = {}) {
    if (!this.fabric) return null;
    let shape = null;
    const centerX = this.fabric.width / 2;
    const centerY = this.fabric.height / 2;

    const baseOpts = {
      left: centerX,
      top: centerY,
      originX: 'center',
      originY: 'center',
      fill: options.fill || '#D4AF37',
      stroke: options.stroke || '#854D0E',
      strokeWidth: options.strokeWidth || 0,
      opacity: options.opacity || 1
    };

    if (type === 'rect') {
      shape = new fabric.Rect(Object.assign(baseOpts, {
        width: options.width || 300,
        height: options.height || 180,
        rx: options.rx || 8,
        ry: options.ry || 8,
        name: 'Rectangle'
      }));
    } else if (type === 'circle') {
      shape = new fabric.Circle(Object.assign(baseOpts, {
        radius: options.radius || 120,
        name: 'Circle'
      }));
    } else if (type === 'badge') {
      shape = new fabric.Rect(Object.assign(baseOpts, {
        width: 320,
        height: 54,
        rx: 27,
        ry: 27,
        fill: '#0B3B24',
        stroke: '#D4AF37',
        strokeWidth: 2,
        name: 'Ribbon Capsule'
      }));
    } else if (type === 'line') {
      shape = new fabric.Line([centerX - 150, centerY, centerX + 150, centerY], {
        stroke: options.stroke || '#D4AF37',
        strokeWidth: options.strokeWidth || 3,
        name: 'Divider Line'
      });
    }

    if (shape) {
      this.fabric.add(shape);
      this.fabric.setActiveObject(shape);
      this.fabric.renderAll();
    }
    return shape;
  }

  /**
   * Add Raster Image (from URL or data URL)
   */
  addImage(url, options = {}) {
    if (!this.fabric) return;
    fabric.Image.fromURL(url, (img) => {
      const maxWidth = this.fabric.width * 0.6;
      if (img.width > maxWidth) {
        img.scale(maxWidth / img.width);
      }
      img.set({
        left: this.fabric.width / 2,
        top: this.fabric.height / 2,
        originX: 'center',
        originY: 'center',
        name: options.name || 'Image Layer'
      });
      this.fabric.add(img);
      this.fabric.setActiveObject(img);
      this.fabric.renderAll();
    }, { crossOrigin: 'anonymous' });
  }

  /**
   * Import Vector SVG into canvas
   */
  importSVG(svgString) {
    if (!this.fabric) return;
    fabric.loadSVGFromString(svgString, (objects, options) => {
      const obj = fabric.util.groupSVGElements(objects, options);
      obj.set({
        left: this.fabric.width / 2,
        top: this.fabric.height / 2,
        originX: 'center',
        originY: 'center',
        name: 'Imported Vector Group'
      });
      const maxDim = Math.min(this.fabric.width, this.fabric.height) * 0.8;
      if (obj.width > maxDim || obj.height > maxDim) {
        const scale = maxDim / Math.max(obj.width, obj.height);
        obj.scale(scale);
      }
      this.fabric.add(obj);
      this.fabric.setActiveObject(obj);
      this.fabric.renderAll();
    });
  }

  /**
   * Setup snap-to-center guidelines
   */
  setupSnappingGuides() {
    if (!this.fabric) return;
    this.fabric.on('object:moving', (e) => {
      const obj = e.target;
      if (!obj) return;
      const centerX = this.fabric.width / 2;
      const centerY = this.fabric.height / 2;

      // Snap to horizontal center
      if (Math.abs(obj.left - centerX) < this.snapThreshold) {
        obj.set({ left: centerX });
      }
      // Snap to vertical center
      if (Math.abs(obj.top - centerY) < this.snapThreshold) {
        obj.set({ top: centerY });
      }
    });
  }

  /**
   * Zoom & Pan
   */
  setZoom(zoomFactor) {
    if (!this.fabric) return;
    this.zoom = Math.max(0.2, Math.min(3.0, zoomFactor));
    this.fabric.setZoom(this.zoom);
    this.fabric.renderAll();
  }

  zoomIn() {
    this.setZoom(this.zoom + 0.15);
  }

  zoomOut() {
    this.setZoom(this.zoom - 0.15);
  }

  resetZoom() {
    this.setZoom(1.0);
  }

  /**
   * Layer Ordering Operations
   */
  bringForward() {
    const active = this.fabric?.getActiveObject();
    if (active) {
      this.fabric.bringForward(active);
      this.fabric.renderAll();
      if (this.onLayersChange) this.onLayersChange();
    }
  }

  sendBackward() {
    const active = this.fabric?.getActiveObject();
    if (active) {
      this.fabric.sendBackwards(active);
      this.fabric.renderAll();
      if (this.onLayersChange) this.onLayersChange();
    }
  }

  bringToFront() {
    const active = this.fabric?.getActiveObject();
    if (active) {
      this.fabric.bringToFront(active);
      this.fabric.renderAll();
      if (this.onLayersChange) this.onLayersChange();
    }
  }

  sendToBack() {
    const active = this.fabric?.getActiveObject();
    if (active) {
      this.fabric.sendToBack(active);
      this.fabric.renderAll();
      if (this.onLayersChange) this.onLayersChange();
    }
  }

  deleteSelected() {
    const active = this.fabric?.getActiveObject();
    if (active) {
      this.fabric.remove(active);
      this.fabric.discardActiveObject();
      this.fabric.renderAll();
    }
  }

  duplicateSelected() {
    const active = this.fabric?.getActiveObject();
    if (!active) return;
    active.clone((cloned) => {
      this.fabric.discardActiveObject();
      cloned.set({
        left: cloned.left + 25,
        top: cloned.top + 25,
        evented: true,
        name: (active.name || 'Object') + ' (Copy)'
      });
      this.fabric.add(cloned);
      this.fabric.setActiveObject(cloned);
      this.fabric.requestRenderAll();
    });
  }

  /**
   * Export Functions
   */
  exportPNG(multiplier = 1, transparent = false) {
    if (!this.fabric) return null;
    const origBg = this.fabric.backgroundColor;
    if (transparent) {
      this.fabric.backgroundColor = null;
    }
    const dataUrl = this.fabric.toDataURL({
      format: 'png',
      multiplier: multiplier,
      quality: 1.0
    });
    this.fabric.backgroundColor = origBg;
    this.fabric.renderAll();
    return dataUrl;
  }

  exportJPG(quality = 0.95) {
    if (!this.fabric) return null;
    return this.fabric.toDataURL({
      format: 'jpeg',
      quality: quality
    });
  }

  exportSVG() {
    if (!this.fabric) return null;
    return this.fabric.toSVG();
  }

  exportJSON() {
    if (!this.fabric) return null;
    return this.fabric.toJSON(['name', 'id', 'locked', 'selectable']);
  }

  loadJSON(json, callback) {
    if (!this.fabric) return;
    this.fabric.loadFromJSON(json, () => {
      this.fabric.renderAll();
      if (callback) callback();
      if (this.onLayersChange) this.onLayersChange();
    });
  }
}

  window.CanvasEngine = CanvasEngine;
})(window);
