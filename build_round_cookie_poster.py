#!/usr/bin/env python3
"""
Generate a luxury, print-ready, high-resolution Round Shape Cookie Poster.
Incorporates real cookie photography, circular typography, gold accents,
and boutique bakery aesthetics.
"""
from __future__ import annotations
import math
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

SIZE = 1800
CENTER = SIZE // 2
RADIUS = 840

# Palette
CREAM = (255, 248, 240)
IVORY = (255, 252, 248)
BLUSH = (250, 228, 226)
ROSE = (244, 206, 209)
WINE = (108, 18, 39)
WINE_DEEP = (82, 12, 28)
GOLD = (194, 149, 74)
GOLD_LIGHT = (235, 198, 138)
CHOCOLATE = (58, 27, 21)

# Fonts
FONT_SERIF = '/System/Library/Fonts/Supplemental/Baskerville.ttc'
FONT_SERIF_ITALIC = '/System/Library/Fonts/Supplemental/Georgia Italic.ttf'
FONT_ROUND = '/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf'
FONT_SANS = '/System/Library/Fonts/Avenir Next.ttc'

def get_font(path: str, size: int, index: int = 0):
    try:
        return ImageFont.truetype(path, size, index=index)
    except:
        return ImageFont.load_default()

def draw_curved_text(im: Image.Image, text: str, font: ImageFont.FreeTypeFont,
                     center_r: float, start_deg: float, end_deg: float,
                     fill, clockwise: bool = True):
    """Draw text smoothly along a circular arc."""
    draw = ImageDraw.Draw(im)
    chars = list(text)
    n = len(chars)
    if n == 0:
        return

    total_arc = end_deg - start_deg
    step = total_arc / max(1, n - 1)

    for i, ch in enumerate(chars):
        deg = start_deg + i * step
        rad = math.radians(deg)

        # Character position
        cx = CENTER + center_r * math.cos(rad)
        cy = CENTER + center_r * math.sin(rad)

        # Render single char on small canvas
        bbox = font.getbbox(ch)
        cw = max(1, bbox[2] - bbox[0] + 10)
        ch_h = max(1, bbox[3] - bbox[1] + 10)
        char_im = Image.new('RGBA', (cw + 20, ch_h + 20), (0, 0, 0, 0))
        cdraw = ImageDraw.Draw(char_im)
        cdraw.text((10 - bbox[0], 10 - bbox[1]), ch, font=font, fill=fill)

        # Rotation angle for the letter
        # For top arc (clockwise), text faces outward
        char_rot = deg + 90 if clockwise else deg - 90
        rotated = char_im.rotate(-char_rot, resample=Image.Resampling.BICUBIC, expand=True)

        # Paste onto main image centered at (cx, cy)
        px = int(round(cx - rotated.width / 2))
        py = int(round(cy - rotated.height / 2))
        im.alpha_composite(rotated, (px, py))

