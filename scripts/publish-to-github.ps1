param(
  [Parameter(Mandatory = $true)]
  [string]$RemoteUrl,

  [string]$Branch = "codex/scarlet-admin"
)

$ErrorActionPreference = "Stop"
Set-Location -LiteralPath (Split-Path -Parent $PSScriptRoot)

if (-not (Test-Path -LiteralPath ".git")) {
  throw "This folder is not a Git repository."
}

$existing = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0 -and $existing) {
  git remote set-url origin $RemoteUrl
} else {
  git remote add origin $RemoteUrl
}

git push -u origin $Branch
