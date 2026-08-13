param(
  [string]$ConfigPath = "config\scarlet.setup.json",
  [switch]$SkipBrowser
)

$ErrorActionPreference = "Stop"

function Step-Header {
  param([string]$Title, [string]$Purpose)
  Write-Host ""
  Write-Host "==================================================" -ForegroundColor DarkGray
  Write-Host $Title -ForegroundColor Cyan
  Write-Host "==================================================" -ForegroundColor DarkGray
  if ($Purpose) {
    Write-Host ""
    Write-Host "逶ｮ逧・" -ForegroundColor Yellow
    Write-Host $Purpose
  }
  Write-Host ""
}

function Open-Url {
  param([string]$Url)
  Write-Host "URL: $Url" -ForegroundColor DarkCyan
  if (-not $SkipBrowser) {
    Start-Process $Url
  }
}

function Wait-Human {
  param([string]$Message = "縺薙・謇矩・′邨ゅｏ縺｣縺溘ｉ Enter 繧呈款縺励※縺上□縺輔＞")
  Write-Host ""
  Read-Host $Message | Out-Null
}

function Guide {
  param([string[]]$Lines)
  Write-Host "謫堺ｽ懈焔鬆・" -ForegroundColor Yellow
  foreach ($line in $Lines) {
    Write-Host "- $line"
  }
  Write-Host ""
  Write-Host "陬懆ｶｳ: 縺ｾ縺蛻・°繧峨↑縺・､縺ｯ縲∽ｽ輔ｂ蜈･蜉帙○縺・Enter 縺ｧ蠕悟屓縺励↓縺ｧ縺阪∪縺吶ゅ≠縺ｨ縺ｧ $ConfigPath 縺ｫ霑ｽ險倥〒縺阪∪縺吶・ -ForegroundColor DarkYellow
  Write-Host ""
}

function Guide-Section {
  param([string]$Title, [string[]]$Lines)
  Write-Host $Title -ForegroundColor Yellow
  foreach ($line in $Lines) {
    Write-Host "  $line"
  }
  Write-Host ""
}

function Ask-Value {
  param([string]$Prompt, [string]$DefaultValue = "")
  if ($DefaultValue) {
    $label = $Prompt + " [" + $DefaultValue + "]"
    $value = Read-Host $label
    if ([string]::IsNullOrWhiteSpace($value)) { return $DefaultValue }
    return $value.Trim()
  }
  return (Read-Host $Prompt).Trim()
}

function To-Hashtable {
  param([object]$Object)
  if ($null -eq $Object) { return $null }
  if ($Object -is [System.Collections.IDictionary]) {
    $hash = @{}
    foreach ($key in $Object.Keys) { $hash[$key] = To-Hashtable $Object[$key] }
    return $hash
  }
  if ($Object -is [System.Collections.IEnumerable] -and $Object -isnot [string]) {
    return @($Object | ForEach-Object { To-Hashtable $_ })
  }
  if ($Object.PSObject.Properties.Count -gt 0 -and $Object -isnot [string]) {
    $hash = @{}
    foreach ($property in $Object.PSObject.Properties) {
      $hash[$property.Name] = To-Hashtable $property.Value
    }
    return $hash
  }
  return $Object
}

function Set-NestedValue {
  param([hashtable]$Hash, [string[]]$Path, [object]$Value)
  $cursor = $Hash
  for ($i = 0; $i -lt $Path.Count - 1; $i++) {
    $key = $Path[$i]
    if (-not $cursor.ContainsKey($key) -or $null -eq $cursor[$key]) {
      $cursor[$key] = @{}
    }
    $cursor = $cursor[$key]
  }
  $cursor[$Path[-1]] = $Value
}

function Save-SetupConfig {
  param([hashtable]$Config)
  $dir = Split-Path -Parent $ConfigPath
  if ($dir -and -not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir | Out-Null
  }
  $Config | ConvertTo-Json -Depth 8 | Set-Content -Path $ConfigPath -Encoding UTF8
  Write-Host "菫晏ｭ倥＠縺ｾ縺励◆: $ConfigPath" -ForegroundColor Green
}

