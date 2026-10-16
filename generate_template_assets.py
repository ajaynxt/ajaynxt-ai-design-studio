#!/usr/bin/env python3
"""
generate_template_assets.py
Creates real vector SVG sources and renders crisp PNG previews for all 13 templates.
"""

import os, json, subprocess
from PIL import Image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATES_DIR = os.path.join(BASE_DIR, 'templates')
SOURCES_DIR = os.path.join(TEMPLATES_DIR, 'sources')
PREVIEWS_DIR = os.path.join(TEMPLATES_DIR, 'previews')

os.makedirs(SOURCES_DIR, exist_ok=True)
os.makedirs(PREVIEWS_DIR, exist_ok=True)

# Common SVG gradient & font defs
DEFS_HEADER = '''
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFDF0"/>
      <stop offset="20%" stop-color="#FDE047"/>
      <stop offset="45%" stop-color="#EAB308"/>
      <stop offset="75%" stop-color="#CA8A04"/>
      <stop offset="100%" stop-color="#854D0E"/>
    </linearGradient>
    <radialGradient id="mintGrad" cx="50%" cy="45%" r="70%">
      <stop offset="0%" stop-color="#C5ECE1"/>
      <stop offset="70%" stop-color="#97D8C4"/>
      <stop offset="100%" stop-color="#76C4AE"/>
    </radialGradient>
    <radialGradient id="maroonGrad" cx="50%" cy="45%" r="70%">
      <stop offset="0%" stop-color="#3B0A12"/>
      <stop offset="75%" stop-color="#1A0307"/>
      <stop offset="100%" stop-color="#0E0104"/>
    </radialGradient>
    <radialGradient id="blackGrad" cx="50%" cy="45%" r="70%">
      <stop offset="0%" stop-color="#27272A"/>
      <stop offset="75%" stop-color="#09090B"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>
    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&amp;family=Cinzel+Decorative:wght@700;900&amp;family=Montserrat:wght@700;800;900&amp;family=Playfair+Display:ital,wght@0,700;0,900;1,700&amp;display=swap');
    text { font-family: 'Cinzel', serif; }
  </style>
'''

# 1. Packaging Mint Luxury
svg_mint = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="1200" height="1200">
  {DEFS_HEADER}
  <!-- Background -->
  <circle cx="600" cy="600" r="590" fill="url(#mintGrad)"/>
  <circle cx="600" cy="600" r="582" fill="none" stroke="url(#goldGrad)" stroke-width="4.5"/>
  <circle cx="600" cy="600" r="574" fill="none" stroke="url(#goldGrad)" stroke-width="1.6"/>
  <circle cx="600" cy="600" r="566" fill="none" stroke="url(#goldGrad)" stroke-width="0.8" opacity="0.6"/>

  <!-- Mandala Watermark -->
  <g opacity="0.35" transform="translate(600, 600)">
    <circle cx="0" cy="0" r="450" fill="none" stroke="url(#goldGrad)" stroke-width="2"/>
    <circle cx="0" cy="0" r="320" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" stroke-dasharray="4 4"/>
    <circle cx="0" cy="0" r="180" fill="none" stroke="url(#goldGrad)" stroke-width="1.8"/>
  </g>

  <!-- Top Arc Header -->
  <path id="mintTopArc" d="M 140,430 A 530,530 0 0,1 1060,430" fill="none"/>
  <text fill="#0F4C2A" font-weight="800" font-size="15" letter-spacing="0.25em">
    <textPath href="#mintTopArc" startOffset="50%" text-anchor="middle">★ SERVING SHIMLA SINCE 2002 • FINEST ARTISAN BAKES ★</textPath>
  </text>

  <!-- Bottom Arc Footer -->
  <path id="mintBotArc" d="M 140,770 A 530,530 0 0,0 1060,770" fill="none"/>
  <text fill="#0F4C2A" font-weight="800" font-size="15" letter-spacing="0.22em">
    <textPath href="#mintBotArc" startOffset="50%" text-anchor="middle">★ PREPARED IN PURE BUTTER &amp; DESI GHEE • ZERO PALM OIL ★</textPath>
  </text>

  <!-- Brand & Monogram -->
  <g transform="translate(600, 405)" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="64" fill="none" stroke="url(#goldGrad)" stroke-width="2.5"/>
    <circle cx="0" cy="0" r="56" fill="none" stroke="url(#goldGrad)" stroke-width="1"/>
    <text x="0" y="24" text-anchor="middle" font-family="'Cinzel Decorative', serif" font-weight="900" font-size="76" fill="#C81D25">D</text>
    <text x="0" y="104" text-anchor="middle" font-weight="800" font-size="48" letter-spacing="0.26em" fill="#C81D25">DIAMOND</text>
    <text x="0" y="130" text-anchor="middle" font-weight="700" font-size="14" letter-spacing="0.22em" fill="#C81D25" opacity="0.9">BAKERY • RESTAURANT • SWEETS</text>
  </g>

  <!-- Title "Assorted Cookies" -->
  <g transform="translate(600, 690)" filter="url(#dropShadow)">
    <text x="0" y="0" text-anchor="middle" font-family="'Cinzel Decorative', serif" font-weight="900" font-size="105" letter-spacing="0.04em" fill="url(#goldGrad)" stroke="#78350F" stroke-width="1.2">
      Assorted Cookies
    </text>
  </g>

  <!-- Tagline Ribbon -->
  <g transform="translate(600, 795)" filter="url(#dropShadow)">
    <rect x="-375" y="-19" width="750" height="38" rx="19" fill="#0B3B24" stroke="url(#goldGrad)" stroke-width="1.8"/>
    <text x="0" y="5.5" text-anchor="middle" font-weight="800" font-size="16" letter-spacing="0.20em" fill="#FFFDF0">
      ★ BAKED WITH 100% PURE BUTTER • ZERO PALM OIL ★
    </text>
  </g>

  <!-- Plaque -->
  <g transform="translate(600, 895)" filter="url(#dropShadow)">
    <rect x="-155" y="-19" width="310" height="38" rx="19" fill="#FFFFFF" stroke="url(#goldGrad)" stroke-width="2.2"/>
    <g transform="translate(-115, 0)">
      <rect x="-10" y="-10" width="20" height="20" rx="3" fill="#FFFFFF" stroke="#16A34A" stroke-width="2"/>
      <circle cx="0" cy="0" r="5" fill="#16A34A"/>
    </g>
    <text x="10" y="5" text-anchor="middle" font-weight="800" font-size="14" letter-spacing="0.18em" fill="#0B3B24">
      NET WT. 500g ℮
    </text>
  </g>
