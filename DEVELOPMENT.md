# Development

How to run the site locally, post devlog updates, add games, and set up hosting. For how the site is built (structure, theming, accessibility, regenerating images, commit conventions), see [`AGENTS.md`](AGENTS.md).

## Run it locally

You need Ruby 3.x. macOS ships 2.6, which is too old, and Ruby 4 isn't supported by GitHub Pages' gems yet.

```sh
brew install ruby@3.3
scripts/serve.sh
```

`scripts/serve.sh` installs the gems inside the repo (in `vendor/`, which git ignores) on first run, then runs `bundle exec jekyll serve`. It finds Homebrew's Ruby 3.3 without it being on your `PATH`, and passes any arguments on to Jekyll, e.g. `scripts/serve.sh --livereload`.

Then open <http://localhost:4000>. Jekyll rebuilds when you save a file, so just reload the page. Changes to `_config.yml` need a restart.

## Posting a devlog update

Each update is one Markdown file in `_posts/`. Jekyll turns it into:
- a card on the home page (the three newest show there)
- an entry on [`/updates/`](https://upnorthgaming.com/updates/)
- a page of its own
- an item in the RSS feed (`/feed.xml`)

### 1. Name the file

`_posts/YYYY-MM-DD-short-title.md`, for example `_posts/2026-12-04-frozen-lake-level.md`.

- The date in the name is the post's date. Posts are ordered by it, newest first.
- The rest becomes the address: `/updates/2026/12/04/frozen-lake-level/`.
- A post dated in the future stays hidden until the site is rebuilt on or after that date. Any later push rebuilds it.
- Jekyll only reads files in `_posts/` whose names start with the date, so it can't move into the front matter. Games don't have this rule (see [Adding a game](#adding-a-game)).

### 2. Write the front matter

The file starts with a block between `---` lines that describes the post, followed by the post itself in Markdown:

```markdown
---
title: First look at the frozen lake level
platform: Console
description: The ice cracks as you cross, so every route is a race against the thaw.
images:
  - src: 2026-12-04-frozen-lake.webp
    alt: The player's sled crossing a cracked frozen lake toward a pine island.
    width: 1600
    height: 900
  - src: 2026-12-04-fishing-shack.webp
    alt: A red fishing shack on the ice, its window lit, with snow drifting past.
    width: 1600
    height: 900
youtube: aqz-KE-bpKQ
---
We spent the week blocking out the frozen lake level. The ice cracks under
the player as they cross, so every route is a race against the thaw.

## What's next

- Wind that pushes the player across the ice
- A fishing shack you can hide in
```

| Field | Required | What it does |
|---|---|---|
| `title` | Yes | The post's headline. |
| `platform` | No | Shows a tag on the post. Use `Mobile`, `Console`, or `board.fun`. Leave it out for studio-wide news. |
| `description` | No | One sentence for search results and link previews. Without it, the first paragraph is used. |
| `images` | No | Screenshots shown under the post. The first one is the card's cover and the post's link-preview image. |
| `youtube` | No | A YouTube video id, shown above the images. |

The body is regular [Markdown](https://www.markdownguide.org/basic-syntax/): paragraphs, `## headings`, lists, `**bold**`, and `[links](https://example.com)`. The first paragraph doubles as the card's summary, so make it a good one.

### 3. Add images

Put them in `images/devlog/`, named with the post's date so they sort together, e.g. `2026-12-04-frozen-lake.webp`.

- **Size:** scale screenshots down to 1600px wide (at most 2400px). Bigger only slows the page down.
- **Format:** WebP keeps them small: `cwebp -q 85 shot.png -o images/devlog/2026-12-04-frozen-lake.webp` (`brew install webp`). PNG and JPEG work too.
- **Color:** screenshots should be sRGB. Mac captures of wide-color displays aren't, so convert them first: `sips --matchTo "/System/Library/ColorSync/Profiles/sRGB Profile.icc" shot.png`.
- **`width` and `height`:** the image's real pixel size. `sips -g pixelWidth -g pixelHeight <file>` prints it. The browser uses these to reserve space so the page doesn't jump while loading.
- **`alt`:** one sentence describing what's in the shot, for people using screen readers. Describe the scene, not "a screenshot".

### 4. Add a video (optional)

Upload gameplay clips to YouTube, then put the video's id in `youtube`. The id is the part after `v=` in `https://www.youtube.com/watch?v=aqz-KE-bpKQ`, or after the `/` in a `youtu.be` link. Videos aren't stored in this repo, since GitHub rejects large files. The embed uses YouTube's privacy-enhanced mode, so it sets no cookies until someone plays it.

### 5. Publish

Preview with `scripts/serve.sh`, then commit and push to `main`. GitHub Pages rebuilds within a minute or two.

**No local setup?** On GitHub, open the `_posts` folder, choose **Add file → Create new file**, name it as above, paste in the front matter and text, and commit to `main`. Upload images to `images/devlog/` the same way, with **Add file → Upload files**.

### Editing or removing a post

Edit its file and push. To unpublish a post, delete the file, or add `published: false` to its front matter to keep it as a draft. Renaming a file changes its address, which breaks links people have shared.

## Adding a game

Each released game is one Markdown file in `_games/`, written the same way as a devlog post. Jekyll turns it into a card in the home page's "Our Games" section, with a button for each store it's on. Games don't get pages of their own. Until the first one is added, the section says the first game is in development.

### 1. Name the file

`_games/short-name.md`, for example `_games/frozen-lake.md`. Unlike posts, the name has no date in it; the release date goes in the front matter instead. The name never shows on the site, so it's safe to rename.

### 2. Write the front matter

```markdown
---
title: Frozen Lake
date: 2027-03-14
platforms:
  - Mobile
  - Console
description: Race across a thawing lake before the ice gives way.
cover:
  src: frozen-lake-cover.webp
  alt: A sled racing across a cracked frozen lake toward a pine island at dusk.
  width: 1200
  height: 675
links:
  - label: Download on the App Store
    url: https://apps.apple.com/app/frozen-lake/id0000000000
  - label: Get it on Google Play
    url: https://play.google.com/store/apps/details?id=com.upnorthgaming.frozenlake
  - label: PlayStation Store
    url: https://store.playstation.com/en-us/product/0000
---
Race across a thawing lake before the ice gives way, on your phone or your PS5.
```

| Field | Required | What it does |
|---|---|---|
| `title` | Yes | The game's name. |
| `date` | Yes | The release date, as `YYYY-MM-DD`. Games are ordered by it, newest first. It isn't shown. A game dated in the future stays hidden until the site is rebuilt on or after that date, like a post. |
| `platforms` | No | Tags on the card. Use `Mobile`, `Console`, or `board.fun`, the same names posts use. |
| `description` | No | One sentence for the card. Without it, the first paragraph is used. |
| `cover` | No | The card's image. Without it, the card shows the studio's emblem on navy. |
| `links` | No | One button per store. `label` is the button's text, in your own words, and `url` is the full store address. |

Only the body's first paragraph is used, and only when there's no `description`, since games have no page to show the rest on.

### 3. Add the cover

Put it in `images/games/`, named after the file, e.g. `frozen-lake-cover.webp`.

- **Shape and size:** 16:9, 1200x675. The card crops anything else to 16:9.
- **Format, color, `width`/`height`, and `alt`:** the same as devlog images (see [Add images](#3-add-images)).

### 4. Publish

Preview with `scripts/serve.sh`, then commit and push to `main`. On GitHub, use **Add file → Create new file** in the `_games` folder, and **Add file → Upload files** in `images/games/`.

### Editing or removing a game

Edit its file and push. To take a game down, delete the file, or add `published: false` to keep it for later.

## Hosting setup

This only needs doing once, by a repo admin.

1. Under **Settings → Pages**, set **Source** to **Deploy from a branch**, with branch `main` and folder `/ (root)`.
2. Under **Custom domain**, enter `upnorthgaming.com` (the `CNAME` file already holds it). Turn on **Enforce HTTPS** once the certificate is issued.
3. At the domain registrar, point the apex domain at GitHub Pages with A records for `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`, and AAAA records for `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, and `2606:50c0:8003::153`. Add a `www` CNAME record pointing to `upnorthgaming.github.io`.

GitHub's guide: [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
