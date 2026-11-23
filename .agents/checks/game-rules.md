---
name: game-rules
description: Front-matter and image rules for games
globs: ["_games/*.md", "images/games/*"]
---

- The filename is `slug.md`, with a lowercase, hyphenated slug and no date.
- `title` and `date` are required. `date` is `YYYY-MM-DD`, the release date.
- Every `platforms` entry is exactly `Mobile`, `Console`, or `board.fun`.
- `cover`, if present, has `src`, `alt`, `width`, and `height`. `src` is a bare filename that exists in `images/games/`, and `width`/`height` match the file's real pixel size (`sips -g pixelWidth -g pixelHeight`).
- Every `links` entry has a `label` and a `url`, and the `url` is an absolute `https://` address.
- No empty fields: delete an unused `platforms:`, `description:`, `cover:`, or `links:`.
- No `layout` or `permalink`: games have no pages.
- Without a `description`, the body's first paragraph works as a standalone summary, since the card uses it.
- Covers are sRGB, 16:9, at most 2400px wide, and preferably WebP, named `<slug>-cover.ext`.

See `_games/AGENTS.md`.
