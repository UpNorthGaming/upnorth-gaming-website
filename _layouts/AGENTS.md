# Layouts and includes

These rules cover `_layouts/` and `_includes/`. Both hold Liquid templates that Jekyll renders into every page; neither folder is published itself.

## Files

| File | Role |
|---|---|
| `_layouts/default.html` | The shell of every page: `<head>`, skip link, header, `<main id="main">`, footer, and scroll-to-top button. |
| `_layouts/post.html` | One devlog post inside `default`: back link, date and platform, title, Markdown body, YouTube embed, then images. `_config.yml`'s `defaults` apply it to every post. |
| `_includes/head.html` | The whole `<head>`. Works out the title, description, and link-preview image from page variables. |
| `_includes/header.html` | Emblem home link (alt "UpNorth Gaming", with no name beside it), main nav, and theme toggle. A page with `hero: true` gets `.site-header-over-hero`, which lays it over the hero. |
| `_includes/footer.html` | The treeline above the footer, the copyright and the RSS feed link, plus the `overview-return` button. |
| `_includes/update-card.html` | A post as one card link (used on the home page and `/updates/`). Takes `post`, and `level` for its title's heading level (default 3; `/updates/` passes 2, since its cards sit under the page's `h1`). |
| `_includes/game-card.html` | A game from `_games/` as a card, used in the home page's "Our games" section. Takes `game`. Not a link, since a game can have several store links; each of its `links` is a `.btn-store` button instead. |
| `_includes/update-meta.html` | A post's `<time>` and platform tag. Takes `post`. |
| `_includes/youtube.html` | A youtube-nocookie embed. Takes `id` and `title`. |

## Page variables `head.html` reads

- `title`: becomes `<title>` as "Title | UpNorth Gaming". Without one, the page is titled "UpNorth Gaming | Indie game studio" (the home page).
- `description`: the meta and `og:description`. A post without one uses its excerpt, and any other page uses `site.description`.
- `images`: on posts, the first entry becomes `og:image` with its size and alt. Otherwise the image is `images/og-image.png`.
- Posts also get `og:type` `article` and `article:published_time`.

## `<head>` order

1. `charset`
2. viewport (`width=device-width, initial-scale=1`; never `user-scalable=no`)
3. `<title>`, description, canonical
4. the `theme-color` pair
5. Open Graph: `og:title`, `og:type`, `og:url`, `og:description`, `og:site_name`, `og:image` with `:width`, `:height`, `:alt`
6. Twitter: `summary_large_image`, `twitter:image`, `twitter:image:alt` (Twitter never reads `og:image:alt`)
7. icons, then the feed link
8. `index-common.css`, then the dark and light sheets media-scoped with `id="theme-dark"` / `id="theme-light"`
9. `dark-mode.js` as a classic, synchronous script, then `overview-return.js` with `defer`

The two `theme-color` metas are `media`-scoped, carry each theme's `--bg`, and must match `scripts/dark-mode.js`.

## HTML conventions

- Four-space indent. Wrapped attributes continue eight spaces in. Use a blank line between `<head>` groups and between top-level sections.
- Every internal URL is `{{ '/path' | relative_url }}`, and every URL in a meta tag is `absolute_url`.
- Escape user-written strings that land in attributes or text (`| escape`), since titles and alts come from front matter.
- Every published `<img>` has `width`, `height`, and `decoding="async"`, plus `fetchpriority="high"` for the hero's images or `loading="lazy"` below the fold. Small images above the fold, like the header mark, take neither. Decorative images get `alt=""`.
- An image that changes with the theme is a `<picture>`: a dark `<source … data-theme="dark" media="(prefers-color-scheme: dark)">`, then the light `<img>`. `dark-mode.js` flips every `picture source[data-theme]`. Never swap `src` from script or hide a duplicate with `display`. (Nothing uses this yet; the hero is the same in both themes.)
- Icons are inline Feather-style SVGs: `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="2"`, round caps and joins, and `aria-hidden="true"`, at 20px in the header.
- Buttons have `type="button"`. Links open in the same tab.
- An icon-only control has an `aria-label`. A toggle's label names its on state, and `aria-pressed` carries the state.
- The nav links to the home page's sections in page order (`/#games`, `/#devlog`, `/#developers`), each labeled with its section's heading or a short form of it. Renaming a section's `id` means updating the nav and the hero's buttons.
- Comment non-obvious markup with HTML comments (`<!-- -->`), or with `{%- comment -%}` when the note shouldn't ship in the page.
