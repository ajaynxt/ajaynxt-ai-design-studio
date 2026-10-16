/**
 * AJAYNXT AI Design Studio — Template Gallery Module
 * Searchable, filterable gallery loading templates.json, real previews, and editable sources.
 */

(function(window) {
  'use strict';

  class TemplateGallery {
    constructor(canvasEngineOrContainer, options = {}) {
      if (typeof canvasEngineOrContainer === 'string' || (canvasEngineOrContainer && canvasEngineOrContainer.nodeType)) {
        this.container = typeof canvasEngineOrContainer === 'string' ? document.getElementById(canvasEngineOrContainer) : canvasEngineOrContainer;
        this.canvasEngine = options.canvasEngine || null;
      } else {
        this.canvasEngine = canvasEngineOrContainer;
        this.container = options.container || document.getElementById('drawer-templates-container');
      }

      this.options = options;
      this.manifest = [];
      this.categories = [
        { id: 'all', name: 'All' },
        { id: 'packaging', name: 'Bakery Packaging' },
        { id: 'posters', name: 'Posters & Ads' },
        { id: 'social', name: 'Social Posts' },
        { id: 'stickers', name: 'Stickers & Labels' },
        { id: 'restaurant', name: 'Restaurant Promos' },
        { id: 'festivals', name: 'Festivals' },
        { id: 'ads', name: 'Product Ads' },
        { id: 'custom', name: 'Custom Print' }
      ];
      this.activeCategory = 'all';
      this.searchQuery = '';
      this.onTemplateSelected = options.onTemplateSelected || null;

      this.init();
    }

    async init() {
      await this.fetchManifest();
      if (this.container) {
        this.render();
      }
    }

    async fetchManifest() {
      try {
        const resp = await fetch('templates/templates.json');
        if (resp.ok) {
          const raw = await resp.json();
          const items = Array.isArray(raw) ? raw : (raw.templates || []);
          this.manifest = items.map(t => ({
            ...t,
            preview: t.previewFile ? 'templates/' + t.previewFile : (t.preview || 'templates/previews/packaging_mint_luxury.png'),
            source: t.sourceFile ? 'templates/' + t.sourceFile : (t.source || ''),
            format: (t.sourceFormat || t.format || 'SVG').toUpperCase()
          }));
        } else {
          console.warn('Failed to fetch templates/templates.json, using fallback');
          this.manifest = this.getFallbackManifest();
        }
      } catch (e) {
        console.warn('Template fetch error, using fallback:', e);
        this.manifest = this.getFallbackManifest();
      }
    }

    getFallbackManifest() {
      return [
        {
          id: 'tpl-packaging-mint-luxury',
          title: "Diamond Bakery — Pastel Mint & 24K Gold Tin",
          category: 'bakery-packaging',
          dimensions: { width: 1200, height: 1200, unit: 'px', dpi: 600 },
          preview: 'templates/previews/packaging_mint_luxury.png',
          source: 'templates/sources/packaging_mint_luxury.svg',
          format: 'SVG'
        },
        {
          id: 'tpl-festival-diwali-royal-hamper',
          title: 'Royal Diwali Celebration Poster',
          category: 'festival-creatives',
          dimensions: { width: 1240, height: 1754, unit: 'px', dpi: 300 },
          preview: 'templates/previews/festival_diwali_royal_hamper.png',
          source: 'templates/sources/festival_diwali_royal_hamper.svg',
          format: 'SVG'
        }
      ];
    }

    render() {
      if (!this.container) return;

      const filtered = this.manifest.filter(t => {
        const matchesCategory = this.activeCategory === 'all' || t.category === this.activeCategory;
        const matchesSearch = !this.searchQuery || 
          t.title.toLowerCase().includes(this.searchQuery) || 
          t.category.toLowerCase().includes(this.searchQuery);
        return matchesCategory && matchesSearch;
      });

      this.container.innerHTML = `
        <div class="panel-section">
          <div class="asset-search-wrap">
            <input type="text" class="form-input search-input" id="tpl-search-input" placeholder="Search templates..." value="${this.searchQuery}" />
          </div>
          <div class="asset-categories-scroll">
            ${this.categories.map(c => `
              <button class="cat-pill ${this.activeCategory === c.id ? 'active' : ''}" data-cat="${c.id}">
                ${c.name}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="panel-section" style="padding-top: 0;">
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            ${filtered.length === 0 ? `
              <div style="grid-column: span 2; padding: 24px 0; text-align: center; color: var(--text-muted); font-size: 12px;">
                No matching templates found.
              </div>
            ` : filtered.map(t => `
              <div class="template-card" data-id="${t.id}">
                <div class="template-thumb-wrap">
                  <img src="${t.preview}" alt="${t.title}" loading="lazy" />
                </div>
                <div class="template-card-body" style="padding: 10px 8px;">
                  <span class="template-card-title" style="font-size: 11px;">${t.title}</span>
                  <div class="template-card-meta">
                    <span>${t.dimensions.width}×${t.dimensions.height}</span>
                    <span class="tag-badge" style="font-size: 8px;">${t.format}</span>
                  </div>
                </div>
                <button class="btn-insert-asset btn-open-card-tpl" data-id="${t.id}" style="padding: 6px;">
                  Open Template
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      // Bind events
      const searchInput = this.container.querySelector('#tpl-search-input');
      searchInput?.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.render();
      });

      this.container.querySelectorAll('.cat-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          this.activeCategory = pill.getAttribute('data-cat');
          this.render();
        });
      });

      this.container.querySelectorAll('.btn-open-card-tpl').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-id');
          const tpl = this.manifest.find(t => t.id === id);
          if (tpl) this.loadTemplate(tpl);
        });
      });
    }

    async loadTemplate(t) {
      if (!t) return;

      if (t.category === 'packaging') {
        if (window.studioApp && window.studioApp.switchMode) {
          window.studioApp.switchMode('packaging');
        }
      } else {
        // Fetch vector SVG source
        try {
          const resp = await fetch(t.source);
          if (resp.ok) {
            const svgContent = await resp.text();
            if (this.canvasEngine) {
              this.canvasEngine.clear();
              this.canvasEngine.setDimensions(t.dimensions.width, t.dimensions.height);
              this.canvasEngine.loadSVG(svgContent);
            }
          }
        } catch (e) {
          console.error('Failed to load template SVG source:', e);
        }

        if (window.studioApp && window.studioApp.switchMode) {
          window.studioApp.switchMode('design');
        }
      }

      if (this.onTemplateSelected) {
        this.onTemplateSelected(t);
      }
    }
  }

  window.TemplateGallery = TemplateGallery;
})(window);
