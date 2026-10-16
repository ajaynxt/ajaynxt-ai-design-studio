/**
 * AJAYNXT AI Design Studio - Asset Library & PNG Manager
 * Implements Section 5 & 6 of Phase 1 specifications:
 * - Organised asset library for uploaded PNGs, brand logos, cookie illustrations, and vector mandalas
 * - Search, categories, tags, image dimensions, transparent checkerboard preview
 * - Insert into canvas as independent selectable layer
 * - Reusable built-in assets from embedded_assets.js & mandalas_library.js
 * - Storage service boundary for Phase 2 Firebase Storage migration
 */

(function(window) {
  'use strict';

  class AssetLibrary {
    constructor(canvasEngine, options = {}) {
      this.engine = canvasEngine;
      this.options = options;
      this.container = options.container || document.getElementById('assets-panel');
      this.storageService = window.StudioServices ? window.StudioServices.storage : null;
      this.activeCategory = 'all';
      this.searchQuery = '';

      this.init();
    }

    init() {
      if (!this.container) return;
      this.render();
      this.bindEvents();
    }

    getBuiltInAssets() {
      const assets = [];

      // 1. Mandalas from mandalas_library.js if loaded
      if (window.MANDALAS && Array.isArray(window.MANDALAS)) {
        window.MANDALAS.forEach((m, idx) => {
          assets.push({
            id: 'mandala_' + (m.id || idx),
            title: m.name || `Royal Mandala #${idx + 1}`,
            category: 'mandalas',
            type: 'vector_svg',
            tags: ['mandala', 'gold', 'ornament', 'heritage'],
            dimensions: '800 × 800',
            sourceType: 'builtin',
            svgContent: m.svg || m.content || '',
            thumbnail: 'data:image/svg+xml;utf8,' + encodeURIComponent(m.svg || m.content || '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="#d4af37" stroke-width="2" fill="none"/></svg>')
          });
        });
      }

      // 2. Embedded bakery assets if loaded
      if (window.EMBEDDED_ASSETS) {
        Object.keys(window.EMBEDDED_ASSETS).forEach(key => {
          const val = window.EMBEDDED_ASSETS[key];
          if (typeof val === 'string' && val.startsWith('data:image')) {
            assets.push({
              id: 'builtin_' + key,
              title: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              category: key.includes('cookie') ? 'food' : 'logos',
              type: 'raster_png',
              tags: ['bakery', 'diamond', key],
              dimensions: '400 × 400',
              sourceType: 'builtin',
              thumbnail: val,
              dataUrl: val
            });
          }
        });
      }

      // 3. Built-in geometric vector shapes & decorative badges
      assets.push(
        {
          id: 'badge_100_veg',
          title: '100% Pure Vegetarian Green Badge',
          category: 'logos',
          type: 'vector_svg',
          tags: ['badge', 'veg', 'green', 'fssai'],
          dimensions: '200 × 200',
          sourceType: 'builtin',
          svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" rx="8" fill="none" stroke="#16a34a" stroke-width="6"/><circle cx="50" cy="50" r="24" fill="#16a34a"/></svg>`,
          thumbnail: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" rx="8" fill="none" stroke="#16a34a" stroke-width="6"/><circle cx="50" cy="50" r="24" fill="#16a34a"/></svg>`)
        },
        {
          id: 'badge_pure_ghee',
          title: 'Made with 100% Pure Desi Ghee Seal',
          category: 'logos',
          type: 'vector_svg',
          tags: ['seal', 'pure ghee', 'gold', 'quality'],
          dimensions: '300 × 300',
          sourceType: 'builtin',
          svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="90" fill="#780016" stroke="#d4af37" stroke-width="4"/><circle cx="100" cy="100" r="82" fill="none" stroke="#d4af37" stroke-width="1.5" stroke-dasharray="4 2"/><text x="100" y="85" font-family="Cinzel, serif" font-size="16" fill="#fef08a" text-anchor="middle" font-weight="bold">MADE WITH</text><text x="100" y="112" font-family="Cinzel, serif" font-size="22" fill="#d4af37" text-anchor="middle" font-weight="bold">PURE GHEE</text><text x="100" y="132" font-family="Montserrat, sans-serif" font-size="11" fill="#fef08a" text-anchor="middle" letter-spacing="2">AUTHENTIC RECIPE</text></svg>`,
          thumbnail: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="90" fill="#780016" stroke="#d4af37" stroke-width="4"/><circle cx="100" cy="100" r="82" fill="none" stroke="#d4af37" stroke-width="1.5" stroke-dasharray="4 2"/><text x="100" y="85" font-family="Cinzel, serif" font-size="16" fill="#fef08a" text-anchor="middle" font-weight="bold">MADE WITH</text><text x="100" y="112" font-family="Cinzel, serif" font-size="22" fill="#d4af37" text-anchor="middle" font-weight="bold">PURE GHEE</text><text x="100" y="132" font-family="Montserrat, sans-serif" font-size="11" fill="#fef08a" text-anchor="middle" letter-spacing="2">AUTHENTIC RECIPE</text></svg>`)
        },
        {
          id: 'badge_handmade_gold',
          title: 'Handcrafted Heritage Seal (Gold Foil)',
          category: 'logos',
          type: 'vector_svg',
          tags: ['seal', 'handcrafted', 'gold', 'royal'],
          dimensions: '300 × 300',
          sourceType: 'builtin',
          svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="90" fill="#082b20" stroke="#d4af37" stroke-width="4"/><circle cx="100" cy="100" r="82" fill="none" stroke="#d4af37" stroke-width="2"/><text x="100" y="85" font-family="Cinzel, serif" font-size="14" fill="#d4af37" text-anchor="middle" letter-spacing="3">HANDCRAFTED</text><text x="100" y="115" font-family="Cinzel, serif" font-size="24" fill="#ffffff" text-anchor="middle" font-weight="bold">DELIGHT</text><text x="100" y="135" font-family="Montserrat, sans-serif" font-size="10" fill="#d4af37" text-anchor="middle">SINCE 1985</text></svg>`,
          thumbnail: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="90" fill="#082b20" stroke="#d4af37" stroke-width="4"/><circle cx="100" cy="100" r="82" fill="none" stroke="#d4af37" stroke-width="2"/><text x="100" y="85" font-family="Cinzel, serif" font-size="14" fill="#d4af37" text-anchor="middle" letter-spacing="3">HANDCRAFTED</text><text x="100" y="115" font-family="Cinzel, serif" font-size="24" fill="#ffffff" text-anchor="middle" font-weight="bold">DELIGHT</text><text x="100" y="135" font-family="Montserrat, sans-serif" font-size="10" fill="#d4af37" text-anchor="middle">SINCE 1985</text></svg>`)
        }
      );

      return assets;
    }

    render() {
      this.container.innerHTML = `
        <div class="panel-section">
          <div class="section-title">Asset & PNG Library</div>
          <p class="section-hint">High-resolution brand assets, PNG elements, and vector ornaments ready to place onto the canvas.</p>
          
          <div class="asset-search-wrap">
            <input type="text" id="asset-search-input" class="form-input search-input" placeholder="Search assets, badges, mandalas..." />
          </div>

          <div class="asset-categories-scroll">
            <button class="cat-pill active" data-cat="all">All Assets</button>
            <button class="cat-pill" data-cat="mandalas">Mandalas (17)</button>
            <button class="cat-pill" data-cat="logos">Badges & Seals</button>
            <button class="cat-pill" data-cat="food">Cookies & Bakery</button>
            <button class="cat-pill" data-cat="user">My Uploads</button>
          </div>
        </div>

        <div class="panel-section" style="padding-top: 0;">
          <div class="asset-grid" id="asset-items-grid">
            <!-- Asset items injected here -->
          </div>
        </div>
      `;

      this.filterAndRenderItems();
    }

    bindEvents() {
      const searchInput = this.container.querySelector('#asset-search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value.toLowerCase().trim();
          this.filterAndRenderItems();
        });
      }

      const catPills = this.container.querySelectorAll('.cat-pill');
      catPills.forEach(pill => {
        pill.addEventListener('click', () => {
          catPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          this.activeCategory = pill.getAttribute('data-cat');
          this.filterAndRenderItems();
        });
      });
    }

    filterAndRenderItems() {
      const grid = this.container.querySelector('#asset-items-grid');
      if (!grid) return;

      const builtins = this.getBuiltInAssets();
      let allAssets = [...builtins];

      // Add user uploaded images if upload workflow exists
      if (window.studioApp && window.studioApp.uploadWorkflow && window.studioApp.uploadWorkflow.uploadedFiles) {
        const userUploads = window.studioApp.uploadWorkflow.uploadedFiles.map(u => ({
          id: u.id,
          title: u.name,
          category: 'user',
          type: u.isSvg ? 'vector_svg' : 'raster_png',
          tags: ['upload', 'user'],
          dimensions: `${u.width} × ${u.height}`,
          sourceType: 'user',
          thumbnail: u.dataUrl,
          dataUrl: u.dataUrl,
          svgContent: u.svgContent
        }));
        allAssets = [...userUploads, ...allAssets];
      }

      // Filter by category
      let filtered = allAssets;
      if (this.activeCategory !== 'all') {
        filtered = filtered.filter(a => a.category === this.activeCategory);
      }

      // Filter by query
      if (this.searchQuery) {
        filtered = filtered.filter(a => 
          a.title.toLowerCase().includes(this.searchQuery) ||
          a.tags.some(t => t.toLowerCase().includes(this.searchQuery))
        );
      }

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div class="empty-state">
            <div class="empty-title">No assets found</div>
            <div class="empty-desc">Try a different category or search term, or upload a new image.</div>
          </div>
        `;
        return;
      }

      grid.innerHTML = filtered.map(item => `
        <div class="asset-card" data-id="${item.id}" title="${item.title} (${item.dimensions})">
          <div class="asset-checkerboard-wrap">
            <img src="${item.thumbnail}" alt="${item.title}" loading="lazy" />
            <span class="asset-type-badge">${item.type === 'vector_svg' ? 'SVG' : 'PNG'}</span>
          </div>
          <div class="asset-info">
            <span class="asset-title">${item.title}</span>
            <span class="asset-dims">${item.dimensions} px</span>
          </div>
          <button class="btn-insert-asset" data-id="${item.id}">+ Insert</button>
        </div>
      `).join('');

      // Bind click handlers to insert
      grid.querySelectorAll('.asset-card').forEach(card => {
        card.addEventListener('click', () => {
          const id = card.getAttribute('data-id');
          const asset = filtered.find(a => a.id === id);
          if (asset) this.insertAsset(asset);
        });
      });
    }

    insertAsset(asset) {
      if (!asset) return;

      if (asset.type === 'vector_svg' && asset.svgContent) {
        this.engine.loadSVG(asset.svgContent);
      } else if (asset.dataUrl) {
        this.engine.addImage(asset.dataUrl, {
          name: asset.title
        });
      }

      // Quick visual feedback
      const toast = document.createElement('div');
      toast.className = 'studio-toast toast-info';
      toast.innerHTML = `<span>Placed <strong>${asset.title}</strong> onto canvas.</span>`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2500);
    }
  }

  window.AssetLibrary = AssetLibrary;
})(window);
