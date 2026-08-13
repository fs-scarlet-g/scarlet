INSERT INTO analytics_summaries (period, visits, readings, chat_starts, note_views, next_action, memo)
SELECT '2026年7月 第5週', 120, 14, 7, 22, '公開メモから管理導線までの流れを確認し、次週は問い合わせ前の説明を短くする。', '初回の運用テストです。訪問、主要行動、問い合わせ開始、メモ閲覧を仮の週次データとして保存しました。トップページに公開メモが出るか、管理画面で履歴が読めるかを確認します。'
WHERE NOT EXISTS (SELECT 1 FROM analytics_summaries WHERE period = '2026年7月 第5週');

INSERT INTO posts (slug, title, description, body, pub_date, category, tags, featured, status)
SELECT 'scarlet-first-operation-note', 'Scarlet Donovanを公開しました', 'Scarlet Donovanの公式サイトとして、鑑定案内とお知らせを掲載していきます。', '## Scarlet Donovanについて\n\nScarlet Donovanは、迷いや違和感を言葉にし、次の一歩を選びやすくするための鑑定サイトです。\n\n## 掲載内容\n\n- 鑑定に関するお知らせ\n- 日々の読み物\n- 受付や更新に関する案内', '2026-07-30', 'お知らせ', 'Scarlet, Fortune Studios, お知らせ', 1, 'published'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE slug = 'scarlet-first-operation-note');

INSERT INTO sns_drafts (platform, topic, goal, tone, body, caption, slides_json, status)
SELECT 'instagram', 'Scarlet Donovanの運用開始', '公開サイトへの案内', '静かで正確', 'Scarlet Donovanの公開サイトと管理画面を整備しました。更新メモ、SNS案、分析記録をひとつの流れで扱えます。', 'Scarlet Donovanの運用を開始しました。\n\n公開サイト、管理画面、D1保存、分析メモを段階的に整えています。\n\n#ScarletGuardian #FortuneStudios #運用メモ', '[{"heading":"Scarlet Donovan","body":"公開サイトと管理画面を整備しました。"},{"heading":"できること","body":"記事メモ、SNS案、分析記録を保存できます。"},{"heading":"次の確認","body":"公開記事と週次分析を運用しながら育てます。"}]', 'ready'
WHERE NOT EXISTS (SELECT 1 FROM sns_drafts WHERE topic = 'Scarlet Donovanの運用開始');

