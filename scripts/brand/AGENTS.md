# Brand

Unpublished sources (`_config.yml` excludes `scripts/brand/`). The site's published images and icons are generated from these.

| File | What |
|---|---|
| `logo-master.png` | The original logo, 1312x1199 RGBA. Never edit it; regenerate from it. |
| `logo-github-avatar.png` | The logo on an opaque background, for the GitHub organization's avatar. |
| `hero-lake-light-master.png`, `hero-lake-dark-master.png` | Matching generated hero scenery at 1774x887, sRGB. |
| `export_assets.py` | Regenerates the logo images and icons from `logo-master.png`. |
| `og-image.html` | The source page for `images/og-image.png`. |

## Logo and icons

From the repo root:

```sh
uv run scripts/brand/export_assets.py
cwebp -quiet -q 88 -alpha_q 100 -m 6 images/logo.png -o images/logo.webp && rm images/logo.png
```

`uv` installs Pillow, NumPy, and SciPy for the script on the fly. The script:
- Clears the master's stray pixels. The image generator left faint red and grey ghosts (alpha 1-15) in the transparent area, which show as smudges on a light background, so anything fainter than alpha 16 more than 3px from the logo is erased.
- Writes `images/logo.png` (720px wide), which the second command encodes to `images/logo.webp` for the hero.
- Crops the compass-and-controller emblem (everything above row 727, where the wordmark's panel starts) for `images/logo-mark.png` (80px tall, the header's 2x).
- Writes `favicon.png` (96x96) and `favicon.ico` (16, 32, 48), transparent.
- Writes `apple-touch-icon.png` (180x180): the emblem on the logo's navy, opaque, with safe space, since the home screen masks it and fills transparency with black.

The favicon isn't themed. Safari draws its own backdrop behind a favicon too dark for its tab bar, and browsers read icon links once at load, so a themed favicon could neither look right nor follow the toggle.

If the logo's size changes, update the `width`/`height` on its `<img>` tags (`index.html`, `scripts/brand/og-image.html`, `_includes/header.html`, `_includes/update-card.html`). Then re-render the link preview.

## Photos

- Convert any non-sRGB source to sRGB before anything else: `sips --matchTo "/System/Library/ColorSync/Profiles/sRGB Profile.icc" <file>`. Check with `sips -g profile <file>`. Browsers read untagged pixels as sRGB, so wide-gamut colors (like iPhone photos in Display P3) come out dull otherwise.
- Downscale to at most 2x the size the photo displays at, and encode as WebP: `cwebp -q 84 -m 6 scripts/brand/hero-lake-light-master.png -o images/hero-lake-light.webp` and the same command for `dark`.

## Link preview

`images/og-image.png` is a 1200x630 screenshot of `og-image.html`, which repeats the home page's hero markup over the real stylesheets on the dark theme. When the hero's copy changes in `index.html`, make the same change here. The render command and its checks are in the root `AGENTS.md` under "Link preview".

The preview must be an opaque RGB PNG (crawler support for WebP is patchy, and transparency composites unpredictably) on the dark theme, since a preview can't know the reader's theme.
