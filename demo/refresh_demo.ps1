# Rebuilds the site and restarts only the local server, so the running demo shows the
# latest changes while KEEPING THE SAME public link (the Cloudflare tunnel is not touched).
#
#   powershell -ExecutionPolicy Bypass -File C:\Users\abdul\afinity\demo\refresh_demo.ps1
#
# If the demo is not running yet, use start_demo.ps1 instead.

$ErrorActionPreference = 'Stop'
$Demo    = $PSScriptRoot
$Project = Split-Path $Demo -Parent
$Logs    = Join-Path $Demo 'logs'
$Pids    = Join-Path $Demo 'pids.txt'
$Port    = 8010

if (-not (Test-Path $Pids)) { throw 'The demo is not running. Start it with start_demo.ps1.' }
$webPid, $tunnelPid = (Get-Content $Pids).Split(' ', [StringSplitOptions]::RemoveEmptyEntries)
if (-not (Get-Process -Id $tunnelPid -ErrorAction SilentlyContinue)) { throw 'The tunnel is not running. Start the demo with start_demo.ps1.' }

# 1) Build first: if it fails, the current demo keeps running untouched
Set-Location $Project
& npm.cmd run build *> (Join-Path $Logs 'build.log')
if ($LASTEXITCODE -ne 0) { throw "Build failed - the demo was left as it was. See $Logs\build.log" }

# 2) Restart the local server on the same port
& taskkill.exe /PID ([int]$webPid) /T /F 2>$null | Out-Null
for ($i = 0; $i -lt 20 -and (Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue); $i++) { Start-Sleep -Milliseconds 250 }
$web = Start-Process 'npm.cmd' -PassThru -WindowStyle Hidden -WorkingDirectory $Project `
    -ArgumentList 'run', 'preview', '--', '--host', '127.0.0.1', '--port', "$Port", '--strictPort' `
    -RedirectStandardOutput (Join-Path $Logs 'web.out.log') -RedirectStandardError (Join-Path $Logs 'web.log')
"$($web.Id) $tunnelPid" | Out-File -Encoding ascii $Pids

$url = (Get-Content (Join-Path $Demo 'demo_url.txt') -Raw).Trim()
Write-Host ''
Write-Host "Demo updated, same link: $url" -ForegroundColor Green
