#!/usr/bin/env python3
"""
Generate ULTRA HIGH QUALITY (600 DPI - 3600x3600 px) Master Print PNGs for the 6-Inch Dabba.
- Exact match to client's reference packaging (media_1792135089810_68287a45.jpg)
- 2 Master Designs:
  1. Mint & Emerald Luxury (The First One)
  2. Royal Velvet Maroon & 24K Gold (The Maroon One)
- Cormorant Garamond Authentic Serif Font for DIAMOND
- Alex Brush Cursive Script for "Assorted Cookies" (Bada size)
- Logo shifted higher up (logo_y = 1200)
- Round shape curved text at outer perimeter (R = 1580px, true 530px radius scaled)
- Symmetrical Luxury Balanced Plaque with FSSAI Pure Veg Green Mark & 4-Point Gold Star
"""
from __future__ import annotations
import math
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

SIZE = 3600
CENTER = SIZE // 2  # 1800
RADIUS = 1720

MANDALA_PATH = Path('mandala_pure_gold_clean.png')
CREST_PATH = Path('diamond_crest_user.png')

FONT_SCRIPT = '/Users/ajaynxt/Documents/lodo king/test_fonts/AlexBrush-Regular.ttf'
if not os.path.exists(FONT_SCRIPT):
    FONT_SCRIPT = '/System/Library/Fonts/Supplemental/Georgia Italic.ttf'

FONT_SERIF = '/Users/ajaynxt/Documents/lodo king/test_fonts/Cormorant_Garamond_700.ttf'
if not os.path.exists(FONT_SERIF):
    FONT_SERIF = '/System/Library/Fonts/Supplemental/Georgia.ttf'

FONT_SANS = '/System/Library/Fonts/Avenir Next.ttc'

def get_font(path: str, size: int):
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

def draw_top_arc(canvas: Image.Image, text: str, font: ImageFont.FreeTypeFont, fill: tuple, center_y: int = CENTER, radius: int = 1580, start_angle: float = -142, end_angle: float = -38):
    total_angle = end_angle - start_angle
    chars = list(text)
    n = len(chars)
    for i, ch in enumerate(chars):
        if ch == ' ':
            continue
        angle_deg = start_angle + (i / (n - 1)) * total_angle
        angle_rad = math.radians(angle_deg)
        x = CENTER + radius * math.cos(angle_rad)
        y = center_y + radius * math.sin(angle_rad)
        
        char_img = Image.new('RGBA', (220, 220), (0, 0, 0, 0))
        cd = ImageDraw.Draw(char_img)
        cd.text((110, 110), ch, font=font, fill=fill, anchor='mm')
        
        rot_angle = -(angle_deg + 90)
        char_rot = char_img.rotate(rot_angle, resample=Image.Resampling.BICUBIC)
        canvas.alpha_composite(char_rot, (int(x - 110), int(y - 110)))

def draw_bottom_arc(canvas: Image.Image, text: str, font: ImageFont.FreeTypeFont, fill: tuple, center_y: int = CENTER, radius: int = 1580, start_angle: float = 142, end_angle: float = 38):
    total_angle = end_angle - start_angle
    chars = list(text)
    n = len(chars)
    for i, ch in enumerate(chars):
        if ch == ' ':
            continue
        angle_deg = start_angle + (i / (n - 1)) * total_angle
        angle_rad = math.radians(angle_deg)
        x = CENTER + radius * math.cos(angle_rad)
        y = center_y + radius * math.sin(angle_rad)
        
        char_img = Image.new('RGBA', (220, 220), (0, 0, 0, 0))
        cd = ImageDraw.Draw(char_img)
        cd.text((110, 110), ch, font=font, fill=fill, anchor='mm')
        
        rot_angle = 90 - angle_deg
        char_rot = char_img.rotate(rot_angle, resample=Image.Resampling.BICUBIC)
        canvas.alpha_composite(char_rot, (int(x - 110), int(y - 110)))