</svg>'''

# 2. Packaging Royal Maroon
svg_maroon = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="1200" height="1200">
  {DEFS_HEADER}
  <!-- Background -->
  <circle cx="600" cy="600" r="590" fill="url(#maroonGrad)"/>
  <circle cx="600" cy="600" r="582" fill="none" stroke="url(#goldGrad)" stroke-width="4.5"/>
  <circle cx="600" cy="600" r="574" fill="none" stroke="url(#goldGrad)" stroke-width="1.6"/>

  <!-- Mandala Watermark -->
  <g opacity="0.45" transform="translate(600, 600)">
    <circle cx="0" cy="0" r="480" fill="none" stroke="url(#goldGrad)" stroke-width="2"/>
    <circle cx="0" cy="0" r="360" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" stroke-dasharray="4 4"/>
    <circle cx="0" cy="0" r="220" fill="none" stroke="url(#goldGrad)" stroke-width="2"/>
  </g>

  <!-- Top Arc Header -->
  <path id="maroonTopArc" d="M 140,430 A 530,530 0 0,1 1060,430" fill="none"/>
  <text fill="url(#goldGrad)" font-weight="800" font-size="15" letter-spacing="0.25em">
    <textPath href="#maroonTopArc" startOffset="50%" text-anchor="middle">★ SERVING SHIMLA SINCE 2002 • FINEST ARTISAN BAKES ★</textPath>
  </text>

  <!-- Bottom Arc Footer -->
  <path id="maroonBotArc" d="M 140,770 A 530,530 0 0,0 1060,770" fill="none"/>
  <text fill="url(#goldGrad)" font-weight="800" font-size="15" letter-spacing="0.22em">
    <textPath href="#maroonBotArc" startOffset="50%" text-anchor="middle">★ PREPARED IN PURE BUTTER &amp; DESI GHEE • ZERO PALM OIL ★</textPath>
  </text>

  <!-- Brand & Monogram -->
  <g transform="translate(600, 405)" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="64" fill="none" stroke="url(#goldGrad)" stroke-width="2.5"/>
    <text x="0" y="24" text-anchor="middle" font-family="'Cinzel Decorative', serif" font-weight="900" font-size="76" fill="#FFFDF0">D</text>
    <text x="0" y="104" text-anchor="middle" font-weight="800" font-size="48" letter-spacing="0.26em" fill="url(#goldGrad)">DIAMOND</text>
    <text x="0" y="130" text-anchor="middle" font-weight="700" font-size="14" letter-spacing="0.22em" fill="url(#goldGrad)" opacity="0.9">BAKERY • RESTAURANT • SWEETS</text>
  </g>

  <!-- Title "Assorted Cookies" -->
  <g transform="translate(600, 690)" filter="url(#dropShadow)">
    <text x="0" y="0" text-anchor="middle" font-family="'Cinzel Decorative', serif" font-weight="900" font-size="105" letter-spacing="0.04em" fill="url(#goldGrad)" stroke="#1A0307" stroke-width="1.2">
      Assorted Cookies
    </text>
  </g>

  <!-- Tagline Ribbon -->
  <g transform="translate(600, 795)" filter="url(#dropShadow)">
    <rect x="-375" y="-19" width="750" height="38" rx="19" fill="#28050B" stroke="url(#goldGrad)" stroke-width="1.8"/>
    <text x="0" y="5.5" text-anchor="middle" font-weight="800" font-size="16" letter-spacing="0.20em" fill="#FFFDF0">
      ★ BAKED WITH 100% PURE BUTTER • ZERO PALM OIL ★
    </text>
  </g>

  <!-- Plaque -->
  <g transform="translate(600, 895)" filter="url(#dropShadow)">
    <rect x="-155" y="-19" width="310" height="38" rx="19" fill="#28050B" stroke="url(#goldGrad)" stroke-width="2.2"/>
    <g transform="translate(-115, 0)">
      <rect x="-10" y="-10" width="20" height="20" rx="3" fill="#FFFFFF" stroke="#16A34A" stroke-width="2"/>
      <circle cx="0" cy="0" r="5" fill="#16A34A"/>
    </g>
    <text x="10" y="5" text-anchor="middle" font-weight="800" font-size="14" letter-spacing="0.18em" fill="#FFFFFF">
      NET WT. 500g ℮
    </text>
  </g>
</svg>'''

