#!/usr/bin/env python3
"""Generate brand icons for the PWA and the browser extension.

Produces clean PNGs at the sizes required by the manifests, plus a
maskable variant with the safe-area padding the spec recommends.
"""

from __future__ import annotations

import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
WEB_ICONS = ROOT / "web" / "icons"
EXT_ICONS = ROOT / "extension" / "icons"

# Brand colors used everywhere else in the project.
COLOR_PINK = (255, 46, 147)
COLOR_PURPLE = (124, 58, 237)
COLOR_CYAN = (34, 211, 238)
COLOR_BG = (15, 3, 34)
COLOR_FG = (245, 243, 255)


def gradient(size: int) -> Image.Image:
    """Diagonal pink → purple → cyan gradient."""
    img = Image.new("RGB", (size, size), COLOR_BG)
    px = img.load()
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * (size - 1))
            if t < 0.5:
                k = t / 0.5
                r = int(COLOR_PINK[0] + (COLOR_PURPLE[0] - COLOR_PINK[0]) * k)
                g = int(COLOR_PINK[1] + (COLOR_PURPLE[1] - COLOR_PINK[1]) * k)
                b = int(COLOR_PINK[2] + (COLOR_PURPLE[2] - COLOR_PINK[2]) * k)
            else:
                k = (t - 0.5) / 0.5
                r = int(COLOR_PURPLE[0] + (COLOR_CYAN[0] - COLOR_PURPLE[0]) * k)
                g = int(COLOR_PURPLE[1] + (COLOR_CYAN[1] - COLOR_PURPLE[1]) * k)
                b = int(COLOR_PURPLE[2] + (COLOR_CYAN[2] - COLOR_PURPLE[2]) * k)
            px[x, y] = (r, g, b)
    return img


def find_font(size: int) -> ImageFont.FreeTypeFont:
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        "/Library/Fonts/Arial Bold.ttf",
        "C:/Windows/Fonts/arialbd.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def rounded_mask(size: int, radius_ratio: float = 0.22) -> Image.Image:
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    r = int(size * radius_ratio)
    draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=r, fill=255)
    return mask


def render(size: int, *, maskable: bool = False) -> Image.Image:
    bg = gradient(size)
    if not maskable:
        bg.putalpha(rounded_mask(size))
    else:
        bg = bg.convert("RGBA")

    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(bg, (0, 0), bg)

    safe = 0.8 if maskable else 1.0
    inner = int(size * safe)
    text_size = int(inner * 0.34)
    font = find_font(text_size)
    draw = ImageDraw.Draw(out)

    label = "⇧F3"
    bbox = draw.textbbox((0, 0), label, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    cx = (size - tw) // 2 - bbox[0]
    cy = (size - th) // 2 - bbox[1]
    # Soft drop shadow.
    shadow_offset = max(1, size // 80)
    draw.text((cx + shadow_offset, cy + shadow_offset), label, fill=(0, 0, 0, 110), font=font)
    draw.text((cx, cy), label, fill=COLOR_FG, font=font)

    return out


def main() -> None:
    WEB_ICONS.mkdir(parents=True, exist_ok=True)
    EXT_ICONS.mkdir(parents=True, exist_ok=True)

    for size in (16, 32, 48, 128, 192, 512):
        img = render(size)
        img.save(WEB_ICONS / f"icon-{size}.png", optimize=True)
        if size in (16, 32, 48, 128):
            img.save(EXT_ICONS / f"icon-{size}.png", optimize=True)
        print(f"  wrote icon-{size}.png")

    maskable = render(512, maskable=True)
    maskable.save(WEB_ICONS / "icon-maskable-512.png", optimize=True)
    print("  wrote icon-maskable-512.png")

    # A favicon-style 32x32 for the web root.
    render(32).save(ROOT / "web" / "favicon.png", optimize=True)
    print("  wrote web/favicon.png")


if __name__ == "__main__":
    main()