MASTER_DESIGNS = [
    # 1. THE FIRST ONE: Tiffany Pastel Mint & Emerald Luxury
    {
        'file': 'diamond_cookies_mint_luxury_600dpi.png',
        'title_text': 'Assorted Cookies',
        'bg_start': (212, 239, 217), # #D4EFD9
        'bg_end': (186, 226, 194),   # #BAE2C2
        'mandala_alpha': 0.28,
        'gold_line': (212, 175, 55), # 24K Gold
        'top_arc_text': '★  SERVING SHIMLA SINCE 2002  •  FINEST ARTISAN BAKES  ★',
        'top_arc_color': (10, 51, 38), # Deep Emerald for crystal-clear readability
        'bot_arc_text': '★  PREPARED IN PURE BUTTER & DESI GHEE  •  ZERO PALM OIL  ★',
        'bot_arc_color': (10, 51, 38), # Deep Emerald
        'brand_color': (236, 50, 55),  # Authentic Original Red
        'sub_color': (17, 17, 17),     # Obsidian Black
        'title_color': (220, 155, 30), # Golden Honey Script with shadow
        'ribbon_bg': (16, 48, 32, 240), # Dark Forest Green capsule ribbon
        'ribbon_text': (253, 224, 71), # Warm Gold
        'plaque_bg': (255, 255, 255, 245),
        'plaque_text': (10, 51, 38),   # Deep Emerald
        'is_dark': False
    },
    # 2. THE MAROON ONE: Royal Shahi Velvet Maroon & 24K Gold
    {
        'file': 'diamond_cookies_maroon_gold_600dpi.png',
        'title_text': 'Assorted Cookies',
        'bg_start': (74, 14, 23),     # Deep Velvet Maroon #4A0E17
        'bg_end': (34, 4, 8),         # Imperial Dark Wine #220408
        'mandala_alpha': 0.42,
        'gold_line': (250, 204, 21),  # Specular 24K Gold
        'top_arc_text': '★  SERVING SHIMLA SINCE 2002  •  FINEST CONFECTIONERY  ★',
        'top_arc_color': (250, 204, 21), # 24K Gold
        'bot_arc_text': '★  PREPARED IN PURE BUTTER & DESI GHEE  •  ZERO PALM OIL  ★',
        'bot_arc_color': (250, 204, 21), # 24K Gold
        'brand_color': (250, 204, 21),  # 24K Gold
        'sub_color': (253, 230, 138),  # 24K Silk Gold
        'title_color': (250, 204, 21), # 24K Liquid Gold
        'ribbon_bg': (42, 6, 14, 245), # Deep Wine Velvet
        'ribbon_text': (253, 230, 138),# 24K Gold
        'plaque_bg': (42, 6, 14, 245),
        'plaque_text': (253, 230, 138),# 24K Gold
        'is_dark': True
    }
]

