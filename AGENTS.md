# upnorthgaming.com

The UpNorth Gaming studio site: a home page (hero, the latest devlog posts, and the team), a devlog archive at `/updates/`, and a page per post. GitHub Pages builds it with Jekyll from the root of `main` and serves it at `upnorthgaming.com` (`CNAME`). There is no other build step: pushing to `main` publishes.

Folders with their own rules have their own `AGENTS.md`: [`_posts/`](_posts/AGENTS.md), [`_layouts/`](_layouts/AGENTS.md) (also covers `_includes/`), [`styles/`](styles/AGENTS.md), [`scripts/`](scripts/AGENTS.md), and [`scripts/brand/`](scripts/brand/AGENTS.md). Each `CLAUDE.md` is a symlink to the `AGENTS.md` beside it.

## Stack

- Hand-written HTML, CSS, and vanilla JavaScript, templated by Jekyll's Liquid. No frameworks, CSS libraries, web fonts, or JS build tools.
- Plugins are limited to GitHub Pages' allowlist: `jekyll-feed` (`/feed.xml`) and `jekyll-sitemap` (`/sitemap.xml`, `/robots.txt`). `theme: null` stops Pages from adding its Primer theme.
- Vendored code, if ever needed, lives unmodified in `third-party/<name>/` (`vendor/` is Bundler's, and git-ignored), with its version noted here and its license published as `.txt`, since Markdown files aren't published.
- `Gemfile` pins `github-pages`, which pins Jekyll and every plugin to what Pages runs. It needs Ruby 3.x (the Gemfile's `ruby` line), since its `commonmarker` dependency doesn't support Ruby 4.

## Project structure

```
index.html                  Home page
updates.html                Devlog archive at /updates/ (its permalink), every post newest first
404.html                    Not-found page (Pages serves it for any missing path)
_config.yml                 Jekyll config, including the `exclude` list
_layouts/                   Page shells: default (every page) and post
_includes/                  head, header, footer, update-card, update-meta, youtube
_posts/                     Devlog posts, one Markdown file each
styles/                     index-common.css, index-light.css, index-dark.css
scripts/                    dark-mode.js, overview-return.js
scripts/brand/              Unpublished masters, asset script, link preview source
images/                     logo.webp, logo-mark.png, hero-winter.webp, og-image.png
images/devlog/              Post images
favicon.png, favicon.ico, apple-touch-icon.png
.agents/                    Agent checks and skills (.claude/ and .codex/ link here)
CNAME, Gemfile, .gitignore
AGENTS.md, CLAUDE.md, README.md, DEVELOPMENT.md
```

## Publishing

- Jekyll renders any file with front matter (the `---` block) through Liquid and copies everything else verbatim. Pages and posts have front matter and pull in the layouts and includes; CSS, JS, and images never have any, so they're published byte for byte.
- Jekyll skips names starting with `_` or `.` on its own. Everything else that isn't part of the site is listed in `_config.yml`'s `exclude`. **Docs are listed by path, never with `**/*.md`**, since that pattern would also drop every post in `_posts/`. A new `AGENTS.md`, `CLAUDE.md`, or unpublished root file needs its own line there.
- Every internal URL goes through `relative_url` (or `absolute_url` for meta tags), so the site still works if it's ever served from a subpath.

## Look and theming

- Colors come from the logo (`scripts/brand/logo-master.png`): navy `#0a2f4a`, gold `#efa933`, cream `#f8f1e3`, and ice `#b8e5ff`.
- The design is **flat**: solid fills and hairline borders, with no glass, blur, glows, gradients, or decorative shadows. The one exception is the home page's header, which lies over the hero and fades into its photo.
- There are two designed themes:
  - **Light** ("snow at noon"): an ice-tinted white, with navy text.
  - **Dark** ("night up north"): the navy-black of the hero's sky, with cream text.
- Gold is a fill color in both themes, never text on the page background.
- The hero is the same in both themes: the winter night photo under a flat navy scrim, with fixed colors that don't follow the theme. On the home page (`hero: true` in its front matter), the header lies over its top and takes its colors.
- `styles/AGENTS.md` holds the token contract, type scale, layout, components, and CSS conventions.
- **Theme switching.** Both theme sheets load on every page, media-scoped to `prefers-color-scheme`, so the page follows the OS with no JavaScript. `scripts/dark-mode.js` acts only when the toggle has stored an override.

## Update together

| Change | Also update |
|---|---|
| A theme's `--bg` | The `theme-color` metas in `_includes/head.html`, `scripts/dark-mode.js`, and, for dark, the link preview |
| Logo | `scripts/brand/logo-master.png`, then rerun `scripts/brand/export_assets.py` (header mark, favicons, touch icon), re-encode `logo.webp`, and re-render the link preview |
| Name, tagline, hero copy, or hero photo | `index.html` and `scripts/brand/og-image.html` together, then re-render the link preview |
| An image's pixel size | Its `<img>` `width` and `height` (or a post's `images` entry) |
| A new unpublished file, or a new `AGENTS.md`/`CLAUDE.md` | `_config.yml` `exclude` |
| Files, conventions, or behavior | This file, the nearest folder `AGENTS.md`, and `DEVELOPMENT.md` (keep `README.md` to a short overview) |

## Devlog

Posts are Markdown files in `_posts/` named `YYYY-MM-DD-slug.md`. Their front matter can set:
- `title` (required)
- `platform` (`Mobile`, `Console`, or `board.fun`)
- `description`
- `images`, which live in `images/devlog/`
- `youtube` (a bare video id)

The home page shows the newest three. `/updates/` lists all of them, and each gets `/updates/YYYY/MM/DD/slug/`. A post dated in the future isn't published until a later build. The full contract and a template are in [`_posts/AGENTS.md`](_posts/AGENTS.md); the human guide is in `DEVELOPMENT.md`.

## Accessibility

- **Contrast.** Text holds 4.5:1 against whatever it sits on; non-text UI (control borders, icons that carry meaning) holds 3:1. Composite translucent layers over their background before measuring, and note the checked ratio in a comment beside the token.
- **Hover** styles live only inside `@media (hover: hover) and (pointer: fine)`, so touch screens don't get stuck hover states.
- **Focus.** `a`, `button`, and `iframe` show a 2px `--accent-text` outline on `:focus-visible`.
- **Motion.** `prefers-reduced-motion` is honored in CSS (the last block of `index-common.css`) and in scripted scrolling.
- **Zoom.** The viewport meta never sets `user-scalable=no`.
- **Icon-only controls** have an `aria-label` and `aria-hidden="true"` SVGs. A toggle's label names its on state ("Dark mode"), and `aria-pressed` carries the state.
- **Narrow screens.** Every page works at 320px wide and at 200% text with no horizontal scroll and nothing clipped or hidden under the scroll-to-top button.

## Writing

- Page copy is plain and concrete, with no hype. Headings are sentence case. Side-by-side copy (like the developer cards) stays about the same length, so the columns wrap to the same number of lines.
- Say each thing once. The studio's name is in the hero's logo and the page title, so the header shows only the emblem; the tagline names the platforms, so they get no section of their own.
- The meta description reads "UpNorth Gaming is …: …".
- Alt text describes what's visible, in one sentence a listener can picture. Decorative images, like the hero photo behind the logo, get `alt=""`. The header's emblem is the home link's only content, so its alt is the studio's name.
- Code comments say why, in full sentences in the present tense. They name the source of a value and anything that must change with it. Use caps only to stop a plausible mistake, like renaming `overview-return`.

## Images

- `images/hero-winter.webp`: `scripts/brand/hero-winter-master.jpg` encoded with `cwebp -q 80 -m 6`, at 1536x1024.
- `images/logo.webp`, `images/logo-mark.png`, and the icons: generated by `scripts/brand/export_assets.py` (see [`scripts/brand/AGENTS.md`](scripts/brand/AGENTS.md)).
- **Developer avatars** are initials until there are photos. To add one, square-crop the photo to 144x144 (2x the avatar) in sRGB, save it as `images/team/<name>.jpg`, and put an `<img>` (with `alt`, `width`, `height`, `loading="lazy"`, and `decoding="async"`) inside that developer's `.avatar` in place of the initials. Then drop the avatar's `aria-hidden`.

### Link preview

`images/og-image.png` is the 1200x630 card that link unfurls show for every page except posts with images, which use their first image. It's an opaque PNG of the hero on the dark theme, rendered from `scripts/brand/og-image.html`. Re-render it in the same change as anything it shows. From the repo root:

```sh
profile=$(mktemp -d) && rm -f images/og-image.png && \
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --force-dark-mode \
    --force-device-scale-factor=1 --hide-scrollbars --user-data-dir="$profile" --window-size=1200,630 \
    --virtual-time-budget=5000 --screenshot="$PWD/images/og-image.png" "file://$PWD/scripts/brand/og-image.html"; \
rm -rf "$profile"; file images/og-image.png
```

`file` must report `1200 x 630` and `RGB` (not RGBA). View the PNG to check that nothing overflows. Keep it a PNG, since crawler support for WebP is patchy.

## Verify

Serve with `bundle exec jekyll serve` (`http://localhost:4000`) rather than opening files, so permalinks, includes, and the feed behave as on Pages. To exercise the devlog, add a throwaway post with two images and a `youtube` id, then delete it before committing. Check:

- **Themes.** Both themes from the OS setting and from the toggle, after a reload too, with `aria-pressed` following. With JavaScript off, the page still follows the OS.
- **Narrow screens.** 320px wide at 100% and 200% text: no horizontal scroll, nothing clipped.
- **Devlog.** Home cards, `/updates/`, a post page, the empty state with no posts, and the 404 page.
- **Unpublished files.** `_site/` contains nothing from `scripts/brand/`, `.agents/`, or any `AGENTS.md`, `CLAUDE.md`, `README.md`, or `DEVELOPMENT.md`.

Headless Chrome follows the OS appearance. Force light with `--blink-settings=preferredColorScheme=1` and dark with `--force-dark-mode`. `--window-size` won't go below 500px wide, so for 320px, frame the page in a 320px `<iframe>` on a page served from the same origin (so a script can also set the frame's root `font-size` to 200%), or use a browser's responsive mode.

## Agent skills and checks

- `.agents/skills/self-review-diff/` is a copy of Aidan's global skill, so everyone working here has it. Re-sync it when the original changes.
- `.agents/checks/` holds lint-style rules for `scripts/`, `styles/`, the HTML and Liquid templates, and `_posts/`.
- `.claude/` and `.codex/` link both folders, so Claude Code and Codex find them.

## Commits

- Run the `/self-review-diff` skill loop over the change before every commit, and fix what it finds.
- Commit on `main` unless asked otherwise.
- Write the subject as a plain sentence-case summary, with no conventional-commit prefix like `feat:`, `fix:`, or `chore:`.
- Surround file, class, function, and variable names with backticks, e.g. "Add `platform-tag` to `update-card.html`".
- Keep the body as short as possible. Put line breaks only between paragraphs, never to wrap lines at a fixed width.
- End with a trailer naming the agent:
    - Claude: `Co-authored-by: Claude <noreply@anthropic.com>`
    - Codex: `Co-authored-by: Codex <noreply@openai.com>`