def create_poster():
    # Base canvas with transparent background
    canvas = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))

    # 1. Background Circle with warm radial velvet lighting
    bg_circle = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    bg_draw = ImageDraw.Draw(bg_circle)
    bg_draw.ellipse((CENTER - RADIUS, CENTER - RADIUS, CENTER + RADIUS, CENTER + RADIUS), fill=ROSE)

    # Pixel shader for smooth radial gradient
    px = bg_circle.load()
    for y in range(CENTER - RADIUS, CENTER + RADIUS):
        for x in range(CENTER - RADIUS, CENTER + RADIUS):
            dx = (x - CENTER) / RADIUS
            dy = (y - CENTER) / RADIUS
            dist_sq = dx*dx + dy*dy
            if dist_sq <= 1.0:
                dist = math.sqrt(dist_sq)
                # Center is warm Ivory/Cream, edge is soft Rose/Blush with antique gold tint
                if dist < 0.65:
                    t = dist / 0.65
                    r = int(IVORY[0]*(1-t) + BLUSH[0]*t)
                    g = int(IVORY[1]*(1-t) + BLUSH[1]*t)
                    b = int(IVORY[2]*(1-t) + BLUSH[2]*t)
                else:
                    t = (dist - 0.65) / 0.35
                    r = int(BLUSH[0]*(1-t) + ROSE[0]*t)
                    g = int(BLUSH[1]*(1-t) + ROSE[1]*t)
                    b = int(BLUSH[2]*(1-t) + ROSE[2]*t)
                px[x, y] = (r, g, b, 255)

    canvas.alpha_composite(bg_circle)

    d = ImageDraw.Draw(canvas)

    # 2. Luxury Outer Frame & Gold Trim Rings
    # Outer gold rim
    d.ellipse((CENTER - RADIUS, CENTER - RADIUS, CENTER + RADIUS, CENTER + RADIUS),
              outline=GOLD, width=6)
    d.ellipse((CENTER - RADIUS + 10, CENTER - RADIUS + 10, CENTER + RADIUS - 10, CENTER + RADIUS - 10),
              outline=GOLD_LIGHT, width=2)

    # Deep wine border band for top/bottom text contrast
    d.ellipse((CENTER - RADIUS + 18, CENTER - RADIUS + 18, CENTER + RADIUS - 18, CENTER + RADIUS - 18),
              outline=WINE, width=72)
    d.ellipse((CENTER - RADIUS + 54, CENTER - RADIUS + 54, CENTER + RADIUS - 54, CENTER + RADIUS - 54),
              outline=GOLD, width=3)
    d.ellipse((CENTER - RADIUS + 62, CENTER - RADIUS + 62, CENTER + RADIUS - 62, CENTER + RADIUS - 62),
              outline=(255, 255, 255, 120), width=1)

    # Decorative beaded dots around circle
    for deg in range(0, 360, 10):
        rad = math.radians(deg)
        bx = CENTER + (RADIUS - 9) * math.cos(rad)
        by = CENTER + (RADIUS - 9) * math.sin(rad)
        d.ellipse((bx-2.5, by-2.5, bx+2.5, by+2.5), fill=GOLD_LIGHT)

    # 3. Curved Circular Typography
    # Top Arc: "★ THE DIAMOND ARTISAN BAKERY • FRESH COOKIES ★"
    font_top = get_font(FONT_ROUND, 28)
    draw_curved_text(canvas, "★  THE DIAMOND ARTISAN BAKERY  •  FRESH COOKIES  ★",
                     font_top, RADIUS - 38, -148, -32, fill=GOLD_LIGHT, clockwise=True)

    # Bottom Arc: "• 100% PURE BUTTER • BAKED FRESH DAILY WITH LOVE •"
    font_bot = get_font(FONT_ROUND, 26)
    draw_curved_text(canvas, "•  100% PURE BUTTER  •  BAKED FRESH DAILY WITH LOVE  •",
                     font_bot, RADIUS - 38, 146, 34, fill=GOLD_LIGHT, clockwise=False)

    # 4. Central Visual: Realistic Delicious Chocolate Chip Cookie
    cookie_path = '/Users/ajaynxt/Documents/Codex/2026-10-07/a/work/inspect-chocolate-chip.png'
    if os.path.exists(cookie_path):
        src_cookie = Image.open(cookie_path).convert('RGB')
        # Center of cookie in original image
        cw, ch = src_cookie.size
        cx, cy = cw // 2, ch // 2
        cr = int(cw * 0.44)

        # Extract circular cookie with natural edge
        crop = src_cookie.crop((cx - cr, cy - cr, cx + cr, cy + cr))
        mask = Image.new('L', crop.size, 0)
        md = ImageDraw.Draw(mask)
        # Organic edge points
        pts = []
        for i in range(360):
            a = 2 * math.pi * i / 360
            wobble = 1.0 + 0.02 * math.sin(7 * a) + 0.015 * math.cos(11 * a)
            px_pt = cr + cr * 0.94 * wobble * math.cos(a)
            py_pt = cr + cr * 0.94 * wobble * math.sin(a)
            pts.append((px_pt, py_pt))
        md.polygon(pts, fill=255)
        mask = mask.filter(ImageFilter.GaussianBlur(2.5))
        crop.putalpha(mask)

        # Resize for round poster center
        target_size = (720, 720)
        crop.thumbnail(target_size, Image.Resampling.LANCZOS)

        # Drop shadow behind cookie
        shadow = Image.new('RGBA', (crop.width + 120, crop.height + 120), (0, 0, 0, 0))
        sh_draw = ImageDraw.Draw(shadow)
        sh_draw.ellipse((40, 40, shadow.width - 40, shadow.height - 40), fill=(45, 15, 18, 120))
        shadow = shadow.filter(ImageFilter.GaussianBlur(32))

        # Composite cookie in the lower-middle zone
        cookie_x = CENTER - crop.width // 2
        cookie_y = CENTER - 40
        canvas.alpha_composite(shadow, (cookie_x - 60, cookie_y - 40))
        canvas.alpha_composite(crop, (cookie_x, cookie_y))

    # 5. Top Headline & Designer Typography
    d = ImageDraw.Draw(canvas)

    # Sub-header vintage flourish
    font_sub = get_font(FONT_SANS, 22)
    sub_text = "SWEET INDULGENCE  •  HANDCRAFTED"
    sub_bbox = font_sub.getbbox(sub_text)
    sub_w = sub_bbox[2] - sub_bbox[0]
    d.text((CENTER, 260), sub_text, font=font_sub, fill=WINE, anchor='mm')
    # Decorative lines with gold diamonds
    d.line((CENTER - sub_w//2 - 90, 260, CENTER - sub_w//2 - 20, 260), fill=GOLD, width=2)
    d.line((CENTER + sub_w//2 + 20, 260, CENTER + sub_w//2 + 90, 260), fill=GOLD, width=2)
    d.polygon([(CENTER - sub_w//2 - 15, 260), (CENTER - sub_w//2 - 10, 256),
               (CENTER - sub_w//2 - 5, 260), (CENTER - sub_w//2 - 10, 264)], fill=GOLD)
    d.polygon([(CENTER + sub_w//2 + 5, 260), (CENTER + sub_w//2 + 10, 256),
               (CENTER + sub_w//2 + 15, 260), (CENTER + sub_w//2 + 10, 264)], fill=GOLD)

    # Main romantic headline: "Forget the roses."
    font_title = get_font(FONT_SERIF_ITALIC, 82)
    d.text((CENTER, 350), "Forget the roses.", font=font_title, fill=WINE_DEEP, anchor='mm')

    # Luxury Gift Ribbon Pill: "GET A COOKIE."
    pill_w = 540
    pill_h = 92
    pill_x1 = CENTER - pill_w // 2
    pill_y1 = 415
    pill_x2 = CENTER + pill_w // 2
    pill_y2 = pill_y1 + pill_h

    # Soft 3D shadow for pill
    pill_shadow = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    ps_draw = ImageDraw.Draw(pill_shadow)
    ps_draw.rounded_rectangle((pill_x1, pill_y1 + 8, pill_x2, pill_y2 + 8),
                             radius=46, fill=(50, 10, 18, 90))
    pill_shadow = pill_shadow.filter(ImageFilter.GaussianBlur(14))
    canvas.alpha_composite(pill_shadow)

    # Redraw draw context
    d = ImageDraw.Draw(canvas)
    # Wine pill body
    d.rounded_rectangle((pill_x1, pill_y1, pill_x2, pill_y2),
                        radius=46, fill=WINE, outline=GOLD, width=4)
    # Inset gold wire
    d.rounded_rectangle((pill_x1 + 6, pill_y1 + 6, pill_x2 - 6, pill_y2 - 6),
                        radius=40, outline=GOLD_LIGHT, width=1)

    # Pill Text
    font_pill = get_font(FONT_ROUND, 54)
    d.text((CENTER, (pill_y1 + pill_y2)//2), "GET A COOKIE.",
           font=font_pill, fill=CREAM, anchor='mm')

    # Tagline under pill
    font_tag = get_font(FONT_SANS, 20)
    d.text((CENTER, 535), "CHUNKY CHOCOLATE CHIP  •  MELTY CENTER",
           font=font_tag, fill=CHOCOLATE, anchor='mm')

    # 6. Bottom Floating Stamp / Seal: "SHIMLA'S FINEST • 100% FRESH"
    badge_y = CENTER + 490
    badge_r = 75
    # Shadow for badge
    b_sh = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(b_sh)
    b_draw.ellipse((CENTER - badge_r, badge_y - badge_r + 6,
                    CENTER + badge_r, badge_y + badge_r + 6), fill=(40, 10, 15, 80))
    b_sh = b_sh.filter(ImageFilter.GaussianBlur(10))
    canvas.alpha_composite(b_sh)

    d = ImageDraw.Draw(canvas)
    # Badge plate
    d.ellipse((CENTER - badge_r, badge_y - badge_r,
               CENTER + badge_r, badge_y + badge_r),
              fill=CREAM, outline=GOLD, width=3)
    d.ellipse((CENTER - badge_r + 6, badge_y - badge_r + 6,
               CENTER + badge_r - 6, badge_y + badge_r - 6),
              outline=WINE, width=1.5)

    # Star in center of badge
    d.text((CENTER, badge_y - 28), "★ ★ ★", font=get_font(FONT_ROUND, 16), fill=GOLD, anchor='mm')
    d.text((CENTER, badge_y - 2), "FRESHLY", font=get_font(FONT_ROUND, 22), fill=WINE_DEEP, anchor='mm')
    d.text((CENTER, badge_y + 20), "BAKED", font=get_font(FONT_ROUND, 22), fill=WINE_DEEP, anchor='mm')
    d.text((CENTER, badge_y + 40), "ESTD. 2026", font=get_font(FONT_SANS, 12), fill=GOLD, anchor='mm')

    # Output file
    out_dir = Path('/Users/ajaynxt/Documents/lodo king')
    out_file = out_dir / 'round_cookie_poster.png'
    canvas.save(out_file, 'PNG', quality=95)
    print(f"✓ Created round cookie poster: {out_file}")

if __name__ == '__main__':
    create_poster()
