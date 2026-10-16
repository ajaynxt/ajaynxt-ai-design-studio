#!/usr/bin/env python3
"""
Create the authentic Melodi-inspired Luxury Tin Packaging for Diamond Bakery, Shimla.
Directly captures the aesthetic of the user's reference image (media_1792135862506_a007f3a5.jpg)
and the authentic brand heritage of Diamond Bakery (diamondrestaurants.com):
- Scalloped & beaded 24K gold foil outer lace rim
- Central beaded sunburst medallion with curved brand name, crest & SINCE 2002
- Asymmetrical luxury balanced curved typography (Assorted Butter Cookies / Pure Desi Ghee & Butter)
- Vintage "NO. 01" batch callout and Shimla Himalayan Heritage Seal
- ZERO palm oil, 100% Pure Veg, no cookie photos needed on the lid
"""
import math
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

SIZE = 3600
CENTER = SIZE // 2 # 1800
R_OUTER = 1720

FONT_SERIF = '/Users/ajaynxt/Documents/lodo king/test_fonts/Cormorant_Garamond_700.ttf'
if not os.path.exists(FONT_SERIF):
    FONT_SERIF = '/System/Library/Fonts/Supplemental/Georgia.ttf'

FONT_SCRIPT = '/Users/ajaynxt/Documents/lodo king/test_fonts/AlexBrush-Regular.ttf'
if not os.path.exists(FONT_SCRIPT):
    FONT_SCRIPT = '/System/Library/Fonts/Supplemental/Georgia Italic.ttf'

FONT_SANS = '/System/Library/Fonts/Avenir Next.ttc'

CREST_PATH = Path('diamond_crest_user.png')

def get_font(path: str, size: int):
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

def draw_arc_text(canvas, text, font, fill, center=(CENTER, CENTER), radius=1400, start_angle=0, end_angle=60, inward=True):
    """Draw text curved along an arc."""
    chars = list(text)
    n = len(chars)
    if n == 0:
        return
    total_angle = end_angle - start_angle
    for i, ch in enumerate(chars):
        if ch == ' ':
            continue
        frac = i / (n - 1) if n > 1 else 0.5
        angle_deg = start_angle + frac * total_angle
        angle_rad = math.radians(angle_deg)
        x = center[0] + radius * math.cos(angle_rad)
        y = center[1] + radius * math.sin(angle_rad)
        
        char_img = Image.new('RGBA', (300, 300), (0, 0, 0, 0))
        cd = ImageDraw.Draw(char_img)
        cd.text((150, 150), ch, font=font, fill=fill, anchor='mm')
        
        # rotation angle
        if inward:
            rot = -(angle_deg + 90)
        else:
            rot = -(angle_deg - 90)
            
        char_rot = char_img.rotate(rot, resample=Image.Resampling.BICUBIC)
        canvas.alpha_composite(char_rot, (int(x - 150), int(y - 150)))

def draw_scalloped_rim(draw, center, r_base, num_scallops=72, scallop_depth=28, gold_color=(235, 190, 80)):
    """Draw an authentic scalloped lace rim with pin-dots inside each scallop."""
    pts = []
    dot_pts = []
    step = 360.0 / num_scallops
    for i in range(num_scallops * 4):
        ang_deg = i * (step / 4.0)
        ang_rad = math.radians(ang_deg)
        # sinusoidal scallop wave
        wave = math.cos(math.radians(ang_deg * num_scallops))
        r = r_base - (wave + 1) * 0.5 * scallop_depth
        x = center[0] + r * math.cos(ang_rad)
        y = center[1] + r * math.sin(ang_rad)
        pts.append((x, y))
    
    # Draw scalloped loop
    draw.polygon(pts, outline=gold_color, width=8)
    
    # Draw pin-dots at each scallop crest
    for i in range(num_scallops):
        ang_deg = i * step
        ang_rad = math.radians(ang_deg)
        r_dot = r_base - scallop_depth * 0.5
        dx = center[0] + r_dot * math.cos(ang_rad)
        dy = center[1] + r_dot * math.sin(ang_rad)
        draw.ellipse((dx - 5, dy - 5, dx + 5, dy + 5), fill=gold_color)

def draw_beaded_ring(draw, center, radius, num_beads=60, bead_r=6, fill=(235, 190, 80)):
    """Draw circular beaded ring."""
    draw.ellipse((center[0] - radius, center[1] - radius, center[0] + radius, center[1] + radius), outline=fill, width=3)
    step = 360.0 / num_beads
    for i in range(num_beads):
        ang_rad = math.radians(i * step)
        bx = center[0] + radius * math.cos(ang_rad)
        by = center[1] + radius * math.sin(ang_rad)
        draw.ellipse((bx - bead_r, by - bead_r, bx + bead_r, by + bead_r), fill=fill)

