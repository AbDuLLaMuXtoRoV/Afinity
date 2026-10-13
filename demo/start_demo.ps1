# Afinity website demo: builds the site, serves it on this computer and shares it
# through a Cloudflare quick tunnel (a new public https://….trycloudflare.com link every time).
#
#   Start:  powershell -ExecutionPolicy Bypass -File C:\Users\abdul\afinity\demo\start_demo.ps1
#   Stop:   powershell -ExecutionPolicy Bypass -File C:\Users\abdul\afinity\demo\stop_demo.ps1
#
# The link works only while this computer is on and the demo is running.

$ErrorActionPreference = 'Stop'
$Demo    = $PSScriptRoot
$Project = Split-Path $Demo -Parent
$Logs    = Join-Path $Demo 'logs'
$Port    = 8010
New-Item -ItemType Directory -Force $Logs | Out-Null

# Stop a previous run first
& (Join-Path $Demo 'stop_demo.ps1') -Quiet

# cloudflared: this folder, the Bibo demo folder, or anywhere on PATH
$Cloudflared = @(
    (Join-Path $Demo 'cloudflared.exe'),
    'C:\Users\abdul\Projects\bibo-demo\cloudflared.exe'
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $Cloudflared) { $Cloudflared = (Get-Command cloudflared -ErrorAction SilentlyContinue).Source }
if (-not $Cloudflared) { throw 'cloudflared.exe not found. Put it in the demo folder: https://github.com/cloudflare/cloudflared/releases' }

# 1) Fresh production build
Set-Location $Project
if (-not (Test-Path (Join-Path $Project 'node_modules'))) { & npm.cmd install *> (Join-Path $Logs 'npm-install.log') }
& npm.cmd run build *> (Join-Path $Logs 'build.log')
if ($LASTEXITCODE -ne 0) { throw "Build failed - see $Logs\build.log" }

# 2) Serve the built site locally
$web = Start-Process 'npm.cmd' -PassThru -WindowStyle Hidden -WorkingDirectory $Project `
    -ArgumentList 'run', 'preview', '--', '--host', '127.0.0.1', '--port', "$Port", '--strictPort' `
    -RedirectStandardOutput (Join-Path $Logs 'web.out.log') -RedirectStandardError (Join-Path $Logs 'web.log')

# 3) Public link (Cloudflare quick tunnel)
$TunnelLog = Join-Path $Logs 'tunnel.log'
Remove-Item $TunnelLog -ErrorAction SilentlyContinue
$tunnel = Start-Process $Cloudflared -PassThru -WindowStyle Hidden `
    -ArgumentList 'tunnel', '--no-autoupdate', '--url', "http://127.0.0.1:$Port" `
    -RedirectStandardOutput (Join-Path $Logs 'tunnel.out.log') -RedirectStandardError $TunnelLog

"$($web.Id) $($tunnel.Id)" | Out-File -Encoding ascii (Join-Path $Demo 'pids.txt')

$url = $null
for ($i = 0; $i -lt 60 -and -not $url; $i++) {
    Start-Sleep -Seconds 1
    if (Test-Path $TunnelLog) {
        $m = Select-String -Path $TunnelLog -Pattern 'https://(?!api\.)[a-z0-9-]+\.trycloudflare\.com' | Select-Object -First 1
        if ($m) { $url = $m.Matches[0].Value }
    }
}
if (-not $url) { throw "No Cloudflare link received - check the internet connection ($TunnelLog)" }

$url | Out-File -Encoding ascii (Join-Path $Demo 'demo_url.txt')
Write-Host ''
Write-Host "Afinity demo is live: $url" -ForegroundColor Green
Write-Host "(the link is also saved in $Demo\demo_url.txt)"
