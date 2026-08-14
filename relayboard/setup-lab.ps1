param([string]$Destination)
$ErrorActionPreference = "Stop"
$source = Join-Path $PSScriptRoot "starter"
if (-not $Destination) { $Destination = Join-Path (Split-Path $PSScriptRoot -Parent) "relayboard-work" }
$resolvedParent = [IO.Path]::GetFullPath((Split-Path $Destination -Parent))
$resolvedDestination = [IO.Path]::GetFullPath($Destination)
if (Test-Path -LiteralPath $resolvedDestination) { throw "Destination already exists: $resolvedDestination" }
if (-not (Test-Path -LiteralPath $source)) { throw "Starter not found: $source" }
New-Item -ItemType Directory -Force -Path $resolvedParent | Out-Null
Copy-Item -LiteralPath $source -Destination $resolvedDestination -Recurse
git -C $resolvedDestination init -b main
git -C $resolvedDestination config user.name "Course Learner"
git -C $resolvedDestination config user.email "learner@example.invalid"
git -C $resolvedDestination add .
git -C $resolvedDestination commit -m "course: RelayBoard starter"
git -C $resolvedDestination tag course-start
git -C $resolvedDestination switch -c learner-work
Write-Output "RelayBoard learner workspace created at $resolvedDestination"
