# Akash Kumar — The Operating Ledger

A personal site for **Akash Kumar**: a technically-literate operator moving toward project management. The concept
is **The Operating Ledger** — a calm, editorial record whose single signature device is a *status ledger*: every
real role is tagged `LIVE` / `SHIPPED` / `KILLED`, with the Jeevan Jhola shutdown owned as a deliberate `KILLED`
decision (judgment, not a gap), and the Global Game Jam win featured as the one concrete project-management
artifact. The form itself is the proof. Static, fast, and dependency-free.

> Design note: refined to "institutional calm" — warm porcelain + ink with one terracotta accent, generous
> whitespace, and exactly one organizing device (the ledger row). Earlier gimmicks (ticker, boarding pass, gantt
> bars, dark dashboard, floating button) were deleted to concentrate the one strong idea. The direction was chosen
> by scoring four world-class candidate directions across recruiter / founder / designer / feasibility lenses.

## What it is
- A single static page: `index.html` + `styles/` + `js/` + `assets/`. **No build step, no framework, no tracker.**
- **Self-hosted fonts** — Fraunces (editorial serif display), Inter (body), IBM Plex Mono (labels/ledger). Zero
  third-party requests at runtime.
- **Fully readable with JavaScript disabled.** WCAG 2.1 AA (one terracotta accent; status shown by text label
  + glyph + colour, never colour alone). Responsive 360→1440. Print styles included.
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
Replace the placeholder `https://akashkumar.netlify.app/` everywhere it appears (each spot is flagged with a
`DOMAIN:` comment). Quickest: a project-wide find-and-replace of `akashkumar.netlify.app`. Locations:
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
- Fonts: `powershell -ExecutionPolicy Bypass -File scripts\fetch-fonts.ps1` (downloads Fraunces + Inter + IBM Plex
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