# 3. Packaging Obsidian Black
svg_black = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="1200" height="1200">
  {DEFS_HEADER}
  <circle cx="600" cy="600" r="590" fill="url(#blackGrad)"/>
  <circle cx="600" cy="600" r="582" fill="none" stroke="url(#goldGrad)" stroke-width="4.5"/>
  <circle cx="600" cy="600" r="574" fill="none" stroke="url(#goldGrad)" stroke-width="1.6"/>
  <g opacity="0.4" transform="translate(600, 600)">
    <circle cx="0" cy="0" r="480" fill="none" stroke="url(#goldGrad)" stroke-width="2"/>
    <circle cx="0" cy="0" r="320" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" stroke-dasharray="4 4"/>
  </g>
  <g transform="translate(600, 405)" filter="url(#dropShadow)">
    <circle cx="0" cy="0" r="64" fill="none" stroke="url(#goldGrad)" stroke-width="2.5"/>
    <text x="0" y="24" text-anchor="middle" font-family="'Cinzel Decorative', serif" font-weight="900" font-size="76" fill="#FFFDF0">D</text>
    <text x="0" y="104" text-anchor="middle" font-weight="800" font-size="48" letter-spacing="0.26em" fill="url(#goldGrad)">DIAMOND</text>
  </g>
  <g transform="translate(600, 690)" filter="url(#dropShadow)">
    <text x="0" y="0" text-anchor="middle" font-family="'Cinzel Decorative', serif" font-weight="900" font-size="105" letter-spacing="0.04em" fill="url(#goldGrad)">
      Assorted Cookies
    </text>
  </g>
  <g transform="translate(600, 795)" filter="url(#dropShadow)">
    <rect x="-375" y="-19" width="750" height="38" rx="19" fill="#121214" stroke="url(#goldGrad)" stroke-width="1.8"/>
    <text x="0" y="5.5" text-anchor="middle" font-weight="800" font-size="16" letter-spacing="0.20em" fill="#FFFDF0">
      ★ BAKED WITH 100% PURE BUTTER • ZERO PALM OIL ★
    </text>
  </g>
