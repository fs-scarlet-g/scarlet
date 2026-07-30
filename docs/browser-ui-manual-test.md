# Browser UI Manual Test

Use this when browser automation is unavailable.

## Account

- Admin email: fs.scarlet.g@gmail.com
- Admin URL: https://scarlet.fortunestudios.jp/admin

## Test 1: Blog management

1. Open https://scarlet.fortunestudios.jp/admin/blog
2. Save a draft blog article.
3. Confirm it appears in the saved list.
4. Save or edit one article as `published`.
5. Open https://scarlet.fortunestudios.jp/ and confirm it appears under `公開記事`.

## Test 2: SNS content

1. Open https://scarlet.fortunestudios.jp/admin/sns
2. Use the slide generator.
3. Copy caption.
4. Save a ready SNS draft.
5. Confirm it appears in the saved list.

## Test 3: Analytics

1. Open https://scarlet.fortunestudios.jp/admin/analytics
2. Enter a new weekly period.
3. Save visits, primary actions, contact starts, and article views.
4. Confirm the latest summary cards update.
5. Download CSV.

## Test 4: Public copy checker

1. Open https://scarlet.fortunestudios.jp/oracle
2. Paste a blog or SNS draft.
3. Confirm score, flags, and next checks update.

## Expected security behavior

Without login, these endpoints should return 401:

- https://scarlet.fortunestudios.jp/api/admin/posts
- https://scarlet.fortunestudios.jp/api/admin/sns-drafts
- https://scarlet.fortunestudios.jp/api/admin/analytics
