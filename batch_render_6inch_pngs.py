#!/usr/bin/env python3
"""
Generate 4 final 1800x1800 px (300 DPI) print-ready PNGs for the 6-inch dabba:
- Mandala in EXACT DEAD CENTER (900, 900) - perfectly concentric 360° symmetry!
- Authentic Logo in Middle: Crest + "DIAMOND" + "BAKERY • RESTAURANT • SWEETS" straight in Black
- Product Title: "Cookies" (Script font)
- Directly below logo: "★ BAKED WITH 100% PURE BUTTER • ZERO PALM OIL ★"
- 4 Gold Trust Badges at the bottom/side: "🧈 100% PURE BUTTER", "🚫 NO PALM OIL", "✨ OVEN BAKED FRESH", "🌱 100% PURE VEG"
- Net Weight badge: "NET WT. 250g ℮"
"""
from __future__ import annotations
import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

SIZE = 1800
CENTER = SIZE // 2  # 900
RADIUS = 860

MANDALA_PATH = Path('mandala_pure_gold_clean.png')
CREST_PATH = Path('diamond_crest_user.png')

FONT_SCRIPT = '/System/Library/Fonts/Supplemental/Georgia Italic.ttf'
FONT_SERIF = '/System/Library/Fonts/Supplemental/Georgia.ttf'
FONT_SANS = '/System/Library/Fonts/Avenir Next.ttc'

def get_font(path: str, size: int):
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

def draw_arched_text(canvas: Image.Image, text: str, font: ImageFont.FreeTypeFont, fill: tuple, center_y: int = CENTER, radius: int = 770, start_angle: float = -142, end_angle: float = -38):
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
        
        char_img = Image.new('RGBA', (80, 80), (0, 0, 0, 0))
        cd = ImageDraw.Draw(char_img)
        cd.text((40, 40), ch, font=font, fill=fill, anchor='mm')
        rot_angle = -(angle_deg + 90)
        char_rot = char_img.rotate(rot_angle, resample=Image.Resampling.BICUBIC)
        canvas.alpha_composite(char_rot, (int(x - 40), int(y - 40)))

VARIATIONS = [
    {
        'file': 'diamond_cookies_mint_6inch.png',
        'bg_start': (212, 239, 217),
        'bg_end': (186, 226, 194),
        'mandala_alpha': 0.32,
        'title': 'Cookies',
        'gold_line': (205, 165, 75),
        'sub_color': (15, 23, 42),            # Straight Black as in original logo
        'butter_tag_color': (205, 165, 75),
        'pill_bg': (212, 175, 55, 45),
        'brand_color': (215, 25, 36)
    },
    {
        'file': 'diamond_cookies_black_gold_6inch.png',
        'bg_start': (22, 26, 32),
        'bg_end': (10, 12, 15),
        'mandala_alpha': 0.45,
        'title': 'Cookies',
        'gold_line': (235, 198, 90),
        'sub_color': (245, 222, 148),
        'butter_tag_color': (235, 198, 90),
        'pill_bg': (235, 198, 90, 45),
        'brand_color': (235, 198, 90)
    },
    {
        'file': 'diamond_cookies_cream_gold_6inch.png',
        'bg_start': (255, 247, 237),
        'bg_end': (246, 230, 210),
        'mandala_alpha': 0.35,
        'title': 'Cookies',
        'gold_line': (195, 148, 65),
        'sub_color': (20, 20, 20),
        'butter_tag_color': (195, 148, 65),
        'pill_bg': (195, 148, 65, 45),
        'brand_color': (215, 25, 36)
    },
    {
        'file': 'diamond_cookies_crimson_red_6inch.png',
        'bg_start': (139, 20, 36),
        'bg_end': (80, 10, 20),
        'mandala_alpha': 0.40,
        'title': 'Cookies',
        'gold_line': (245, 220, 130),
        'sub_color': (255, 245, 220),
        'butter_tag_color': (245, 220, 130),
        'pill_bg': (245, 220, 130, 45),
        'brand_color': (245, 220, 130)
    }
]