</svg>'''

# 4. Poster Heritage Shimla (1200x1600)
svg_poster_heritage = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1600" width="1200" height="1600">
  {DEFS_HEADER}
  <rect width="1200" height="1600" fill="#0B132B"/>
  <rect x="40" y="40" width="1120" height="1520" fill="none" stroke="url(#goldGrad)" stroke-width="3"/>
  <rect x="55" y="55" width="1090" height="1490" fill="none" stroke="url(#goldGrad)" stroke-width="1" stroke-dasharray="6 6"/>

  <text x="600" y="180" text-anchor="middle" font-size="28" letter-spacing="0.3em" fill="url(#goldGrad)">ESTABLISHED 2002 • THE MALL SHIMLA</text>
  <text x="600" y="270" text-anchor="middle" font-family="'Cinzel Decorative', serif" font-weight="900" font-size="82" letter-spacing="0.1em" fill="#FFFDF0">DIAMOND BAKERY</text>
  <line x1="300" y1="320" x2="900" y2="320" stroke="url(#goldGrad)" stroke-width="2"/>
  <text x="600" y="370" text-anchor="middle" font-size="32" letter-spacing="0.2em" fill="#94A3B8">HERITAGE ARTISAN BAKERS</text>

  <!-- Central Crest Frame -->
  <g transform="translate(600, 750)">
    <circle cx="0" cy="0" r="300" fill="none" stroke="url(#goldGrad)" stroke-width="3"/>
    <circle cx="0" cy="0" r="280" fill="none" stroke="url(#goldGrad)" stroke-width="1.2" stroke-dasharray="4 4"/>
    <circle cx="0" cy="0" r="260" fill="#1C2541"/>
    <text x="0" y="30" text-anchor="middle" font-family="'Cinzel Decorative', serif" font-size="120" font-weight="900" fill="url(#goldGrad)">D</text>
    <text x="0" y="120" text-anchor="middle" font-size="28" letter-spacing="0.25em" fill="#FFFDF0">100% PURE BUTTER</text>
  </g>

  <text x="600" y="1180" text-anchor="middle" font-family="'Playfair Display', serif" font-weight="900" font-size="64" fill="url(#goldGrad)">
    Handcrafted In The Hills
  </text>
  <text x="600" y="1260" text-anchor="middle" font-size="24" letter-spacing="0.15em" fill="#CBD5E1">
    Traditional Scottish Shortbread • Pista Badam Delights • Desi Ghee Bakes
  </text>

  <g transform="translate(600, 1420)">
    <rect x="-280" y="-30" width="560" height="60" rx="30" fill="url(#goldGrad)"/>
    <text x="0" y="10" text-anchor="middle" font-weight="900" font-size="24" letter-spacing="0.2em" fill="#0B132B">
      VISIT US AT THE MALL, SHIMLA
    </text>
  </g>
</svg>'''

# 5. Poster Pure Desi Ghee (1200x1600)
svg_poster_ghee = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1600" width="1200" height="1600">
  {DEFS_HEADER}
  <rect width="1200" height="1600" fill="#2E1C0C"/>
  <rect x="40" y="40" width="1120" height="1520" fill="none" stroke="url(#goldGrad)" stroke-width="3"/>

  <text x="600" y="220" text-anchor="middle" font-size="26" letter-spacing="0.3em" fill="url(#goldGrad)">GUARANTEED PURITY • ZERO PALM OIL</text>
  <text x="600" y="320" text-anchor="middle" font-family="'Cinzel Decorative', serif" font-weight="900" font-size="78" fill="#FFFDF0">100% PURE DESI GHEE</text>

  <g transform="translate(600, 750)">
    <circle cx="0" cy="0" r="320" fill="#3D2612" stroke="url(#goldGrad)" stroke-width="4"/>
    <text x="0" y="-30" text-anchor="middle" font-family="'Playfair Display', serif" font-weight="900" font-size="72" fill="url(#goldGrad)">Artisan</text>
    <text x="0" y="60" text-anchor="middle" font-family="'Cinzel Decorative', serif" font-weight="900" font-size="82" fill="#FFFDF0">COOKIES</text>
    <text x="0" y="130" text-anchor="middle" font-size="24" letter-spacing="0.2em" fill="#D4AF37">OVEN BAKED EVERY MORNING</text>
  </g>

  <text x="600" y="1250" text-anchor="middle" font-size="30" letter-spacing="0.15em" fill="#FEF08A">
    NO PRESERVATIVES • NO ARTIFICIAL COLORS • NO PALM OIL
  </text>
  <text x="600" y="1330" text-anchor="middle" font-size="22" letter-spacing="0.25em" fill="#D1D5DB">
    DIAMOND BAKERY • SHIMLA • ESTD. 2002
  </text>
