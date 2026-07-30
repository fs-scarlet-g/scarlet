INSERT INTO analytics_summaries (period, visits, readings, chat_starts, note_views, next_action, memo)
SELECT '2026年7月 第5週', 120, 14, 7, 22, '公開メモから管理導線までの流れを確認し、次週は問い合わせ前の説明を短くする。', '初回の運用テストです。訪問、主要行動、問い合わせ開始、メモ閲覧を仮の週次データとして保存しました。トップページに公開メモが出るか、管理画面で履歴が読めるかを確認します。'
WHERE NOT EXISTS (SELECT 1 FROM analytics_summaries WHERE period = '2026年7月 第5週');

INSERT INTO posts (slug, title, description, body, pub_date, category, tags, featured, status)
SELECT 'scarlet-first-operation-note', 'Scarlet Guardianの運用を開始しました', 'Scarlet用の公開サイトと管理画面を使い、更新メモと分析記録を残せるようにしました。', '## 運用開始\n\nScarlet Guardianの公開サイトと管理画面を整備しました。記事メモ、SNS投稿案、アクセス分析をD1へ保存し、公開してよい記事はトップページにも表示できます。\n\n## 確認すること\n\n- 管理画面がGoogleログインで保護されていること\n- publishedの記事が公開トップに表示されること\n- 分析メモが週次で保存できること', '2026-07-30', 'Scarlet運用', 'Scarlet, Fortune Studios, 運用開始', 1, 'published'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE slug = 'scarlet-first-operation-note');

INSERT INTO sns_drafts (platform, topic, goal, tone, body, caption, slides_json, status)
SELECT 'instagram', 'Scarlet Guardianの運用開始', '公開サイトへの案内', '静かで正確', 'Scarlet Guardianの公開サイトと管理画面を整備しました。更新メモ、SNS案、分析記録をひとつの流れで扱えます。', 'Scarlet Guardianの運用を開始しました。\n\n公開サイト、管理画面、D1保存、分析メモを段階的に整えています。\n\n#ScarletGuardian #FortuneStudios #運用メモ', '[{"heading":"Scarlet Guardian","body":"公開サイトと管理画面を整備しました。"},{"heading":"できること","body":"記事メモ、SNS案、分析記録を保存できます。"},{"heading":"次の確認","body":"公開記事と週次分析を運用しながら育てます。"}]', 'ready'
WHERE NOT EXISTS (SELECT 1 FROM sns_drafts WHERE topic = 'Scarlet Guardianの運用開始');