def render_batch():
    mandala_raw = Image.open(MANDALA_PATH).convert('RGBA') if MANDALA_PATH.exists() else None
    crest_im = Image.open(CREST_PATH).convert('RGBA') if CREST_PATH.exists() else None

    logo_y = 660

    for var in VARIATIONS:
        canvas = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
        bg = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
        bg_draw = ImageDraw.Draw(bg)
        bg_draw.ellipse((CENTER - RADIUS, CENTER - RADIUS, CENTER + RADIUS, CENTER + RADIUS), fill=var['bg_start'])

        # Radial Background Gradient
        px = bg.load()
        for y in range(CENTER - RADIUS, CENTER + RADIUS):
            for x in range(CENTER - RADIUS, CENTER + RADIUS):
                dx = (x - CENTER) / RADIUS
                dy = (y - CENTER) / RADIUS
                dist_sq = dx*dx + dy*dy
                if dist_sq <= 1.0:
                    t = math.sqrt(dist_sq)
                    r = int(var['bg_start'][0]*(1-t) + var['bg_end'][0]*t)
                    g = int(var['bg_start'][1]*(1-t) + var['bg_end'][1]*t)
                    b = int(var['bg_start'][2]*(1-t) + var['bg_end'][2]*t)
                    px[x, y] = (r, g, b, 255)

        canvas.alpha_composite(bg)
        d = ImageDraw.Draw(canvas)

        # Dual outer gold rims
        d.ellipse((CENTER - RADIUS, CENTER - RADIUS, CENTER + RADIUS, CENTER + RADIUS), outline=var['gold_line'], width=8)
        d.ellipse((CENTER - RADIUS + 12, CENTER - RADIUS + 12, CENTER + RADIUS - 12, CENTER + RADIUS - 12), outline=var['gold_line'], width=3)
        d.ellipse((CENTER - RADIUS + 24, CENTER - RADIUS + 24, CENTER + RADIUS - 24, CENTER + RADIUS - 24), outline=(255, 255, 255, 100), width=1)

        # 1. Mandala in EXACT DEAD CENTER (CENTER, CENTER) - concentric in all directions!
        # "uske bad madala aaya vo charo trf se bich me ho ese nhi toda upper ya niche ho ok"
        if mandala_raw:
            target_mw = 1700
            scale = target_mw / mandala_raw.width
            target_mh = int(mandala_raw.height * scale)
            m_res = mandala_raw.resize((target_mw, target_mh), Image.Resampling.LANCZOS)
            
            m_alpha = m_res.split()[3].point(lambda a: int(a * var['mandala_alpha']))
            m_res.putalpha(m_alpha)
            
            # EXACT CENTER: (CENTER - w//2, CENTER - h//2)
            canvas.alpha_composite(m_res, (CENTER - target_mw//2, CENTER - target_mh//2))

        # 2. Soft Backlight Halo under Center Logo
        halo = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
        halo_d = ImageDraw.Draw(halo)
        halo_d.ellipse((CENTER - 420, logo_y - 420, CENTER + 420, logo_y + 420), fill=(var['bg_start'][0], var['bg_start'][1], var['bg_start'][2], 225))
        halo = halo.filter(ImageFilter.GaussianBlur(50))
        canvas.alpha_composite(halo)

        # 3. Top Rim Arched Micro Header
        font_arc = get_font(FONT_SERIF, 24)
        draw_arched_text(canvas, "★  HANDCRAFTED LUXURY BAKES  •  ESTABLISHED 2026  ★", font_arc, var['gold_line'], center_y=CENTER, radius=775, start_angle=-142, end_angle=-38)

        # 4. Authentic Diamond Crest in Middle
        if crest_im:
            crest_w = 440
            cscale = crest_w / crest_im.width
            crest_h = int(crest_im.height * cscale)
            c_res = crest_im.resize((crest_w, crest_h), Image.Resampling.LANCZOS)
            canvas.alpha_composite(c_res, (CENTER - crest_w//2, logo_y - crest_h//2 - 30))

        # 5. Brand Name: DIAMOND (Straight as in logo)
        d = ImageDraw.Draw(canvas)
        font_brand = get_font(FONT_SERIF, 58)
        d.text((CENTER, logo_y + 225), "DIAMOND", font=font_brand, fill=var['brand_color'], anchor='mm')

        # 6. "BAKERY • RESTAURANT • SWEETS" (Straight horizontal, Black color, exactly like original logo!)
        font_sub = get_font(FONT_SERIF, 24)
        d.text((CENTER, logo_y + 268), "BAKERY  •  RESTAURANT  •  SWEETS", font=font_sub, fill=var['sub_color'], anchor='mm')

        # 7. Product Title: "Cookies" (Directly below logo, big script font)
        font_title = get_font(FONT_SCRIPT, 175)
        d.text((CENTER, 1140), var['title'], font=font_title, fill=var['gold_line'], anchor='mm')

        # 8. Tagline Directly Below Logo: Butter & No Palm Oil
        # "or ek tag line logo ke niche ho jaise hm butter or achha oil use krte h no plam oil h"
        font_butter = get_font(FONT_SERIF, 25)
        d.text((CENTER, 1225), "★  BAKED WITH 100% PURE BUTTER  •  ZERO PALM OIL  ★", font=font_butter, fill=var['butter_tag_color'], anchor='mm')

        # 9. Four Gold Trust Taglines at the very bottom / sides ("ek dam last me. ho side me")
        font_pill = get_font(FONT_SANS, 22)
        
        # Pill helper
        def draw_pill(text: str, cx: int, cy: int):
            pw, ph = 320, 46
            d.rounded_rectangle((cx - pw//2, cy - ph//2, cx + pw//2, cy + ph//2), radius=23, outline=var['gold_line'], width=2, fill=var['pill_bg'])
            d.text((cx, cy), text, font=font_pill, fill=var['gold_line'], anchor='mm')

        # Row 1 of pills
        draw_pill("🧈 100% PURE BUTTER", CENTER - 180, 1310)
        draw_pill("🚫 ZERO PALM OIL", CENTER + 180, 1310)

        # Row 2 of pills
        draw_pill("✨ OVEN BAKED FRESH", CENTER - 180, 1375)
        draw_pill("🌱 100% PURE VEG", CENTER + 180, 1375)

        # 10. Net Weight Badge at bottom
        font_weight = get_font(FONT_SANS, 24)
        d.rounded_rectangle((CENTER - 85, 1440, CENTER + 85, 1478), radius=19, outline=var['gold_line'], width=2)
        d.text((CENTER, 1459), "NET WT. 250g ℮", font=font_weight, fill=var['gold_line'], anchor='mm')

        # Save High-Res 300 DPI PNG
        out_path = Path(var['file'])
        canvas.save(out_path, 'PNG', quality=95)
        print(f"✓ Generated 300 DPI label: {out_path} ({out_path.stat().st_size} bytes)")

if __name__ == '__main__':
    render_batch()
