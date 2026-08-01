#!/usr/bin/env python3
"""Generate the two small brand marks used in the email signature strip.

Rendered locally to PNG so the signature never depends on a third-party CDN
staying up. Output is 3x the display size so it stays crisp on retina.
"""
import math
import subprocess
import pathlib

OUT = pathlib.Path("/Users/labiffilmhouse/Desktop2/creativelygrow-clone/assets")
DISPLAY = 18          # px in the signature
SCALE = 3             # render at 3x for retina

# ---------------------------------------------------------------- Claude burst
# Radial starburst: 12 spokes, tapered narrow at the hub and blunt at the tip,
# with alternating lengths so it reads organic rather than mechanical.
CLAUDE_ORANGE = "#D97757"
VB = 100
cx = cy = VB / 2

rays = []
N = 12
for i in range(N):
    ang = (2 * math.pi * i / N) - math.pi / 2
    outer = 46 if i % 2 == 0 else 39
    inner = 2
    half_in = 3.2
    half_out = 5.9

    # unit vectors along and perpendicular to the ray
    dx, dy = math.cos(ang), math.sin(ang)
    px, py = -dy, dx

    ix, iy = cx + dx * inner, cy + dy * inner
    ox, oy = cx + dx * outer, cy + dy * outer

    p1 = (ix + px * half_in, iy + py * half_in)
    p2 = (ox + px * half_out, oy + py * half_out)
    p3 = (ox - px * half_out, oy - py * half_out)
    p4 = (ix - px * half_in, iy - py * half_in)

    # rounded blunt tip across the outer edge
    d = (f"M{p1[0]:.2f},{p1[1]:.2f} L{p2[0]:.2f},{p2[1]:.2f} "
         f"A{half_out:.2f},{half_out:.2f} 0 0 1 {p3[0]:.2f},{p3[1]:.2f} "
         f"L{p4[0]:.2f},{p4[1]:.2f} Z")
    rays.append(f'<path d="{d}"/>')

# solid hub so the spokes read as one mark rather than 12 loose petals
rays.append(f'<circle cx="{cx}" cy="{cy}" r="5.5"/>')

claude_svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {VB} {VB}">'
    f'<g fill="{CLAUDE_ORANGE}">' + "".join(rays) + "</g></svg>"
)

# ------------------------------------------------------------------ Meta loops
# The Meta mark: two loops meeting in the middle, drawn as a single stroked
# path so the crossing reads as one continuous ribbon.
META_BLUE_A = "#0064E0"
META_BLUE_B = "#0082FB"

meta_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 72">
  <defs>
    <linearGradient id="mg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="{META_BLUE_A}"/>
      <stop offset="1" stop-color="{META_BLUE_B}"/>
    </linearGradient>
  </defs>
  <g fill="none" stroke="url(#mg)" stroke-width="13"
     stroke-linecap="round" stroke-linejoin="round">
    <path d="M14,52
             C14,26 25,15 34,15
             C46,15 54,30 60,40
             C66,50 74,63 86,63
             C97,63 106,52 106,36
             C106,20 97,9 86,9
             C74,9 66,22 60,32
             C54,42 46,57 34,57
             C25,57 14,46 14,30 Z"/>
  </g>
</svg>'''

# ------------------------------------------------------------- Google Ads mark
# The "A" monogram: yellow and blue strokes meeting at the apex, green dot at
# the foot of the yellow stroke.
gads_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <g stroke-linecap="round" fill="none" stroke-width="26">
    <line x1="50" y1="24" x2="34" y2="64" stroke="#FBBC04"/>
    <line x1="50" y1="24" x2="67" y2="76" stroke="#4285F4"/>
  </g>
  <circle cx="34" cy="76" r="13" fill="#34A853"/>
</svg>'''

specs = [
    ("sig-claude-mark", claude_svg, DISPLAY * SCALE, DISPLAY * SCALE),
    ("sig-meta-mark", meta_svg, int(DISPLAY * SCALE * 120 / 72), DISPLAY * SCALE),
    ("sig-gads-mark", gads_svg, DISPLAY * SCALE, DISPLAY * SCALE),
]

for name, svg, w, h in specs:
    tmp = pathlib.Path(f"/tmp/{name}.svg")
    tmp.write_text(svg)
    png = OUT / f"{name}.png"
    subprocess.run(
        ["rsvg-convert", "-w", str(w), "-h", str(h), "-o", str(png), str(tmp)],
        check=True,
    )
    print(f"{png.name}  {w}x{h}  {png.stat().st_size}B")
