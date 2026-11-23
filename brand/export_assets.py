# /// script
# requires-python = ">=3.10"
# dependencies = ["pillow", "numpy", "scipy"]
# ///
"""Regenerates the published logo images and icons from brand/logo-master.png.

Run from the repo root with `uv run brand/export_assets.py`, then re-encode the
hero logo as described in brand/AGENTS.md. It writes:

  images/logo.png        Full logo at 720px wide, cleaned (encode to logo.webp)
  images/logo-mark.png   The compass-and-controller emblem, 80px tall
  favicon.png            Emblem, 96x96, transparent
  favicon.ico            Emblem at 16, 32, and 48
  apple-touch-icon.png   Emblem on the logo's navy, 180x180, opaque
"""

import numpy as np
from PIL import Image
from scipy import ndimage

MASTER = "brand/logo-master.png"
# The logo's navy, also --brand-navy in styles/index-common.css.
NAVY = (10, 47, 74, 255)
# The wordmark's navy panel starts at this row of the master; everything above
# it is the emblem.
EMBLEM_BOTTOM = 727


def clean(image):
    """Clears the generator's stray pixels around the logo.

    The master has faint red and grey ghosts (alpha 1-15) floating in its
    transparent area, which show as smudges on a light background. The logo
    itself is one solid shape at alpha >= 16, so anything fainter more than 3px
    from it is cleared.
    """
    a = np.array(image.convert("RGBA"))
    alpha = a[..., 3]
    body = alpha >= 16
    _, count = ndimage.label(body)
    if count != 1:
        raise SystemExit(f"expected the logo as one shape, found {count}")
    keep = ndimage.binary_dilation(body, iterations=3)
    a[..., 3] = np.where(keep, alpha, 0)
    # Fully transparent pixels keep no color, so resampling can't bleed it in.
    a[a[..., 3] == 0, :3] = 0
    return Image.fromarray(a, "RGBA")


def fit(image, size, pad):
    """Centers image in a transparent size x size square, inset by pad."""
    w, h = image.size
    scale = (size - 2 * pad) / max(w, h)
    resized = image.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.alpha_composite(resized, ((size - resized.width) // 2, (size - resized.height) // 2))
    return canvas


def main():
    logo = clean(Image.open(MASTER))
    bbox = logo.getbbox()

    full = logo.crop(bbox)
    full.resize((720, round(full.height * 720 / full.width)), Image.LANCZOS).save("images/logo.png", optimize=True)

    emblem = logo.crop((bbox[0], bbox[1], bbox[2], EMBLEM_BOTTOM))
    emblem = emblem.crop(emblem.getbbox())
    # 2x of the header's 2.5rem (40px) display height.
    emblem.resize((round(emblem.width * 80 / emblem.height), 80), Image.LANCZOS).save("images/logo-mark.png", optimize=True)

    fit(emblem, 96, 2).save("favicon.png", optimize=True)
    icons = [fit(emblem, s, 0) for s in (48, 32, 16)]
    icons[0].save("favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)], append_images=icons[1:])

    # The home screen masks the touch icon and fills transparency with black,
    # so it's opaque, with room for the mask's rounded corners.
    touch = Image.new("RGBA", (180, 180), NAVY)
    touch.alpha_composite(fit(emblem, 180, 24))
    touch.convert("RGB").save("apple-touch-icon.png", optimize=True)


if __name__ == "__main__":
    main()
