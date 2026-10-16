#!/usr/bin/env python3
import math

def generate_lotus():
    parts = []
    parts.append('<circle cx="0" cy="0" r="32" fill="none" stroke="url(#foilGoldGrad)" stroke-width="3"/>')
    parts.append('<circle cx="0" cy="0" r="16" fill="url(#foilGoldGrad)"/>')
    for i in range(16):
        a = i * 360 / 16
        parts.append(f'<g transform="rotate({a})">')
        parts.append('  <path d="M 0,32 C -18,65 -22,105 0,140 C 22,105 18,65 0,32 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
        parts.append('  <line x1="0" y1="40" x2="0" y2="120" stroke="url(#foilGoldGrad)" stroke-width="1.5"/>')
        parts.append('  <circle cx="0" cy="110" r="4" fill="url(#foilGoldGrad)"/>')
        parts.append('</g>')
    parts.append('<circle cx="0" cy="0" r="145" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>')
    parts.append('<circle cx="0" cy="0" r="155" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1" stroke-dasharray="4 4"/>')
    for i in range(16):
        a = i * 360 / 16 + 11.25
        parts.append(f'<g transform="rotate({a})">')
        parts.append('  <path d="M 0,155 C -35,210 -45,290 0,350 C 45,290 35,210 0,155 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="3"/>')
        parts.append('  <path d="M 0,180 C -20,225 -25,280 0,325 C 25,280 20,225 0,180 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1.5"/>')
        parts.append('  <circle cx="0" cy="300" r="6" fill="url(#foilGoldGrad)"/>')
        parts.append('  <circle cx="0" cy="358" r="4" fill="url(#foilGoldGrad)"/>')
        parts.append('</g>')
    parts.append('<circle cx="0" cy="0" r="365" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
    for i in range(16):
        a = i * 360 / 16
        parts.append(f'<g transform="rotate({a})">')
        parts.append('  <path d="M 0,365 C -55,420 -60,500 0,550 C 60,500 55,420 0,365 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="3.5"/>')
        parts.append('  <circle cx="0" cy="562" r="7" fill="url(#foilGoldGrad)"/>')
        parts.append('</g>')
    return '\n'.join(parts)

def generate_starburst():
    parts = []
    parts.append('<circle cx="0" cy="0" r="45" fill="none" stroke="url(#foilGoldGrad)" stroke-width="3.5"/>')
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
        parts.append('  <circle cx="0" cy="495" r="6" fill="url(#foilGoldGrad)"/>')
        parts.append('</g>')
    parts.append('<circle cx="0" cy="0" r="515" fill="none" stroke="url(#foilGoldGrad)" stroke-width="3"/>')
    return '\n'.join(parts)

def make_royal_taj():
    parts = []
    parts.append('<circle cx="0" cy="0" r="28" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
    parts.append('<circle cx="0" cy="0" r="14" fill="url(#foilGoldGrad)"/>')
    for i in range(8):
        a = i * 45
        parts.append(f'<g transform="rotate({a})">')
        parts.append('  <path d="M 0,28 C -12,50 -14,80 0,105 C 14,80 12,50 0,28 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>')
        parts.append('  <line x1="0" y1="35" x2="0" y2="90" stroke="url(#foilGoldGrad)" stroke-width="1.2"/>')
        parts.append('  <circle cx="0" cy="75" r="3" fill="url(#foilGoldGrad)"/>')
        parts.append('</g>')
    parts.append('<circle cx="0" cy="0" r="110" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>')
    parts.append('<circle cx="0" cy="0" r="118" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1" stroke-dasharray="3 3"/>')
    for i in range(16):
        a = i * 22.5
        parts.append(f'<g transform="rotate({a})">')
        parts.append('  <path d="M 0,118 C -24,155 -28,210 0,245 C 28,210 24,155 0,118 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.2"/>')
        parts.append('  <circle cx="0" cy="205" r="4.5" fill="url(#foilGoldGrad)"/>')
        parts.append('</g>')
    parts.append('<circle cx="0" cy="0" r="255" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
    for i in range(32):
        a = i * 360 / 32
        parts.append(f'<g transform="rotate({a})">')
        parts.append('  <path d="M 0,260 C -18,300 -22,350 0,385 C 22,350 18,300 0,260 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>')
        parts.append('  <circle cx="0" cy="396" r="3.5" fill="url(#foilGoldGrad)"/>')
        parts.append('</g>')
    parts.append('<circle cx="0" cy="0" r="405" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>')
    for i in range(16):
        a = i * 22.5 + 11.25
        parts.append(f'<g transform="rotate({a})">')
        parts.append('  <path d="M -35,415 C -65,465 -75,530 0,580 C 75,530 65,465 35,415" fill="none" stroke="url(#foilGoldGrad)" stroke-width="3"/>')
        parts.append('  <path d="M 0,430 C -35,475 -40,515 0,555 C 40,515 35,475 0,430 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="1.8"/>')
        parts.append('  <circle cx="0" cy="595" r="7" fill="url(#foilGoldGrad)"/>')
        parts.append('</g>')
    parts.append('<circle cx="0" cy="0" r="605" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
    return '\n'.join(parts)

def make_sacred_bloom():
    parts = []
    parts.append('<circle cx="0" cy="0" r="36" fill="none" stroke="url(#foilGoldGrad)" stroke-width="3"/>')
    for i in range(12):
        a = i * 30
        parts.append(f'<g transform="rotate({a})">')
        parts.append('  <path d="M 0,36 C -15,70 -15,110 0,135 C 15,110 15,70 0,36 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>')
        parts.append('  <circle cx="0" cy="142" r="3" fill="url(#foilGoldGrad)"/>')
        parts.append('</g>')
    parts.append('<circle cx="0" cy="0" r="148" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2"/>')
    for i in range(24):
        a = i * 15
        parts.append(f'<g transform="rotate({a})">')
        parts.append('  <path d="M 0,148 C -25,200 -30,260 0,310 C 30,260 25,200 0,148 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.2"/>')
        parts.append('  <circle cx="0" cy="320" r="4.5" fill="url(#foilGoldGrad)"/>')
        parts.append('</g>')
    parts.append('<circle cx="0" cy="0" r="332" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
    for i in range(24):
        a = i * 15 + 7.5
        parts.append(f'<g transform="rotate({a})">')
        parts.append('  <path d="M 0,342 C -40,410 -45,500 0,565 C 45,500 40,410 0,342 Z" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.8"/>')
        parts.append('  <circle cx="0" cy="578" r="6" fill="url(#foilGoldGrad)"/>')
        parts.append('</g>')
    parts.append('<circle cx="0" cy="0" r="590" fill="none" stroke="url(#foilGoldGrad)" stroke-width="2.5"/>')
    return '\n'.join(parts)

taj = make_royal_taj()
bloom = make_sacred_bloom()
lotus = generate_lotus()
starburst = generate_starburst()

with open('mandalas_library.js', 'w') as f:
    f.write('window.MANDALAS = {\n')
    f.write('  taj: `' + taj + '`,\n')
    f.write('  bloom: `' + bloom + '`,\n')
    f.write('  lotus: `' + lotus + '`,\n')
    f.write('  starburst: `' + starburst + '`\n')
    f.write('};\n')

print("All 5 vector mandalas exported successfully to mandalas_library.js!")
