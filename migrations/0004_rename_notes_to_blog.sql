UPDATE analytics_summaries
SET next_action = REPLACE(next_action, '公開メモ', '公開記事'),
    memo = REPLACE(REPLACE(memo, '公開メモ', '公開記事'), '運用メモ', 'ブログ記事')
WHERE next_action LIKE '%公開メモ%' OR memo LIKE '%公開メモ%' OR memo LIKE '%運用メモ%';

UPDATE posts
SET description = REPLACE(REPLACE(description, '更新メモ', 'ブログ記事'), '運用メモ', 'ブログ記事'),
    body = REPLACE(REPLACE(body, '記事メモ', 'ブログ記事'), '運用メモ', 'ブログ記事'),
    category = REPLACE(category, 'Scarlet運用', 'Scarletブログ'),
    tags = REPLACE(tags, '運用開始', 'ブログ管理')
WHERE description LIKE '%更新メモ%' OR body LIKE '%記事メモ%' OR category = 'Scarlet運用' OR tags LIKE '%運用開始%';

UPDATE sns_drafts
SET body = REPLACE(REPLACE(body, '更新メモ', 'ブログ記事'), '運用メモ', 'ブログ記事'),
    caption = REPLACE(REPLACE(caption, '運用メモ', 'ブログ記事'), '#運用メモ', '#ブログ管理'),
    slides_json = REPLACE(REPLACE(slides_json, '記事メモ', 'ブログ記事'), '運用メモ', 'ブログ記事')
WHERE body LIKE '%更新メモ%' OR caption LIKE '%運用メモ%' OR slides_json LIKE '%記事メモ%' OR slides_json LIKE '%運用メモ%';