def render_melodi_style(theme_name='maroon'):
    if theme_name == 'maroon':
        bg_solid = (145, 45, 40)      # Terracotta Wine Velvet #912D28
        bg_rim = (100, 25, 25)        # Darker rim #641919
        gold = (245, 205, 100)        # 24K Rich Gold
        gold_sub = (255, 230, 160)    # Soft Silk Gold
        dark_text = (50, 10, 12)      # Deep Espresso Wine
        accent_red = (230, 45, 50)    # Diamond Red
        file_name = 'diamond_cookies_melodi_maroon.png'
    else: # mint
        bg_solid = (195, 228, 205)    # Pastel Mint Green #C3E4CD
        bg_rim = (165, 210, 180)      # Soft sage rim #A5D2B4
        gold = (190, 145, 45)         # Warm Bronze Gold
        gold_sub = (30, 70, 50)       # Dark Emerald
        dark_text = (12, 45, 30)      # British Racing Emerald
        accent_red = (220, 40, 45)    # Diamond Red
        file_name = 'diamond_cookies_melodi_mint.png'

    canvas = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    bg = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    bg_draw = ImageDraw.Draw(bg)

    # Base circle background
    bg_draw.ellipse((CENTER - R_OUTER, CENTER - R_OUTER, CENTER + R_OUTER, CENTER + R_OUTER), fill=bg_solid)
    
    # Soft subtle vignette shading for velvet depth
    px = bg.load()
    for y in range(CENTER - R_OUTER, CENTER + R_OUTER):
        dy = (y - CENTER) / R_OUTER
        for x in range(CENTER - R_OUTER, CENTER + R_OUTER):
            dx = (x - CENTER) / R_OUTER
            d2 = dx*dx + dy*dy
            if d2 <= 1.0:
                t = math.sqrt(d2)
                r = int(bg_solid[0]*(1 - t*0.35) + bg_rim[0]*t*0.35)
                g = int(bg_solid[1]*(1 - t*0.35) + bg_rim[1]*t*0.35)
                b = int(bg_solid[2]*(1 - t*0.35) + bg_rim[2]*t*0.35)
                px[x, y] = (r, g, b, 255)

    canvas.alpha_composite(bg)
    draw = ImageDraw.Draw(canvas)

    # 1. OUTER RIM: Scalloped Lace with Gold Beads (Exact Melodi Match!)
    draw_scalloped_rim(draw, (CENTER, CENTER), r_base=1670, num_scallops=64, scallop_depth=36, gold_color=gold)
    
    # Outer hairline ring & beaded sub-ring
    draw.ellipse((CENTER - 1610, CENTER - 1610, CENTER + 1610, CENTER + 1610), outline=gold, width=4)
    draw_beaded_ring(draw, (CENTER, CENTER), radius=1560, num_beads=64, bead_r=5, fill=gold)
    draw.ellipse((CENTER - 1520, CENTER - 1520, CENTER + 1520, CENTER + 1520), outline=(gold[0], gold[1], gold[2], 140), width=2)

    # 2. CENTRAL MEDALLION: Sunburst Radial Florets & Beaded Frame
    R_MEDALLION = 700
    
    # Draw radial florets / rays around medallion (Melodi sunburst style)
    num_rays = 48
    step_ray = 360.0 / num_rays
    for i in range(num_rays):
        ang_rad = math.radians(i * step_ray)
        cos_a = math.cos(ang_rad)
        sin_a = math.sin(ang_rad)
        r1 = R_MEDALLION + 15
        r2 = R_MEDALLION + 65
        p1 = (CENTER + r1 * cos_a, CENTER + r1 * sin_a)
        p2 = (CENTER + r2 * cos_a, CENTER + r2 * sin_a)
        draw.line([p1, p2], fill=gold, width=3)
        # Dot at the tip of each ray
        draw.ellipse((p2[0] - 4, p2[1] - 4, p2[0] + 4, p2[1] + 4), fill=gold)

    # Double ring frame for Medallion
    draw.ellipse((CENTER - R_MEDALLION, CENTER - R_MEDALLION, CENTER + R_MEDALLION, CENTER + R_MEDALLION), outline=gold, width=6)
    draw.ellipse((CENTER - R_MEDALLION + 18, CENTER - R_MEDALLION + 18, CENTER + R_MEDALLION - 18, CENTER + R_MEDALLION - 18), outline=gold, width=2)

    # Inside Medallion: Soft illuminated center
    med_bg = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    mb_draw = ImageDraw.Draw(med_bg)
    mb_color = (bg_solid[0] + 15, bg_solid[1] + 8, bg_solid[2] + 8, 120) if theme_name == 'maroon' else (235, 250, 240, 140)
    mb_draw.ellipse((CENTER - R_MEDALLION + 20, CENTER - R_MEDALLION + 20, CENTER + R_MEDALLION - 20, CENTER + R_MEDALLION - 20), fill=mb_color)
    canvas.alpha_composite(med_bg)

    # 3. INSIDE MEDALLION TYPOGRAPHY:
    # A) Arched Brand Name: "D I A M O N D" following upper arch inside medallion
    font_med_brand = get_font(FONT_SERIF, 154)
    draw_arc_text(canvas, "D I A M O N D", font_med_brand, gold, center=(CENTER, CENTER), radius=480, start_angle=-145, end_angle=-35, inward=True)

    # B) "✦ SINCE 2002 ✦"
    font_year = get_font(FONT_SERIF, 68)
    draw.text((CENTER, CENTER - 240), "✦  SINCE 2002  ✦", font=font_year, fill=gold_sub, anchor='mm')

    # C) Diamond Crest Logo in Center
    if CREST_PATH.exists():
        crest_im = Image.open(CREST_PATH).convert('RGBA')
        cw = 620
        ch = int(crest_im.height * (cw / crest_im.width))
        c_res = crest_im.resize((cw, ch), Image.Resampling.LANCZOS)
        canvas.alpha_composite(c_res, (CENTER - cw//2, CENTER - ch//2 + 75))

    # D) "THE MALL • SHIMLA" & "BAKERY • RESTAURANT • SWEETS" under Crest inside Medallion
    font_shimla = get_font(FONT_SERIF, 52)
    draw.text((CENTER, CENTER + 420), "THE MALL  •  SHIMLA", font=font_shimla, fill=gold_sub, anchor='mm')
    
    font_conf = get_font(FONT_SANS, 34)
    draw.text((CENTER, CENTER + 485), "BAKERY  •  RESTAURANT  •  SWEETS", font=font_conf, fill=gold, anchor='mm')

    # 4. OUTER ASYMMETRICAL CURVED TYPOGRAPHY (Melodi Signature Layout):
    
    # A) Top Right Curve: "ASSORTED BUTTER COOKIES" (Placed cleanly from -68° to 16°, no collision!)
    font_product = get_font(FONT_SERIF, 108)
    draw_arc_text(canvas, "ASSORTED BUTTER COOKIES", font_product, dark_text if theme_name == 'mint' else gold, center=(CENTER, CENTER), radius=1240, start_angle=-68, end_angle=16, inward=True)

    # B) Bottom Left Curve: "PREPARED IN PURE BUTTER & DESI GHEE" (Placed from 162° to 78°)
    font_ghee = get_font(FONT_SERIF, 76)
    chars_ghee = list("PREPARED IN PURE BUTTER & DESI GHEE")
    n_ghee = len(chars_ghee)
    start_g = 162
    end_g = 78
    tot_g = end_g - start_g
    for i, ch in enumerate(chars_ghee):
        if ch == ' ':
            continue
        frac = i / (n_ghee - 1)
        ang_deg = start_g + frac * tot_g
        ang_rad = math.radians(ang_deg)
        x = CENTER + 1240 * math.cos(ang_rad)
        y = CENTER + 1240 * math.sin(ang_rad)
        
        char_img = Image.new('RGBA', (260, 260), (0, 0, 0, 0))
        cd = ImageDraw.Draw(char_img)
        cd.text((130, 130), ch, font=font_ghee, fill=dark_text if theme_name == 'mint' else gold, anchor='mm')
        rot = 90 - ang_deg
        char_rot = char_img.rotate(rot, resample=Image.Resampling.BICUBIC)
        canvas.alpha_composite(char_rot, (int(x - 130), int(y - 130)))

    # C) Top Left Angle (Melodi's "PRODUCED IN THE..."):
    font_small_arc = get_font(FONT_SANS, 34)
    draw_arc_text(canvas, "TRADITIONAL HIMALAYAN RECIPES", font_small_arc, gold_sub, center=(CENTER, CENTER), radius=1240, start_angle=-155, end_angle=-105, inward=True)
    
    font_mini = get_font(FONT_SERIF, 38)
    draw.text((CENTER - 880, CENTER - 650), "100% PURE VEG", font=font_mini, fill=gold if theme_name == 'maroon' else dark_text, anchor='mm')
    draw.text((CENTER - 880, CENTER - 600), "ZERO PALM OIL", font=font_mini, fill=gold_sub if theme_name == 'maroon' else dark_text, anchor='mm')
    draw.text((CENTER - 880, CENTER - 550), "NO PRESERVATIVES", font=font_mini, fill=gold_sub if theme_name == 'maroon' else dark_text, anchor='mm')

    # D) Center Left Vintage Callout (Melodi's "NO. 02"):
    font_no_label = get_font(FONT_SERIF, 44)
    font_no_num = get_font(FONT_SERIF, 100)
    
    badge_img = Image.new('RGBA', (400, 300), (0, 0, 0, 0))
    bd = ImageDraw.Draw(badge_img)
    bd.text((130, 80), "NO.", font=font_no_label, fill=gold if theme_name == 'maroon' else dark_text, anchor='mm')
    bd.text((230, 110), "01", font=font_no_num, fill=gold if theme_name == 'maroon' else dark_text, anchor='mm')
    bd.line([(80, 160), (320, 160)], fill=gold, width=3)
    bd.text((200, 195), "ARTISAN BATCH", font=get_font(FONT_SANS, 26), fill=gold_sub if theme_name == 'maroon' else dark_text, anchor='mm')
    
    badge_rot = badge_img.rotate(24, resample=Image.Resampling.BICUBIC)
    canvas.alpha_composite(badge_rot, (CENTER - 1420, CENTER - 220))

    # E) Bottom Right Royal Wax Stamp / Seal (Melodi's round stamp - positioned at angle 44°):
    seal_cx = CENTER + 820
    seal_cy = CENTER + 750
    seal_r = 195
    
    draw.ellipse((seal_cx - seal_r, seal_cy - seal_r, seal_cx + seal_r, seal_cy + seal_r), outline=gold, width=5)
    draw.ellipse((seal_cx - seal_r + 14, seal_cy - seal_r + 14, seal_cx + seal_r - 14, seal_cy + seal_r - 14), outline=gold, width=2)
    draw_beaded_ring(draw, (seal_cx, seal_cy), radius=seal_r - 25, num_beads=24, bead_r=3, fill=gold)
    
    # Curved text inside seal (reading right way up)
    font_seal_curved = get_font(FONT_SERIF, 26)
    draw_arc_text(canvas, "DIAMOND BAKERY • SHIMLA", font_seal_curved, gold if theme_name == 'maroon' else dark_text, center=(seal_cx, seal_cy), radius=seal_r - 48, start_angle=-135, end_angle=135, inward=True)
    
    font_seal_center = get_font(FONT_SERIF, 42)
    draw.text((seal_cx, seal_cy - 12), "SPECIAL", font=font_seal_center, fill=gold if theme_name == 'maroon' else dark_text, anchor='mm')
    draw.text((seal_cx, seal_cy + 30), "TASTE", font=font_seal_center, fill=gold if theme_name == 'maroon' else dark_text, anchor='mm')
    draw.text((seal_cx, seal_cy + 70), "★ ★ ★", font=get_font(FONT_SERIF, 22), fill=gold_sub if theme_name == 'maroon' else gold, anchor='mm')

    # F) Bottom Center Plaque: FSSAI Pure Veg & Net Wt
    plaque_y = CENTER + 1420
    
    # Veg icon
    draw.rectangle((CENTER - 260 - 24, plaque_y - 24, CENTER - 260 + 24, plaque_y + 24), outline=(34, 197, 94), width=4, fill=(255, 255, 255))
    draw.ellipse((CENTER - 260 - 12, plaque_y - 12, CENTER - 260 + 12, plaque_y + 12), fill=(34, 197, 94))
    
    # Net Wt
    font_wt = get_font(FONT_SERIF, 56)
    draw.text((CENTER, plaque_y), "NET WEIGHT  500g ℮", font=font_wt, fill=gold if theme_name == 'maroon' else dark_text, anchor='mm')
    
    # Gold 4-point star on right
    sx = CENTER + 260
    draw.polygon([(sx, plaque_y - 18), (sx + 5, plaque_y - 5), (sx + 18, plaque_y), (sx + 5, plaque_y + 5), (sx, plaque_y + 18), (sx - 5, plaque_y + 5), (sx - 18, plaque_y), (sx - 5, plaque_y - 5)], fill=gold)


    # Save Ultra HD 600 DPI & Preview
    out_path = Path(file_name)
    canvas.save(out_path, 'PNG', quality=100, dpi=(600, 600))
    print(f"Saved 600 DPI master: {out_path} ({out_path.stat().st_size / (1024*1024):.2f} MB)")
    
    prev = canvas.resize((1000, 1000), Image.Resampling.LANCZOS)
    prev_path = file_name.replace('.png', '_preview.png')
    prev.save(prev_path)
    print(f"Saved preview: {prev_path}")

if __name__ == '__main__':
    render_melodi_style('maroon')
    render_melodi_style('mint')
