#!/usr/bin/env python3
"""
Generate the official 6-inch Round Cookie Tin Label using the user's authentic Diamond Logo,
Hadji Bey's vintage mint/teal matte background, Victorian gold lace wreath, and 300 DPI print output.
"""
from __future__ import annotations
import base64
import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

SIZE = 1800
CENTER = SIZE // 2
RADIUS = 840  # 6-inch diameter circular label (3-inch radius)

# Palette
TEAL_LIGHT = (142, 192, 190)
TEAL_MID = (114, 168, 166)
TEAL_DEEP = (92, 146, 144)
TEAL_DARK = (60, 104, 102)

GOLD = (205, 162, 82)
GOLD_LIGHT = (245, 222, 148)
GOLD_SHINE = (255, 242, 195)
RED_BRAND = (225, 29, 44)

# Load user logo
CREST_PATH = Path('diamond_crest_user.png')
TEXT_PATH = Path('diamond_text_user.png')

def get_font(path: str, size: int):
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

def draw_curved_text(im: Image.Image, text: str, font: ImageFont.FreeTypeFont,
                     center_r: float, start_deg: float, end_deg: float,
                     fill, clockwise: bool = True):
    chars = list(text)
    n = len(chars)
    if n == 0:
        return

    total_arc = end_deg - start_deg
    step = total_arc / max(1, n - 1)

    for i, ch in enumerate(chars):
        deg = start_deg + i * step
        rad = math.radians(deg)

        cx = CENTER + center_r * math.cos(rad)
        cy = CENTER + center_r * math.sin(rad)

        bbox = font.getbbox(ch)
        cw = max(1, bbox[2] - bbox[0] + 10)
        ch_h = max(1, bbox[3] - bbox[1] + 10)
        char_im = Image.new('RGBA', (cw + 24, ch_h + 24), (0, 0, 0, 0))
        cdraw = ImageDraw.Draw(char_im)
        cdraw.text((12 - bbox[0], 12 - bbox[1]), ch, font=font, fill=fill)

        char_rot = deg + 90 if clockwise else deg - 90
        rotated = char_im.rotate(-char_rot, resample=Image.Resampling.BICUBIC, expand=True)

        px = int(round(cx - rotated.width / 2))
        py = int(round(cy - rotated.height / 2))
        im.alpha_composite(rotated, (px, py))

