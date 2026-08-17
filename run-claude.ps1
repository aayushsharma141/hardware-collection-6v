$env:ANTHROPIC_BASE_URL = "http://127.0.0.1:20128/v1"
$env:ANTHROPIC_API_KEY = "sk-omniroute"

Write-Host "Starting Claude Code with OmniRoute at $($env:ANTHROPIC_BASE_URL)..." -ForegroundColor Green
claude @args