function Load-SetupConfig {
  if (Test-Path $ConfigPath) {
    return To-Hashtable (Get-Content -Raw $ConfigPath | ConvertFrom-Json)
  }
  $example = "config\scarlet.setup.example.json"
  if (Test-Path $example) {
    return To-Hashtable (Get-Content -Raw $example | ConvertFrom-Json)
  }
  return @{
    project = @{
      siteName = "Scarlet Donovan"
      workerName = "scarlet-guardian"
      domain = "scarlet.fortunestudios.jp"
      repositoryName = "scarlet-guardian-site"
    }
    accounts = @{}
    cloudflare = @{ d1DatabaseName = "scarlet-guardian" }
    openai = @{}
    meta = @{}
    line = @{}
    booking = @{}
    analytics = @{}
  }
}

function Yes-No {
  param([string]$Prompt, [bool]$DefaultValue = $false)
  $defaultText = if ($DefaultValue) { "yes" } else { "no" }
  $answer = Ask-Value $Prompt $defaultText
  return $answer -match "^(y|yes|true|1)$"
}

$config = Load-SetupConfig

Step-Header "Scarlet 繧ｻ繝・ヨ繧｢繝・・" "Google繧｢繧ｫ繧ｦ繝ｳ繝井ｽ懈・蠕後↓縲∝推繧ｵ繝ｼ繝薙せ縺ｮ逋ｻ骭ｲ蜀・ｮｹ繧帝・分縺ｫ謗ｧ縺医ｋ縺溘ａ縺ｮ蜊願・蜍輔メ繧ｧ繝・け繝ｪ繧ｹ繝医〒縺吶ゅΟ繧ｰ繧､繝ｳ繧・悽莠ｺ遒ｺ隱阪・繝悶Λ繧ｦ繧ｶ縺ｧ陦後＞縺ｾ縺吶・
Write-Host "險ｭ螳壹ヵ繧｡繧､繝ｫ: $ConfigPath"
Write-Host ""
Write-Host "縺薙・繧ｹ繧ｯ繝ｪ繝励ヨ縺ｯ縲∝推繧ｵ繝ｼ繝薙せ縺ｮ繝壹・繧ｸ繧帝幕縺阪√≠縺ｪ縺溘′繝悶Λ繧ｦ繧ｶ縺ｧ謫堺ｽ懊＠縺溘≠縺ｨ縲！D繧ФRL繧剃ｿ晏ｭ倥☆繧九◆繧√↓雉ｪ蝠上＠縺ｾ縺吶・ -ForegroundColor Yellow
Write-Host "繝悶Λ繧ｦ繧ｶ菴懈･ｭ縺檎ｵゅｏ縺｣縺溘ｉ縲√％縺ｮ PowerShell 逕ｻ髱｢縺ｫ謌ｻ縺｣縺ｦ Enter 繧呈款縺励※縺上□縺輔＞縲・ -ForegroundColor Yellow
Write-Host "蛻・°繧峨↑縺・､縺ｯ遨ｺ谺・・縺ｾ縺ｾ Enter 縺ｧ蠕悟屓縺励↓縺ｧ縺阪∪縺吶ゅ≠縺ｨ縺ｧ蜀榊ｮ溯｡後〒縺阪∪縺吶・ -ForegroundColor Yellow
Wait-Human "髢句ｧ九☆繧九↓縺ｯ Enter 繧呈款縺励※縺上□縺輔＞"

