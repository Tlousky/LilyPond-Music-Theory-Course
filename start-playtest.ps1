<#
.SYNOPSIS
    Starts the LilyPond Music Theory Course web application for playtesting.

.DESCRIPTION
    Checks for available TCP ports (to avoid collisions with other running Vite instances),
    ensures dependencies are installed, displays a playtesting feature guide, and launches
    the Vite development server with optional automatic browser launch.

.PARAMETER StartPort
    The initial port to check. Defaults to 3000.

.PARAMETER NoBrowser
    Do not automatically open the default web browser.

.EXAMPLE
    .\start-playtest.ps1
    .\start-playtest.ps1 -StartPort 3000 -NoBrowser
#>

[CmdletBinding()]
param (
    [int]$StartPort = 3000,
    [switch]$NoBrowser
)

$ErrorActionPreference = "Stop"

# Resolve directories
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$AppDir = Join-Path $ScriptDir "apps\course-web"

if (-not (Test-Path $AppDir)) {
    Write-Error "Could not find apps\course-web at: $AppDir"
    exit 1
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " 🎵 LilyPond Music Theory Course - Playtest Launcher" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# Ensure node & npm are available
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "[OK] Node.js $nodeVersion (npm $npmVersion) detected." -ForegroundColor Green
} catch {
    Write-Error "Node.js and npm are required to run this project. Please install them and try again."
    exit 1
}

# Ensure dependencies are installed
$NodeModulesDir = Join-Path $AppDir "node_modules"
if (-not (Test-Path $NodeModulesDir)) {
    Write-Host "Dependencies missing. Running 'npm install' in apps\course-web..." -ForegroundColor Yellow
    Push-Location $AppDir
    try {
        npm install
    } finally {
        Pop-Location
    }
}

# Function to test port availability
function Test-PortAvailable ([int]$port) {
    try {
        $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
        $listener.Start()
        $listener.Stop()
        return $true
    } catch {
        return $false
    }
}

# Search for available port
Write-Host "Checking for available TCP port starting at $StartPort..." -ForegroundColor Gray
$selectedPort = $StartPort
$maxPort = $StartPort + 100
$foundPort = $false

while ($selectedPort -le $maxPort) {
    if (Test-PortAvailable $selectedPort) {
        $foundPort = $true
        break
    }
    Write-Host "  Port $selectedPort is currently in use (e.g. by another Vite app). Trying $($selectedPort + 1)..." -ForegroundColor DarkGray
    $selectedPort++
}

if (-not $foundPort) {
    Write-Error "Could not find an open TCP port between $StartPort and $maxPort."
    exit 1
}

Write-Host "[OK] Selected open port: $selectedPort" -ForegroundColor Green
Write-Host ""

# Playtest Features Overview
Write-Host "----------------------------------------------------------" -ForegroundColor DarkCyan
Write-Host " 🚀 Playtesting Guide & Key Features:" -ForegroundColor Yellow
Write-Host "  1. Curriculum Map: Interactive skill tree with locked/unlocked lesson nodes" -ForegroundColor White
Write-Host "  2. 5-Stage Lessons: Theory Card -> Quiz -> LilyPond Syntax -> Code Challenge -> Classical Capstone" -ForegroundColor White
Write-Host "  3. Monaco Editor: Custom LilyPond Monarch syntax highlighting & Quick-Palette" -ForegroundColor White
Write-Host "  4. Live Engraver: Vector SVG score preview with click-to-code note focus" -ForegroundColor White
Write-Host "  5. Virtual Piano: Displays ASPN notes & LilyPond syntax hints (c', cis', d') on keys" -ForegroundColor White
Write-Host "  6. USB MIDI Support: Plug in a physical USB/Bluetooth MIDI keyboard anytime" -ForegroundColor White
Write-Host "  7. Rhythm Tapper: Metronome pulse with spacebar rhythm timing accuracy" -ForegroundColor White
Write-Host "  8. Classical Repertoire: Authentic pieces by Petzold, Bach, Mozart, Beethoven, Pachelbel" -ForegroundColor White
Write-Host "----------------------------------------------------------" -ForegroundColor DarkCyan
Write-Host ""

$url = "http://localhost:$selectedPort"
Write-Host "Starting Vite development server at: " -NoNewline
Write-Host $url -ForegroundColor Green -BackgroundColor Black
Write-Host "Press Ctrl+C in this terminal to stop the server." -ForegroundColor Gray
Write-Host ""

Push-Location $AppDir
try {
    $viteArgs = @("vite", "--port", "$selectedPort", "--host", "localhost")
    if (-not $NoBrowser) {
        $viteArgs += "--open"
    }
    npx $viteArgs
} finally {
    Pop-Location
}
