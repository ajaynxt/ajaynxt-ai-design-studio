#!/usr/bin/env python3
"""
Generate ultra-intricate, luxury, designer-grade vector Mandalas in pure SVG.
"""
import math

def polar_to_cart(cx, cy, r, deg):
    rad = math.radians(deg)
    return cx + r * math.cos(rad), cy + r * math.sin(rad)

def make_royal_taj():
    """Ultra-detailed Mughal/Rajputana royal palace jewel mandala"""
    parts = []
    # Layer 0: Core Star & Petals
    parts.append('<circle cx="0" cy="0" r="28" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
    parts.append('<circle cx="0" cy="0" r="14" fill="url(#foilGoldGrad)"/>')
    for i in range(8):
        a = i * 45
        parts.append(f'<g transform="rotate({a})">')
        parts.append('  <path d="M 0,28 C -12,50 -14,80 0,105 C 14,80 12,50 0,28 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>')
        parts.append('  <line x1="0" y1="35" x2="0" y2="90" stroke="url(#foilGoldGrad)" stroke-width="1.2"/>')
        parts.append('  <circle cx="0" cy="75" r="3" fill="url(#foilGoldGrad)"/>')
        parts.append('</g>')

    # Ring 1
    parts.append('<circle cx="0" cy="0" r="110" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>')
    parts.append('<circle cx="0" cy="0" r="118" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1" stroke-dasharray="3 3"/>')

    # Layer 1: 16 Arch Petals with inner jaali
    for i in range(16):
        a = i * 22.5
        parts.append(f'<g transform="rotate({a})">')
        parts.append('  <path d="M 0,118 C -24,155 -28,210 0,245 C 28,210 24,155 0,118 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.2"/>')
        parts.append('  <path d="M 0,135 C -14,165 -16,200 0,225 C 16,200 14,165 0,135 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1.2"/>')
        parts.append('  <circle cx="0" cy="205" r="4.5" fill="url(#foilGoldGrad)"/>')
        parts.append('  <circle cx="-12" cy="180" r="2.5" fill="url(#foilGoldGrad)"/>')
        parts.append('  <circle cx="12" cy="180" r="2.5" fill="url(#foilGoldGrad)"/>')
        parts.append('</g>')

    # Ring 2: Scalloped Interlock
    parts.append('<circle cx="0" cy="0" r="255" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
    for i in range(32):
        a = i * 360 / 32
        rad = math.radians(a)
        parts.append(f'<circle cx="{255*math.cos(rad)}" cy="{255*math.sin(rad)}" r="3" fill="url(#foilGoldGrad)"/>')

    # Layer 2: 32 Filigree Lotus Spears
    for i in range(32):
        a = i * 360 / 32
        parts.append(f'<g transform="rotate({a})">')
        parts.append('  <path d="M 0,260 C -18,300 -22,350 0,385 C 22,350 18,300 0,260 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>')
        parts.append('  <path d="M -8,285 C -15,320 0,355 0,375" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1.2"/>')
        parts.append('  <path d="M 8,285 C 15,320 0,355 0,375" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1.2"/>')
        parts.append('  <circle cx="0" cy="396" r="3.5" fill="url(#foilGoldGrad)"/>')
        parts.append('</g>')

    # Ring 3: Concentric Diamond Mesh
    parts.append('<circle cx="0" cy="0" r="405" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>')
    parts.append('<circle cx="0" cy="0" r="415" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1" stroke-dasharray="4 4"/>')

    # Layer 3: Grand 16 Ornate Crown Arches with teardrop drops
    for i in range(16):
        a = i * 22.5 + 11.25
        parts.append(f'<g transform="rotate({a})">')
        # Outer Grand Arch
        parts.append('  <path d="M -35,415 C -65,465 -75,530 0,580 C 75,530 65,465 35,415" fill="none" stroke="url(#foilGoldGrad)" stroke-width="3"/>')
        # Inner Heart Motif
        parts.append('  <path d="M 0,430 C -35,475 -40,515 0,555 C 40,515 35,475 0,430 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1.8"/>')
        # Teardrop Jewel Peak
        parts.append('  <circle cx="0" cy="595" r="7" fill="url(#foilGoldGrad)"/>')
        parts.append('  <circle cx="-25" cy="565" r="4.5" fill="url(#foilGoldGrad)"/>')
        parts.append('  <circle cx="25" cy="565" r="4.5" fill="url(#foilGoldGrad)"/>')
        # Hanging Pearl
        parts.append('  <circle cx="0" cy="510" r="6" fill="url(#foilGoldGrad)"/>')
        parts.append('</g>')

    # Outer Boundary Frame
    parts.append('<circle cx="0" cy="0" r="605" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
    return '\n'.join(parts)

def make_sacred_bloom():
    """Intricate radiating floral chrysanthemum mandala"""
    parts = []
    parts.append('<circle cx="0" cy="0" r="36" fill="none" stroke="url(#foilGoldGrad)" stroke-width="3"/>')
    for i in range(12):
        a = i * 30
        parts.append(f'<g transform="rotate({a})">')
        parts.append('  <path d="M 0,36 C -15,70 -15,110 0,135 C 15,110 15,70 0,36 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>')
        parts.append('  <circle cx="0" cy="142" r="3" fill="url(#foilGoldGrad)"/>')
        parts.append('</g>')

    parts.append('<circle cx="0" cy="0" r="148" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>')
    
    # 24 swirling tendril leaves
    for i in range(24):
        a = i * 15
        parts.append(f'<g transform="rotate({a})">')
        parts.append('  <path d="M 0,148 C -25,200 -30,260 0,310 C 30,260 25,200 0,148 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.2"/>')
        parts.append('  <path d="M -6,170 C -18,220 0,270 0,295" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1.2"/>')
        parts.append('  <path d="M 6,170 C 18,220 0,270 0,295" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1.2"/>')
        parts.append('  <circle cx="0" cy="320" r="4.5" fill="url(#foilGoldGrad)"/>')
        parts.append('</g>')

    parts.append('<circle cx="0" cy="0" r="332" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
    parts.append('<circle cx="0" cy="0" r="342" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1" stroke-dasharray="4 4"/>')

    # 24 outer grand bloom petals
    for i in range(24):
        a = i * 15 + 7.5
        parts.append(f'<g transform="rotate({a})">')
        parts.append('  <path d="M 0,342 C -40,410 -45,500 0,565 C 45,500 40,410 0,342 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.8"/>')
        parts.append('  <path d="M 0,370 C -22,430 -25,490 0,535 C 25,490 22,430 0,370 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1.5"/>')
        parts.append('  <circle cx="0" cy="578" r="6" fill="url(#foilGoldGrad)"/>')
        parts.append('  <circle cx="-16" cy="550" r="3.5" fill="url(#foilGoldGrad)"/>')
        parts.append('  <circle cx="16" cy="550" r="3.5" fill="url(#foilGoldGrad)"/>')
        parts.append('</g>')

    parts.append('<circle cx="0" cy="0" r="590" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
    return '\n'.join(parts)

taj = make_royal_taj()
bloom = make_sacred_bloom()

# Read existing mandalas_library.js and add the new ones
with open('mandalas_library.js', 'w') as f:
    f.write('window.MANDALAS = {\n')
    f.write('  taj: `' + taj + '`,\n')
    f.write('  bloom: `' + bloom + '`\n')
    f.write('};\n')

print("Mandalas library successfully upgraded with Taj and Bloom!")