</svg>'''

# 6. Social Fresh Baked Square (1080x1080)
svg_social_square = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
  {DEFS_HEADER}
  <rect width="1080" height="1080" fill="#18181B"/>
  <rect x="30" y="30" width="1020" height="1020" fill="none" stroke="url(#goldGrad)" stroke-width="3"/>
  <circle cx="540" cy="540" r="420" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" stroke-dasharray="6 6"/>

  <text x="540" y="160" text-anchor="middle" font-size="22" letter-spacing="0.3em" fill="url(#goldGrad)">DIAMOND BAKERY SHIMLA</text>
  <text x="540" y="240" text-anchor="middle" font-family="'Cinzel Decorative', serif" font-weight="900" font-size="64" fill="#FFFFFF">FRESHLY BAKED</text>
  <text x="540" y="310" text-anchor="middle" font-size="26" letter-spacing="0.2em" fill="#A1A1AA">EVERY SINGLE MORNING</text>

  <g transform="translate(540, 540)">
    <circle cx="0" cy="0" r="180" fill="#27272A" stroke="url(#goldGrad)" stroke-width="3"/>
    <text x="0" y="15" text-anchor="middle" font-family="'Cinzel Decorative', serif" font-weight="900" font-size="90" fill="url(#goldGrad)">D</text>
  </g>

  <text x="540" y="800" text-anchor="middle" font-family="'Playfair Display', serif" font-weight="900" font-size="52" fill="url(#goldGrad)">Assorted Butter Cookies</text>
  <text x="540" y="860" text-anchor="middle" font-size="22" letter-spacing="0.2em" fill="#E4E4E7">6-INCH ROYAL GIFT TINS AVAILABLE</text>

  <rect x="360" y="920" width="360" height="50" rx="25" fill="url(#goldGrad)"/>
  <text x="540" y="952" text-anchor="middle" font-weight="900" font-size="18" letter-spacing="0.15em" fill="#18181B">ORDER NOW • SHIMLA</text>
</svg>'''

# 7. Social Story (1080x1920)
svg_social_story = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  {DEFS_HEADER}
  <rect width="1080" height="1920" fill="#0F172A"/>
  <rect x="40" y="80" width="1000" height="1760" fill="none" stroke="url(#goldGrad)" stroke-width="3"/>

  <text x="540" y="260" text-anchor="middle" font-size="24" letter-spacing="0.3em" fill="url(#goldGrad)">DIAMOND BAKERY • SHIMLA</text>
  <text x="540" y="380" text-anchor="middle" font-family="'Cinzel Decorative', serif" font-weight="900" font-size="78" fill="#FFFFFF">PURE BUTTER</text>
  <text x="540" y="470" text-anchor="middle" font-family="'Playfair Display', serif" font-weight="900" font-size="64" fill="url(#goldGrad)">Delights</text>

  <g transform="translate(540, 960)">
    <circle cx="0" cy="0" r="340" fill="#1E293B" stroke="url(#goldGrad)" stroke-width="4"/>
    <circle cx="0" cy="0" r="320" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" stroke-dasharray="6 6"/>
    <text x="0" y="30" text-anchor="middle" font-family="'Cinzel Decorative', serif" font-weight="900" font-size="140" fill="url(#goldGrad)">D</text>
  </g>

  <text x="540" y="1450" text-anchor="middle" font-size="32" letter-spacing="0.2em" fill="#F8FAFC">ZERO PALM OIL • ZERO PRESERVATIVES</text>
  <text x="540" y="1520" text-anchor="middle" font-size="24" letter-spacing="0.15em" fill="#94A3B8">AVAILABLE IN 500G ROYAL GIFT TINS</text>

  <rect x="340" y="1620" width="400" height="64" rx="32" fill="url(#goldGrad)"/>
  <text x="540" y="1660" text-anchor="middle" font-weight="900" font-size="22" letter-spacing="0.2em" fill="#0F172A">SWIPE UP TO ORDER</text>
