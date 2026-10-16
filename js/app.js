/**
 * AJAYNXT AI Design Studio - Master Application Controller
 * Orchestrates:
 * - Canvas Engine (Fabric.js vector studio) & Packaging Engine (6" circular tin)
 * - 15 Application Pages & Unified Navigation
 * - Left Tool Rail, Flyout Drawers, Contextual Properties Inspector, Layers Tree
 * - Uploads, Asset Library, Template Gallery, AI Brief Studio, BG Remover, Export Engine
 * - Global Keyboard Shortcuts & Mode Switchers
 */

(function(window) {
  'use strict';

  class StudioApplication {
    constructor() {
      this.currentMode = 'design'; // 'design', 'packaging', or 'print'
      this.currentPage = 'editor'; // 'editor', 'home', 'templates', 'projects', 'pricing', 'creator', etc.
      this.activeDrawerTab = 'templates';

      this.init();
    }

    async init() {
      // 1. Initialize Project Model & Core Engines
      this.project = new window.StudioProject({
        title: 'Untitled Creative Design',
        width: 1200,
        height: 1200
      });

      this.canvasEngine = new window.CanvasEngine('studio-main-canvas', {
        width: 1200,
        height: 1200,
        projectModel: this.project
      });

      this.packagingEngine = new window.PackagingEngine(
        document.getElementById('packaging-svg-stage'),
        { projectModel: this.project }
      );

      // 2. Initialize Panels & Modules
      this.layersPanel = new window.LayersPanel(this.canvasEngine, {
        container: document.getElementById('layers-tree-container')
      });

      this.inspectorPanel = new window.InspectorPanel(this.canvasEngine, {
        container: document.getElementById('inspector-content-box')
      });

      this.templateGallery = new window.TemplateGallery(this.canvasEngine, {
        container: document.getElementById('drawer-templates-container'),
        onTemplateSelected: (tpl) => this.onTemplateLoaded(tpl)
      });

      this.assetLibrary = new window.AssetLibrary(this.canvasEngine, {
        container: document.getElementById('drawer-assets-container')
      });

      this.uploadWorkflow = new window.UploadWorkflow(this.canvasEngine, {
        container: document.getElementById('drawer-upload-container'),
        onSendToAI: (briefData) => this.aiBriefModal.show(briefData)
      });

      this.aiBriefModal = new window.AIBriefModal(this.canvasEngine);
      this.bgRemover = new window.BackgroundRemover(this.canvasEngine);
      this.exportEngine = new window.ExportEngine(this.canvasEngine, this.packagingEngine, this.project);
      this.authModal = new window.AuthModal();
      this.projectsManager = new window.ProjectsManager(this.canvasEngine, this.project, {
        container: document.getElementById('projects-view-container')
      });
      this.creatorPages = new window.CreatorPagesManager();
      this.providerDashboard = window.ProviderDashboard ? new window.ProviderDashboard() : null;

      // 3. Connect Canvas Engine to Panels
      this.canvasEngine.onSelectionChanged((obj) => {
        this.inspectorPanel.updateForSelection(obj);
        this.layersPanel.highlightLayer(obj ? obj.id : null);
      });

      this.canvasEngine.onCanvasModified(() => {
        this.layersPanel.updateLayersList(this.canvasEngine.getObjects());
        this.updateUndoRedoButtons();
      });

      // 4. Bind Global UI Events & Navigation
      this.bindNavigationEvents();
      this.bindModeSwitcherEvents();
      this.bindDrawerEvents();
      this.bindTopBarEvents();
      this.bindKeyboardShortcuts();
      this.bindPackagingSubtoolbar();
      this.bindCustomDesignModal();

      // 5. Initialize Page Views
      this.creatorPages.renderSubscriptionPage(document.getElementById('subscription-view-container'));
      this.creatorPages.renderCreatorDashboard(document.getElementById('creator-view-container'));
      this.creatorPages.renderCreatorSubmission(document.getElementById('creator-submit-container'));
      this.creatorPages.renderCreatorLeaderboard(document.getElementById('leaderboard-view-container'));
      this.creatorPages.renderAccountSettings(document.getElementById('settings-view-container'));

      // Render home dashboard quick links
      this.renderHomeDashboard();

      // Check if auth session exists
      if (window.StudioServices && window.StudioServices.auth) {
        window.StudioServices.auth.init();
      }

      console.log('AJAYNXT AI Design Studio Initialized successfully.');
    }

    renderHomeDashboard() {
      const container = document.getElementById('home-view-container');
      if (!container) return;

      container.innerHTML = `
        <div class="page-container">
          <div class="dashboard-hero-card">
            <div>
              <div class="dev-badge-pill">Creative Engine 2.0</div>
              <h1 class="page-title" style="font-size:32px; color:#fff;">Welcome to AJAYNXT AI Design Studio</h1>
              <p class="page-desc" style="color:#cbd5e1; margin-top:8px;">
                Professional vector studio, 6" circular bakery packaging engine, and AI design assistant.
              </p>
            </div>
            <button class="btn btn-primary btn-lg" id="btn-hero-start-creating">
              <span class="btn-icon">⚡</span> Start Creating
            </button>
          </div>

          <h3 class="section-title" style="font-size:18px; margin-bottom:16px;">Quick Workspaces</h3>
          <div class="hero-actions-grid">
            <div class="hero-action-card" id="card-action-blank">
              <div class="hero-action-icon">📐</div>
              <div class="hero-action-title">Blank Canvas Design</div>
              <div class="hero-action-desc">Custom dimensions for posters, social media, advertisements, and prints.</div>
            </div>
            <div class="hero-action-card" id="card-action-packaging">
              <div class="hero-action-icon">🍪</div>
              <div class="hero-action-title">6" Bakery Tin Packaging</div>
              <div class="hero-action-desc">Diamond Bakery royal cookie tin, 3D steel dabba simulation, concentric rims, and A4 print imposition.</div>
            </div>
            <div class="hero-action-card" id="card-action-templates">
              <div class="hero-action-icon">🎨</div>
              <div class="hero-action-title">Explore Template Gallery</div>
              <div class="hero-action-desc">Search 13+ production vector templates across 8 categories with real PNG previews.</div>
            </div>
            <div class="hero-action-card" id="card-action-bgremove">
              <div class="hero-action-icon">✂️</div>
              <div class="hero-action-title">AI Background Remover</div>
              <div class="hero-action-desc">Edge-aware cutout for portraits, cookies, and products with interactive before/after slider.</div>
            </div>
            <div class="hero-action-card" id="card-action-ai-brief">
              <div class="hero-action-icon">✨</div>
              <div class="hero-action-title">AI Design Assistant Brief</div>
              <div class="hero-action-desc">Refine natural-language prompts into structured design briefs with verified pre-flight checks.</div>
            </div>
            <div class="hero-action-card" id="card-action-projects">
              <div class="hero-action-icon">📁</div>
              <div class="hero-action-title">My Saved Projects</div>
              <div class="hero-action-desc">Open, duplicate, and export locally preserved vector artworks and packaging projects.</div>
            </div>
          </div>
        </div>
      `;

      container.querySelector('#btn-hero-start-creating').addEventListener('click', () => this.switchPage('editor'));
      container.querySelector('#card-action-blank').addEventListener('click', () => {
        this.switchPage('editor');
        this.openCustomDesignModal();
      });
      container.querySelector('#card-action-packaging').addEventListener('click', () => {
        this.switchPage('editor');
        this.switchMode('packaging');
      });
      container.querySelector('#card-action-templates').addEventListener('click', () => this.switchPage('templates'));
      container.querySelector('#card-action-bgremove').addEventListener('click', () => {
        this.switchPage('editor');
        this.bgRemover.show();
      });
      container.querySelector('#card-action-ai-brief').addEventListener('click', () => {
        this.switchPage('editor');
        this.aiBriefModal.show();
      });
      container.querySelector('#card-action-projects').addEventListener('click', () => this.switchPage('projects'));
    }

    switchPage(pageId) {
      this.currentPage = pageId;

      // Update nav link active state
      document.querySelectorAll('.nav-link-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-page') === pageId);
      });

      // Hide all full-page views
      document.querySelectorAll('.full-page-view').forEach(view => {
        view.classList.remove('active');
      });

      if (pageId === 'editor') {
        // Standard editor workspace is visible underneath
        document.getElementById('editor-workspace').style.display = 'flex';
      } else {
        document.getElementById('editor-workspace').style.display = 'none';
        const targetView = document.getElementById(`${pageId}-view`);
        if (targetView) targetView.classList.add('active');

        // Re-render gallery if templates page
        if (pageId === 'templates') {
          this.renderFullTemplateGallery();
        }
      }
    }

    renderFullTemplateGallery() {
      const container = document.getElementById('full-gallery-container');
      if (!container) return;

      container.innerHTML = `
        <div class="page-container">
          <div class="page-top-bar">
            <div>
              <h2 class="page-title">Global Template Library</h2>
              <p class="page-desc">Search and load editable vector templates. Real PNG previews rendered from vector sources.</p>
            </div>
          </div>
          <div id="full-gallery-categories" class="asset-categories-scroll" style="margin-bottom: 24px;"></div>
          <div id="full-gallery-grid" class="template-grid"></div>
        </div>
      `;

      // Copy categories and cards from templateGallery module
      const catsScroll = container.querySelector('#full-gallery-categories');
      const grid = container.querySelector('#full-gallery-grid');

      if (this.templateGallery && this.templateGallery.manifest) {
        catsScroll.innerHTML = this.templateGallery.categories.map(c => `
          <button class="cat-pill ${c.id === 'all' ? 'active' : ''}" data-cat="${c.id}">${c.name}</button>
        `).join('');

        const renderCards = (cat) => {
          const list = cat === 'all' 
            ? this.templateGallery.manifest 
            : this.templateGallery.manifest.filter(t => t.category === cat);

          grid.innerHTML = list.map(t => `
            <div class="template-card" data-id="${t.id}">
              <div class="template-thumb-wrap">
                <img src="${t.preview}" alt="${t.title}" />
              </div>
              <div class="template-card-body">
                <div class="template-card-title">${t.title}</div>
                <div class="template-card-meta">
                  <span>${t.dimensions.width} × ${t.dimensions.height} px</span>
                  <span>•</span>
                  <span class="tag-badge">${t.format}</span>
                </div>
              </div>
              <div style="padding: 0 14px 14px;">
                <button class="btn btn-primary btn-block btn-sm btn-open-tpl" data-id="${t.id}">Open in Studio</button>
              </div>
            </div>
          `).join('');

          grid.querySelectorAll('.btn-open-tpl').forEach(btn => {
            btn.addEventListener('click', (e) => {
              e.stopPropagation();
              const id = btn.getAttribute('data-id');
              const tpl = this.templateGallery.manifest.find(x => x.id === id);
              if (tpl) {
                this.switchPage('editor');
                this.templateGallery.loadTemplate(tpl);
              }
            });
          });
        };

        renderCards('all');

        catsScroll.querySelectorAll('.cat-pill').forEach(pill => {
          pill.addEventListener('click', () => {
            catsScroll.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            renderCards(pill.getAttribute('data-cat'));
          });
        });
      }
    }

    switchMode(mode) {
      this.currentMode = mode;

      // Update mode switcher buttons
      document.querySelectorAll('.mode-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
      });

      const artboardContainer = document.getElementById('canvas-artboard-container');
      const packagingViewport = document.getElementById('packaging-viewport');

      if (mode === 'packaging') {
        artboardContainer.style.display = 'none';
        packagingViewport.style.display = 'flex';
        this.packagingEngine.setViewMode('3d');
        this.openDrawer('packaging');
      } else if (mode === 'print') {
        artboardContainer.style.display = 'none';
        packagingViewport.style.display = 'flex';
        this.packagingEngine.setViewMode('a4_sheet');
      } else {
        // Design Canvas Mode
        artboardContainer.style.display = 'block';
        packagingViewport.style.display = 'none';
        this.openDrawer('templates');
      }
    }

    openDrawer(drawerId) {
      this.activeDrawerTab = drawerId;
      const drawer = document.getElementById('left-drawer-panel');
      drawer.classList.remove('collapsed');

      // Update icon rail buttons
      document.querySelectorAll('.rail-tool-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tool') === drawerId);
      });

      // Show relevant panel inside drawer
      document.querySelectorAll('.drawer-tab-content').forEach(panel => {
        panel.style.display = panel.id === `drawer-${drawerId}-container` ? 'block' : 'none';
      });

      const drawerTitle = document.getElementById('drawer-title-label');
      if (drawerTitle) {
        const titles = {
          templates: 'Template Gallery',
          elements: 'Shapes & Elements',
          text: 'Text & Typography',
          upload: 'Uploads & Sources',
          assets: 'Asset & PNG Library',
          packaging: 'Packaging Tin Settings',
          layers: 'Layer Tree Manager'
        };
        drawerTitle.textContent = titles[drawerId] || 'Tool Drawer';
      }
    }

    closeDrawer() {
      const drawer = document.getElementById('left-drawer-panel');
      drawer.classList.add('collapsed');
      document.querySelectorAll('.rail-tool-btn').forEach(btn => btn.classList.remove('active'));
    }

    bindNavigationEvents() {
      // Top navbar page buttons
      document.querySelectorAll('.nav-link-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const page = btn.getAttribute('data-page');
          this.switchPage(page);
        });
      });

      // Brand badge clicks back to Home
      const brandBadge = document.getElementById('nav-brand-badge');
      if (brandBadge) {
        brandBadge.addEventListener('click', () => this.switchPage('home'));
      }
    }

    bindModeSwitcherEvents() {
      document.querySelectorAll('.mode-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const mode = btn.getAttribute('data-mode');
          this.switchMode(mode);
        });
      });
    }

    bindDrawerEvents() {
      // Left rail buttons
      document.querySelectorAll('.rail-tool-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tool = btn.getAttribute('data-tool');
          if (tool === 'ai') {
            this.aiBriefModal.show();
          } else if (tool === 'bgremove') {
            this.bgRemover.show();
          } else {
            if (this.activeDrawerTab === tool && !document.getElementById('left-drawer-panel').classList.contains('collapsed')) {
              this.closeDrawer();
            } else {
              this.openDrawer(tool);
            }
          }
        });
      });

      // Close drawer button
      const closeBtn = document.getElementById('btn-close-drawer');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeDrawer());
      }

      // Quick Shape Add Buttons in Elements tab
      document.querySelectorAll('.btn-quick-shape').forEach(btn => {
        btn.addEventListener('click', () => {
          const shape = btn.getAttribute('data-shape');
          if (shape === 'rect') this.canvasEngine.addRect();
          else if (shape === 'circle') this.canvasEngine.addCircle();
          else if (shape === 'triangle') this.canvasEngine.addTriangle();
          else if (shape === 'line') this.canvasEngine.addLine();
        });
      });

      // Quick Text Add Buttons in Text tab
      document.querySelectorAll('.btn-add-text-preset').forEach(btn => {
        btn.addEventListener('click', () => {
          const type = btn.getAttribute('data-type');
          if (type === 'heading') {
            this.canvasEngine.addText('Heading Text', { fontSize: 48, fontFamily: 'Cinzel, serif', fontWeight: 'bold' });
          } else if (type === 'subheading') {
            this.canvasEngine.addText('Subheading Line', { fontSize: 26, fontFamily: 'Playfair Display, serif' });
          } else if (type === 'body') {
            this.canvasEngine.addText('Add body paragraph copy here with clean typography.', { fontSize: 16, fontFamily: 'Montserrat, sans-serif' });
          }
        });
      });
    }

    bindTopBarEvents() {
      // Undo / Redo
      document.getElementById('btn-top-undo')?.addEventListener('click', () => {
        this.project.undo(this.canvasEngine);
        this.updateUndoRedoButtons();
      });

      document.getElementById('btn-top-redo')?.addEventListener('click', () => {
        this.project.redo(this.canvasEngine);
        this.updateUndoRedoButtons();
      });

      // Zoom controls
      document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
        this.canvasEngine.setZoom(this.canvasEngine.zoom * 1.15);
        this.updateZoomLabel();
      });
      document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
        this.canvasEngine.setZoom(this.canvasEngine.zoom / 1.15);
        this.updateZoomLabel();
      });
      document.getElementById('btn-zoom-fit')?.addEventListener('click', () => {
        this.canvasEngine.setZoom(1);
        this.updateZoomLabel();
      });

      // New Blank Design
      document.getElementById('btn-new-design')?.addEventListener('click', () => {
        this.openCustomDesignModal();
      });

      // Export Button
      document.getElementById('btn-top-export')?.addEventListener('click', () => {
        this.exportEngine.show(this.currentMode);
      });

      // Sign In / Auth Button
      document.getElementById('btn-user-profile')?.addEventListener('click', () => {
        this.authModal.show();
      });

      // AI Providers Status & Spending Limit Button
      document.getElementById('btn-ai-providers-status')?.addEventListener('click', () => {
        if (this.providerDashboard) this.providerDashboard.show();
      });
    }

    bindPackagingSubtoolbar() {
      // 3D Dabba View
      document.getElementById('btn-pkg-3d')?.addEventListener('click', () => {
        this.packagingEngine.setViewMode('3d');
        document.querySelectorAll('.pkg-tool-chip').forEach(c => c.classList.remove('active'));
        document.getElementById('btn-pkg-3d').classList.add('active');
      });

      // Flat Circular View
      document.getElementById('btn-pkg-flat')?.addEventListener('click', () => {
        this.packagingEngine.setViewMode('flat');
        document.querySelectorAll('.pkg-tool-chip').forEach(c => c.classList.remove('active'));
        document.getElementById('btn-pkg-flat').classList.add('active');
      });

      // A4 Sheet Imposition
      document.getElementById('btn-pkg-a4')?.addEventListener('click', () => {
        this.packagingEngine.setViewMode('a4_sheet');
        document.querySelectorAll('.pkg-tool-chip').forEach(c => c.classList.remove('active'));
        document.getElementById('btn-pkg-a4').classList.add('active');
      });

      // Packaging Presets in Drawer
      document.querySelectorAll('.pkg-preset-card').forEach(card => {
        card.addEventListener('click', () => {
          const preset = card.getAttribute('data-preset');
          this.packagingEngine.applyPreset(preset);
        });
      });
    }

    bindKeyboardShortcuts() {
      window.addEventListener('keydown', (e) => {
        // Ignore if user is inside an input or textarea
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
          return;
        }

        const isCtrl = e.ctrlKey || e.metaKey;

        // Undo: Ctrl/Cmd + Z
        if (isCtrl && e.key.toLowerCase() === 'z' && !e.shiftKey) {
          e.preventDefault();
          this.project.undo(this.canvasEngine);
          this.updateUndoRedoButtons();
        }
        // Redo: Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z
        else if ((isCtrl && e.key.toLowerCase() === 'y') || (isCtrl && e.shiftKey && e.key.toLowerCase() === 'z')) {
          e.preventDefault();
          this.project.redo(this.canvasEngine);
          this.updateUndoRedoButtons();
        }
        // Delete: Delete or Backspace
        else if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault();
          this.canvasEngine.deleteActiveObject();
        }
        // Save: Ctrl/Cmd + S
        else if (isCtrl && e.key.toLowerCase() === 's') {
          e.preventDefault();
          this.projectsManager.saveActiveProject();
        }
      });
    }

    bindCustomDesignModal() {
      const modal = document.getElementById('create-custom-modal');
      if (!modal) return;

      modal.querySelector('#close-custom-modal')?.addEventListener('click', () => modal.style.display = 'none');
      modal.querySelector('#btn-cancel-custom')?.addEventListener('click', () => modal.style.display = 'none');

      modal.querySelector('#btn-create-custom-canvas')?.addEventListener('click', () => {
        const preset = modal.querySelector('input[name="custom_preset"]:checked')?.value || '1200x1200';
        let w = 1200, h = 1200;

        if (preset === 'custom') {
          w = parseInt(modal.querySelector('#custom-w-input').value) || 1200;
          h = parseInt(modal.querySelector('#custom-h-input').value) || 1200;
        } else if (preset.includes('x')) {
          [w, h] = preset.split('x').map(Number);
        }

        this.canvasEngine.clear();
        this.canvasEngine.setDimensions(w, h);
        modal.style.display = 'none';
        this.switchPage('editor');
        this.switchMode('design');
      });
    }

    openCustomDesignModal() {
      const modal = document.getElementById('create-custom-modal');
      if (modal) modal.style.display = 'flex';
    }

    updateUndoRedoButtons() {
      const undoBtn = document.getElementById('btn-top-undo');
      const redoBtn = document.getElementById('btn-top-redo');
      if (undoBtn) undoBtn.disabled = !this.project.canUndo();
      if (redoBtn) redoBtn.disabled = !this.project.canRedo();
    }

    updateZoomLabel() {
      const label = document.getElementById('top-zoom-val');
      if (label) {
        label.textContent = Math.round(this.canvasEngine.zoom * 100) + '%';
      }
    }

    onTemplateLoaded(template) {
      this.switchPage('editor');
      this.switchMode(template.category === 'packaging' ? 'packaging' : 'design');
    }
  }

  // Initialize on DOMContentLoaded
  window.addEventListener('DOMContentLoaded', () => {
    window.studioApp = new StudioApplication();
  });

})(window);
