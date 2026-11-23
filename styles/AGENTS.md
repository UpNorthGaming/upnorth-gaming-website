# Styles

Three sheets, published verbatim (no front matter):

| Sheet | Holds |
|---|---|
| `index-common.css` | Everything theme-independent: base, layout, components, hover, responsive. Also the brand colors the hero, avatars, and buttons use in both themes. |
| `index-light.css` | Light tokens and anything painted per theme. |
| `index-dark.css` | Dark tokens and anything painted per theme. |

`_includes/head.html` loads `index-common.css`, then the dark sheet with `media="(prefers-color-scheme: dark)"` and the light sheet with `media="(prefers-color-scheme: no-preference), (prefers-color-scheme: light)"`. So the page follows the OS with no JavaScript, and `scripts/dark-mode.js` only flips their `media` for a stored choice. Each theme sheet opens with a one-line comment saying what it depicts, sets `html { background: var(--bg); }`, and shows its toggle icon (light shows `.icon-moon`, dark `.icon-sun`).

## Flat

No glass, `backdrop-filter`, glows, gradients, gradient text, or decorative `box-shadow`. The one exception is `.site-header-over-hero` (see Components), whose fade of the scrim's navy blends the header into the hero's photo. Use these instead:
- **Depth:** a solid `--surface` on `--bg`, separated by a 1px `--hairline`.
- **Hover:** a color change. A card's border and title turn `--accent-text`; a button's fill shifts. Nothing lifts or scales.
- **Shape:** radius `.75rem` (`--radius`) for cards and media, `.55rem` for buttons, and `999px` for tags.

## Tokens

Both theme sheets define all of these on `:root`, after `color-scheme`. Note each checked ratio in a comment beside the value.

| Token | Use | Light | Dark | Requirement |
|---|---|---|---|---|
| `--bg` | Page canvas | `#f4f8fb` | `#0b1421` | Must match `dark-mode.js` and the `theme-color` metas |
| `--fg` | Body text, headings | `#0a2f4a` (logo navy) | `#f8f1e3` (logo cream) | 4.5:1 on `--bg` and `--surface` |
| `--secondary` | Secondary text | `#46607a` | `#b3c3d3` | 4.5:1 on `--bg` and `--surface` |
| `--accent` | Fills (skip link) | `#efa933` (logo gold) | `#efa933` | Never text on `--bg` |
| `--on-accent` | Text on `--accent` | `#0a2f4a` | `#0b1421` | 4.5:1 on `--accent` |
| `--accent-text` | Links, focus rings, hover | `#1b5f8f` | `#b8e5ff` (logo ice) | 4.5:1 on `--bg` and `--surface` |
| `--surface` | Cards, scroll-to-top button | `#ffffff` | `#111e2e` | |
| `--hairline` | Dividers that only separate | navy at .12 | cream at .12 | |
| `--hairline-strong` | Borders that outline a control or tag | navy at .55 | cream at .4 | 3:1 on `--bg` and `--surface` |

`index-common.css` also defines the theme-independent `--font`, `--fab-size: 2.5rem`, `--fab-inset: 1.5rem`, `--radius`, and the logo's colors as `--brand-navy`, `--brand-gold`, `--brand-cream`, and `--brand-ice`.

## The hero

The hero is the same in both themes. The night photo (`.hero-photo`) sits under `.section-hero::before`, a flat `rgba(8, 17, 30, .65)` scrim, and its text uses the `--brand-*` colors directly. The tagline's link and the hero's focus rings are ice, since `--accent-text` is too dark for the photo in the light theme. The scrim's strength comes from the photo's brightest .5% (`#adcceb`, on the lake): cream holds 7.1:1 there and ice 6:1. Re-measure if the photo or scrim changes.

## Type

| Element | Size | Weight | Tracking | Line height |
|---|---|---|---|---|
| Body | `1rem`, `overflow-wrap: break-word` | 400 | | 1.5 |
| Hero `h1` | `clamp(min(2.75rem, 20vw), 7vw, 4.25rem)` | 700 | `-.035em` | 1.05 |
| Tagline | `clamp(1.05rem, 1.6vw, 1.2rem)`, max `30rem`, `text-wrap: balance` | 400 | | 1.55 |
| Section `h2`, page `h1` | `clamp(1.9rem, 3.5vw, 2.6rem)` | 700 | `-.03em` | 1.1 |
| Section intro | `1.1rem`, `text-wrap: pretty` | 400 | | 1.6 |
| Post `h1` | `clamp(min(1.9rem, 10vw), 4.5vw, 2.8rem)` | 700 | `-.03em` | 1.1 |
| Post body | `1.075rem` | 400 | | 1.7 |
| Button | `.95rem` | 600 | | |
| Footer | `.875rem` | 400 | | |

