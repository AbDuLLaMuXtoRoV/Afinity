# Stops the Afinity demo (local server and Cloudflare tunnel) started by start_demo.ps1.
param([switch]$Quiet)
$Demo = $PSScriptRoot
$Pids = Join-Path $Demo 'pids.txt'
if (Test-Path $Pids) {
    foreach ($id in (Get-Content $Pids).Split(' ', [StringSplitOptions]::RemoveEmptyEntries)) {
        & taskkill.exe /PID ([int]$id) /T /F 2>$null | Out-Null
    }
    Remove-Item $Pids -ErrorAction SilentlyContinue
}
if (-not $Quiet) { Write-Host 'Afinity demo stopped.' }
