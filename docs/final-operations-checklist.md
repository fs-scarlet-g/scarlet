# Scarlet Final Operations Checklist

## Current production URLs

- Public site: https://scarlet.fortunestudios.jp/
- Admin: https://scarlet.fortunestudios.jp/admin
- Blog admin: https://scarlet.fortunestudios.jp/admin/blog
- SNS admin: https://scarlet.fortunestudios.jp/admin/sns
- Analytics admin: https://scarlet.fortunestudios.jp/admin/analytics
- Public copy checker: https://scarlet.fortunestudios.jp/oracle
- Health: https://scarlet.fortunestudios.jp/health

## Confirmed by CLI/API

- Public site returns 200 OK.
- Public copy checker returns 200 OK.
- Health returns db ok.
- Public posts API returns the seeded published blog article.
- Admin APIs return 401 Unauthorized when not logged in.
- D1 contains initial analytics, blog, and SNS records.
- Latest deployment has been published to Cloudflare Workers.

## Browser UI confirmation still to do manually

The Codex browser connector failed with:

`failed to write kernel assets: 指定されたパスが見つかりません。 (os error 3)`

Because of that, browser form submission could not be automated from this session. Manual check:

1. Open https://scarlet.fortunestudios.jp/admin
2. Log in as fs.scarlet.g@gmail.com if prompted.
3. Open Blog admin and save one draft blog article.
4. Open SNS admin and save one ready SNS draft.
5. Open Analytics admin and save one weekly summary.
6. Create or edit one blog article with status `published` and confirm it appears on the public top page.

## Git status

- Local repository was initialized at `C:\dev\Projects\FM002_scarlet`.
- Current branch: `codex/scarlet-admin`.
- Local commits include the Scarlet Donovan implementation and later naming/function updates.
- No remote is configured.
- `gh` CLI is not available in this environment.

## GitHub publishing options

If GitHub CLI is installed later:

```powershell
gh repo create FM002_scarlet --private --source C:\dev\Projects\FM002_scarlet --remote origin --push
```

If a repository already exists:

```powershell
cd C:\dev\Projects\FM002_scarlet
git remote add origin https://github.com/<owner>/<repo>.git
git push -u origin codex/scarlet-admin
```

## Deploy commands

```powershell
cd C:\dev\Projects\FM002_scarlet
npm.cmd run build
.\node_modules\.bin\wrangler.cmd deploy --config dist\server\wrangler.json
```

## Verification commands

```powershell
curl.exe -I https://scarlet.fortunestudios.jp/
curl.exe -I https://scarlet.fortunestudios.jp/oracle
curl.exe https://scarlet.fortunestudios.jp/health
curl.exe https://scarlet.fortunestudios.jp/api/public/posts
curl.exe https://scarlet.fortunestudios.jp/api/admin/posts
```