</svg>'''

# 8. Sticker Jar Seal Gold (1000x1000)
svg_sticker_jar = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  {DEFS_HEADER}
  <circle cx="500" cy="500" r="480" fill="#0C0A09"/>
  <circle cx="500" cy="500" r="460" fill="none" stroke="url(#goldGrad)" stroke-width="6"/>
  <circle cx="500" cy="500" r="440" fill="none" stroke="url(#goldGrad)" stroke-width="2" stroke-dasharray="6 6"/>

  <path id="sealTop" d="M 120,500 A 380,380 0 0,1 880,500" fill="none"/>
  <text fill="url(#goldGrad)" font-weight="800" font-size="32" letter-spacing="0.25em">
    <textPath href="#sealTop" startOffset="50%" text-anchor="middle">★ ARTISAN QUALITY SEAL ★</textPath>
  </text>

  <path id="sealBot" d="M 120,500 A 380,380 0 0,0 880,500" fill="none"/>
  <text fill="url(#goldGrad)" font-weight="800" font-size="28" letter-spacing="0.20em">
    <textPath href="#sealBot" startOffset="50%" text-anchor="middle">DIAMOND BAKERY • SHIMLA</textPath>
  </text>

  <g transform="translate(500, 500)">
    <circle cx="0" cy="0" r="180" fill="#1C1917" stroke="url(#goldGrad)" stroke-width="2"/>
    <text x="0" y="25" text-anchor="middle" font-family="'Cinzel Decorative', serif" font-weight="900" font-size="90" fill="url(#goldGrad)">D</text>
  </g>
</svg>'''

# 9. Sticker Hexagon Luxury (1000x1000)
svg_sticker_hex = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  {DEFS_HEADER}
  <polygon points="500,60 880,280 880,720 500,940 120,720 120,280" fill="#1E293B" stroke="url(#goldGrad)" stroke-width="8"/>
  <polygon points="500,90 850,295 850,705 500,910 150,705 150,295" fill="none" stroke="url(#goldGrad)" stroke-width="2" stroke-dasharray="6 6"/>

  <text x="500" y="260" text-anchor="middle" font-size="22" letter-spacing="0.3em" fill="url(#goldGrad)">FINEST CONFECTIONERY</text>
  <text x="500" y="340" text-anchor="middle" font-family="'Cinzel Decorative', serif" font-weight="900" font-size="52" fill="#FFFFFF">DIAMOND</text>
  <text x="500" y="400" text-anchor="middle" font-size="20" letter-spacing="0.2em" fill="#94A3B8">BAKERY • SHIMLA</text>

  <g transform="translate(500, 550)">
    <circle cx="0" cy="0" r="110" fill="#0F172A" stroke="url(#goldGrad)" stroke-width="2"/>
    <text x="0" y="20" text-anchor="middle" font-family="'Cinzel Decorative', serif" font-weight="900" font-size="64" fill="url(#goldGrad)">D</text>
  </g>

  <text x="500" y="740" text-anchor="middle" font-weight="800" font-size="28" letter-spacing="0.15em" fill="url(#goldGrad)">PURE BUTTER</text>
  <text x="500" y="800" text-anchor="middle" font-size="18" letter-spacing="0.2em" fill="#E2E8F0">100% ARTISAN GUARANTEE</text>
</svg>'''

# 10. Restaurant Weekend Special (1200x800)
svg_restaurant = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  {DEFS_HEADER}
  <rect width="1200" height="800" fill="#1C1917"/>
  <rect x="30" y="30" width="1140" height="740" fill="none" stroke="url(#goldGrad)" stroke-width="3"/>
  <rect x="45" y="45" width="1110" height="710" fill="none" stroke="url(#goldGrad)" stroke-width="1" stroke-dasharray="4 4"/>

  <text x="600" y="140" text-anchor="middle" font-size="24" letter-spacing="0.3em" fill="url(#goldGrad)">THE MALL SHIMLA • SPECIAL TASTING</text>
  <text x="600" y="240" text-anchor="middle" font-family="'Cinzel Decorative', serif" font-weight="900" font-size="64" fill="#FFFDF0">WEEKEND HIGH TEA</text>
  <text x="600" y="310" text-anchor="middle" font-family="'Playfair Display', serif" font-weight="700" font-size="34" fill="#D4AF37">&amp; Artisan Cookie Pairing</text>

  <line x1="400" y1="360" x2="800" y2="360" stroke="url(#goldGrad)" stroke-width="2"/>

  <text x="600" y="450" text-anchor="middle" font-size="26" letter-spacing="0.15em" fill="#F5F5F4">FRESH BAKES • MASALA CHAI • DARJEELING BREWS</text>
  <text x="600" y="520" text-anchor="middle" font-size="22" letter-spacing="0.2em" fill="#A8A29E">EVERY SATURDAY &amp; SUNDAY • 4 PM TO 7 PM</text>

  <rect x="420" y="600" width="360" height="60" rx="30" fill="url(#goldGrad)"/>
  <text x="600" y="638" text-anchor="middle" font-weight="900" font-size="22" letter-spacing="0.15em" fill="#1C1917">TABLE RESERVATION</text>
</svg>'''

