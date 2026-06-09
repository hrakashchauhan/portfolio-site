# Generates og-image.png (1200x630), favicon.png (512), apple-touch-icon.png (180),
# and the placeholder akash.jpg by rendering the templates in scripts/asset-src/ with
# headless Chrome/Edge. No Node or Python needed.
# Usage:  powershell -ExecutionPolicy Bypass -File scripts\generate-assets.ps1
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$src  = Join-Path $root 'scripts\asset-src'
$out  = Join-Path $root 'assets'
$tmp  = Join-Path $root '.asset-tmp'        # under repo root => no spaces in paths
New-Item -ItemType Directory -Force -Path $tmp | Out-Null

$browser = $null
foreach ($p in @(
  "C:\Program Files\Google\Chrome\Application\chrome.exe",
  "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
  "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
  "C:\Program Files\Microsoft\Edge\Application\msedge.exe")) { if (Test-Path $p) { $browser = $p; break } }
if (-not $browser) { throw "No Chrome or Edge found to render assets." }
Write-Host "Renderer: $browser"
Add-Type -AssemblyName System.Drawing

function Shot([string]$htmlPath, [string]$pngOut, [int]$w, [int]$h, [bool]$transparent) {
  if (Test-Path $pngOut) { Remove-Item $pngOut -Force }
  $uri = 'file:///' + ($htmlPath -replace '\\', '/')
  $a = @('--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
         "--window-size=$w,$h", '--virtual-time-budget=3000', "--screenshot=$pngOut")
  if ($transparent) { $a += '--default-background-color=00000000' }
  $a += $uri
  $prev = $ErrorActionPreference; $ErrorActionPreference = 'Continue'
  & $browser @a 2>$null | Out-Null
  $ErrorActionPreference = $prev
  $n = 0; while (-not (Test-Path $pngOut) -and $n -lt 30) { Start-Sleep -Milliseconds 200; $n++ }
  if (-not (Test-Path $pngOut)) { throw "render failed: $pngOut" }
  $img = [System.Drawing.Image]::FromFile($pngOut); $d = "$($img.Width)x$($img.Height)"; $img.Dispose()
  Write-Host ("  {0,-22} {1}" -f [System.IO.Path]::GetFileName($pngOut), $d)
}

function ToJpeg([string]$pngPath, [string]$jpgPath, [int]$quality) {
  $img = [System.Drawing.Image]::FromFile($pngPath)
  $bmp = New-Object System.Drawing.Bitmap $img.Width, $img.Height
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::FromArgb(236, 234, 225))
  $g.DrawImage($img, 0, 0, $img.Width, $img.Height)
  $g.Dispose(); $img.Dispose()
  $enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
  $ep = New-Object System.Drawing.Imaging.EncoderParameters 1
  $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [int64]$quality)
  if (Test-Path $jpgPath) { Remove-Item $jpgPath -Force }
  $bmp.Save($jpgPath, $enc, $ep); $bmp.Dispose()
  Write-Host ("  {0,-22} {1}" -f [System.IO.Path]::GetFileName($jpgPath), "jpeg q$quality")
}

# 1) Open Graph image
Shot (Join-Path $src 'og.html') (Join-Path $out 'og-image.png') 1200 630 $false

# 2) Favicons rendered from assets/favicon.svg (single source of truth)
$svg = Get-Content (Join-Path $out 'favicon.svg') -Raw
$base = 'html,body{margin:0;width:100%;height:100%}svg{display:block;width:100%;height:100%}'
$iconHtml  = "<!doctype html><html><head><meta charset='utf-8'><style>$base body{background:transparent}</style></head><body>$svg</body></html>"
$appleHtml = "<!doctype html><html><head><meta charset='utf-8'><style>$base body{background:#1B4DFF}</style></head><body>$svg</body></html>"
Set-Content -Path (Join-Path $tmp 'icon.html')  -Value $iconHtml  -Encoding UTF8
Set-Content -Path (Join-Path $tmp 'apple.html') -Value $appleHtml -Encoding UTF8
Shot (Join-Path $tmp 'icon.html')  (Join-Path $out 'favicon.png')          512 512 $true
Shot (Join-Path $tmp 'apple.html') (Join-Path $out 'apple-touch-icon.png') 180 180 $false

# 3) Placeholder hero photo -> akash.jpg (never clobber a real photo)
$photoPath = Join-Path $out 'akash.jpg'
if (Test-Path $photoPath) {
  Write-Host "  akash.jpg already exists - leaving it (delete it to regenerate the placeholder)."
} else {
  $photoPng = Join-Path $tmp 'photo.png'
  Shot (Join-Path $src 'photo.html') $photoPng 480 480 $false
  ToJpeg $photoPng $photoPath 86
}

Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "Done -> /assets (og-image.png, favicon.png, apple-touch-icon.png, akash.jpg)."
