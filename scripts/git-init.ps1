# Recreates the intended milestone commit history once git is installed.
# (git was not available in the build environment, so the project was authored without it.)
# Usage:  powershell -ExecutionPolicy Bypass -File scripts\git-init.ps1
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Host "git is not installed. Get it from https://git-scm.com/download/win, reopen the terminal, then re-run."
  return
}

if (-not (Test-Path (Join-Path $root '.git'))) { git init | Out-Null }
# Identity for this repo (edit if you prefer different author metadata):
git config user.name  "Akash Kumar"
git config user.email "hrakashchauhan@gmail.com"
try { git symbolic-ref HEAD refs/heads/main } catch {}

function Commit($message, [string[]]$paths) {
  $existing = $paths | Where-Object { Test-Path $_ }
  if (-not $existing) { return }
  git add -- $existing
  git commit -m $message | Out-Null
  Write-Host "  committed: $message"
}

Commit "chore: scaffold, docs, deploy config, dev tooling" @(
  'BUILD-PLAN.md', 'README.md', 'CONTENT-TODO.md', '.gitignore', 'robots.txt',
  'sitemap.xml', 'site.webmanifest', 'scripts/serve.ps1', 'scripts/git-init.ps1')
Commit "feat: self-host Newsreader + IBM Plex Mono" @('assets/fonts', 'scripts/fetch-fonts.ps1')
Commit "feat: design tokens + ruled-paper base CSS" @('styles/tokens.css', 'styles/main.css')
Commit "feat: OG image, favicons, hero photo + asset generator" @(
  'assets/og-image.png', 'assets/favicon.svg', 'assets/favicon.png',
  'assets/apple-touch-icon.png', 'assets/akash.jpg', 'scripts/generate-assets.ps1', 'scripts/asset-src')
Commit "feat: all 11 content sections + SEO/JSON-LD head" @('index.html')
Commit "feat: progressive-enhancement JS (scroll-reveal, highlighter sweep)" @('js/main.js')

Write-Host "Done. Review with:  git log --oneline"
