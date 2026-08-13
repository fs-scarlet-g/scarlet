import Link from "next/link";
import { cookies, headers } from "next/headers";
import { SnsTools } from "./sns-tools";

type SnsDraft = {
  id: number;
  platform: string;
  topic?: string;
  goal?: string;
  tone?: string;
  body?: string;
  caption?: string;
  slides_json?: string;
  status: string;
  created_at: string;
};

async function getDrafts() {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "scarlet.fortunestudios.jp";
  const proto = headerStore.get("x-forwarded-proto") ?? "https";
  const response = await fetch(`${proto}://${host}/api/admin/sns-drafts`, {
    cache: "no-store",
    headers: { cookie: cookieStore.toString() },
  });

  if (!response.ok) return [] as SnsDraft[];
  const data = (await response.json()) as { drafts?: SnsDraft[] };
  return data.drafts ?? [];
}

export const metadata = { title: "SNSコンテンツ生成 | Scarlet Donovan" };

export default async function SnsAdminPage() {
  const drafts = await getDrafts();

  return (
    <main className="min-h-screen bg-[#f5f0e8] px-5 py-8 text-[#20241f]">
      <div className="mx-auto max-w-6xl">
        <Link className="text-sm font-semibold text-[#8f263a]" href="/admin">管理ダッシュボードへ戻る</Link>
        <header className="mt-5 border-b border-[#d7cabc] pb-6">
          <p className="text-sm font-semibold uppercase text-[#7d4b56]">SNS Creator</p>
          <h1 className="mt-2 text-4xl font-semibold">SNSコンテンツ生成</h1>
          <p className="mt-3 max-w-2xl leading-7 text-[#5e625c]">投稿テーマ、スライド案、PNG、キャプションを作成して保存します。自動投稿は行いません。</p>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="grid gap-5">
            <SnsTools />
            <form className="rounded-lg border border-[#d7cabc] bg-white p-5" action="/api/admin/sns-drafts" method="post">
              <h2 className="text-2xl font-semibold">D1へ保存</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-[#7d4b56]">投稿先<select className="admin-field" name="platform" defaultValue="instagram"><option value="instagram">Instagram</option><option value="x">X</option><option value="threads">Threads</option><option value="other">その他</option></select></label>
                <label className="grid gap-2 text-sm font-semibold text-[#7d4b56]">状態<select className="admin-field" name="status" defaultValue="draft"><option value="draft">下書き</option><option value="ready">投稿準備OK</option></select></label>
              </div>
              <label className="mt-3 grid gap-2 text-sm font-semibold text-[#7d4b56]">投稿テーマ<textarea className="admin-field min-h-24" name="topic" placeholder="例: Scarletの更新内容を短く伝える" /></label>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-[#7d4b56]">目的<select className="admin-field" name="goal" defaultValue="公開サイトへの案内"><option>公開サイトへの案内</option><option>管理メモの整理</option><option>更新告知</option><option>問い合わせ導線</option></select></label>
                <label className="grid gap-2 text-sm font-semibold text-[#7d4b56]">トーン<select className="admin-field" name="tone" defaultValue="静かで正確"><option>静かで正確</option><option>短く実用的</option><option>やさしく落ち着いた</option></select></label>
              </div>
              <label className="mt-3 grid gap-2 text-sm font-semibold text-[#7d4b56]">スライド案<textarea className="admin-field min-h-40 font-mono text-sm leading-7" name="slides_json" placeholder={'[{"heading":"Scarlet Donovan","body":"更新内容を短く伝えます。"}]'} /></label>
              <label className="mt-3 grid gap-2 text-sm font-semibold text-[#7d4b56]">投稿本文<textarea className="admin-field min-h-36" name="body" placeholder="投稿の下書き" /></label>
              <label className="mt-3 grid gap-2 text-sm font-semibold text-[#7d4b56]">キャプション<textarea className="admin-field min-h-36" name="caption" placeholder="#Scarlet #FortuneStudios" /></label>
              <button className="mt-4 rounded-lg bg-[#20241f] px-5 py-3 text-sm font-semibold text-white" type="submit">SNS案を保存</button>
            </form>
          </div>

          <section aria-label="保存済みSNS投稿案">
            <h2 className="text-2xl font-semibold">保存済み投稿案</h2>
            {drafts.length === 0 ? <p className="mt-3 leading-7 text-[#5e625c]">まだ保存済みの投稿案はありません。</p> : (
              <div className="mt-4 grid gap-3">
                {drafts.map((draft) => (
                  <article className="rounded-lg border border-[#d7cabc] bg-white p-5" key={draft.id}>
                    <span className="text-xs font-semibold uppercase text-[#8f263a]">{draft.platform} / {draft.status}</span>
                    <h3 className="mt-2 text-lg font-semibold">{draft.topic || "無題の投稿案"}</h3>
                    <p className="mt-1 text-sm text-[#7f837b]">{draft.goal || "目的未設定"} / {draft.tone || "トーン未設定"}</p>
                    {draft.body ? <p className="mt-3 whitespace-pre-wrap leading-7 text-[#5e625c]">{draft.body}</p> : null}
                    {draft.caption ? <p className="mt-3 whitespace-pre-wrap rounded-lg border border-[#d7cabc] bg-[#fffaf2] p-3 leading-7 text-[#5e625c]">{draft.caption}</p> : null}
                    {draft.slides_json ? <pre className="mt-3 max-h-44 overflow-auto rounded-lg border border-[#d7cabc] bg-[#fffaf2] p-3 text-xs"><code>{draft.slides_json}</code></pre> : null}
                    <time className="mt-3 block text-xs text-[#7f837b]">{draft.created_at}</time>
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