# 11. Festival Diwali Royal Hamper (1200x1200)
svg_diwali = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="1200" height="1200">
  {DEFS_HEADER}
  <rect width="1200" height="1200" fill="#450A0A"/>
  <rect x="40" y="40" width="1120" height="1120" fill="none" stroke="url(#goldGrad)" stroke-width="4"/>
  <rect x="55" y="55" width="1090" height="1090" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" stroke-dasharray="6 6"/>

  <g opacity="0.35" transform="translate(600, 600)">
    <circle cx="0" cy="0" r="460" fill="none" stroke="url(#goldGrad)" stroke-width="2"/>
    <circle cx="0" cy="0" r="320" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" stroke-dasharray="4 4"/>
  </g>

  <text x="600" y="190" text-anchor="middle" font-size="28" letter-spacing="0.35em" fill="url(#goldGrad)">SHUBH DEEPAVALI</text>
  <text x="600" y="290" text-anchor="middle" font-family="'Cinzel Decorative', serif" font-weight="900" font-size="76" fill="#FFFBEB">ROYAL GIFT HAMPER</text>

  <g transform="translate(600, 600)">
    <circle cx="0" cy="0" r="220" fill="#7F1D1D" stroke="url(#goldGrad)" stroke-width="3"/>
    <text x="0" y="25" text-anchor="middle" font-family="'Cinzel Decorative', serif" font-weight="900" font-size="110" fill="url(#goldGrad)">D</text>
    <text x="0" y="90" text-anchor="middle" font-size="20" letter-spacing="0.2em" fill="#FEF08A">DIAMOND BAKERY</text>
  </g>

  <text x="600" y="940" text-anchor="middle" font-family="'Playfair Display', serif" font-weight="900" font-size="52" fill="url(#goldGrad)">Festive Sweets &amp; Cookies</text>
  <text x="600" y="1020" text-anchor="middle" font-size="24" letter-spacing="0.2em" fill="#FEF3C7">PREPARED IN 100% PURE DESI GHEE</text>
</svg>'''

# 12. Product Ad Almond Macaron (1200x1200)
svg_product_ad = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="1200" height="1200">
  {DEFS_HEADER}
  <rect width="1200" height="1200" fill="#0F172A"/>
  <rect x="40" y="40" width="1120" height="1120" fill="none" stroke="url(#goldGrad)" stroke-width="3"/>

  <text x="600" y="180" text-anchor="middle" font-size="26" letter-spacing="0.3em" fill="url(#goldGrad)">NEW PRODUCT LAUNCH</text>
  <text x="600" y="280" text-anchor="middle" font-family="'Cinzel Decorative', serif" font-weight="900" font-size="72" fill="#FFFFFF">ALMOND MACARON</text>
  <text x="600" y="350" text-anchor="middle" font-family="'Playfair Display', serif" font-weight="700" font-size="44" fill="url(#goldGrad)">&amp; Crunchy Cashew Delights</text>

  <g transform="translate(600, 640)">
    <circle cx="0" cy="0" r="240" fill="#1E293B" stroke="url(#goldGrad)" stroke-width="4"/>
    <text x="0" y="15" text-anchor="middle" font-family="'Cinzel Decorative', serif" font-weight="900" font-size="82" fill="url(#goldGrad)">D</text>
    <text x="0" y="80" text-anchor="middle" font-size="18" letter-spacing="0.25em" fill="#E2E8F0">DIAMOND SHIMLA</text>
  </g>

  <text x="600" y="980" text-anchor="middle" font-size="28" letter-spacing="0.2em" fill="#38BDF8">BAKED WITH 100% PURE BUTTER</text>
  <text x="600" y="1040" text-anchor="middle" font-size="22" letter-spacing="0.15em" fill="#94A3B8">AVAILABLE AT OUR THE MALL SHIMLA STORE</text>
</svg>'''

