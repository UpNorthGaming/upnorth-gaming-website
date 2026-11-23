# Scripts

`scripts/brand/` isn't page code: it holds the unpublished brand masters and asset tooling, and `_config.yml` excludes it as a whole. See [`brand/AGENTS.md`](brand/AGENTS.md).

Page scripts are classic scripts, each wrapped in an IIFE with `var` and `function` declarations: no modules, no globals, and no dependencies. Feature-detect rather than sniff user agents, and give a missing API a fallback. The rules in `.agents/checks/javascript-rules.md` apply.

## `dark-mode.js`

Loaded synchronously in `<head>` so a stored choice applies before the first paint. It must:

1. Read `localStorage.theme` inside `try`, since storage throws in private modes, and an uncaught throw in `<head>` leaves the page unthemed. Writes go inside `try` too.
2. Do nothing more when no `light` or `dark` is stored. The media-scoped sheets, `<picture>` sources, and `theme-color` metas already follow the OS, including live changes.
3. When one is stored, set the chosen sheet's `media` to `all` and the other's to `not all`, set every `theme-color` meta's `content` to that theme's `--bg`, and set each `picture source[data-theme]`'s `media` to `all` or `not all` by its theme. Do the pictures again on `DOMContentLoaded`, since none exist yet while `<head>` runs.
4. On `DOMContentLoaded`, wire up `#theme-toggle`. `aria-pressed` is `true` in dark, and a click flips the theme, stores it, and applies it.
5. While no choice is stored, follow `matchMedia('(prefers-color-scheme: dark)')` changes, to keep `aria-pressed` and the next click's direction right.

**Its two theme colors (`#0b1421` dark, `#f4f8fb` light) must match each theme sheet's `--bg` and the `theme-color` metas in `_includes/head.html`.** It's adapted from af.codes' copy, with only those colors changed.

## `overview-return.js`

The scroll-to-top button. **Don't rename it** (the file, `#overview-return`, or `.overview-return`) to anything like `back-to-top`, `jump-to-top`, or `scroll-to-top`: ad blockers' cosmetic filters hide those names.

- It toggles `.visible` once `scrollY` passes 400, from a passive scroll listener and once on load.
- A click scrolls to the top: smoothly, or instantly under `prefers-reduced-motion: reduce`.
- It loads with `defer`, so the button already exists when it runs.
