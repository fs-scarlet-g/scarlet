# Scarlet Operations

## Cloudflare accounts

- Scarlet account: `fs.scarlet.g@gmail.com`
- Scarlet account ID: `ac8c2578aeccae5fce1a75e0b4e47ca0`
- Parent domain account: `fortune.kanri@gmail.com`
- Parent account ID: `cfda786a82241adf6b21f772dbc87544`

## Domain ownership

`fortunestudios.jp` remains managed by the parent account. The Scarlet account
hosts the Worker and D1 database only.

Public traffic flows through:

1. `scarlet.fortunestudios.jp`
2. Parent account DNS and `scarlet-parent-proxy`
3. `scarlet-guardian.fs-scarlet-g.workers.dev`

Do not move the parent zone into the Scarlet account.

## Deploy

Login to the Scarlet Cloudflare account, then run:

```powershell
cd C:\dev\Projects\FM002_scarlet
npm.cmd run build
.\node_modules\.bin\wrangler.cmd deploy --config dist\server\wrangler.json
```

Verify:

```powershell
curl.exe -i https://scarlet.fortunestudios.jp/health
curl.exe -i https://scarlet.fortunestudios.jp/api/scarlet/status
```

## Admin authentication

`/admin` is protected by Google OAuth. Allowed account:

- `fs.scarlet.g@gmail.com`

Required Worker secrets:

- `ADMIN_SESSION_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Google OAuth callback URL:

- `https://scarlet.fortunestudios.jp/api/admin/auth/google/callback`
