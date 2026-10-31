<#
.SYNOPSIS
    Convenience shortcut to launch start-playtest.ps1
#>
[CmdletBinding()]
param (
    [int]$StartPort = 3000,
    [switch]$NoBrowser
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
& (Join-Path $ScriptDir "start-playtest.ps1") -StartPort $StartPort -NoBrowser:$NoBrowser
