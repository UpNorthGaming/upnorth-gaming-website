---
name: css-rules
description: Flat-design, theming, and formatting rules for the site's stylesheets
globs: ["styles/*.css"]
---

- Colors come from tokens (`var(--fg)`, `var(--surface)`, …). Literal colors are allowed only for the `--brand-*` definitions, the hero (which is the same in both themes), a button's hover fill, and the video frame's black letterbox, and each needs a comment saying why.
- `index-light.css` and `index-dark.css` hold only `:root` tokens, `html { background: var(--bg); }`, toggle-icon visibility, and anything painted per theme. Everything else goes in `index-common.css`.
- Every token both theme sheets define must exist in both. A text color needs a comment with its checked contrast ratio (4.5:1 for text, 3:1 for non-text UI).
- Flat: no `backdrop-filter`, glass, `linear-gradient`/`radial-gradient` backgrounds, gradient text, or decorative `box-shadow`.
- Hover styles appear only inside `@media (hover: hover) and (pointer: fine)`.
- Focus uses `:focus-visible` with a 2px `var(--accent-text)` outline.
- The last block of `index-common.css` is `@media (prefers-reduced-motion: reduce)`.
- Never rename `.overview-return` to a generic "back to top" name.
- Formatting: four-space indent, one declaration per line, decimals without a leading zero (`.5rem`), `rem` for sizes, 78-character banner comments between sections in page order, and fallbacks before modern values (`overflow: hidden` then `overflow: clip`).

See `styles/AGENTS.md`.
