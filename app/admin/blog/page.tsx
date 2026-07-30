import Link from "next/link";
import { cookies, headers } from "next/headers";
import { BlogTools } from "./blog-tools";

type Post = {
  id: number;
  slug?: string;
  title: string;
  description?: string;
  body: string;
  pub_date?: string;
  category?: string;
  tags?: string;
  featured?: number;
  status: string;
  created_at: string;
};

async function getPosts() {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "scarlet.fortunestudios.jp";
  const proto = headerStore.get("x-forwarded-proto") ?? "https";
  const response = await fetch(`${proto}://${host}/api/admin/posts`, {
    cache: "no-store",
    headers: { cookie: cookieStore.toString() },
  });

  if (!response.ok) return [] as Post[];
  const data = (await response.json()) as { posts?: Post[] };
  return data.posts ?? [];
}

export const metadata = { title: "ブログ管理 | Scarlet Guardian" };

export default async function BlogAdminPage() {
  const posts = await getPosts();
  const today = new Date().toISOString().slice(0, 10);
  const categories = Array.from(new Set(posts.map((post) => post.category).filter(Boolean)));

  return (
    <main className="min-h-screen bg-[#f5f0e8] px-5 py-8 text-[#20241f]">
      <div className="mx-auto max-w-6xl">
        <Link className="text-sm font-semibold text-[#8f263a]" href="/admin">管理ダッシュボードへ戻る</Link>
        <header className="mt-5 border-b border-[#d7cabc] pb-6">
          <p className="text-sm font-semibold uppercase text-[#7d4b56]">Blog Admin</p>
          <h1 className="mt-2 text-4xl font-semibold">ブログ管理</h1>
          <p className="mt-3 max-w-2xl leading-7 text-[#5e625c]">公開記事、記事案、Markdown化しやすい本文をD1へ保存します。</p>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-5">
            <form className="rounded-lg border border-[#d7cabc] bg-white p-5" action="/api/admin/posts" method="post">
              <h2 className="text-2xl font-semibold">D1へ保存</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-[#7d4b56]">スラッグ<input className="admin-field" name="slug" placeholder="scarlet-update" /></label>
                <label className="grid gap-2 text-sm font-semibold text-[#7d4b56]">公開日<input className="admin-field" name="pub_date" type="date" defaultValue={today} /></label>
              </div>
              <label className="mt-3 grid gap-2 text-sm font-semibold text-[#7d4b56]">タイトル<input className="admin-field" name="title" required placeholder="例: Scarletのブログ記事" /></label>
              <label className="mt-3 grid gap-2 text-sm font-semibold text-[#7d4b56]">説明文<textarea className="admin-field min-h-24" name="description" placeholder="一覧やSNS転用で使う短い説明" /></label>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-[#7d4b56]">カテゴリ<input className="admin-field" name="category" defaultValue="Scarlet運用" /></label>
                <label className="grid gap-2 text-sm font-semibold text-[#7d4b56]">タグ<input className="admin-field" name="tags" placeholder="Scarlet, 運用, 更新" /></label>
              </div>
              <label className="mt-3 grid gap-2 text-sm font-semibold text-[#7d4b56]">本文<textarea className="admin-field min-h-72 font-mono text-sm leading-7" name="body" required placeholder={"## 見出し\n\n本文を入力してください。"} /></label>
              <div className="mt-3 flex flex-wrap gap-4 text-sm font-semibold text-[#7d4b56]">
                <label className="flex items-center gap-2"><input name="featured" type="checkbox" value="1" />トップ候補</label>
                <label className="flex items-center gap-2">状態<select className="admin-field" name="status" defaultValue="draft"><option value="draft">下書き</option><option value="published">公開</option></select></label>
              </div>
              <button className="mt-4 rounded-lg bg-[#20241f] px-5 py-3 text-sm font-semibold text-white" type="submit">ブログ記事を保存</button>
            </form>
            <BlogTools seed={posts[0]} />
          </div>

          <section aria-label="保存済み記事">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="text-2xl font-semibold">保存済み記事</h2>
              <p className="text-sm text-[#5e625c]">カテゴリ: {categories.length ? categories.join(" / ") : "未登録"}</p>
            </div>
            {posts.length === 0 ? <p className="mt-3 leading-7 text-[#5e625c]">まだ保存済みの記事はありません。</p> : (
              <div className="mt-4 grid gap-3">
                {posts.map((post) => (
                  <article className="rounded-lg border border-[#d7cabc] bg-white p-5" key={post.id}>
                    <span className="text-xs font-semibold uppercase text-[#8f263a]">{post.status}{post.featured ? " / featured" : ""}</span>
                    <h3 className="mt-2 text-lg font-semibold">{post.title}</h3>
                    <p className="mt-1 text-sm text-[#7f837b]">{post.pub_date || post.created_at} / {post.category || "未分類"}</p>
                    {post.description ? <p className="mt-3 leading-7 text-[#5e625c]">{post.description}</p> : null}
                    <p className="mt-3 line-clamp-4 whitespace-pre-wrap leading-7 text-[#5e625c]">{post.body}</p>
                    {post.tags ? <p className="mt-3 text-xs text-[#8f263a]">{post.tags}</p> : null}
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}

