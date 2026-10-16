# 🎨 AJAYNXT AI Design Studio (Phase 1 — Frontend + SVG Editor)

> **A professional creative application & vector SVG design studio.**  
> Built for custom poster design, vector packaging, AI-assisted graphic composition, professional background removal, and multi-format commercial print workflows (72–600 DPI).  
> *Fully incorporates and preserves the Diamond Bakery 6-Inch Round Cookie Tin Packaging Studio & A4 Imposition Engine.*

[![Studio Live Demo](https://img.shields.io/badge/🚀%20Live%20App-AJAYNXT%20Studio-22C55E?style=for-the-badge)](https://ajaynxt.github.io/ajaynxt-ai-design-studio/)
[![Vector Engine](https://img.shields.io/badge/Vector%20Engine-Fabric.js%205.3-0284C7?style=for-the-badge)](https://fabricjs.com/)
[![Print Resolution](https://img.shields.io/badge/Print%20Resolution-600%20DPI%20Ultra%20HD-D4AF37?style=for-the-badge)](https://ajaynxt.github.io/ajaynxt-ai-design-studio/)
[![Templates](https://img.shields.io/badge/Templates-13%20Vector%20Projects-8B5CF6?style=for-the-badge)](https://ajaynxt.github.io/ajaynxt-ai-design-studio/)
[![AI Readiness](https://img.shields.io/badge/AI%20Readiness-Phase%201%20Compliant-F59E0B?style=for-the-badge)](https://ajaynxt.github.io/ajaynxt-ai-design-studio/)

---

## 🌟 Executive Summary & Phase 1 Scope

**AJAYNXT AI Design Studio** is a browser-native graphic design platform tailored for print packaging, promotional posters, social creatives, and restaurant branding. 

In **Phase 1 (Frontend + SVG Editor)**, the application delivers a complete local creative studio:
- **Zero backend dependencies**: Runs client-side with full offline/local storage capabilities.
- **High-DPI Vector Engine**: Object-oriented canvas powered by Fabric.js with layers, typography, transform matrices, snap guidelines, and SVG import/export.
- **Professional AI Background Remover**: Edge matting, before/after comparison split slider, manual mask correction brush (Restore/Erase), replacement backdrops, and genuine 32-bit alpha PNG download.
- **AI Design Assistant**: Structured brief refinement modal turning natural language prompts into schema-validated JSON design specifications with strict pre-flight confirmation.
- **100% Preserved Diamond Bakery Heritage**: 6-inch circular tin packaging engine, 3D steel dabba simulation, 17 royal mandalas, and A4 print sheet imposition preserved and accessible seamlessly.
- **Creator Portal & Pricing**: Showcase dashboard, template submission workflow, royalty ledger, and 7-day free trial tier cards.

---

## 📐 Application Architecture

```
ajaynxt-ai-design-studio/
├── index.html                      # Master application shell & UI layout
├── legacy_packaging_studio.html    # Preserved original Diamond Bakery studio
├── css/
│   └── studio.css                  # Modern dark theme creative workspace (#090d16)
├── js/
│   ├── app.js                      # Master application controller & navigation
│   ├── core/
│   │   ├── project-model.js        # StudioProject data model, 30-step undo/redo, JSON schema
│   │   ├── canvas-engine.js        # Fabric.js vector controller, guidelines, zoom & selection
│   │   └── packaging-engine.js     # Preserved Diamond Bakery 6" packaging & A4 imposition engine
│   ├── services/
│   │   └── service-contracts.js    # Typed service contracts (Auth, AI, Storage, BG Removal & provider matrix)
│   └── modules/
│       ├── layers-panel.js         # Layer hierarchy, ordering, lock, visibility, deletion
│       ├── inspector-panel.js      # Contextual properties (typography, color, alignment, BG removal)
│       ├── template-gallery.js     # Searchable catalog with real PNG previews & SVG source loader
│       ├── upload-workflow.js      # Multi-format upload (PNG/JPG/WebP/SVG) with dimensions inspector
│       ├── asset-library.js        # Brand assets, 17 royal mandalas, cookies, stamps & user uploads
│       ├── projects-manager.js     # Local projects CRUD, auto-save, JSON import/export
│       ├── ai-brief-modal.js       # Natural language prompt refiner & JSON brief generator
│       ├── bg-remover.js           # AI Background Remover with interactive before/after split slider
│       ├── export-engine.js        # Multi-format exporter (PNG 72-600 DPI, JPG, pure SVG, PDF, JSON)
│       ├── auth-modal.js           # Google & Email sign-in modal with Phase 1 status indicators
│       └── creator-pages.js        # Creator dashboard, template submitter, leaderboard & pricing
├── templates/
│   ├── templates.json              # 13 verified templates manifest across 8 categories
│   ├── sources/                    # 13 pure vector SVG project source files
│   └── previews/                   # 13 real PNG preview renders (rendered via Chrome)
└── test_studio_suite.py            # Automated Playwright verification test suite
```

---

## 🎨 Core Features

### 1. Vector SVG Canvas & Object Manipulation
- **Object Types**: Text (Cinzel, Playfair Display, Montserrat, Alex Brush, Cormorant Garamond), Rectangles, Circles, Stars, Polygons, Lines, and Raster Images.
- **Transformations**: Real-time bounding box rotation, scale, skew, and positional coordinates.
- **Layer Management**: Reorder (Bring to Front, Send to Back, Forward, Backward), Rename, Lock, Hide, Duplicate, and Delete.
- **History**: 30-step deep undo/redo stack (`Ctrl+Z` / `Ctrl+Y`).
- **Snapping & Alignment**: Dynamic center and edge guidelines with instant alignment tools (Left, Center, Right, Top, Middle, Bottom).

### 2. Verified Template Catalog (13 Real Projects)
All templates feature editable vector SVGs and real rendered PNG previews (no fabricated screenshots):
1. **Packaging — Royal Velvet Maroon & Gold** (6" Round Tin)
2. **Packaging — Tiffany Mint & Emerald Luxury** (6" Round Tin)
3. **Packaging — Obsidian Black & 24K Gold** (6" Round Tin)
4. **Poster — Heritage Shimla Mall Road** (18" × 24")
5. **Poster — Pure Desi Ghee & Golden Butter** (18" × 24")
6. **Social — Fresh Baked Daily Square** (1080 × 1080 px)
7. **Social — Pure Butter Story Creative** (1080 × 1920 px)
8. **Sticker — Hexagon Artisan Seal** (3" × 3")
9. **Sticker — Royal Jar Gold Seal** (2.5" × 2.5")
10. **Restaurant — Weekend Royal High Tea** (11" × 17")
11. **Festival — Shahi Diwali Royal Hamper** (12" × 18")
12. **Product Ad — French Almond Macaron** (1200 × 628 px)
13. **Custom Print — A4 Dual Tin Imposition** (210 × 297 mm)

### 3. Professional AI Background Removal
- **Client-Side Matting Pipeline**: High-contrast luma and chroma boundary matting algorithm with edge feathering.
- **Before / After Split Slider**: Interactive dual-layer comparison slider revealing the transparent checkerboard in real time.
- **Manual Mask Correction**: Brush tools with adjustable size (5–80px) for detailed edge restoration and erasing.
- **Backdrop Replacement**: Test cutouts instantly against Dark Studio, Clean White, Emerald Luxury, Velvet Maroon, or 24K Gold gradients.
- **32-Bit Alpha Export**: Genuine transparent PNG output without checkerboard pixel baking.
- **Provider Evaluation Drawer**: Comparative matrix for production Phase 2 deployment:
  - **remove.bg**: Best for human portraits and fine hair (API cost ~\$0.20/image).
  - **Adobe Photoshop API**: Industry gold standard for complex bakery packaging, food details, and depth maps.
  - **Photoroom API**: Highly performant for product photography and e-commerce batch processing.

### 4. AI Design Assistant (Brief Refiner)
- Translates vague prompts (e.g., *"Make a royal bakery banner for Shimla"*) into structured design briefs:
  - **Project Type & Dimensions**
  - **Primary & Accent Color Palettes (HEX)**
  - **Typography Pairing** (Heading serif + Body sans)
  - **Layout Structure & Visual Hierarchy**
  - **Mood & Visual Theme**
- Generates schema-compliant JSON ready for Phase 2 AI endpoints.
- Enforces strict user pre-flight review and checkbox confirmation before execution.

### 5. Multi-Format Commercial Export Engine
- **Raster Exports**:
  - PNG Web (72 DPI)
  - PNG Standard (150 DPI)
  - PNG Print Ready (300 DPI)
  - PNG Master Press (600 DPI — up to 3600 × 3600 px)
  - JPG High Quality (92% quality with customizable canvas background)
- **Vector & Document Exports**:
  - Pure Vector SVG (all paths and text preserved as scalable vector markup)
  - Print PDF (direct vector rendering via jsPDF)
  - Studio Project JSON (complete layer tree, styles, and asset references for future editing)

### 6. Diamond Bakery 600 DPI Packaging Suite (Preserved)
- **100% Backward Compatible**: The original Diamond Bakery packaging engine is preserved and accessible directly via the top navigation bar (**Bakery Packaging (6" Tin)**) or via [`legacy_packaging_studio.html`](legacy_packaging_studio.html).
- **View Modes**:
  - **3D Steel Dabba View**: Realistic metallic rim reflection and container simulation.
  - **Flat 2D Circle View**: Pure concentric editing view with 17 mandalas.
  - **A4 Imposition Sheet View**: Automated 2-up label layout with crop marks for offset printing.
- **Asset Library**: Includes all 17 royal mandalas (Taj, Bloom, Lotus, Jaipur Royal, Mandir Jaali, etc.) and embedded bakery assets.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + Z` / `⌘ + Z` | Undo last action |
| `Ctrl + Y` / `⌘ + Y` | Redo action |
| `Delete` / `Backspace` | Delete selected layer |
| `Ctrl + S` / `⌘ + S` | Save project locally |
| `Escape` | Close any open modal or drawer |

---

## 🧪 Automated Verification & Testing

The application has been verified using a headless Playwright test suite (`test_studio_suite.py`) running real Chromium:
- ✅ Canvas initialization and Fabric.js event binding.
- ✅ Mode switching (Design Canvas ↔ 6" Bakery Tin ↔ A4 Print Sheet).
- ✅ Template catalog rendering and vector SVG loading.
- ✅ AI Background Remover interactive slider, manual mask correction brush, and alpha PNG download.
- ✅ AI Design Assistant natural language brief refinement and JSON preview.
- ✅ Multi-format export dialog options (72–600 DPI, SVG, PDF, JSON).
- ✅ Creator dashboard, templates table, and pricing modal navigation.

---

## 🚀 Phase 2 Roadmap (Future Backend & Cloud Services)

In accordance with project constraints, Phase 1 focused strictly on the frontend and local vector editor. The architecture is prepared for Phase 2:
1. **Firebase Authentication**: Seamless migration from mock auth service to Firebase Auth (Google OAuth & Email Link).
2. **Serverless AI Gateway**: Firebase Cloud Functions proxying prompt generation and vector asset creation to Gemini / Imagen APIs without exposing client-side credentials.
3. **Cloud Background Removal**: Server-side integration with Adobe Photoshop API / remove.bg with automated rate-limiting and quota controls.
4. **Cloud Project Storage**: Firestore metadata tracking with Firebase Cloud Storage for high-res assets.
5. **Subscription Billing**: Integration with Stripe / Razorpay for Pro and Enterprise subscriptions.

---

## 📜 License & Ownership
Copyright © 2026 **AJAYNXT AI Design Studio** & **Diamond Bakery • Restaurant • Sweets**. All Rights Reserved.  
Designed and engineered for professional creative design and commercial print packaging workflows.