# 13. Custom A4 Imposition (1240x1754)
svg_a4_imposition = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1240 1754" width="1240" height="1754">
  {DEFS_HEADER}
  <rect width="1240" height="1754" fill="#FFFFFF"/>
  <rect x="40" y="40" width="1160" height="1674" fill="none" stroke="#E2E8F0" stroke-width="1"/>

  <text x="620" y="90" text-anchor="middle" font-size="20" font-weight="900" fill="#0F172A">DIAMOND BAKERY • 6-INCH ROUND TIN MASTER • A4 2-UP SHEET</text>
  <text x="620" y="125" text-anchor="middle" font-size="14" fill="#64748B">100% Scale (Do Not Fit To Page) • 210 × 297 mm • 300 DPI</text>

  <!-- Top 6-inch label -->
  <g transform="translate(620, 480)">
    <circle cx="0" cy="0" r="320" fill="#C5ECE1" stroke="url(#goldGrad)" stroke-width="3"/>
    <text x="0" y="-30" text-anchor="middle" font-family="'Cinzel Decorative', serif" font-weight="900" font-size="48" fill="#C81D25">DIAMOND</text>
    <text x="0" y="40" text-anchor="middle" font-family="'Cinzel Decorative', serif" font-weight="900" font-size="44" fill="url(#goldGrad)">Assorted Cookies</text>
  </g>

  <!-- Bottom 6-inch label -->
  <g transform="translate(620, 1180)">
    <circle cx="0" cy="0" r="320" fill="#3B0A12" stroke="url(#goldGrad)" stroke-width="3"/>
    <text x="0" y="-30" text-anchor="middle" font-family="'Cinzel Decorative', serif" font-weight="900" font-size="48" fill="url(#goldGrad)">DIAMOND</text>
    <text x="0" y="40" text-anchor="middle" font-family="'Cinzel Decorative', serif" font-weight="900" font-size="44" fill="url(#goldGrad)">Assorted Cookies</text>
  </g>

  <!-- Crop Marks -->
  <line x1="280" y1="160" x2="310" y2="160" stroke="#000000" stroke-width="2"/>
  <line x1="300" y1="140" x2="300" y2="170" stroke="#000000" stroke-width="2"/>
  <line x1="930" y1="160" x2="960" y2="160" stroke="#000000" stroke-width="2"/>
  <line x1="940" y1="140" x2="940" y2="170" stroke="#000000" stroke-width="2"/>

  <!-- CMYK Bars -->
  <g transform="translate(420, 1680)">
    <rect x="0" y="0" width="60" height="25" fill="#00FFFF"/>
    <rect x="80" y="0" width="60" height="25" fill="#FF00FF"/>
    <rect x="160" y="0" width="60" height="25" fill="#FFFF00"/>
    <rect x="240" y="0" width="60" height="25" fill="#000000"/>
    <rect x="320" y="0" width="60" height="25" fill="#D4AF37"/>
  </g>
</svg>'''

SOURCES = {
    "packaging_mint_luxury.svg": svg_mint,
    "packaging_royal_maroon.svg": svg_maroon,
    "packaging_obsidian_black.svg": svg_black,
    "poster_heritage_shimla.svg": svg_poster_heritage,
    "poster_pure_desi_ghee.svg": svg_poster_ghee,
    "social_fresh_baked_square.svg": svg_social_square,
    "social_story_pure_butter.svg": svg_social_story,
    "sticker_jar_seal_gold.svg": svg_sticker_jar,
    "sticker_hexagon_luxury.svg": svg_sticker_hex,
    "restaurant_weekend_special.svg": svg_restaurant,
    "festival_diwali_royal_hamper.svg": svg_diwali,
    "product_ad_almond_macaron.svg": svg_product_ad,
    "custom_a4_imposition.svg": svg_a4_imposition
}

# Write each SVG
for filename, content in SOURCES.items():
    filepath = os.path.join(SOURCES_DIR, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content.strip())
    print(f"Wrote SVG source: {filename}")

# Render real PNG previews via Chrome
for filename in SOURCES.keys():
    png_name = filename.replace('.svg', '.png')
    svg_path = os.path.join(SOURCES_DIR, filename)
    png_path = os.path.join(PREVIEWS_DIR, png_name)
    
    # Render with 400x400 or scaled dimension
    cmd = [
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '--headless',
        '--disable-gpu',
        '--window-size=500,500',
        f'--screenshot={png_path}',
        f'file://{svg_path}'
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if os.path.exists(png_path):
        print(f"Rendered real PNG preview: {png_name} ({os.path.getsize(png_path)} bytes)")

print("All template sources and previews successfully created!")