- The font is the system stack in `--font`; there are no web fonts.
- The `min(…, Nvw)` floors keep the longest word on one line on a 320px phone at 200% text, where `rem` doubles but `vw` doesn't. Re-check them if a heading gets a longer word.
- Use `text-wrap: pretty` on paragraphs that sit side by side, so none ends on a lone word.

## Layout

- `.container`: `max-width: 68rem`, centered, `padding: 0 1.25rem`.
- `.section`: `padding: 5rem 0`, with a top hairline between consecutive sections. `.section-head` holds the `h2` and intro at `max-width: 42rem`.
- `.update-grid`: `repeat(auto-fill, minmax(min(100%, 18rem), 1fr))`. Each `.update-card` is a single link.
- `.team-grid`: two columns, stacking at 820px.
- `.post`: one column at `max-width: 44rem`.

## Components

- **Header:** the emblem (the home link), the nav, and the theme toggle, in a wrapping flex row, so links drop to a second row rather than overflowing. One row needs about 19rem, so below `22em` the toggle stays beside the emblem and the nav takes a full row.
- **`.site-header-over-hero`:** on pages with `hero: true` (the home page), above `22em`, the header is absolute over the hero's top, with a `rgba(8, 17, 30, .6)`-to-transparent fade and the hero's fixed colors (cream links, ice focus rings) in both themes. The hero adds the header's 4rem to its top padding. Below `22em` it's the normal themed header above the hero, since the nav's rows make its height unknown.
- **`.top-link` / `.top-btn`:** `--secondary` text. On hover, they get a `--hairline` fill and `--fg` text. `aria-current` links are `--fg`.
- **Buttons:** `.btn-primary` is gold with navy text (6.8:1). `.btn-ghost` is the hero's cream outline. Both are `min-height: 3rem`, `max-width: 100%`, and `padding: .4rem 1.3rem`. Labels may wrap: never `white-space: nowrap`, and never widen a button with padding or `min-width` to match its neighbor.
- **Cards:** `.update-card` has `--surface`, a hairline border, and a 16:9 `.update-card-cover`, or `.update-card-cover-empty` (the emblem on navy) when the post has no images.
- **`.platform-tag`:** a `--hairline-strong` outline pill.
- **`.empty-state`:** a dashed `--hairline-strong` box for the devlog with no posts.
- **Avatars:** `.avatar` is a 4.5rem navy circle with gold initials. An `<img>` inside it fills the circle.
- **`.overview-return`:** fixed `--fab-inset` from the bottom right. A `--surface` circle with a `--hairline-strong` border, hidden until `.visible`. **Never rename it** (see `scripts/AGENTS.md`).
- **Focus:** `a`, `button`, and `iframe` get `outline: 2px solid var(--accent-text)` with `outline-offset: 2px` on `:focus-visible`.

## Motion

- Colors and borders transition over `.2s ease`; fades over `.25s`.
- The last block of `index-common.css` is `@media (prefers-reduced-motion: reduce)`. It turns off smooth scrolling and sets transitions and animations to `.01ms`.

## Responsive

- At 820px: the hero stacks with the logo first, sections drop to `4rem` padding, and the team stacks.
- At 600px: the hero padding shrinks and developer cards stack the avatar above the text.
- Pixel queries miss enlarged text, so anything that could overflow when text grows (the header) uses an `em` query.
- Support 320px wide at 200% text with no horizontal scroll. Measure text too: a long word can run out of its box without widening the page, and the hero's `overflow: clip` hides it.

## CSS conventions

- **Formatting:** four-space indent, one declaration per line, decimals without a leading zero (`.5rem`, `rgba(0, 0, 0, .1)`), and `rem` for sizes.
- **Sections:** separated by banner comments 78 characters wide (`/* Hero ---…--- */`), in page order, ending with `Hover` then `Responsive`.
- **Comments:** each sheet opens with a comment on what it holds. Comment the reason above any non-obvious rule, and name where a value comes from and what must change with it.
- **Hover:** styles only inside `@media (hover: hover) and (pointer: fine)`.
- **Fallbacks first:** `overflow: hidden` then `overflow: clip`, and `100vh` then `100svh`. Prefix `-webkit-text-size-adjust` and the like.
- **Scope:** page-specific type is scoped to its section (`.hero-copy h1`, `.post h1`) so it doesn't leak into other pages.