Step-Header "謇矩・1 / 9: Google繧｢繧ｫ繧ｦ繝ｳ繝・ "繝｡繝ｼ繝ｫ縲；oogle Drive縲；A4縲ヾearch Console 縺ｮ蝓ｺ遉弱↓縺ｪ繧九い繧ｫ繧ｦ繝ｳ繝医〒縺吶・
Open-Url "https://accounts.google.com/"
Guide @(
  "繝悶Λ繧ｦ繧ｶ縺ｧ Scarlet 逕ｨ縺ｮ Google 繧｢繧ｫ繧ｦ繝ｳ繝医↓繝ｭ繧ｰ繧､繝ｳ縺励∪縺吶・,
  "莉雁屓縺ｮ繧｢繧ｫ繧ｦ繝ｳ繝医・ fs.scarlet.g@gmail.com 縺ｧ縺吶・,
  "髮ｻ隧ｱ逡ｪ蜿ｷ縲∝・險ｭ螳夂畑繝｡繝ｼ繝ｫ縲・谿ｵ髫手ｪ崎ｨｼ繧呈ｱゅａ繧峨ｌ縺溘ｉ逕ｻ髱｢縺ｮ謖・､ｺ縺ｩ縺翫ｊ螳御ｺ・＠縺ｾ縺吶・,
  "繝ｭ繧ｰ繧､繝ｳ螳御ｺ・ｾ後√％縺ｮ PowerShell 逕ｻ髱｢縺ｫ謌ｻ縺｣縺ｦ Enter 繧呈款縺励∪縺吶・,
  "縺昴・縺ゅ→縲∽ｿ晏ｭ倥☆繧・Google 繝｡繝ｼ繝ｫ繧｢繝峨Ξ繧ｹ繧定◇縺九ｌ縺ｾ縺吶・
)
Wait-Human
Set-NestedValue $config @("accounts", "googleEmail") (Ask-Value "Google繝｡繝ｼ繝ｫ" $config.accounts.googleEmail)
Save-SetupConfig $config

