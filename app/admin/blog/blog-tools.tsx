"use client";

import { useMemo, useState } from "react";

type PostSeed = {
  slug?: string;
  title?: string;
  description?: string;
  body?: string;
  pub_date?: string;
  category?: string;
  tags?: string;
  featured?: number;
  status?: string;
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "") || `scarlet-${Date.now()}`;
}

function buildMarkdown(post: Required<PostSeed>) {
  const tags = post.tags
    .split(",")
    .map((tag) => `"${tag.trim()}"`)
    .filter((tag) => tag !== '""')
    .join(", ");
  return `---\ntitle: "${post.title}"\ndescription: "${post.description}"\npubDate: ${post.pub_date}\ncategory: "${post.category}"\ntags: [${tags}]\nfeatured: ${Boolean(post.featured)}\nstatus: "${post.status}"\n---\n\n${post.body}\n`;
}

export function BlogTools({ seed = {} }: { seed?: PostSeed }) {
  const [post, setPost] = useState<Required<PostSeed>>({
    slug: seed.slug || "",
    title: seed.title || "Scarletのブログ記事",
    description: seed.description || "Scarlet Guardianの更新内容を短く整理したメモです。",
    body: seed.body || "## 目的\n\nScarletの更新内容を、公開前に短く整理します。\n\n## 確認すること\n\n- 公開してよい情報だけを書く\n- 親ドメインの管理と混ぜない\n- 次に必要な作業を一つ残す",
    pub_date: seed.pub_date || today(),
    category: seed.category || "Scarlet運用",
    tags: seed.tags || "Scarlet, Fortune Studios, 運用",
    featured: seed.featured || 0,
    status: seed.status || "draft",
  });
  const [message, setMessage] = useState("Markdownを確認できます。");
  const markdown = useMemo(() => buildMarkdown(post), [post]);

  async function copyMarkdown() {
    await navigator.clipboard.writeText(markdown);
    setMessage("Markdownをコピーしました。");
  }

  function fillTemplate(kind: "update" | "notice" | "checklist") {
    if (kind === "notice") {
      setPost((current) => ({
        ...current,
        slug: "scarlet-notice",
        title: "Scarletからのお知らせ",
        description: "Scarlet Guardianに関するお知らせです。",
        body: "## お知らせ\n\nScarlet Guardianの公開情報を更新しました。\n\n## 対象\n\n公開サイト、管理画面、ブログ記事の確認導線です。\n\n## 次の確認\n\n必要な文言とリンクを確認します。",
      }));
      return;
    }
    if (kind === "checklist") {
      setPost((current) => ({
        ...current,
        slug: "scarlet-operation-check",
        title: "公開前チェックリスト",
        description: "Scarletの公開前に確認する項目をまとめます。",
        body: "## 確認項目\n\n- 公開URLが正しく開く\n- 管理画面がログイン保護されている\n- D1に保存した内容が表示される\n- 親ドメイン側の既存サイトに影響しない\n\n## メモ\n\n気づいたことをここに残します。",
      }));
      return;
    }
    setPost((current) => ({
      ...current,
      slug: "scarlet-update",
      title: "Scarlet更新メモ",
      description: "Scarlet Guardianの更新内容と次の作業を整理します。",
      body: "## 更新内容\n\nScarlet Guardianの管理機能を更新しました。\n\n## 影響範囲\n\n公開ページ、管理画面、D1保存データを確認します。\n\n## 次の一手\n\n運用しながら不足している入力欄を追加します。",
    }));
  }

  return (
    <section className="rounded-lg border border-[#d7cabc] bg-[#fffaf2] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Markdown生成</h2>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-lg border border-[#d7cabc] px-3 py-2 text-sm font-semibold" type="button" onClick={() => fillTemplate("update")}>更新メモ</button>
          <button className="rounded-lg border border-[#d7cabc] px-3 py-2 text-sm font-semibold" type="button" onClick={() => fillTemplate("notice")}>お知らせ</button>
          <button className="rounded-lg border border-[#d7cabc] px-3 py-2 text-sm font-semibold" type="button" onClick={() => fillTemplate("checklist")}>チェック</button>
          <button className="rounded-lg bg-[#20241f] px-3 py-2 text-sm font-semibold text-white" type="button" onClick={copyMarkdown}>コピー</button>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-[#7d4b56]">スラッグ<input className="admin-field" value={post.slug} onChange={(event) => setPost({ ...post, slug: toSlug(event.target.value) })} /></label>
        <label className="grid gap-2 text-sm font-semibold text-[#7d4b56]">公開日<input className="admin-field" type="date" value={post.pub_date} onChange={(event) => setPost({ ...post, pub_date: event.target.value })} /></label>
      </div>
      <label className="mt-3 grid gap-2 text-sm font-semibold text-[#7d4b56]">タイトル<input className="admin-field" value={post.title} onChange={(event) => setPost({ ...post, title: event.target.value })} /></label>
      <label className="mt-3 grid gap-2 text-sm font-semibold text-[#7d4b56]">説明文<textarea className="admin-field min-h-24" value={post.description} onChange={(event) => setPost({ ...post, description: event.target.value })} /></label>
      <label className="mt-3 grid gap-2 text-sm font-semibold text-[#7d4b56]">本文<textarea className="admin-field min-h-56 font-mono text-sm leading-7" value={post.body} onChange={(event) => setPost({ ...post, body: event.target.value })} /></label>
      <pre className="mt-4 max-h-72 overflow-auto rounded-lg border border-[#d7cabc] bg-white p-4 text-xs leading-6"><code>{markdown}</code></pre>
      <p className="mt-3 text-sm text-[#5e625c]">{message}</p>
    </section>
  );
}

