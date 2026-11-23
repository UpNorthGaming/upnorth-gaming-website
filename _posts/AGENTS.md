# Devlog posts

Every file here named `YYYY-MM-DD-slug.md` is a devlog post. Jekyll skips any other name, so this file and `CLAUDE.md` are never treated as posts (`_config.yml` excludes them by path too). `DEVELOPMENT.md` has the step-by-step guide for people; this is the contract.

## Naming

- `YYYY-MM-DD-slug.md`, where the slug is lowercase words joined by hyphens.
- The date is the post's date and sort key. The permalink is `/updates/YYYY/MM/DD/slug/` (`permalink` in `_config.yml`). Renaming a published post changes its URL and breaks shared links, so don't, unless asked.
- Jekyll leaves out future-dated posts (`future: false` is the default) until a build runs on or after that date.

## Front matter

| Field | Type | Rendered by | Notes |
|---|---|---|---|
| `title` | string, required | `_layouts/post.html`, `_includes/update-card.html`, `<title>`, `og:title`, the feed | Sentence case, no trailing period. |
| `platform` | `Mobile` \| `Console` \| `board.fun` | `_includes/update-meta.html` as `.platform-tag` | Must match `index.html`'s platform names exactly, and the names games use in `platforms` (`_games/AGENTS.md`). Omit it for studio-wide posts. |
| `description` | string | `<meta name="description">`, `og:description`, the card summary | One sentence, about 160 characters at most. Falls back to the excerpt (the first paragraph). |
| `images` | list of `{src, alt, width, height}` | `post.html`'s `.post-media`; the first one is also the card cover and `og:image` | `src` is a bare filename inside `images/devlog/`. `width` and `height` are the file's real pixel size. Every entry needs `alt`. |
| `youtube` | string | `_includes/youtube.html` | The bare video id (`aqz-KE-bpKQ`), never a URL. Embedded from youtube-nocookie.com. |
| `published` | `false` | Jekyll | Hides a post without deleting it. |

Leave out `layout`: `_config.yml`'s `defaults` give every post `layout: post`.

## Body

- Markdown (kramdown). The first paragraph is the excerpt that cards and the meta description use, so it should stand on its own as a summary of one or two sentences.
- Use `##` and `###` for sections. The page's only `h1` is the title.
- Don't embed raw `<img>` tags; list images in `images` so they get sizes, lazy loading, and the right layout.

## Images

- Store them in `images/devlog/` as `YYYY-MM-DD-what.webp`, matching the post's date.
- Downscale to the size they display at, at most 2x. Posts display at about 44rem (704px), so 1600px wide is plenty.
- Convert to sRGB first (`sips --matchTo "/System/Library/ColorSync/Profiles/sRGB Profile.icc"`), since browsers read untagged pixels as sRGB and wide-gamut captures come out dull.
- Encode screenshots as WebP (`cwebp -q 85`). UI captures with lots of text read better lossless (`cwebp -lossless -z 9`).
- The first image becomes the link preview, which crawlers show at 1.91:1, so a 16:9 shot works best first.
- Alt text describes what's on screen, including any visible text, as one sentence a listener can picture: "The player's sled crossing a cracked frozen lake toward a pine island." Never "screenshot of …".

## Template

```markdown
---
title:
platform:
description:
images:
  - src: YYYY-MM-DD-name.webp
    alt:
    width: 1600
    height: 900
youtube:
---
First paragraph: what changed and why it matters, in a sentence or two.
```

Delete any field you leave empty: a blank `platform:` or `youtube:` renders nothing, but a blank `images` entry renders a broken image.

## Checking

Run `bundle exec jekyll serve`, then open the home page, `/updates/`, and the post itself in both themes. A post with no images shows the emblem on navy as its card cover.
