# Akash Kumar — The Record

A personal site for **Akash Kumar**: a technically-literate operator moving toward project management. The concept
is **The Record** — the whole page is one beautifully-typeset operations *record* an operator keeps of what he's
**shipped, killed, and is running now**: a masthead and dateline, a ruled ledger, tabular figures, margin notes,
footnotes, and a colophon. Warm archival **paper** (`#F4EFE3`), near-black warm ink, and one **editor's red**
(`#B5392B` — the editor's pen / "in the red" / the kill), used sparingly so it always means something. Every real
role is tagged `LIVE` / `SHIPPED` / `KILLED`; the Jeevan Jhola shutdown is owned as a deliberate decision (its own
case file with a `KILLED · ON PURPOSE` mark); and the Global Game Jam win is featured as the one concrete PM
artifact. The differentiator is editorial craft and restraint. Static, fast, and dependency-free.

> Design note: a ground-up v6 redesign (June 2026) replacing the dark "SIGNAL". Direction chosen by the owner from
> three candidates ("The Record — editorial"), motion kept deliberately restrained, accent chosen for meaning (an
> editor's red, no technical blue). Motion is content-serving only: section/ledger rules draw themselves on reveal,
> figures count up, the decision spine draws as you read down the case, the kill-mark sets in, a live Ernakulam
> clock ticks, links draw a red underline on hover — all vanilla JS, all degrading to a fully readable static page.

## What it is
- A single static page: `index.html` + `styles/` + `js/` + `assets/`. **No build step, no framework, no tracker.**
- **Self-hosted fonts** — Fraunces (variable serif; display + text) and IBM Plex Mono (machinery/figures). Zero
  third-party requests at runtime.
- **Fully readable with JavaScript disabled** (html.no-js shows everything; a 3s failsafe reveals all if JS dies).
  `prefers-reduced-motion` gets a fully static page. WCAG 2.1 AA on warm paper (contrast math in
  `styles/tokens.css`; status shown by text label + glyph + colour, never colour alone). Responsive 360→1440.
  Print styles included (a clean black-on-white record). Light identity by design.

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
- Fonts: `powershell -ExecutionPolicy Bypass -File scripts\fetch-fonts.ps1` (downloads Fraunces (roman + italic)
  + IBM Plex Mono as latin woff2 into `assets/fonts/` — already committed).
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
