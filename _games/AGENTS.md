# Games

Every Markdown file here with front matter is a released game, shown as a card in the home page's "Our games" section. They're the `games` collection in `_config.yml`, with `output: false`: a game has no page of its own, and its card's buttons link out to stores. This file and `CLAUDE.md` have no front matter, so they're never games (`_config.yml` excludes them by path too). `DEVELOPMENT.md` has the step-by-step guide for people; this is the contract. It mirrors [`_posts/AGENTS.md`](../_posts/AGENTS.md) wherever it can, so adding a game feels like adding a post.

## Naming

- `slug.md`, where the slug is the game's name in lowercase words joined by hyphens (`frozen-lake.md`).
- Unlike posts, the filename carries no date. Jekyll requires dated names only in `_posts/`; a game's release date is its `date` field.
- The slug never appears on the site, so renaming a file is safe.

## Order

- Newest `date` first. `index.html` sorts with `sort: "date" | reverse`.
- A game dated in the future is left out until a build runs on or after that day, like a post. Jekyll does this only for posts, so `index.html` filters with `where_exp: "game", "game.date <= site.time"`. Any later push rebuilds the site.

## Front matter

| Field | Type | Rendered by | Notes |
|---|---|---|---|
| `title` | string, required | `_includes/game-card.html` | The game's name, as it's written in stores. |
| `date` | `YYYY-MM-DD`, required | `index.html`'s sort and future filter | The release date. It isn't shown. Without it, Jekyll uses the build time, so the game sorts as newest. |
| `platforms` | list of `Mobile` \| `Console` \| `board.fun` | `game-card.html` as `.platform-tag` pills | The same names posts use for `platform`. |
| `description` | string | the card summary | One sentence, about 140 characters at most (the card truncates there). Falls back to the excerpt (the first paragraph). |
| `cover` | `{src, alt, width, height}` | `game-card.html`'s `.card-cover` | Same keys as a post's `images` entry. `src` is a bare filename inside `images/games/`. Without it, the card shows the emblem on navy. |
| `links` | list of `{label, url}` | `game-card.html` as `.btn-store` buttons | `label` is the button's text, in any wording (`Download on the App Store`). `url` is an absolute `https://` address. Links open in the same tab. |
| `published` | `false` | Jekyll | Hides a game without deleting it. |

## Body

- Markdown (kramdown). Only the first paragraph is used, as the card's summary when there's no `description`, so it should stand on its own in a sentence or two.
- Nothing else in the body is shown, since a game has no page.

## Images

- Store the cover in `images/games/` as `<slug>-cover.webp`.
- Make it 16:9, since `.card-cover` crops to that. A card is widest, about 36rem (576px), just before the grid splits into two columns, so 1200x675 covers 2x.
- Convert to sRGB first (`sips --matchTo "/System/Library/ColorSync/Profiles/sRGB Profile.icc"`), then encode as WebP (`cwebp -q 85`).
- `width` and `height` are the file's real pixel size (`sips -g pixelWidth -g pixelHeight`).
- Alt text describes what's in the art as one sentence a listener can picture, not "cover art for …".

## Template

```markdown
---
title:
date: YYYY-MM-DD
platforms:
  - Mobile
description:
cover:
  src: slug-cover.webp
  alt:
  width: 1200
  height: 675
links:
  - label: Download on the App Store
    url: https://apps.apple.com/app/…
---
First paragraph: what the game is, in a sentence or two.
```

Delete any field you leave empty. A blank `platforms:`, `links:`, or `cover:` renders nothing (or the emblem), but a `cover` with a blank `src` renders a broken image.

## Checking

Run `scripts/serve.sh`, then open the home page in both themes. Check that the card sits in date order, that its buttons go to the right stores, and that a game without a cover shows the emblem on navy. With no games, the section shows its empty state.
