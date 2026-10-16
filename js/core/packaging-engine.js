(function(window) {
  'use strict';

  class PackagingEngine {
  constructor(mountElementId, options = {}) {
    this.mountId = mountElementId;
    this.options = options;
    
    // Core Packaging State
    this.state = {
      preset: 'mint',
      viewMode: '3d', // '3d', 'flat', 'a4'
      
      // Colors & Background
      bgCenter: '#C5ECE1',
      bgOuter: '#97D8C4',

      // Product Title ("Assorted Cookies")
      title: 'Assorted Cookies',
      titleFont: 'cinzel-dec', // 'cinzel-dec', 'playfair-black', 'montserrat-black', 'alex-brush'
      titleSize: 105,
      titleY: 690,
      titleColorMode: 'gold', // 'gold', 'emerald', 'white', 'custom'
      titleCustomColor: '#D4AF37',

      // Brand & Monogram
      brand: 'DIAMOND',
      brandSub: 'BAKERY • RESTAURANT • SWEETS',
      monogram: 'D',
      brandSize: 48,
      brandY: 405,
      crestScale: 1.0,
      brandColorMode: 'red', // 'red', 'gold', 'white', 'custom'
      brandCustomColor: '#C81D25',

      // Top Arc
      topArc: '★  SERVING SHIMLA SINCE 2002  •  FINEST ARTISAN BAKES  ★',
      topArcRadius: 530,
      topArcSize: 14.5,
      topArcColor: '#0F4C2A',

      // Bottom Arc
      bottomArc: '★  PREPARED IN PURE BUTTER & DESI GHEE  •  ZERO PALM OIL  ★',
      bottomArcRadius: 530,
      bottomArcSize: 14.5,
      bottomArcColor: '#0F4C2A',

      // Tagline Capsule Ribbon
      ribbonText: '★  BAKED WITH 100% PURE BUTTER  •  ZERO PALM OIL  ★',
      ribbonWidth: 750,
      ribbonSize: 16.5,
      ribbonY: 795,
      ribbonBg: '#0B3B24',
      ribbonBorder: '#D4AF37',
      ribbonTextColor: '#FFFDF0',

      // Plaque
      weight: '500g ℮',
      showVeg: true,
      plaqueY: 895,
      plaqueBg: '#FFFFFF',
      plaqueBorder: '#D4AF37',
      plaqueTextColor: '#0B3B24',

      // Mandala
      mandalaType: 'authentic_user',
      mandalaOpacity: 0.38,
      mandalaScale: 1.0,

      // A4 Engine
      a4Layout: 1
    };

    this.onStateChange = options.onStateChange || null;
  }

  /**
   * Presets
   */
  static PRESETS = {
    mint: {
      bgCenter: '#C5ECE1',
      bgOuter: '#97D8C4',
      brandColorMode: 'red',
      titleFont: 'cinzel-dec',
      titleColorMode: 'gold',
      titleSize: 105,
      titleY: 690,
      brandY: 405,
      ribbonY: 795,
      plaqueY: 895,
      topArc: '★  SERVING SHIMLA SINCE 2002  •  FINEST ARTISAN BAKES  ★',
      topArcColor: '#0F4C2A',
      bottomArc: '★  PREPARED IN PURE BUTTER & DESI GHEE  •  ZERO PALM OIL  ★',
      bottomArcColor: '#0F4C2A',
      ribbonBg: '#0B3B24',
      ribbonBorder: '#D4AF37',
      ribbonTextColor: '#FFFDF0',
      plaqueBg: '#FFFFFF',
      plaqueBorder: '#D4AF37',
      plaqueTextColor: '#0B3B24',
      mandalaType: 'authentic_user',
      mandalaOpacity: 0.38
    },
    maroon: {
      bgCenter: '#3B0A12',
      bgOuter: '#1A0307',
      brandColorMode: 'gold',
      titleFont: 'cinzel-dec',
      titleColorMode: 'gold',
      titleSize: 105,
      titleY: 690,
      brandY: 405,
      ribbonY: 795,
      plaqueY: 895,
      topArc: '★  SERVING SHIMLA SINCE 2002  •  FINEST ARTISAN BAKES  ★',
      topArcColor: '#D4AF37',
      bottomArc: '★  PREPARED IN PURE BUTTER & DESI GHEE  •  ZERO PALM OIL  ★',
      bottomArcColor: '#D4AF37',
      ribbonBg: '#28050B',
      ribbonBorder: '#D4AF37',
      ribbonTextColor: '#FFFDF0',
      plaqueBg: '#28050B',
      plaqueBorder: '#D4AF37',
      plaqueTextColor: '#FFFFFF',
      mandalaType: 'authentic_user',
      mandalaOpacity: 0.48
    },
    black: {
      bgCenter: '#18181B',
      bgOuter: '#09090B',
      brandColorMode: 'gold',
      titleFont: 'cinzel-dec',
      titleColorMode: 'gold',
      titleSize: 105,
      titleY: 690,
      brandY: 405,
      ribbonY: 795,
      plaqueY: 895,
      topArc: '★  SERVING SHIMLA SINCE 2002  •  FINEST ARTISAN BAKES  ★',
      topArcColor: '#D4AF37',
      bottomArc: '★  PREPARED IN PURE BUTTER & DESI GHEE  •  ZERO PALM OIL  ★',
      bottomArcColor: '#D4AF37',
      ribbonBg: '#121214',
      ribbonBorder: '#D4AF37',
      ribbonTextColor: '#FFFDF0',
      plaqueBg: '#121214',
      plaqueBorder: '#D4AF37',
      plaqueTextColor: '#FFFFFF',
      mandalaType: 'sunburst_luxe',
      mandalaOpacity: 0.45
    },
    cream: {
      bgCenter: '#FFFDF7',
      bgOuter: '#F5EED9',
      brandColorMode: 'red',
      titleFont: 'cinzel-dec',
      titleColorMode: 'gold',
      titleSize: 105,
      titleY: 690,
      brandY: 405,
      ribbonY: 795,
      plaqueY: 895,
      topArc: '★  SERVING SHIMLA SINCE 2002  •  FINEST ARTISAN BAKES  ★',
      topArcColor: '#78350F',
      bottomArc: '★  PREPARED IN PURE BUTTER & DESI GHEE  •  ZERO PALM OIL  ★',
      bottomArcColor: '#78350F',
      ribbonBg: '#78350F',
      ribbonBorder: '#D4AF37',
      ribbonTextColor: '#FFFDF0',
      plaqueBg: '#FFFFFF',
      plaqueBorder: '#D4AF37',
      plaqueTextColor: '#78350F',
      mandalaType: 'lotus',
      mandalaOpacity: 0.40
    },
    crimson: {
      bgCenter: '#7F1D1D',
      bgOuter: '#450A0A',
      brandColorMode: 'gold',
      titleFont: 'cinzel-dec',
      titleColorMode: 'gold',
      titleSize: 105,
      titleY: 690,
      brandY: 405,
      ribbonY: 795,
      plaqueY: 895,
      topArc: '★  SERVING SHIMLA SINCE 2002  •  FINEST ARTISAN BAKES  ★',
      topArcColor: '#FDE047',
      bottomArc: '★  PREPARED IN PURE BUTTER & DESI GHEE  •  ZERO PALM OIL  ★',
      bottomArcColor: '#FDE047',
      ribbonBg: '#3B0A12',
      ribbonBorder: '#D4AF37',
      ribbonTextColor: '#FFFDF0',
      plaqueBg: '#3B0A12',
      plaqueBorder: '#D4AF37',
      plaqueTextColor: '#FFFFFF',
      mandalaType: 'taj',
      mandalaOpacity: 0.45
    },
    sapphire: {
      bgCenter: '#0F2C59',
      bgOuter: '#051329',
      brandColorMode: 'gold',
      titleFont: 'cinzel-dec',
      titleColorMode: 'gold',
      titleSize: 105,
      titleY: 690,
      brandY: 405,
      ribbonY: 795,
      plaqueY: 895,
      topArc: '★  SERVING SHIMLA SINCE 2002  •  FINEST ARTISAN BAKES  ★',
      topArcColor: '#D4AF37',
      bottomArc: '★  PREPARED IN PURE BUTTER & DESI GHEE  •  ZERO PALM OIL  ★',
      bottomArcColor: '#D4AF37',
      ribbonBg: '#091E3E',
      ribbonBorder: '#D4AF37',
      ribbonTextColor: '#FFFDF0',
      plaqueBg: '#091E3E',
      plaqueBorder: '#D4AF37',
      plaqueTextColor: '#FFFFFF',
      mandalaType: 'starburst',
      mandalaOpacity: 0.45
    }
  };

  applyPreset(presetKey) {
    const p = PackagingEngine.PRESETS[presetKey];
    if (!p) return;
    this.state.preset = presetKey;
    Object.assign(this.state, p);
    this.render();
    if (this.onStateChange) this.onStateChange(this.state);
  }

  updateState(partial) {
    Object.assign(this.state, partial);
    this.render();
    if (this.onStateChange) this.onStateChange(this.state);
  }

  generateSVG() {
    const s = this.state;
    const topR = s.topArcRadius || 530;
    const botR = s.bottomArcRadius || 530;

    const topX1 = 600 - topR * 0.866;
    const topY1 = 600 - topR * 0.5;
    const topX2 = 600 + topR * 0.866;
    const topY2 = 600 - topR * 0.5;
    const topArcPathD = `M ${topX1},${topY1} A ${topR},${topR} 0 0,1 ${topX2},${topY2}`;

    const botX1 = 600 - botR * 0.866;
    const botY1 = 600 + botR * 0.5;
    const botX2 = 600 + botR * 0.866;
    const botY2 = 600 + botR * 0.5;
    const botArcPathD = `M ${botX1},${botY1} A ${botR},${botR} 0 0,0 ${botX2},${botY2}`;

    let titleFontFamily = "'Cinzel Decorative', serif";
    let titleFontWeight = "900";
    let titleLetterSpacing = "0.04em";

    if (s.titleFont === 'playfair-black') {
      titleFontFamily = "'Playfair Display', serif";
      titleFontWeight = "900";
      titleLetterSpacing = "0.02em";
    } else if (s.titleFont === 'montserrat-black') {
      titleFontFamily = "'Montserrat', sans-serif";
      titleFontWeight = "900";
      titleLetterSpacing = "0.06em";
    } else if (s.titleFont === 'alex-brush') {
      titleFontFamily = "'Alex Brush', cursive";
      titleFontWeight = "normal";
      titleLetterSpacing = "0.02em";
    }

    let titleFill = "url(#foilGoldGrad)";
    let titleStroke = "#78350F";
    let titleStrokeWidth = "1.2";

    if (s.titleColorMode === 'emerald') {
      titleFill = "#064E3B";
      titleStroke = "#D4AF37";
      titleStrokeWidth = "0.8";
    } else if (s.titleColorMode === 'white') {
      titleFill = "#FFFDF0";
      titleStroke = "#000000";
      titleStrokeWidth = "1";
    } else if (s.titleColorMode === 'custom') {
      titleFill = s.titleCustomColor;
      titleStroke = "none";
      titleStrokeWidth = "0";
    }

    let brandFill = "#C81D25";
    if (s.brandColorMode === 'gold') brandFill = "url(#foilGoldGrad)";
    if (s.brandColorMode === 'white') brandFill = "#FFFFFF";
    if (s.brandColorMode === 'custom') brandFill = s.brandCustomColor;

    let monoFill = (s.brandColorMode === 'gold') ? "#FFFDF0" : "#E0222A";

    let mandalaMarkup = '';
    if (s.mandalaType === 'authentic_user' && window.ASSETS && window.ASSETS.mandala) {
      const mw = 1180 * s.mandalaScale;
      mandalaMarkup = `<image href="${window.ASSETS.mandala}" x="${-mw/2}" y="${-mw/2}" width="${mw}" height="${mw}" preserveAspectRatio="xMidYMid meet"/>`;
    } else if (window.MANDALAS && window.MANDALAS[s.mandalaType]) {
      mandalaMarkup = `<g transform="scale(${s.mandalaScale})">${window.MANDALAS[s.mandalaType]}</g>`;
    } else {
      mandalaMarkup = `
        <circle cx="0" cy="0" r="320" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1.5" stroke-dasharray="4 4"/>
        <circle cx="0" cy="0" r="460" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>
      `;
    }

    let crestMarkup = '';
    if (window.ASSETS && window.ASSETS.crest) {
      const cw = 300 * s.crestScale;
      const ch = cw * (255 / 358);
      crestMarkup = `<image href="${window.ASSETS.crest}" x="${-cw/2}" y="${-ch/2}" width="${cw}" height="${ch}" preserveAspectRatio="xMidYMid meet"/>`;
    } else {
      crestMarkup = `<circle cx="0" cy="0" r="60" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>`;
    }

    let vegEmblem = s.showVeg ? `
      <g transform="translate(-118, 0)">
        <rect x="-11" y="-11" width="22" height="22" rx="3.5" fill="#FFFFFF" stroke="#16A34A" stroke-width="2.2"/>
        <circle cx="0" cy="0" r="5.5" fill="#16A34A"/>
      </g>
    ` : '';

    return `
<svg id="final-label-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="100%" height="100%">
  <defs>
    <radialGradient id="tinBgGrad" cx="50%" cy="45%" r="72%">
      <stop offset="0%" stop-color="${s.bgCenter}"/>
      <stop offset="70%" stop-color="${s.bgOuter}"/>
      <stop offset="100%" stop-color="${s.bgOuter}"/>
    </radialGradient>
    <linearGradient id="foilGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFDF0"/>
      <stop offset="15%" stop-color="#FDE047"/>
      <stop offset="35%" stop-color="#EAB308"/>
      <stop offset="65%" stop-color="#CA8A04"/>
      <stop offset="85%" stop-color="#FACC15"/>
      <stop offset="100%" stop-color="#854D0E"/>
    </linearGradient>
    <filter id="shadowFilter" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#000000" flood-opacity="0.30"/>
    </filter>
    <filter id="titleShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="3.5" stdDeviation="4" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
    <clipPath id="lidClip">
      <circle cx="600" cy="600" r="592"/>
    </clipPath>
    <path id="topArcPath" d="${topArcPathD}" fill="none"/>
    <path id="botArcPath" d="${botArcPathD}" fill="none"/>
  </defs>

  <g clip-path="url(#lidClip)">
    <circle cx="600" cy="600" r="592" fill="url(#tinBgGrad)"/>
    <circle cx="600" cy="600" r="586" fill="none" stroke="url(#foilGoldGrad)" stroke-width="4.5"/>
    <circle cx="600" cy="600" r="578" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1.8"/>
    <circle cx="600" cy="600" r="570" fill="none" stroke="url(#foilGoldGrad)" stroke-width="0.8" opacity="0.6"/>

    <g opacity="${s.mandalaOpacity}" transform="translate(600, 600)" class="canva-draggable" data-layer="mandala">
      ${mandalaMarkup}
    </g>

    <text fill="${s.topArcColor}" font-family="'Cinzel', serif" font-weight="800" font-size="${s.topArcSize}px" letter-spacing="0.26em" class="canva-draggable" data-layer="top-arc">
      <textPath href="#topArcPath" startOffset="50%" text-anchor="middle">
        ${s.topArc}
      </textPath>
    </text>

    <text fill="${s.bottomArcColor}" font-family="'Cinzel', serif" font-weight="800" font-size="${s.bottomArcSize}px" letter-spacing="0.22em" class="canva-draggable" data-layer="bot-arc">
      <textPath href="#botArcPath" startOffset="50%" text-anchor="middle">
        ${s.bottomArc}
      </textPath>
    </text>

    <g transform="translate(600, ${s.brandY})" class="canva-draggable" data-layer="brand">
      <g filter="url(#shadowFilter)">
        ${crestMarkup}
      </g>
      <text x="0" y="8" text-anchor="middle" font-family="'Cinzel Decorative', 'Cinzel', serif" font-weight="900" font-size="78" fill="${monoFill}" filter="url(#shadowFilter)">
        ${s.monogram}
      </text>
      <text x="0" y="102" text-anchor="middle" font-family="'Cinzel', serif" font-weight="800" font-size="${s.brandSize}px" letter-spacing="0.28em" fill="${brandFill}" filter="url(#shadowFilter)">
        ${s.brand}
      </text>
      <text x="0" y="126" text-anchor="middle" font-family="'Cinzel', serif" font-weight="700" font-size="14.5px" letter-spacing="0.22em" fill="${brandFill}" opacity="0.92">
        ${s.brandSub}
      </text>
    </g>

    <g transform="translate(600, ${s.titleY})" class="canva-draggable" data-layer="cookies">
      <text x="0" y="0" text-anchor="middle" font-family="${titleFontFamily}" font-weight="${titleFontWeight}" font-size="${s.titleSize}px" letter-spacing="${titleLetterSpacing}" fill="${titleFill}" stroke="${titleStroke}" stroke-width="${titleStrokeWidth}" filter="url(#titleShadow)">
        ${s.title}
      </text>
    </g>

    <g transform="translate(600, ${s.ribbonY})" class="canva-draggable" data-layer="ribbon">
      <rect x="${-s.ribbonWidth / 2}" y="-19" width="${s.ribbonWidth}" height="38" rx="19" fill="${s.ribbonBg}" stroke="${s.ribbonBorder}" stroke-width="1.8" filter="url(#shadowFilter)"/>
      <line x1="${-s.ribbonWidth / 2 + 12}" y1="-14" x2="${s.ribbonWidth / 2 - 12}" y2="-14" stroke="${s.ribbonBorder}" stroke-width="0.6" opacity="0.6"/>
      <text x="0" y="5.5" text-anchor="middle" font-family="'Cinzel', 'Montserrat', serif" font-weight="800" font-size="${s.ribbonSize}px" letter-spacing="0.20em" fill="${s.ribbonTextColor}">
        ${s.ribbonText}
      </text>
    </g>

    <g transform="translate(600, ${s.plaqueY})" class="canva-draggable" data-layer="plaque">
      <path d="M -145,-19 L 145,-19 A 6,6 0 0,0 155,-9 L 155,9 A 6,6 0 0,0 145,19 L -145,19 A 6,6 0 0,0 -155,9 L -155,-9 A 6,6 0 0,0 -145,-19 Z" 
            fill="${s.plaqueBg}" stroke="${s.plaqueBorder}" stroke-width="2.2" filter="url(#shadowFilter)"/>
      <path d="M -140,-14 L 140,-14 A 4,4 0 0,0 148,-6 L 148,6 A 4,4 0 0,0 140,14 L -140,14 A 4,4 0 0,0 -148,6 L -148,-6 A 4,4 0 0,0 -140,-14 Z" 
            fill="none" stroke="${s.plaqueBorder}" stroke-width="0.8" opacity="0.85"/>
      ${vegEmblem}
      <line x1="-92" y1="-10" x2="-92" y2="10" stroke="${s.plaqueBorder}" stroke-width="1.2" stroke-linecap="round"/>
      <line x1="106" y1="-10" x2="106" y2="10" stroke="${s.plaqueBorder}" stroke-width="1.2" stroke-linecap="round"/>
      <text x="6" y="4.5" text-anchor="middle" font-family="'Cinzel', 'Montserrat', serif" font-weight="800" font-size="13.5px" letter-spacing="0.20em" fill="${s.plaqueTextColor}">
        NET WT. ${s.weight}
      </text>
      <g transform="translate(128, 0)">
        <circle cx="0" cy="0" r="9" fill="${s.plaqueBorder}" opacity="0.18"/>
        <path d="M 0,-8 L 2.2,-2.2 L 8,0 L 2.2,2.2 L 0,8 L -2.2,2.2 L -8,0 L -2.2,-2.2 Z" fill="${s.plaqueBorder}"/>
      </g>
    </g>
  </g>
</svg>`;
  }

  setViewMode(mode) {
    this.state.viewMode = mode;
    this.render();
  }

  render() {
    const mount = typeof this.mountId === 'string' ? document.getElementById(this.mountId) : this.mountId;
    if (!mount) return;
    if (this.state.viewMode === 'a4_sheet') {
      mount.innerHTML = this.getA4SheetSVG();
    } else {
      mount.innerHTML = this.generateSVG();
    }
  }

  getSVGString() {
    return this.generateSVG();
  }

  getA4SheetSVG() {
    const singleLabelSVG = this.generateSVG();
    // Wrap 2 circular 6-inch labels onto standard A4 sheet (2480 x 3508 px at 300 DPI)
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2480 3508" width="2480" height="3508">
        <rect width="2480" height="3508" fill="#ffffff" />
        <text x="1240" y="80" font-family="Montserrat, sans-serif" font-size="28" font-weight="bold" fill="#333333" text-anchor="middle">
          DIAMOND BAKERY • 6-INCH ROUND LABEL PRODUCTION SHEET (A4 IMPOSITION • 2 LABELS / SHEET)
        </text>
        <line x1="80" y1="110" x2="2400" y2="110" stroke="#cccccc" stroke-width="2" stroke-dasharray="10 5" />
        <!-- Top Label (Centered) -->
        <g transform="translate(340, 160) scale(1.45)">
          ${singleLabelSVG.replace(/<\/?svg[^>]*>/g, '')}
        </g>
        <line x1="80" y1="1754" x2="2400" y2="1754" stroke="#cccccc" stroke-width="2" stroke-dasharray="10 5" />
        <!-- Bottom Label (Centered) -->
        <g transform="translate(340, 1820) scale(1.45)">
          ${singleLabelSVG.replace(/<\/?svg[^>]*>/g, '')}
        </g>
        <!-- Crop Marks & Registration -->
        <circle cx="120" cy="1754" r="16" fill="none" stroke="#999" stroke-width="2"/>
        <line x1="100" y1="1754" x2="140" y2="1754" stroke="#999" stroke-width="2"/>
        <line x1="120" y1="1734" x2="120" y2="1774" stroke="#999" stroke-width="2"/>
        <circle cx="2360" cy="1754" r="16" fill="none" stroke="#999" stroke-width="2"/>
        <line x1="2340" y1="1754" x2="2380" y2="1754" stroke="#999" stroke-width="2"/>
        <line x1="2360" y1="1734" x2="2360" y2="1774" stroke="#999" stroke-width="2"/>
      </svg>
    `;
  }

  downloadPNG600DPI() {
    const svg = document.getElementById('final-label-svg');
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const img = new Image();
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 3600;
      canvas.height = 3600;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 3600, 3600);

      canvas.toBlob((b) => {
        const dlUrl = URL.createObjectURL(b);
        const a = document.createElement('a');
        a.href = dlUrl;
        a.download = `diamond_bakery_6inch_round_cookies_${this.state.preset}_600dpi.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(dlUrl);
        URL.revokeObjectURL(url);
      }, 'image/png');
    };
    img.src = url;
  }

  downloadSVG() {
    const svg = document.getElementById('final-label-svg');
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diamond_bakery_6inch_round_cookies_${this.state.preset}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

  window.PackagingEngine = PackagingEngine;
})(window);
