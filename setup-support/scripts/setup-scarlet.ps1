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
    Write-Host "目的:" -ForegroundColor Yellow
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
  param([string]$Message = "この手順が終わったら Enter を押してください")
  Write-Host ""
  Read-Host $Message | Out-Null
}

function Guide {
  param([string[]]$Lines)
  Write-Host "操作手順:" -ForegroundColor Yellow
  foreach ($line in $Lines) {
    Write-Host "- $line"
  }
  Write-Host ""
  Write-Host "補足: まだ分からない値は、何も入力せず Enter で後回しにできます。あとで $ConfigPath に追記できます。" -ForegroundColor DarkYellow
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
  Write-Host "保存しました: $ConfigPath" -ForegroundColor Green
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
      siteName = "Scarlet Guardian"
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

Step-Header "Scarlet セットアップ" "Googleアカウント作成後に、各サービスの登録内容を順番に控えるための半自動チェックリストです。ログインや本人確認はブラウザで行います。"
Write-Host "設定ファイル: $ConfigPath"
Write-Host ""
Write-Host "このスクリプトは、各サービスのページを開き、あなたがブラウザで操作したあと、IDやURLを保存するために質問します。" -ForegroundColor Yellow
Write-Host "ブラウザ作業が終わったら、この PowerShell 画面に戻って Enter を押してください。" -ForegroundColor Yellow
Write-Host "分からない値は空欄のまま Enter で後回しにできます。あとで再実行できます。" -ForegroundColor Yellow
Wait-Human "開始するには Enter を押してください"

Step-Header "手順 1 / 9: Googleアカウント" "メール、Google Drive、GA4、Search Console の基礎になるアカウントです。"
Open-Url "https://accounts.google.com/"
Guide @(
  "ブラウザで Scarlet 用の Google アカウントにログインします。",
  "今回のアカウントは fs.scarlet.g@gmail.com です。",
  "電話番号、再設定用メール、2段階認証を求められたら画面の指示どおり完了します。",
  "ログイン完了後、この PowerShell 画面に戻って Enter を押します。",
  "そのあと、保存する Google メールアドレスを聞かれます。"
)
Wait-Human
Set-NestedValue $config @("accounts", "googleEmail") (Ask-Value "Googleメール" $config.accounts.googleEmail)
Save-SetupConfig $config

Step-Header "手順 2 / 9: Cloudflare" "ドメイン、Worker、D1、Cron、DNS の準備をします。"
Open-Url "https://dash.cloudflare.com/"
Guide @(
  "Cloudflare にログインします。",
  "fortunestudios.jp を管理しているアカウントを開きます。",
  "左メニューの Websites で fortunestudios.jp が表示されることを確認します。",
  "Cloudflare の Account ID をコピーします。",
  "この PowerShell に戻って Enter を押すと、Account ID、ドメイン、Worker名、D1名、D1 ID を順番に聞かれます。"
)
Guide-Section "Cloudflare の詳しいクリック手順:" @(
  "1. ブラウザで Log in を押して Cloudflare にログインします。",
  "2. アカウント選択が出たら fortunestudios.jp が入っているアカウントを選びます。",
  "3. 左メニューの Websites をクリックします。",
  "4. 一覧に fortunestudios.jp があるか確認します。ここではDNS変更はまだ不要です。",
  "5. fortunestudios.jp をクリックします。",
  "6. Overview 画面の右側などにある API / Account ID を探してコピーします。",
  "7. PowerShellで 'CloudflareアカウントID' と聞かれたら、その Account ID を貼り付けます。",
  "8. 'Scarletドメイン' は通常 scarlet.fortunestudios.jp のまま Enter でOKです。",
  "9. 'Worker名' は通常 scarlet-guardian のまま Enter でOKです。",
  "10. 'D1データベース名' は通常 scarlet-guardian のまま Enter でOKです。",
  "11. D1をまだ作っていなければ 'D1データベースID' は空欄 Enter でOKです。あとで作成できます。"
)
Wait-Human
Set-NestedValue $config @("cloudflare", "accountId") (Ask-Value "CloudflareアカウントID" $config.cloudflare.accountId)
Set-NestedValue $config @("project", "domain") (Ask-Value "Scarletドメイン" $config.project.domain)
Set-NestedValue $config @("project", "workerName") (Ask-Value "Worker名" $config.project.workerName)
Set-NestedValue $config @("cloudflare", "d1DatabaseName") (Ask-Value "D1データベース名" $config.cloudflare.d1DatabaseName)
Write-Host ""
Write-Host "D1作成コマンド例:"
Write-Host ".\node_modules\.bin\wrangler.cmd d1 create $($config.cloudflare.d1DatabaseName)"
Set-NestedValue $config @("cloudflare", "d1DatabaseId") (Ask-Value "D1データベースID" $config.cloudflare.d1DatabaseId)
Save-SetupConfig $config

Step-Header "手順 3 / 9: GitHub" "コード履歴とバックアップ用の非公開リポジトリを作ります。"
Open-Url "https://github.com/new"
Guide @(
  "GitHub にログインします。",
  "新しいリポジトリ作成画面で、非公開リポジトリを作ります。",
  "おすすめのリポジトリ名は scarlet-guardian-site です。",
  "Owner名と Repository name を控えます。",
  "この PowerShell に戻って Enter を押すと、その2つを聞かれます。"
)
Wait-Human
Set-NestedValue $config @("accounts", "githubOwner") (Ask-Value "GitHubのOwner名または組織名" $config.accounts.githubOwner)
Set-NestedValue $config @("project", "repositoryName") (Ask-Value "GitHubリポジトリ名" $config.project.repositoryName)
Write-Host ""
Write-Host "GitHub CLI コマンド例:"
Write-Host "gh auth login"
Write-Host "gh repo create $($config.accounts.githubOwner)/$($config.project.repositoryName) --private"
Save-SetupConfig $config

Step-Header "手順 4 / 9: OpenAI API" "鑑定文、ブログ下書き、分析サマリーの生成に使います。"
Open-Url "https://platform.openai.com/api-keys"
Guide @(
  "OpenAI Platform にログインします。",
  "API key を作成します。",
  "API key の中身はこの設定ファイルには貼り付けません。",
  "あとで Wrangler secret put OPENAI_API_KEY で安全に保存します。",
  "この PowerShell に戻って Enter を押すと、保存済みかどうかだけ聞かれます。"
)
Write-Host "コマンド: .\node_modules\.bin\wrangler.cmd secret put OPENAI_API_KEY"
Wait-Human
Set-NestedValue $config @("openai", "apiKeyStoredAsWranglerSecret") (Yes-No "OPENAI_API_KEYをWrangler secretに保存済みですか？ yes/no" $config.openai.apiKeyStoredAsWranglerSecret)
Save-SetupConfig $config

Step-Header "手順 5 / 9: Instagram" "Scarlet用Instagramアカウントを確保し、可能ならプロアカウントに切り替えます。"
Open-Url "https://www.instagram.com/accounts/emailsignup/"
Guide @(
  "Scarlet用のInstagramアカウントを作成、またはログインします。",
  "ユーザー名を決めて確保します。",
  "設定画面で、可能ならプロアカウントに切り替えます。",
  "この PowerShell に戻って Enter を押すと、Instagramユーザー名を聞かれます。"
)
Wait-Human
Set-NestedValue $config @("accounts", "instagramUsername") (Ask-Value "Instagramユーザー名" $config.accounts.instagramUsername)
Save-SetupConfig $config

Step-Header "手順 6 / 9: Meta Developers" "Metaアプリ、権限、InstagramアカウントID、トークン保存の準備をします。"
Open-Url "https://developers.facebook.com/apps/"
Guide @(
  "Scarlet用のMeta開発者アプリを作成、または開きます。",
  "Instagramプロアカウントを接続します。",
  "Meta App ID と Instagram Business Account ID を控えます。",
  "アクセストークンはこの設定ファイルではなく、あとで Wrangler secret に保存します。",
  "この PowerShell に戻って Enter を押すと、IDとトークン保存状況を聞かれます。"
)
Wait-Human
Set-NestedValue $config @("meta", "appId") (Ask-Value "Meta App ID" $config.meta.appId)
Set-NestedValue $config @("meta", "instagramBusinessAccountId") (Ask-Value "Instagram Business Account ID" $config.meta.instagramBusinessAccountId)
Set-NestedValue $config @("meta", "accessTokenStoredAsWranglerSecret") (Yes-No "Instagram/MetaトークンをWrangler secretに保存済みですか？ yes/no" $config.meta.accessTokenStoredAsWranglerSecret)
Write-Host "コマンド例: .\node_modules\.bin\wrangler.cmd secret put INSTAGRAM_ACCESS_TOKEN"
Save-SetupConfig $config

Step-Header "手順 7 / 9: LINE公式アカウント" "LINE導線、Messaging API、Webhook用シークレットを準備します。"
Open-Url "https://manager.line.biz/"
Open-Url "https://developers.line.biz/console/"
Guide @(
  "LINE Official Account Manager で Scarlet の公式アカウントを作成、または開きます。",
  "LINE Developers を開き、Messaging API channel を作成または接続します。",
  "Channel Secret と Channel Access Token はあとで Wrangler secret に保存します。",
  "この PowerShell に戻って Enter を押すと、LINE公式アカウント名と保存状況を聞かれます。"
)
Wait-Human
Set-NestedValue $config @("accounts", "lineOfficialAccountName") (Ask-Value "LINE公式アカウント名" $config.accounts.lineOfficialAccountName)
Set-NestedValue $config @("line", "channelSecretStoredAsWranglerSecret") (Yes-No "LINE_CHANNEL_SECRETをWrangler secretに保存済みですか？ yes/no" $config.line.channelSecretStoredAsWranglerSecret)
Set-NestedValue $config @("line", "channelAccessTokenStoredAsWranglerSecret") (Yes-No "LINE_CHANNEL_ACCESS_TOKENをWrangler secretに保存済みですか？ yes/no" $config.line.channelAccessTokenStoredAsWranglerSecret)
Save-SetupConfig $config

Step-Header "手順 8 / 9: 予約サービス" "予約URLと有料サービス導線を準備します。"
Open-Url "https://dashboard.stores.jp/"
Guide @(
  "STORES にログインします。",
  "Scarlet用の予約メニューを作成します。",
  "公開用の予約URLをコピーします。",
  "この PowerShell に戻って Enter を押すと、予約URLを聞かれます。"
)
Wait-Human
Set-NestedValue $config @("booking", "bookingUrl") (Ask-Value "予約URL" $config.booking.bookingUrl)
Save-SetupConfig $config

Step-Header "手順 9 / 9: アクセス解析" "GA4、Search Console、Microsoft Clarity を準備します。"
Open-Url "https://analytics.google.com/analytics/web/"
Open-Url "https://search.google.com/search-console"
Open-Url "https://clarity.microsoft.com/projects"
Guide @(
  "GA4プロパティを作成または開き、G-XXXXXXXXXX のような Measurement ID をコピーします。",
  "Search Console を開き、DNS準備後に Scarletドメインを確認します。",
  "Microsoft Clarity プロジェクトを作成または開き、プロジェクトIDをコピーします。",
  "この PowerShell に戻って Enter を押すと、GA4 ID、Search Console確認状況、Clarity IDを聞かれます。"
)
Wait-Human
Set-NestedValue $config @("analytics", "ga4MeasurementId") (Ask-Value "GA4 Measurement ID" $config.analytics.ga4MeasurementId)
Set-NestedValue $config @("analytics", "searchConsoleVerified") (Yes-No "Search Consoleの確認は完了しましたか？ yes/no" $config.analytics.searchConsoleVerified)
Set-NestedValue $config @("analytics", "clarityProjectId") (Ask-Value "Microsoft Clarity プロジェクトID" $config.analytics.clarityProjectId)
Save-SetupConfig $config

Step-Header "完了" "入力された値を保存しました。次はこの設定から Scarlet Worker、D1 binding、wrangler.toml、サイト文言を作成します。"
Write-Host "設定ファイル: $ConfigPath" -ForegroundColor Green
Write-Host ""
Write-Host "保存内容:"
Write-Host "- Google: $($config.accounts.googleEmail)"
Write-Host "- ドメイン: $($config.project.domain)"
Write-Host "- Worker: $($config.project.workerName)"
Write-Host "- GitHub: $($config.accounts.githubOwner)/$($config.project.repositoryName)"
Write-Host "- Instagram: $($config.accounts.instagramUsername)"
