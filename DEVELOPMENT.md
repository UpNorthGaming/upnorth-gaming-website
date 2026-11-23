# Development

How to run the site locally, post devlog updates, and set up hosting. For how the site is built (structure, theming, accessibility, regenerating images, commit conventions), see [`AGENTS.md`](AGENTS.md).

## Run it locally

You need Ruby 3.x. macOS ships 2.6, which is too old, and Ruby 4 isn't supported by GitHub Pages' gems yet.

```sh
brew install ruby@3.3
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"   # add to your shell profile to keep it
bundle config set --local path vendor/bundle         # installs gems inside the repo (git-ignored)
bundle install
bundle exec jekyll serve
```

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

Preview with `bundle exec jekyll serve`, then commit and push to `main`. GitHub Pages rebuilds within a minute or two.

**No local setup?** On GitHub, open the `_posts` folder, choose **Add file → Create new file**, name it as above, paste in the front matter and text, and commit to `main`. Upload images to `images/devlog/` the same way, with **Add file → Upload files**.

### Editing or removing a post

Edit its file and push. To unpublish a post, delete the file, or add `published: false` to its front matter to keep it as a draft. Renaming a file changes its address, which breaks links people have shared.

## Hosting setup

This only needs doing once, by a repo admin.

1. Under **Settings → Pages**, set **Source** to **Deploy from a branch**, with branch `main` and folder `/ (root)`.
2. Under **Custom domain**, enter `upnorthgaming.com` (the `CNAME` file already holds it). Turn on **Enforce HTTPS** once the certificate is issued.
3. At the domain registrar, point the apex domain at GitHub Pages with A records for `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`, and AAAA records for `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, and `2606:50c0:8003::153`. Add a `www` CNAME record pointing to `upnorthgaming.github.io`.

GitHub's guide: [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
