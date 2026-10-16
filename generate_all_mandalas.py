#!/usr/bin/env python3
"""
Generate a rich collection of 16+ intricate vector mandalas for Diamond Cookie Tin Packaging.
Each mandala is mathematically centered at (0, 0) with 360-degree radial symmetry,
using the gold foil gradient `url(#foilGoldGrad)` and fine hairlines.
"""
import math

def rot_group(angle_deg, content):
    return f'<g transform="rotate({angle_deg:.2f})">\n{content}\n</g>'

def generate_chakra():
    svg = ['<!-- Royal Solar Chakra -->']
    svg.append('<circle cx="0" cy="0" r="40" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
    svg.append('<circle cx="0" cy="0" r="20" fill="url(#foilGoldGrad)"/>')
    svg.append('<circle cx="0" cy="0" r="85" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1.8"/>')
    svg.append('<circle cx="0" cy="0" r="92" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1" stroke-dasharray="2 3"/>')
    # 24 spokes
    for i in range(24):
        ang = i * (360 / 24)
        c = '  <line x1="0" y1="40" x2="0" y2="85" stroke="url(#foilGoldGrad)" stroke-width="1.5"/>\n'
        c += '  <circle cx="0" cy="85" r="2.5" fill="url(#foilGoldGrad)"/>'
        svg.append(rot_group(ang, c))
    # Outer ring with teardrop rays (12 rays)
    svg.append('<circle cx="0" cy="0" r="190" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.2"/>')
    svg.append('<circle cx="0" cy="0" r="202" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1.2" stroke-dasharray="3 4"/>')
    for i in range(16):
        ang = i * (360 / 16)
        c = '  <path d="M 0,92 C -18,130 -22,175 0,190 C 22,175 18,130 0,92 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1.8"/>\n'
        c += '  <circle cx="0" cy="155" r="3.5" fill="url(#foilGoldGrad)"/>'
        svg.append(rot_group(ang, c))
    # Big outer lotus petals (16 petals)
    svg.append('<circle cx="0" cy="0" r="340" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
    for i in range(16):
        ang = i * (360 / 16) + 11.25
        c = '  <path d="M 0,202 C -38,250 -44,310 0,340 C 44,310 38,250 0,202 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.2"/>\n'
        c += '  <line x1="0" y1="215" x2="0" y2="310" stroke="url(#foilGoldGrad)" stroke-width="1.2"/>\n'
        c += '  <circle cx="-16" cy="275" r="3" fill="url(#foilGoldGrad)"/>\n'
        c += '  <circle cx="16" cy="275" r="3" fill="url(#foilGoldGrad)"/>\n'
        c += '  <circle cx="0" cy="305" r="4.5" fill="url(#foilGoldGrad)"/>'
        svg.append(rot_group(ang, c))
    # Scalloped outer perimeter border (32 arches)
    svg.append('<circle cx="0" cy="0" r="470" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>')
    svg.append('<circle cx="0" cy="0" r="482" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1" stroke-dasharray="4 4"/>')
    for i in range(32):
        ang = i * (360 / 32)
        c = '  <path d="M -23,340 Q 0,405 0,470 Q 0,405 23,340" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1.4"/>\n'
        c += '  <circle cx="0" cy="445" r="2.8" fill="url(#foilGoldGrad)"/>'
        svg.append(rot_group(ang, c))
    return '\n'.join(svg)

def generate_moroccan():
    svg = ['<!-- Moroccan Geometric Star Lattice -->']
    svg.append('<circle cx="0" cy="0" r="35" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
    # 8-star core
    for ang in [0, 45]:
        svg.append(f'<rect x="-25" y="-25" width="50" height="50" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2" transform="rotate({ang})"/>')
    # Ring 1 (8 petals with diamond heads)
    for i in range(8):
        ang = i * 45
        c = '  <polygon points="0,35 -18,70 0,110 18,70" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>\n'
        c += '  <circle cx="0" cy="70" r="4" fill="url(#foilGoldGrad)"/>'
        svg.append(rot_group(ang, c))
    svg.append('<circle cx="0" cy="0" r="115" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>')
    svg.append('<circle cx="0" cy="0" r="124" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1" stroke-dasharray="2 2"/>')
    # Interlocking 16-star ring
    for i in range(16):
        ang = i * 22.5
        c = '  <polygon points="0,124 -24,180 0,235 24,180" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>\n'
        c += '  <line x1="0" y1="135" x2="0" y2="220" stroke="url(#foilGoldGrad)" stroke-width="1.2"/>\n'
        c += '  <circle cx="0" cy="180" r="3.5" fill="url(#foilGoldGrad)"/>'
        svg.append(rot_group(ang, c))
    svg.append('<circle cx="0" cy="0" r="240" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.2"/>')
    # Outer Moroccan Alhambra Arch Vaults (16 arches)
    for i in range(16):
        ang = i * 22.5 + 11.25
        c = '  <path d="M -47,240 C -35,310 -15,350 0,380 C 15,350 35,310 47,240 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.2"/>\n'
        c += '  <circle cx="0" cy="330" r="5" fill="url(#foilGoldGrad)"/>\n'
        c += '  <circle cx="-18" cy="295" r="3" fill="url(#foilGoldGrad)"/>\n'
        c += '  <circle cx="18" cy="295" r="3" fill="url(#foilGoldGrad)"/>'
        svg.append(rot_group(ang, c))
    svg.append('<circle cx="0" cy="0" r="385" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
    # Outer radiating star finials (32 finials)
    for i in range(32):
        ang = i * 11.25
        c = '  <line x1="0" y1="385" x2="0" y2="475" stroke="url(#foilGoldGrad)" stroke-width="1.5"/>\n'
        c += '  <polygon points="0,485 -6,475 0,465 6,475" fill="url(#foilGoldGrad)"/>'
        svg.append(rot_group(ang, c))
    svg.append('<circle cx="0" cy="0" r="490" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>')
    return '\n'.join(svg)

def generate_paisley():
    svg = ['<!-- Royal Kalka Paisley Mandala -->']
    svg.append('<circle cx="0" cy="0" r="30" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
    svg.append('<circle cx="0" cy="0" r="16" fill="url(#foilGoldGrad)"/>')
    # Inner rosette (8 petals)
    for i in range(8):
        ang = i * 45
        c = '  <path d="M 0,30 C -12,50 -12,75 0,95 C 12,75 12,50 0,30 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>'
        svg.append(rot_group(ang, c))
    svg.append('<circle cx="0" cy="0" r="100" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>')
    # Paisley ring (12 swirling paisleys)
    for i in range(12):
        ang = i * 30
        c = '  <path d="M 0,100 C -25,130 -30,170 -10,210 C 10,240 40,210 25,170 C 15,140 10,120 0,100 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.2"/>\n'
        c += '  <circle cx="8" cy="180" r="5" fill="url(#foilGoldGrad)"/>\n'
        c += '  <circle cx="0" cy="140" r="3" fill="url(#foilGoldGrad)"/>'
        svg.append(rot_group(ang, c))
    svg.append('<circle cx="0" cy="0" r="230" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.2"/>')
    svg.append('<circle cx="0" cy="0" r="240" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1" stroke-dasharray="3 3"/>')
    # Outer Grand Paisley Crowns (16 heads)
    for i in range(16):
        ang = i * 22.5
        c = '  <path d="M 0,240 C -35,280 -40,340 -12,385 C 15,420 48,375 28,320 C 18,290 12,260 0,240 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.4"/>\n'
        c += '  <line x1="0" y1="250" x2="10" y2="340" stroke="url(#foilGoldGrad)" stroke-width="1.2"/>\n'
        c += '  <circle cx="10" cy="340" r="6" fill="url(#foilGoldGrad)"/>\n'
        c += '  <circle cx="-10" cy="310" r="4" fill="url(#foilGoldGrad)"/>'
        svg.append(rot_group(ang, c))
    svg.append('<circle cx="0" cy="0" r="410" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
    svg.append('<circle cx="0" cy="0" r="475" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>')
    svg.append('<circle cx="0" cy="0" r="485" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1" stroke-dasharray="4 4"/>')
    # Outer pearl ring
    for i in range(48):
        ang = i * (360 / 48)
        c = '  <circle cx="0" cy="445" r="3.2" fill="url(#foilGoldGrad)"/>'
        svg.append(rot_group(ang, c))
    return '\n'.join(svg)

def generate_diamond_gem():
    svg = ['<!-- Faceted Diamond Gem Lattice (Brand Match) -->']
    svg.append('<circle cx="0" cy="0" r="25" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
    svg.append('<circle cx="0" cy="0" r="12" fill="url(#foilGoldGrad)"/>')
    # Inner 8-facet diamond stars
    for i in range(8):
        ang = i * 45
        c = '  <polygon points="0,25 -14,65 0,105 14,65" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>\n'
        c += '  <line x1="0" y1="30" x2="0" y2="100" stroke="url(#foilGoldGrad)" stroke-width="1.2"/>'
        svg.append(rot_group(ang, c))
    svg.append('<circle cx="0" cy="0" r="110" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>')
    # Middle Diamond Facets (16 facets)
    for i in range(16):
        ang = i * 22.5
        c = '  <polygon points="0,110 -22,175 0,240 22,175" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.2"/>\n'
        c += '  <polygon points="0,135 -12,175 0,215 12,175" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1.2"/>\n'
        c += '  <circle cx="0" cy="175" r="4" fill="url(#foilGoldGrad)"/>'
        svg.append(rot_group(ang, c))
    svg.append('<circle cx="0" cy="0" r="245" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
    svg.append('<circle cx="0" cy="0" r="255" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1" stroke-dasharray="3 3"/>')
    # Grand Radiant Diamond Spires (16 giant spires)
    for i in range(16):
        ang = i * 22.5 + 11.25
        c = '  <polygon points="0,255 -36,360 0,465 36,360" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.4"/>\n'
        c += '  <polygon points="0,285 -20,360 0,435 20,360" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1.4"/>\n'
        c += '  <circle cx="0" cy="360" r="6" fill="url(#foilGoldGrad)"/>\n'
        c += '  <circle cx="0" cy="465" r="4.5" fill="url(#foilGoldGrad)"/>'
        svg.append(rot_group(ang, c))
    svg.append('<circle cx="0" cy="0" r="485" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>')
    return '\n'.join(svg)

def generate_sunburst_luxe():
    svg = ['<!-- Ultra-Dense Radiant Sunburst (48 Rays) -->']
    svg.append('<circle cx="0" cy="0" r="45" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
    svg.append('<circle cx="0" cy="0" r="25" fill="url(#foilGoldGrad)"/>')
    # 24 core rays
    for i in range(24):
        ang = i * 15
        c = '  <line x1="0" y1="45" x2="0" y2="120" stroke="url(#foilGoldGrad)" stroke-width="1.8"/>\n'
        c += '  <circle cx="0" cy="120" r="2.5" fill="url(#foilGoldGrad)"/>'
        svg.append(rot_group(ang, c))
    svg.append('<circle cx="0" cy="0" r="125" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>')
    # 36 middle rays with alternating diamonds
    for i in range(36):
        ang = i * 10
        h = 240 if i % 2 == 0 else 210
        c = f'  <line x1="0" y1="125" x2="0" y2="{h}" stroke="url(#foilGoldGrad)" stroke-width="1.6"/>\n'
        c += f'  <polygon points="0,{h+10} -4,{h} 0,{h-10} 4,{h}" fill="url(#foilGoldGrad)"/>'
        svg.append(rot_group(ang, c))
    svg.append('<circle cx="0" cy="0" r="260" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.2"/>')
    svg.append('<circle cx="0" cy="0" r="270" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1" stroke-dasharray="2 3"/>')
    # 48 outer grand sun rays
    for i in range(48):
        ang = i * 7.5
        h = 475 if i % 2 == 0 else 430
        c = f'  <line x1="0" y1="270" x2="0" y2="{h}" stroke="url(#foilGoldGrad)" stroke-width="1.5"/>\n'
        c += f'  <circle cx="0" cy="{h}" r="3" fill="url(#foilGoldGrad)"/>'
        svg.append(rot_group(ang, c))
    svg.append('<circle cx="0" cy="0" r="485" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
    return '\n'.join(svg)

def generate_jaipur_royal():
    svg = ['<!-- Jaipur Hawa Mahal Scalloped Arch Rosette -->']
    svg.append('<circle cx="0" cy="0" r="32" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
    svg.append('<circle cx="0" cy="0" r="18" fill="url(#foilGoldGrad)"/>')
    # 8 scalloped arches
    for i in range(8):
        ang = i * 45
        c = '  <path d="M -15,32 C -20,60 -15,85 0,105 C 15,85 20,60 15,32 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>\n'
        c += '  <circle cx="0" cy="80" r="3.5" fill="url(#foilGoldGrad)"/>'
        svg.append(rot_group(ang, c))
    svg.append('<circle cx="0" cy="0" r="110" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>')
    # 12 jharokha arches
    for i in range(12):
        ang = i * 30
        c = '  <path d="M -28,110 C -35,160 -25,210 0,240 C 25,210 35,160 28,110 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.2"/>\n'
        c += '  <path d="M -16,130 C -22,170 -15,200 0,220 C 15,200 22,170 16,130 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1.2"/>\n'
        c += '  <circle cx="0" cy="180" r="4.5" fill="url(#foilGoldGrad)"/>'
        svg.append(rot_group(ang, c))
    svg.append('<circle cx="0" cy="0" r="248" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.2"/>')
    # 16 grand palace domes
    for i in range(16):
        ang = i * 22.5
        c = '  <path d="M -40,248 C -50,330 -30,400 0,450 C 30,400 50,330 40,248 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>\n'
        c += '  <circle cx="0" cy="380" r="5.5" fill="url(#foilGoldGrad)"/>\n'
        c += '  <circle cx="-18" cy="340" r="3.5" fill="url(#foilGoldGrad)"/>\n'
        c += '  <circle cx="18" cy="340" r="3.5" fill="url(#foilGoldGrad)"/>\n'
        c += '  <circle cx="0" cy="450" r="4" fill="url(#foilGoldGrad)"/>'
        svg.append(rot_group(ang, c))
    svg.append('<circle cx="0" cy="0" r="460" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1.8"/>')
    svg.append('<circle cx="0" cy="0" r="485" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
    return '\n'.join(svg)

def generate_rose_window():
    svg = ['<!-- Gothic Rose Window Medallion -->']
    svg.append('<circle cx="0" cy="0" r="36" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
    # 12-lobed core rosette
    for i in range(12):
        ang = i * 30
        c = '  <circle cx="0" cy="40" r="16" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1.8"/>'
        svg.append(rot_group(ang, c))
    svg.append('<circle cx="0" cy="0" r="65" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>')
    svg.append('<circle cx="0" cy="0" r="130" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>')
    # 12 foil circles ring
    for i in range(12):
        ang = i * 30
        c = '  <circle cx="0" cy="98" r="28" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>\n'
        c += '  <circle cx="0" cy="98" r="8" fill="url(#foilGoldGrad)"/>'
        svg.append(rot_group(ang, c))
    svg.append('<circle cx="0" cy="0" r="138" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1" stroke-dasharray="3 3"/>')
    # 24 trefoil Gothic arches
    for i in range(24):
        ang = i * 15
        c = '  <path d="M -16,138 C -24,200 -12,250 0,280 C 12,250 24,200 16,138 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>\n'
        c += '  <circle cx="0" cy="245" r="4" fill="url(#foilGoldGrad)"/>'
        svg.append(rot_group(ang, c))
    svg.append('<circle cx="0" cy="0" r="285" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.2"/>')
    # 24 grand outer tracery lancets
    for i in range(24):
        ang = i * 15 + 7.5
        c = '  <path d="M -30,285 C -40,360 -20,425 0,470 C 20,425 40,360 30,285 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.4"/>\n'
        c += '  <circle cx="0" cy="410" r="5" fill="url(#foilGoldGrad)"/>\n'
        c += '  <circle cx="-14" cy="370" r="3" fill="url(#foilGoldGrad)"/>\n'
        c += '  <circle cx="14" cy="370" r="3" fill="url(#foilGoldGrad)"/>'
        svg.append(rot_group(ang, c))
    svg.append('<circle cx="0" cy="0" r="485" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
    return '\n'.join(svg)

def generate_filigree():
    svg = ['<!-- French Boutique Filigree Lace -->']
    svg.append('<circle cx="0" cy="0" r="26" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
    svg.append('<circle cx="0" cy="0" r="14" fill="url(#foilGoldGrad)"/>')
    for i in range(8):
        ang = i * 45
        c = '  <path d="M 0,26 C -20,55 -25,90 0,115 C 25,90 20,55 0,26 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>\n'
        c += '  <path d="M -8,55 Q 0,85 8,55" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1.2"/>\n'
        c += '  <circle cx="0" cy="95" r="3.5" fill="url(#foilGoldGrad)"/>'
        svg.append(rot_group(ang, c))
    svg.append('<circle cx="0" cy="0" r="120" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>')
    for i in range(16):
        ang = i * 22.5
        c = '  <path d="M 0,120 C -30,170 -35,225 0,260 C 35,225 30,170 0,120 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.2"/>\n'
        c += '  <circle cx="0" cy="205" r="4" fill="url(#foilGoldGrad)"/>\n'
        c += '  <circle cx="-14" cy="180" r="2.5" fill="url(#foilGoldGrad)"/>\n'
        c += '  <circle cx="14" cy="180" r="2.5" fill="url(#foilGoldGrad)"/>'
        svg.append(rot_group(ang, c))
    svg.append('<circle cx="0" cy="0" r="268" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.2"/>')
    for i in range(16):
        ang = i * 22.5 + 11.25
        c = '  <path d="M 0,268 C -45,340 -50,410 0,465 C 50,410 45,340 0,268 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>\n'
        c += '  <circle cx="0" cy="385" r="5" fill="url(#foilGoldGrad)"/>\n'
        c += '  <circle cx="-20" cy="345" r="3.5" fill="url(#foilGoldGrad)"/>\n'
        c += '  <circle cx="20" cy="345" r="3.5" fill="url(#foilGoldGrad)"/>'
        svg.append(rot_group(ang, c))
    svg.append('<circle cx="0" cy="0" r="475" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>')
    svg.append('<circle cx="0" cy="0" r="485" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1" stroke-dasharray="3 3"/>')
    return '\n'.join(svg)

print("Generator functions ready.")