Step-Header "謇矩・2 / 9: Cloudflare" "繝峨Γ繧､繝ｳ縲仝orker縲．1縲，ron縲．NS 縺ｮ貅門ｙ繧偵＠縺ｾ縺吶・
Open-Url "https://dash.cloudflare.com/"
Guide @(
  "Cloudflare 縺ｫ繝ｭ繧ｰ繧､繝ｳ縺励∪縺吶・,
  "fortunestudios.jp 繧堤ｮ｡逅・＠縺ｦ縺・ｋ繧｢繧ｫ繧ｦ繝ｳ繝医ｒ髢九″縺ｾ縺吶・,
  "蟾ｦ繝｡繝九Η繝ｼ縺ｮ Websites 縺ｧ fortunestudios.jp 縺瑚｡ｨ遉ｺ縺輔ｌ繧九％縺ｨ繧堤｢ｺ隱阪＠縺ｾ縺吶・,
  "Cloudflare 縺ｮ Account ID 繧偵さ繝斐・縺励∪縺吶・,
  "縺薙・ PowerShell 縺ｫ謌ｻ縺｣縺ｦ Enter 繧呈款縺吶→縲、ccount ID縲√ラ繝｡繧､繝ｳ縲仝orker蜷阪．1蜷阪．1 ID 繧帝・分縺ｫ閨槭°繧後∪縺吶・
)
Guide-Section "Cloudflare 縺ｮ隧ｳ縺励＞繧ｯ繝ｪ繝・け謇矩・" @(
  "1. 繝悶Λ繧ｦ繧ｶ縺ｧ Log in 繧呈款縺励※ Cloudflare 縺ｫ繝ｭ繧ｰ繧､繝ｳ縺励∪縺吶・,
  "2. 繧｢繧ｫ繧ｦ繝ｳ繝磯∈謚槭′蜃ｺ縺溘ｉ fortunestudios.jp 縺悟・縺｣縺ｦ縺・ｋ繧｢繧ｫ繧ｦ繝ｳ繝医ｒ驕ｸ縺ｳ縺ｾ縺吶・,
  "3. 蟾ｦ繝｡繝九Η繝ｼ縺ｮ Websites 繧偵け繝ｪ繝・け縺励∪縺吶・,
  "4. 荳隕ｧ縺ｫ fortunestudios.jp 縺後≠繧九°遒ｺ隱阪＠縺ｾ縺吶ゅ％縺薙〒縺ｯDNS螟画峩縺ｯ縺ｾ縺荳崎ｦ√〒縺吶・,
  "5. fortunestudios.jp 繧偵け繝ｪ繝・け縺励∪縺吶・,
  "6. Overview 逕ｻ髱｢縺ｮ蜿ｳ蛛ｴ縺ｪ縺ｩ縺ｫ縺ゅｋ API / Account ID 繧呈爾縺励※繧ｳ繝斐・縺励∪縺吶・,
  "7. PowerShell縺ｧ 'Cloudflare繧｢繧ｫ繧ｦ繝ｳ繝・D' 縺ｨ閨槭°繧後◆繧峨√◎縺ｮ Account ID 繧定ｲｼ繧贋ｻ倥￠縺ｾ縺吶・,
  "8. 'Scarlet繝峨Γ繧､繝ｳ' 縺ｯ騾壼ｸｸ scarlet.fortunestudios.jp 縺ｮ縺ｾ縺ｾ Enter 縺ｧOK縺ｧ縺吶・,
  "9. 'Worker蜷・ 縺ｯ騾壼ｸｸ scarlet-guardian 縺ｮ縺ｾ縺ｾ Enter 縺ｧOK縺ｧ縺吶・,
  "10. 'D1繝・・繧ｿ繝吶・繧ｹ蜷・ 縺ｯ騾壼ｸｸ scarlet-guardian 縺ｮ縺ｾ縺ｾ Enter 縺ｧOK縺ｧ縺吶・,
  "11. D1繧偵∪縺菴懊▲縺ｦ縺・↑縺代ｌ縺ｰ 'D1繝・・繧ｿ繝吶・繧ｹID' 縺ｯ遨ｺ谺・Enter 縺ｧOK縺ｧ縺吶ゅ≠縺ｨ縺ｧ菴懈・縺ｧ縺阪∪縺吶・
)
Wait-Human
Set-NestedValue $config @("cloudflare", "accountId") (Ask-Value "Cloudflare繧｢繧ｫ繧ｦ繝ｳ繝・D" $config.cloudflare.accountId)
Set-NestedValue $config @("project", "domain") (Ask-Value "Scarlet繝峨Γ繧､繝ｳ" $config.project.domain)
Set-NestedValue $config @("project", "workerName") (Ask-Value "Worker蜷・ $config.project.workerName)
Set-NestedValue $config @("cloudflare", "d1DatabaseName") (Ask-Value "D1繝・・繧ｿ繝吶・繧ｹ蜷・ $config.cloudflare.d1DatabaseName)
Write-Host ""
Write-Host "D1菴懈・繧ｳ繝槭Φ繝我ｾ・"
Write-Host ".\node_modules\.bin\wrangler.cmd d1 create $($config.cloudflare.d1DatabaseName)"
Set-NestedValue $config @("cloudflare", "d1DatabaseId") (Ask-Value "D1繝・・繧ｿ繝吶・繧ｹID" $config.cloudflare.d1DatabaseId)
Save-SetupConfig $config

Step-Header "謇矩・3 / 9: GitHub" "繧ｳ繝ｼ繝牙ｱ･豁ｴ縺ｨ繝舌ャ繧ｯ繧｢繝・・逕ｨ縺ｮ髱槫・髢九Μ繝昴ず繝医Μ繧剃ｽ懊ｊ縺ｾ縺吶・
Open-Url "https://github.com/new"
Guide @(
  "GitHub 縺ｫ繝ｭ繧ｰ繧､繝ｳ縺励∪縺吶・,
  "譁ｰ縺励＞繝ｪ繝昴ず繝医Μ菴懈・逕ｻ髱｢縺ｧ縲・撼蜈ｬ髢九Μ繝昴ず繝医Μ繧剃ｽ懊ｊ縺ｾ縺吶・,
  "縺翫☆縺吶ａ縺ｮ繝ｪ繝昴ず繝医Μ蜷阪・ scarlet-guardian-site 縺ｧ縺吶・,
  "Owner蜷阪→ Repository name 繧呈而縺医∪縺吶・,
  "縺薙・ PowerShell 縺ｫ謌ｻ縺｣縺ｦ Enter 繧呈款縺吶→縲√◎縺ｮ2縺､繧定◇縺九ｌ縺ｾ縺吶・
)
Wait-Human
Set-NestedValue $config @("accounts", "githubOwner") (Ask-Value "GitHub縺ｮOwner蜷阪∪縺溘・邨・ｹ泌錐" $config.accounts.githubOwner)
Set-NestedValue $config @("project", "repositoryName") (Ask-Value "GitHub繝ｪ繝昴ず繝医Μ蜷・ $config.project.repositoryName)
Write-Host ""
Write-Host "GitHub CLI 繧ｳ繝槭Φ繝我ｾ・"
Write-Host "gh auth login"
Write-Host "gh repo create $($config.accounts.githubOwner)/$($config.project.repositoryName) --private"
Save-SetupConfig $config

Step-Header "謇矩・4 / 9: OpenAI API" "髑大ｮ壽枚縲√ヶ繝ｭ繧ｰ荳区嶌縺阪∝・譫舌し繝槭Μ繝ｼ縺ｮ逕滓・縺ｫ菴ｿ縺・∪縺吶・
Open-Url "https://platform.openai.com/api-keys"
Guide @(
  "OpenAI Platform 縺ｫ繝ｭ繧ｰ繧､繝ｳ縺励∪縺吶・,
  "API key 繧剃ｽ懈・縺励∪縺吶・,
  "API key 縺ｮ荳ｭ霄ｫ縺ｯ縺薙・險ｭ螳壹ヵ繧｡繧､繝ｫ縺ｫ縺ｯ雋ｼ繧贋ｻ倥￠縺ｾ縺帙ｓ縲・,
  "縺ゅ→縺ｧ Wrangler secret put OPENAI_API_KEY 縺ｧ螳牙・縺ｫ菫晏ｭ倥＠縺ｾ縺吶・,
  "縺薙・ PowerShell 縺ｫ謌ｻ縺｣縺ｦ Enter 繧呈款縺吶→縲∽ｿ晏ｭ俶ｸ医∩縺九←縺・°縺縺題◇縺九ｌ縺ｾ縺吶・
)
Write-Host "繧ｳ繝槭Φ繝・ .\node_modules\.bin\wrangler.cmd secret put OPENAI_API_KEY"
Wait-Human
Set-NestedValue $config @("openai", "apiKeyStoredAsWranglerSecret") (Yes-No "OPENAI_API_KEY繧淡rangler secret縺ｫ菫晏ｭ俶ｸ医∩縺ｧ縺吶°・・yes/no" $config.openai.apiKeyStoredAsWranglerSecret)
Save-SetupConfig $config

Step-Header "謇矩・5 / 9: Instagram" "Scarlet逕ｨInstagram繧｢繧ｫ繧ｦ繝ｳ繝医ｒ遒ｺ菫昴＠縲∝庄閭ｽ縺ｪ繧峨・繝ｭ繧｢繧ｫ繧ｦ繝ｳ繝医↓蛻・ｊ譖ｿ縺医∪縺吶・
Open-Url "https://www.instagram.com/accounts/emailsignup/"
Guide @(
  "Scarlet逕ｨ縺ｮInstagram繧｢繧ｫ繧ｦ繝ｳ繝医ｒ菴懈・縲√∪縺溘・繝ｭ繧ｰ繧､繝ｳ縺励∪縺吶・,
  "繝ｦ繝ｼ繧ｶ繝ｼ蜷阪ｒ豎ｺ繧√※遒ｺ菫昴＠縺ｾ縺吶・,
  "險ｭ螳夂判髱｢縺ｧ縲∝庄閭ｽ縺ｪ繧峨・繝ｭ繧｢繧ｫ繧ｦ繝ｳ繝医↓蛻・ｊ譖ｿ縺医∪縺吶・,
  "縺薙・ PowerShell 縺ｫ謌ｻ縺｣縺ｦ Enter 繧呈款縺吶→縲！nstagram繝ｦ繝ｼ繧ｶ繝ｼ蜷阪ｒ閨槭°繧後∪縺吶・
)
Wait-Human
Set-NestedValue $config @("accounts", "instagramUsername") (Ask-Value "Instagram繝ｦ繝ｼ繧ｶ繝ｼ蜷・ $config.accounts.instagramUsername)
Save-SetupConfig $config

Step-Header "謇矩・6 / 9: Meta Developers" "Meta繧｢繝励Μ縲∵ｨｩ髯舌！nstagram繧｢繧ｫ繧ｦ繝ｳ繝・D縲√ヨ繝ｼ繧ｯ繝ｳ菫晏ｭ倥・貅門ｙ繧偵＠縺ｾ縺吶・
Open-Url "https://developers.facebook.com/apps/"
Guide @(
  "Scarlet逕ｨ縺ｮMeta髢狗匱閠・い繝励Μ繧剃ｽ懈・縲√∪縺溘・髢九″縺ｾ縺吶・,
  "Instagram繝励Ο繧｢繧ｫ繧ｦ繝ｳ繝医ｒ謗･邯壹＠縺ｾ縺吶・,
  "Meta App ID 縺ｨ Instagram Business Account ID 繧呈而縺医∪縺吶・,
  "繧｢繧ｯ繧ｻ繧ｹ繝医・繧ｯ繝ｳ縺ｯ縺薙・險ｭ螳壹ヵ繧｡繧､繝ｫ縺ｧ縺ｯ縺ｪ縺上√≠縺ｨ縺ｧ Wrangler secret 縺ｫ菫晏ｭ倥＠縺ｾ縺吶・,
  "縺薙・ PowerShell 縺ｫ謌ｻ縺｣縺ｦ Enter 繧呈款縺吶→縲！D縺ｨ繝医・繧ｯ繝ｳ菫晏ｭ倡憾豕√ｒ閨槭°繧後∪縺吶・
)
Wait-Human
Set-NestedValue $config @("meta", "appId") (Ask-Value "Meta App ID" $config.meta.appId)
Set-NestedValue $config @("meta", "instagramBusinessAccountId") (Ask-Value "Instagram Business Account ID" $config.meta.instagramBusinessAccountId)
Set-NestedValue $config @("meta", "accessTokenStoredAsWranglerSecret") (Yes-No "Instagram/Meta繝医・繧ｯ繝ｳ繧淡rangler secret縺ｫ菫晏ｭ俶ｸ医∩縺ｧ縺吶°・・yes/no" $config.meta.accessTokenStoredAsWranglerSecret)
Write-Host "繧ｳ繝槭Φ繝我ｾ・ .\node_modules\.bin\wrangler.cmd secret put INSTAGRAM_ACCESS_TOKEN"
Save-SetupConfig $config

Step-Header "謇矩・7 / 9: LINE蜈ｬ蠑上い繧ｫ繧ｦ繝ｳ繝・ "LINE蟆守ｷ壹｀essaging API縲仝ebhook逕ｨ繧ｷ繝ｼ繧ｯ繝ｬ繝・ヨ繧呈ｺ門ｙ縺励∪縺吶・
Open-Url "https://manager.line.biz/"
Open-Url "https://developers.line.biz/console/"
Guide @(
  "LINE Official Account Manager 縺ｧ Scarlet 縺ｮ蜈ｬ蠑上い繧ｫ繧ｦ繝ｳ繝医ｒ菴懈・縲√∪縺溘・髢九″縺ｾ縺吶・,
  "LINE Developers 繧帝幕縺阪｀essaging API channel 繧剃ｽ懈・縺ｾ縺溘・謗･邯壹＠縺ｾ縺吶・,
  "Channel Secret 縺ｨ Channel Access Token 縺ｯ縺ゅ→縺ｧ Wrangler secret 縺ｫ菫晏ｭ倥＠縺ｾ縺吶・,
  "縺薙・ PowerShell 縺ｫ謌ｻ縺｣縺ｦ Enter 繧呈款縺吶→縲´INE蜈ｬ蠑上い繧ｫ繧ｦ繝ｳ繝亥錐縺ｨ菫晏ｭ倡憾豕√ｒ閨槭°繧後∪縺吶・
)
Wait-Human
Set-NestedValue $config @("accounts", "lineOfficialAccountName") (Ask-Value "LINE蜈ｬ蠑上い繧ｫ繧ｦ繝ｳ繝亥錐" $config.accounts.lineOfficialAccountName)
Set-NestedValue $config @("line", "channelSecretStoredAsWranglerSecret") (Yes-No "LINE_CHANNEL_SECRET繧淡rangler secret縺ｫ菫晏ｭ俶ｸ医∩縺ｧ縺吶°・・yes/no" $config.line.channelSecretStoredAsWranglerSecret)
Set-NestedValue $config @("line", "channelAccessTokenStoredAsWranglerSecret") (Yes-No "LINE_CHANNEL_ACCESS_TOKEN繧淡rangler secret縺ｫ菫晏ｭ俶ｸ医∩縺ｧ縺吶°・・yes/no" $config.line.channelAccessTokenStoredAsWranglerSecret)
Save-SetupConfig $config

Step-Header "謇矩・8 / 9: 莠育ｴ・し繝ｼ繝薙せ" "莠育ｴФRL縺ｨ譛画侭繧ｵ繝ｼ繝薙せ蟆守ｷ壹ｒ貅門ｙ縺励∪縺吶・
Open-Url "https://dashboard.stores.jp/"
Guide @(
  "STORES 縺ｫ繝ｭ繧ｰ繧､繝ｳ縺励∪縺吶・,
  "Scarlet逕ｨ縺ｮ莠育ｴ・Γ繝九Η繝ｼ繧剃ｽ懈・縺励∪縺吶・,
  "蜈ｬ髢狗畑縺ｮ莠育ｴФRL繧偵さ繝斐・縺励∪縺吶・,
  "縺薙・ PowerShell 縺ｫ謌ｻ縺｣縺ｦ Enter 繧呈款縺吶→縲∽ｺ育ｴФRL繧定◇縺九ｌ縺ｾ縺吶・
)
Wait-Human
Set-NestedValue $config @("booking", "bookingUrl") (Ask-Value "莠育ｴФRL" $config.booking.bookingUrl)
Save-SetupConfig $config

Step-Header "謇矩・9 / 9: 繧｢繧ｯ繧ｻ繧ｹ隗｣譫・ "GA4縲ヾearch Console縲｀icrosoft Clarity 繧呈ｺ門ｙ縺励∪縺吶・
Open-Url "https://analytics.google.com/analytics/web/"
Open-Url "https://search.google.com/search-console"
Open-Url "https://clarity.microsoft.com/projects"
Guide @(
  "GA4繝励Ο繝代ユ繧｣繧剃ｽ懈・縺ｾ縺溘・髢九″縲；-XXXXXXXXXX 縺ｮ繧医≧縺ｪ Measurement ID 繧偵さ繝斐・縺励∪縺吶・,
  "Search Console 繧帝幕縺阪．NS貅門ｙ蠕後↓ Scarlet繝峨Γ繧､繝ｳ繧堤｢ｺ隱阪＠縺ｾ縺吶・,
  "Microsoft Clarity 繝励Ο繧ｸ繧ｧ繧ｯ繝医ｒ菴懈・縺ｾ縺溘・髢九″縲√・繝ｭ繧ｸ繧ｧ繧ｯ繝・D繧偵さ繝斐・縺励∪縺吶・,
  "縺薙・ PowerShell 縺ｫ謌ｻ縺｣縺ｦ Enter 繧呈款縺吶→縲；A4 ID縲ヾearch Console遒ｺ隱咲憾豕√，larity ID繧定◇縺九ｌ縺ｾ縺吶・
)
Wait-Human
Set-NestedValue $config @("analytics", "ga4MeasurementId") (Ask-Value "GA4 Measurement ID" $config.analytics.ga4MeasurementId)
Set-NestedValue $config @("analytics", "searchConsoleVerified") (Yes-No "Search Console縺ｮ遒ｺ隱阪・螳御ｺ・＠縺ｾ縺励◆縺具ｼ・yes/no" $config.analytics.searchConsoleVerified)
Set-NestedValue $config @("analytics", "clarityProjectId") (Ask-Value "Microsoft Clarity 繝励Ο繧ｸ繧ｧ繧ｯ繝・D" $config.analytics.clarityProjectId)
Save-SetupConfig $config

Step-Header "螳御ｺ・ "蜈･蜉帙＆繧後◆蛟､繧剃ｿ晏ｭ倥＠縺ｾ縺励◆縲よｬ｡縺ｯ縺薙・險ｭ螳壹°繧・Scarlet Worker縲．1 binding縲『rangler.toml縲√し繧､繝域枚險繧剃ｽ懈・縺励∪縺吶・
Write-Host "險ｭ螳壹ヵ繧｡繧､繝ｫ: $ConfigPath" -ForegroundColor Green
Write-Host ""
Write-Host "菫晏ｭ伜・螳ｹ:"
Write-Host "- Google: $($config.accounts.googleEmail)"
Write-Host "- 繝峨Γ繧､繝ｳ: $($config.project.domain)"
Write-Host "- Worker: $($config.project.workerName)"
Write-Host "- GitHub: $($config.accounts.githubOwner)/$($config.project.repositoryName)"
Write-Host "- Instagram: $($config.accounts.instagramUsername)"

