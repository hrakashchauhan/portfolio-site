# Akash Kumar — The Operating Ledger

A personal site for **Akash Kumar**: a technically-literate operator moving toward project management. The concept
is **The Field Ledger** — a warm notebook record (ruled paper, a taped photo, right-margin annotations, one
soft-yellow highlighter) over a disciplined **blue-ink** status ledger: every real role is tagged `LIVE` /
`SHIPPED` / `KILLED`, with the Jeevan Jhola shutdown owned as a deliberate `KILLED` decision (judgment, not a gap),
and the Global Game Jam win featured as the one concrete project-management artifact. The form itself is the proof.
Static, fast, and dependency-free.

> Design note: a fusion of two looks the owner liked — a warm "Field Notes" notebook and a clean blue status
> ledger. One ink-blue accent (`#2B3A87`) on warm ruled paper; warmth comes from ~3 restrained devices (ruled-paper
> texture, a taped "me, lately" photo, mono margin annotations, one highlighter), never gimmicks. The direction was
> chosen by scoring five candidate directions across a critic panel, then hardened by a red-team and a visual-QA
> panel reading the actual renders.

## What it is
- A single static page: `index.html` + `styles/` + `js/` + `assets/`. **No build step, no framework, no tracker.**
- **Self-hosted fonts** — Newsreader (editorial serif, display + body), Inter (UI/labels), IBM Plex Mono
  (ledger machinery). Zero third-party requests at runtime.
- **Fully readable with JavaScript disabled.** WCAG 2.1 AA (one ink-blue accent; status shown by text label
  + glyph + colour, never colour alone). System dark mode, zero JS. Responsive 360→1440. Print styles included.
- **Automatic light / dark theme** — follows the visitor's OS setting via `prefers-color-scheme`, zero JavaScript.
  Both themes share the same single accent and keep AA contrast (the palette lives in `styles/tokens.css`).

See `CONTENT-TODO.md` for the real facts still to add.

## Run it locally
Easiest — **double-click `index.html`** (it works straight from the file system; no server needed).

With a local server (no Node or Python required — this uses PowerShell):
```
powershell -ExecutionPolicy Bypass -File scripts\serve.ps1
```
then open <http://localhost:8080/> (Ctrl+C to stop). `npx serve` or `python -m http.server` from the repo root work too.

## Deploy

### Option A — Netlify Drop (fastest, free HTTPS)
1. Open <https://app.netlify.com/drop>.
2. Drag the **whole project folder** onto the page.
3. You instantly get a live `https://<name>.netlify.app` URL.
4. (Optional) Site settings → Domain to rename or attach a custom domain.
5. Update the placeholder domain — see **Set your domain** below.

### Option B — GitHub Pages
1. Install Git, then: `powershell -ExecutionPolicy Bypass -File scripts\git-init.ps1` (creates the repo + commit history).
2. Create a GitHub repository and push to it.
3. Repo → **Settings → Pages → Deploy from branch → `main` / root**.
4. Your URL is `https://<user>.github.io/<repo>/`. Update the placeholder domain.

## The three things you'll edit

### 1) Set your domain
✅ Done — the live domain is `https://youfoundakash.netlify.app/` and it's wired everywhere. If you ever move to a
custom domain, find-and-replace `youfoundakash.netlify.app` (each spot is flagged with a `DOMAIN:` comment). Locations:
- `index.html` — `canonical`, `og:url`, `og:image`, `twitter:image`, JSON-LD `url` + `image` (one comment block lists them)
- `robots.txt` — the `Sitemap:` line
- `sitemap.xml` — the `<loc>` value

### 2) Your photo
`assets/akash.jpg` already holds your photo (optimised to 560×560, used in the hero and the OG/social image). To
change it, just overwrite that one file with a new roughly-square image (same filename).

### 3) Fill in the real numbers
See `CONTENT-TODO.md`. In `index.html`, search for the `ADD REAL …` HTML comments inside the ledger rows — that's
exactly where true figures go. **Only ever enter true values.**

## Regenerating assets (optional)
Both scripts render templates with headless Chrome/Edge — no Node/Python needed.
- Fonts: `powershell -ExecutionPolicy Bypass -File scripts\fetch-fonts.ps1` (downloads Newsreader + Inter + IBM Plex
  Mono as latin woff2 into `assets/fonts/` — already committed).
- OG image + favicons: `powershell -ExecutionPolicy Bypass -File scripts\generate-assets.ps1`
  (sources in `scripts/asset-src/`; it never overwrites your real `akash.jpg`).

## After you publish (grow it)
- **LinkedIn:** add the URL to Featured, the Contact/website field, and your headline.
- **GitHub:** put the URL in your profile bio.
- **Email signature:** add the URL.
- **Google Search Console:** add the property and submit `sitemap.xml`.

## Good-to-know
- Built in an environment **without Git, Node, or Python**. `scripts/git-init.ps1` reconstructs the intended
  milestone commit history once Git is installed; everything else is plain static files.
- `reference.html` is the original prior version, kept only for provenance — not the live page (`index.html` is),
  and disallowed in `robots.txt`. Delete it if you don't want it in the deploy.
- No analytics, no cookies, no third-party calls. By design.
