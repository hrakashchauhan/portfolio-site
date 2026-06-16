# Akash Kumar — The Record

> A static personal site built as a single, beautifully-typeset operations *record* — what one operator has shipped, killed, and is running now.

The whole page reads like an editorial ledger: a masthead and dateline, ruled rows, tabular figures, margin notes, footnotes, and a colophon. Every role is tagged `LIVE`, `SHIPPED`, or `KILLED`. Warm archival paper (`#F4EFE3`), near-black warm ink, and a single editor's red (`#B5392B`) used sparingly so it always means something. No framework, no build step, no tracker — just HTML, CSS, and a small amount of vanilla JavaScript.

**Live:** <https://youfoundakash.netlify.app/>

## Highlights

- **Single static page** — `index.html` plus `styles/`, `js/`, and `assets/`. Open it straight from the file system; no server required.
- **Self-hosted fonts** — Fraunces (variable serif, roman + italic) and IBM Plex Mono, served as local `woff2`. Zero third-party requests at runtime.
- **Progressive enhancement** — fully readable with JavaScript disabled (the page renders everything; a 3-second failsafe reveals all content even if the script fails to boot).
- **Restrained, content-serving motion** — section rules draw on reveal, figures count up, a decision "spine" draws as you read down a case file, a `KILLED` stamp sets, and a live Ernakulam (IST) clock ticks. All vanilla JS, all degrading gracefully.
- **Accessibility & responsiveness** — honours `prefers-reduced-motion` (static page), status conveyed by text label + glyph + colour (never colour alone), responsive 360→1440, and print styles for a clean black-on-white record.
- **No analytics, no cookies, no third-party calls** — by design.

## Tech stack

- Plain **HTML5**, **CSS** (custom properties / design tokens in `styles/tokens.css`), and **vanilla JavaScript** (`js/main.js`) — no dependencies, no build.
- Self-hosted **Fraunces** and **IBM Plex Mono** webfonts (`assets/fonts/`).
- PowerShell helper scripts for local serving and asset regeneration (optional).

## Getting started

The simplest way to view the site is to **open `index.html` in a browser** — it works directly from the file system.

To serve it over HTTP locally (no Node or Python needed):

```
powershell -ExecutionPolicy Bypass -File scripts\serve.ps1
```

Then open <http://localhost:8080/>. Any static server works just as well, e.g. `npx serve` or `python -m http.server` from the repo root.

## Project structure

```
portfolio-site/
├── index.html            # the site (single page)
├── styles/
│   ├── main.css          # layout + components
│   └── tokens.css        # colour, type, and spacing tokens
├── js/
│   └── main.js           # reveals, counters, clock, copy-email (vanilla)
├── assets/
│   ├── akash.jpg         # hero / social photo
│   ├── og-image.png      # Open Graph share image
│   ├── favicon.*         # favicons + apple-touch-icon
│   └── fonts/            # self-hosted woff2 + fonts.css
├── scripts/              # PowerShell: serve, fetch-fonts, generate-assets, git-init
├── robots.txt
├── sitemap.xml
└── site.webmanifest
```

## Regenerating assets (optional)

PowerShell scripts render templates with headless Chrome/Edge — no Node or Python required:

- **Fonts:** `powershell -ExecutionPolicy Bypass -File scripts\fetch-fonts.ps1` — downloads the Fraunces and IBM Plex Mono `woff2` files into `assets/fonts/`.
- **OG image + favicons:** `powershell -ExecutionPolicy Bypass -File scripts\generate-assets.ps1` — sources live in `scripts/asset-src/`; it never overwrites your real `akash.jpg`.

## Notes

- `reference.html`, `design-directions.html`, and `design-directions-2.html` are kept for provenance of the design exploration — they are not the live page (`index.html` is) and `reference.html` is disallowed in `robots.txt`.
- `BUILD-PLAN.md` and `CONTENT-TODO.md` are development notes used while building the site.
- The canonical domain is referenced in `index.html`, `robots.txt`, and `sitemap.xml`; each spot to change is flagged with a `DOMAIN:` comment.

## Author

Akash Kumar — operator, building toward project management ([@hrakashchauhan](https://github.com/hrakashchauhan))