def render_label():
    # 1. Base Transparent Canvas
    canvas = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))

    # 2. Smooth Radial Gradient Mint/Teal Circle
    bg = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    bg_draw = ImageDraw.Draw(bg)
    bg_draw.ellipse((CENTER - RADIUS, CENTER - RADIUS, CENTER + RADIUS, CENTER + RADIUS), fill=TEAL_MID)

    px = bg.load()
    for y in range(CENTER - RADIUS, CENTER + RADIUS):
        for x in range(CENTER - RADIUS, CENTER + RADIUS):
            dx = (x - CENTER) / RADIUS
            dy = (y - CENTER) / RADIUS
            dist_sq = dx*dx + dy*dy
            if dist_sq <= 1.0:
                dist = math.sqrt(dist_sq)
                # Highlights shifted towards top-left (40% 35%)
                lx = (x - (CENTER - 100)) / RADIUS
                ly = (y - (CENTER - 120)) / RADIUS
                ldist = min(1.0, math.sqrt(lx*lx + ly*ly))
                t = ldist
                r = int(TEAL_LIGHT[0]*(1-t) + TEAL_DEEP[0]*t)
                g = int(TEAL_LIGHT[1]*(1-t) + TEAL_DEEP[1]*t)
                b = int(TEAL_LIGHT[2]*(1-t) + TEAL_DEEP[2]*t)
                px[x, y] = (r, g, b, 255)

    canvas.alpha_composite(bg)
    d = ImageDraw.Draw(canvas)

    # 3. Outer Rims & Inset Gold Borders
    d.ellipse((CENTER - RADIUS, CENTER - RADIUS, CENTER + RADIUS, CENTER + RADIUS),
              outline=GOLD, width=6)
    d.ellipse((CENTER - RADIUS + 10, CENTER - RADIUS + 10, CENTER + RADIUS - 10, CENTER + RADIUS - 10),
              outline=GOLD_LIGHT, width=2)
    d.ellipse((CENTER - RADIUS + 18, CENTER - RADIUS + 18, CENTER + RADIUS - 18, CENTER + RADIUS - 18),
              outline=GOLD, width=3)
    d.ellipse((CENTER - RADIUS + 26, CENTER - RADIUS + 26, CENTER + RADIUS - 26, CENTER + RADIUS - 26),
              outline=(255, 255, 255, 70), width=1)

    # Victorian Lace Wreath around border
    wreath_r = RADIUS - 70
    for deg in range(0, 360, 10):
        rad = math.radians(deg)
        wx = CENTER + wreath_r * math.cos(rad)
        wy = CENTER + wreath_r * math.sin(rad)
        # Small floral motif
        d.ellipse((wx-6, wy-6, wx+6, wy+6), fill=GOLD_LIGHT)
        d.ellipse((wx-3, wy-3, wx+3, wy+3), fill=GOLD)
        # Inset petals
        for pdeg in [deg-4, deg+4]:
            prad = math.radians(pdeg)
            px_p = CENTER + (wreath_r - 18) * math.cos(prad)
            py_p = CENTER + (wreath_r - 18) * math.sin(prad)
            d.ellipse((px_p-3, py_p-3, px_p+3, py_p+3), fill=GOLD_LIGHT)

    # Inner wreath bounding ring
    d.ellipse((CENTER - RADIUS + 115, CENTER - RADIUS + 115,
              CENTER + RADIUS - 115, CENTER + RADIUS - 115),
              outline=GOLD, width=3)
    d.ellipse((CENTER - RADIUS + 122, CENTER - RADIUS + 122,
              CENTER + RADIUS - 122, CENTER + RADIUS - 122),
              outline=GOLD_LIGHT, width=2)

    # 4. Top Arched Header
    font_micro = get_font('/System/Library/Fonts/Avenir Next.ttc', 28)
    draw_curved_text(canvas, "★   HAND MADE   •   ESTABLISHED 2026   ★",
                     font_micro, RADIUS - 150, -145, -35, fill=GOLD_SHINE, clockwise=True)

    # 5. Place User's Authentic Diamond Crest
    if CREST_PATH.exists():
        crest_im = Image.open(CREST_PATH).convert('RGBA')
        # Scale crest for elegant top placement
        crest_target_w = 460
        crest_scale = crest_target_w / crest_im.width
        crest_target_h = int(crest_im.height * crest_scale)
        crest_resized = crest_im.resize((crest_target_w, crest_target_h), Image.Resampling.LANCZOS)

        crest_x = CENTER - crest_target_w // 2
        crest_y = 330
        canvas.alpha_composite(crest_resized, (crest_x, crest_y))

    # 6. Place User's Authentic Diamond Brand Text
    if TEXT_PATH.exists():
        text_im = Image.open(TEXT_PATH).convert('RGBA')
        text_target_w = 560
        text_scale = text_target_w / text_im.width
        text_target_h = int(text_im.height * text_scale)
        text_resized = text_im.resize((text_target_w, text_target_h), Image.Resampling.LANCZOS)

        text_x = CENTER - text_target_w // 2
        text_y = 785
        canvas.alpha_composite(text_resized, (text_x, text_y))

    d = ImageDraw.Draw(canvas)

    # 7. Center Medallion / Swash with Weight (250g ℮) & Tagline
    tagline_y = 990
    font_script = get_font('/System/Library/Fonts/Supplemental/Georgia Italic.ttf', 44)
    font_bold = get_font('/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf', 40)
    font_sans = get_font('/System/Library/Fonts/Avenir Next.ttc', 26)

    # Tagline: "Baked with Pure Butter, Handcrafted with Love"
    d.text((CENTER, tagline_y), "“Baked with Pure Butter, Handcrafted with Love”",
           font=font_script, fill=(255, 248, 230), anchor='mm')

    # Decorative gold filigree dividers
    d.line((CENTER - 360, tagline_y + 36, CENTER - 40, tagline_y + 36), fill=GOLD, width=2)
    d.line((CENTER + 40, tagline_y + 36, CENTER + 360, tagline_y + 36), fill=GOLD, width=2)
    d.polygon([(CENTER, tagline_y + 30), (CENTER + 6, tagline_y + 36),
               (CENTER, tagline_y + 42), (CENTER - 6, tagline_y + 36)], fill=GOLD)

    # Net weight capsule badge
    weight_y = 1085
    pill_w = 260
    pill_h = 58
    d.rounded_rectangle((CENTER - pill_w//2, weight_y - pill_h//2,
                         CENTER + pill_w//2, weight_y + pill_h//2),
                        radius=29, fill=TEAL_DEEP, outline=GOLD, width=2.5)
    d.text((CENTER, weight_y), "NET WT. 250g ℮",
           font=font_sans, fill=GOLD_SHINE, anchor='mm')

    # 8. Bottom Grand Product Title: "BUTTER COOKIES"
    font_title = get_font('/System/Library/Fonts/Supplemental/Georgia.ttf', 82)
    draw_curved_text(canvas, "BUTTER COOKIES",
                     font_title, RADIUS - 180, 138, 42, fill=GOLD_SHINE, clockwise=False)

    font_sub_bot = get_font('/System/Library/Fonts/Avenir Next.ttc', 28)
    draw_curved_text(canvas, "•  PREMIUM ARTISANAL QUALITY  •",
                     font_sub_bot, RADIUS - 250, 132, 48, fill=(255, 245, 220), clockwise=False)

    # Save output files
    out_png = Path('diamond_cookie_tin_6inch.png')
    canvas.save(out_png, 'PNG', quality=95)
    print(f"✓ Saved 300 DPI PNG: {out_png} (Size: {out_png.stat().st_size} bytes)")

if __name__ == '__main__':
    render_label()