def render_ultra():
    mandala_raw = Image.open(MANDALA_PATH).convert('RGBA') if MANDALA_PATH.exists() else None
    crest_im = Image.open(CREST_PATH).convert('RGBA') if CREST_PATH.exists() else None

    # Logo shifted a bit higher up ("logo toda upper kr dena")
    logo_y = 1200

    for var in MASTER_DESIGNS:
        print(f"Rendering {var['file']}...")
        canvas = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
        bg = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
        bg_draw = ImageDraw.Draw(bg)
        bg_draw.ellipse((CENTER - RADIUS, CENTER - RADIUS, CENTER + RADIUS, CENTER + RADIUS), fill=var['bg_start'])

        # Radial Background Gradient (High-Res Anti-Aliased)
        px = bg.load()
        for y in range(CENTER - RADIUS, CENTER + RADIUS):
            dy = (y - CENTER) / RADIUS
            for x in range(CENTER - RADIUS, CENTER + RADIUS):
                dx = (x - CENTER) / RADIUS
                dist_sq = dx*dx + dy*dy
                if dist_sq <= 1.0:
                    t = math.sqrt(dist_sq)
                    r = int(var['bg_start'][0]*(1-t) + var['bg_end'][0]*t)
                    g = int(var['bg_start'][1]*(1-t) + var['bg_end'][1]*t)
                    b = int(var['bg_start'][2]*(1-t) + var['bg_end'][2]*t)
                    px[x, y] = (r, g, b, 255)

        canvas.alpha_composite(bg)
        d = ImageDraw.Draw(canvas)

        # Dual Outer Metallic Gold Rims (Ultra Crisp at 600 DPI)
        d.ellipse((CENTER - RADIUS, CENTER - RADIUS, CENTER + RADIUS, CENTER + RADIUS), outline=var['gold_line'], width=16)
        d.ellipse((CENTER - RADIUS + 24, CENTER - RADIUS + 24, CENTER + RADIUS - 24, CENTER + RADIUS - 24), outline=var['gold_line'], width=6)
        d.ellipse((CENTER - RADIUS + 48, CENTER - RADIUS + 48, CENTER + RADIUS - 48, CENTER + RADIUS - 48), outline=(255, 255, 255, 120), width=2)

        # 1. Mandala in EXACT DEAD CENTER (1800, 1800)
        if mandala_raw:
            target_mw = 3450
            scale = target_mw / mandala_raw.width
            target_mh = int(mandala_raw.height * scale)
            m_res = mandala_raw.resize((target_mw, target_mh), Image.Resampling.LANCZOS)
            m_res = m_res.filter(ImageFilter.UnsharpMask(radius=2, percent=130, threshold=3))
            
            m_alpha = m_res.split()[3].point(lambda a: int(a * var['mandala_alpha']))
            m_res.putalpha(m_alpha)
            
            canvas.alpha_composite(m_res, (CENTER - target_mw//2, CENTER - target_mh//2))

        # 2. Soft Backlight Halo under Center Logo
        halo = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
        halo_d = ImageDraw.Draw(halo)
        halo_color = (var['bg_start'][0], var['bg_start'][1], var['bg_start'][2], 230) if not var['is_dark'] else (80, 16, 26, 210)
        halo_d.ellipse((CENTER - 840, logo_y - 840, CENTER + 840, logo_y + 840), fill=halo_color)
        halo = halo.filter(ImageFilter.GaussianBlur(100))
        canvas.alpha_composite(halo)

        # 3. TOP ROUND SHAPE ARCH HEADER (GOL END ME!)
        font_arc = get_font(FONT_SERIF, 48)
        draw_top_arc(canvas, var['top_arc_text'], font_arc, var['top_arc_color'], center_y=CENTER, radius=1580, start_angle=-142, end_angle=-38)

        # 4. BOTTOM ROUND SHAPE ARCH TAGLINES (GOL END ME! Left to right)
        font_bottom_arc = get_font(FONT_SERIF, 46)
        draw_bottom_arc(canvas, var['bot_arc_text'], font_bottom_arc, var['bot_arc_color'], center_y=CENTER, radius=1580, start_angle=142, end_angle=38)

        # 5. Authentic Diamond Crest in Middle
        if crest_im:
            crest_w = 860
            cscale = crest_w / crest_im.width
            crest_h = int(crest_im.height * cscale)
            c_res = crest_im.resize((crest_w, crest_h), Image.Resampling.LANCZOS)
            c_res = c_res.filter(ImageFilter.UnsharpMask(radius=2, percent=120, threshold=2))
            canvas.alpha_composite(c_res, (CENTER - crest_w//2, logo_y - crest_h//2 - 60))

        # 6. Brand Name: DIAMOND (Original Serif Typography)
        d = ImageDraw.Draw(canvas)
        font_brand = get_font(FONT_SERIF, 126)
        d.text((CENTER, logo_y + 450), "DIAMOND", font=font_brand, fill=var['brand_color'], anchor='mm')

        # 7. "BAKERY • RESTAURANT • SWEETS" (Straight horizontal)
        font_sub = get_font(FONT_SANS, 44)
        d.text((CENTER, logo_y + 536), "BAKERY  •  RESTAURANT  •  SWEETS", font=font_sub, fill=var['sub_color'], anchor='mm')

        # 8. Product Title: "Assorted Cookies" in Alex Brush Script (Bada size)
        font_title = get_font(FONT_SCRIPT, 440)
        # Drop shadow for luxury legibility
        shadow_col = (0, 0, 0, 160) if not var['is_dark'] else (0, 0, 0, 220)
        d.text((CENTER + 5, 2220 + 5), var['title_text'], font=font_title, fill=shadow_col, anchor='mm')
        d.text((CENTER, 2220), var['title_text'], font=font_title, fill=var['title_color'], anchor='mm')

        # 9. Tagline Directly Below Cookies: High-Visibility Capsule Ribbon
        ribbon_w = 2300
        ribbon_h = 116
        ribbon_y = 2430
        d.rounded_rectangle((CENTER - ribbon_w//2, ribbon_y - ribbon_h//2, CENTER + ribbon_w//2, ribbon_y + ribbon_h//2), radius=58, fill=var['ribbon_bg'], outline=var['gold_line'], width=5)
        
        font_butter = get_font(FONT_SERIF, 50)
        d.text((CENTER, ribbon_y), "★  BAKED WITH 100% PURE BUTTER  •  ZERO PALM OIL  ★", font=font_butter, fill=var['ribbon_text'], anchor='mm')

        # 10. Symmetrical Luxury Balanced Plaque for Net Weight & Pure Veg
        plaque_w = 1000
        plaque_h = 116
        plaque_y = 2630

        # Outer rounded rectangle
        d.rounded_rectangle((CENTER - plaque_w//2, plaque_y - plaque_h//2, CENTER + plaque_w//2, plaque_y + plaque_h//2), radius=24, fill=var['plaque_bg'], outline=var['gold_line'], width=6)
        # Inner hairline
        d.rounded_rectangle((CENTER - plaque_w//2 + 18, plaque_y - plaque_h//2 + 15, CENTER + plaque_w//2 - 18, plaque_y + plaque_h//2 - 15), radius=15, outline=var['gold_line'], width=2)

        # Left: FSSAI Pure Veg Green Square
        veg_cx = CENTER - 370
        d.rounded_rectangle((veg_cx - 33, plaque_y - 33, veg_cx + 33, plaque_y + 33), radius=10, fill=(255, 255, 255), outline=(22, 163, 74), width=6)
        d.ellipse((veg_cx - 16, plaque_y - 16, veg_cx + 16, plaque_y + 16), fill=(22, 163, 74))

        # Left Divider
        d.line([(CENTER - 295, plaque_y - 30), (CENTER - 295, plaque_y + 30)], fill=var['gold_line'], width=4)

        # Center: NET WEIGHT
        font_weight = get_font(FONT_SERIF, 44)
        d.text((CENTER + 18, plaque_y), "NET WT. 500g ℮", font=font_weight, fill=var['plaque_text'], anchor='mm')

        # Right Divider
        d.line([(CENTER + 330, plaque_y - 30), (CENTER + 330, plaque_y + 30)], fill=var['gold_line'], width=4)

        # Right: Gold Diamond Star Finial
        star_cx = CENTER + 398
        d.polygon([(star_cx, plaque_y - 24), (star_cx + 7, plaque_y - 7), (star_cx + 24, plaque_y), (star_cx + 7, plaque_y + 7), (star_cx, plaque_y + 24), (star_cx - 7, plaque_y + 7), (star_cx - 24, plaque_y), (star_cx - 7, plaque_y - 7)], fill=var['gold_line'])
        d.ellipse((star_cx - 4, plaque_y - 4, star_cx + 4, plaque_y + 4), fill=(139, 20, 36) if not var['is_dark'] else (255, 250, 240))

        # Save Ultra HD 600 DPI PNG
        out_path = Path(var['file'])
        canvas.save(out_path, 'PNG', quality=100, dpi=(600, 600))
        print(f"✓ Generated 600 DPI Master Print file: {out_path} ({out_path.stat().st_size / (1024*1024):.2f} MB)")

        # Also update preview
        prev = canvas.resize((1000, 1000), Image.Resampling.LANCZOS)
        prev.save(var['file'].replace('_600dpi.png', '_preview.png'))

if __name__ == '__main__':
    render_ultra()
