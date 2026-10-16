#!/usr/bin/env python3
"""
Generate vector SVG path definitions for 4 additional luxury mandalas:
1. Sacred Royal Lotus
2. Victorian Baroque Lace
3. Celestial Starburst
4. Royal Paisley Rosette
"""
import math

def generate_lotus():
    """16-fold radial lotus mandala"""
    parts = []
    # Center circle
    parts.append('<circle cx="0" cy="0" r="32" fill="none" stroke="url(#foilGoldGrad)" stroke-width="3"/>')
    parts.append('<circle cx="0" cy="0" r="16" fill="url(#foilGoldGrad)"/>')
    
    # 16 inner petals
    for i in range(16):
        a = i * 360 / 16
        rad = math.radians(a)
        parts.append(f'<g transform="rotate({a})">')
        parts.append('  <path d="M 0,32 C -18,65 -22,105 0,140 C 22,105 18,65 0,32 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
        parts.append('  <line x1="0" y1="40" x2="0" y2="120" stroke="url(#foilGoldGrad)" stroke-width="1.5"/>')
        parts.append('  <circle cx="0" cy="110" r="4" fill="url(#foilGoldGrad)"/>')
        parts.append('</g>')

    # Ring 1
    parts.append('<circle cx="0" cy="0" r="145" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>')
    parts.append('<circle cx="0" cy="0" r="155" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1" stroke-dasharray="4 4"/>')

    # 16 middle grand lotus petals
    for i in range(16):
        a = i * 360 / 16 + 11.25
        parts.append(f'<g transform="rotate({a})">')
        parts.append('  <path d="M 0,155 C -35,210 -45,290 0,350 C 45,290 35,210 0,155 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="3"/>')
        parts.append('  <path d="M 0,180 C -20,225 -25,280 0,325 C 25,280 20,225 0,180 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1.5"/>')
        parts.append('  <circle cx="0" cy="300" r="6" fill="url(#foilGoldGrad)"/>')
        parts.append('  <circle cx="0" cy="358" r="4" fill="url(#foilGoldGrad)"/>')
        parts.append('</g>')

    # Ring 2
    parts.append('<circle cx="0" cy="0" r="365" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')

    # 16 outer ornate crown petals
    for i in range(16):
        a = i * 360 / 16
        parts.append(f'<g transform="rotate({a})">')
        parts.append('  <path d="M 0,365 C -55,420 -60,500 0,550 C 60,500 55,420 0,365 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="3.5"/>')
        parts.append('  <path d="M -25,410 C -45,460 -15,505 0,530 C 15,505 45,460 25,410" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1.8"/>')
        parts.append('  <circle cx="0" cy="562" r="7" fill="url(#foilGoldGrad)"/>')
        parts.append('  <circle cx="-18" cy="542" r="4" fill="url(#foilGoldGrad)"/>')
        parts.append('  <circle cx="18" cy="542" r="4" fill="url(#foilGoldGrad)"/>')
        parts.append('</g>')

    return '\n'.join(parts)

def generate_starburst():
    """24-point celestial starburst geometric mandala"""
    parts = []
    # Center
    parts.append('<circle cx="0" cy="0" r="45" fill="none" stroke="url(#foilGoldGrad)" stroke-width="3.5"/>')
    parts.append('<polygon points="0,-40 28,-28 40,0 28,28 0,40 -28,28 -40,0 -28,-28" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>')
    
    # 24 star rays
    for i in range(24):
        a = i * 360 / 24
        parts.append(f'<g transform="rotate({a})">')
        parts.append('  <polygon points="0,48 -14,140 0,220 14,140" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>')
        parts.append('  <line x1="0" y1="140" x2="0" y2="210" stroke="url(#foilGoldGrad)" stroke-width="1.5"/>')
        parts.append('  <circle cx="0" cy="180" r="3.5" fill="url(#foilGoldGrad)"/>')
        parts.append('</g>')

    parts.append('<circle cx="0" cy="0" r="230" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
    parts.append('<circle cx="0" cy="0" r="240" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1" stroke-dasharray="5 5"/>')

    for i in range(24):
        a = i * 360 / 24 + 7.5
        parts.append(f'<g transform="rotate({a})">')
        parts.append('  <polygon points="0,245 -28,360 0,480 28,360" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
        parts.append('  <polygon points="0,280 -16,360 0,440 16,360" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1.5"/>')
        parts.append('  <circle cx="0" cy="495" r="6" fill="url(#foilGoldGrad)"/>')
        parts.append('</g>')

    # Outer decorative ring
    parts.append('<circle cx="0" cy="0" r="515" fill="none" stroke="url(#foilGoldGrad)" stroke-width="3"/>')
    for i in range(72):
        a = i * 360 / 72
        rad = math.radians(a)
        parts.append(f'<circle cx="{515*math.cos(rad)}" cy="{515*math.sin(rad)}" r="2" fill="url(#foilGoldGrad)"/>')

    return '\n'.join(parts)

def generate_victorian():
    """12-fold Victorian Baroque lace rosette"""
    parts = []
    parts.append('<circle cx="0" cy="0" r="50" fill="none" stroke="url(#foilGoldGrad)" stroke-width="3"/>')
    for i in range(12):
        a = i * 360 / 12
        parts.append(f'<g transform="rotate({a})">')
        parts.append('  <path d="M 0,50 C -30,110 -60,180 -20,240 C 0,260 20,240 -10,190 C -30,150 0,90 0,50" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
        parts.append('  <path d="M 0,50 C 30,110 60,180 20,240 C 0,260 -20,240 10,190 C 30,150 0,90 0,50" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
        parts.append('  <circle cx="0" cy="255" r="7" fill="url(#foilGoldGrad)"/>')
        parts.append('  <circle cx="-35" cy="215" r="5" fill="url(#foilGoldGrad)"/>')
        parts.append('  <circle cx="35" cy="215" r="5" fill="url(#foilGoldGrad)"/>')
        parts.append('</g>')

    parts.append('<circle cx="0" cy="0" r="275" fill="none" stroke="url(#foilGoldGrad)" stroke-width="3"/>')

    for i in range(12):
        a = i * 360 / 12 + 15
        parts.append(f'<g transform="rotate({a})">')
        parts.append('  <path d="M 0,280 C -60,350 -90,440 -30,510 C 0,545 40,510 -15,440 C -45,380 0,330 0,280" fill="none" stroke="url(#foilGoldGrad)" stroke-width="3"/>')
        parts.append('  <path d="M 0,280 C 60,350 90,440 30,510 C 0,545 -40,510 15,440 C 45,380 0,330 0,280" fill="none" stroke="url(#foilGoldGrad)" stroke-width="3"/>')
        parts.append('  <circle cx="0" cy="540" r="8" fill="url(#foilGoldGrad)"/>')
        parts.append('  <circle cx="-45" cy="485" r="5.5" fill="url(#foilGoldGrad)"/>')
        parts.append('  <circle cx="45" cy="485" r="5.5" fill="url(#foilGoldGrad)"/>')
        parts.append('</g>')

    parts.append('<circle cx="0" cy="0" r="555" fill="none" stroke="url(#foilGoldGrad)" stroke-width="3"/>')
    parts.append('<circle cx="0" cy="0" r="565" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1.5" stroke-dasharray="6 6"/>')
    return '\n'.join(parts)

lotus = generate_lotus()
starburst = generate_starburst()
victorian = generate_victorian()

with open('mandalas_library.js', 'w') as f:
    f.write('window.MANDALAS = {\n')
    f.write('  lotus: `' + lotus + '`,\n')
    f.write('  starburst: `' + starburst + '`,\n')
    f.write('  victorian: `' + victorian + '`\n')
    f.write('};\n')

print("Successfully generated mandalas_library.js!")
