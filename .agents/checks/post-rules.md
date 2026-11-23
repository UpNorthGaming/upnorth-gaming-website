---
name: post-rules
description: Front-matter and image rules for devlog posts
globs: ["_posts/*.md", "images/devlog/*"]
---

- The filename is `YYYY-MM-DD-slug.md`, with a lowercase, hyphenated slug.
- `title` is required.
- `platform`, if present, is exactly `Mobile`, `Console`, or `board.fun`.
- No `layout` field (the `_config.yml` defaults set it).
- Every `images` entry has `src`, `alt`, `width`, and `height`. `src` is a bare filename that exists in `images/devlog/`, and `width`/`height` match the file's real pixel size (`sips -g pixelWidth -g pixelHeight`).
- No empty fields: delete an unused `platform:` or `youtube:` line, and never leave a blank `images` entry.
- `youtube` is a bare 11-character video id, not a URL.
- The body's first paragraph works as a standalone summary, since cards and the meta description use it. The body uses `##`/`###` headings, never `#`.
- Images are sRGB, at most 2400px wide, and preferably WebP, named `YYYY-MM-DD-what.ext` after the post's date.
- Video files are never committed; clips go on YouTube.

See `_posts/AGENTS.md`.
