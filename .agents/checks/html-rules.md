---
name: html-rules
description: Markup, Liquid, and accessibility rules for pages, layouts, and includes
globs: ["*.html", "_layouts/*.html", "_includes/*.html"]
---

- Every internal URL goes through `| relative_url`; URLs in meta tags use `| absolute_url`. No hard-coded `/…` paths.
- Every `<img>` has `width`, `height`, and `decoding="async"`, plus `fetchpriority="high"` for the hero's images or `loading="lazy"` below the fold (small above-the-fold images, like the header mark, take neither). Decorative images have `alt=""`; others have alt text describing what's visible.
- Free-text front-matter values printed into HTML (titles, descriptions, alt text, platform) are escaped with `| escape`.
- Every `<button>` has `type="button"`. Icon-only controls have an `aria-label`, and their SVGs have `aria-hidden="true"`. A toggle uses `aria-pressed`.
- Inline SVG icons are Feather-style: `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="2"`, round caps and joins.
- The viewport meta never contains `user-scalable=no`.
- Links open in the same tab (no `target="_blank"`).
- A new page with front matter that shouldn't be in the sitemap sets `sitemap: false`.
- Four-space indent.
- When the hero's copy changes in `index.html`, `scripts/brand/og-image.html` changes with it and `images/og-image.png` is re-rendered.

See `_layouts/AGENTS.md`.
