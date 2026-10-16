(function(window) {
  'use strict';

  class StudioProject {
  constructor(config = {}) {
    this.id = config.id || 'proj_' + Date.now().toString(36);
    this.title = config.title || 'Untitled Design';
    this.type = config.type || 'freeform'; // 'freeform' | 'packaging'
    this.dimensions = config.dimensions || {
      width: 1080,
      height: 1080,
      unit: 'px',
      dpi: 300
    };
    this.background = config.background || {
      type: 'solid',
      color: '#0B132B',
      colorEnd: '#1C2541',
      opacity: 1
    };
    this.layers = config.layers || [];
    this.packagingState = config.packagingState || null;
    this.activeLayerId = null;

    // Undo / Redo Stacks
    this.undoStack = [];
    this.redoStack = [];
    this.maxHistory = 30;
  }

  /**
   * Save a snapshot into the undo stack
   */
  snapshot(actionName = 'Edit') {
    const serialized = this.serialize();
    this.undoStack.push({
      action: actionName,
      data: serialized,
      timestamp: Date.now()
    });
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
    // Clear redo stack on new action
    this.redoStack = [];
  }

  /**
   * Undo the last action
   */
  undo() {
    if (this.undoStack.length === 0) return null;
    const currentState = this.serialize();
    this.redoStack.push({ data: currentState, timestamp: Date.now() });

    const previous = this.undoStack.pop();
    this.deserialize(previous.data);
    return previous;
  }

  /**
   * Redo the undone action
   */
  redo() {
    if (this.redoStack.length === 0) return null;
    const currentState = this.serialize();
    this.undoStack.push({ data: currentState, timestamp: Date.now() });

    const next = this.redoStack.pop();
    this.deserialize(next.data);
    return next;
  }

  /**
   * Serialise project to JSON
   */
  serialize() {
    return {
      version: '1.0.0',
      id: this.id,
      title: this.title,
      type: this.type,
      dimensions: { ...this.dimensions },
      background: { ...this.background },
      layers: JSON.parse(JSON.stringify(this.layers)),
      packagingState: this.packagingState ? JSON.parse(JSON.stringify(this.packagingState)) : null,
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Deserialise project from JSON
   */
  deserialize(json) {
    if (typeof json === 'string') {
      json = JSON.parse(json);
    }
    this.id = json.id || this.id;
    this.title = json.title || this.title;
    this.type = json.type || this.type;
    this.dimensions = json.dimensions || this.dimensions;
    this.background = json.background || this.background;
    this.layers = json.layers || [];
    this.packagingState = json.packagingState || null;
  }

  /**
   * Layer Management Methods
   */
  addLayer(layer) {
    if (!layer.id) layer.id = 'layer_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 4);
    if (!layer.name) layer.name = layer.type || 'Object';
    if (typeof layer.visible === 'undefined') layer.visible = true;
    if (typeof layer.locked === 'undefined') layer.locked = false;
    this.layers.push(layer);
    this.activeLayerId = layer.id;
    return layer;
  }

  removeLayer(layerId) {
    this.layers = this.layers.filter(l => l.id !== layerId);
    if (this.activeLayerId === layerId) {
      this.activeLayerId = this.layers.length > 0 ? this.layers[this.layers.length - 1].id : null;
    }
  }

  getLayer(layerId) {
    return this.layers.find(l => l.id === layerId);
  }

  reorderLayer(fromIndex, toIndex) {
    if (fromIndex < 0 || fromIndex >= this.layers.length || toIndex < 0 || toIndex >= this.layers.length) return;
    const [moved] = this.layers.splice(fromIndex, 1);
    this.layers.splice(toIndex, 0, moved);
  }

  toggleLayerVisibility(layerId) {
    const layer = this.getLayer(layerId);
    if (layer) {
      layer.visible = !layer.visible;
      return layer.visible;
    }
    return null;
  }

  toggleLayerLock(layerId) {
    const layer = this.getLayer(layerId);
    if (layer) {
      layer.locked = !layer.locked;
      return layer.locked;
    }
    return null;
  }
}

  window.StudioProject = StudioProject;
})(window);
