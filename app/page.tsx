import { headers } from "next/headers";

type PublicPost = {
  id: number;
  slug?: string;
  title: string;
  description?: string;
  body: string;
  pub_date?: string;
  category?: string;
  tags?: string;
  featured?: number;
  created_at: string;
};

const highlights = [
  { label: "Purpose", title: "Scarletの公開拠点", text: "Scarletに関する案内、ブログ記事、更新情報を集約するための公式サブドメインです。" },
  { label: "Operation", title: "運用しやすい基盤", text: "管理画面、記事管理、SNS投稿案、稼働確認を同じWorker上で扱います。" },
  { label: "Domain", title: "サブドメイン単位で安全に公開", text: "親ドメインは既存アカウントで維持し、scarletだけをScarlet用Workerへ接続しています。" },
];

const operations = [
  ["公開URL", "scarlet.fortunestudios.jp"],
  ["Worker", "scarlet-guardian"],
  ["Database", "D1 scarlet-guardian"],
  ["Auth", "Google OAuth / 管理者限定"],
];

async function getPublicPosts() {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "scarlet.fortunestudios.jp";
  const proto = headerStore.get("x-forwarded-proto") ?? "https";
  const response = await fetch(`${proto}://${host}/api/public/posts`, { cache: "no-store" });
  if (!response.ok) return [] as PublicPost[];
  const data = (await response.json()) as { posts?: PublicPost[] };
  return data.posts ?? [];
}

export const metadata = {
  title: "Scarlet Guardian | Fortune Studios",
  description: "Scarlet用の公開サイトと運用基盤です。",
};

export default async function Home() {
  const posts = await getPublicPosts();

  return (
    <main className="min-h-screen bg-[#f6f2ea] text-[#1d2320]">
      <section className="px-5 pb-10 pt-8">
        <div className="mx-auto grid min-h-[72vh] max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-[#8f263a]">Fortune Studios / Scarlet</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-tight text-[#20241f] md:text-7xl">Scarlet Guardian</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5e625c]">
              Scarletの情報発信と運用準備を支える公開サイトです。必要な情報を静かに整理し、更新・記録・確認を継続できる形で管理します。
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a className="rounded-lg bg-[#20241f] px-5 py-3 text-sm font-semibold text-white" href="#updates">更新を見る</a>
              <a className="rounded-lg border border-[#cbbfac] px-5 py-3 text-sm font-semibold text-[#20241f]" href="/admin">管理画面</a>
            </div>
          </div>

          <aside className="rounded-lg border border-[#d7cabc] bg-[#fffaf2] p-5" aria-label="運用状態">
            <p className="text-sm font-semibold uppercase text-[#7d4b56]">Status</p>
            <h2 className="mt-2 text-2xl font-semibold">稼働中の構成</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {operations.map(([label, value]) => (
                <article className="rounded-lg border border-[#d7cabc] bg-white p-4" key={label}>
                  <span className="text-xs font-semibold uppercase text-[#8f263a]">{label}</span>
                  <strong className="mt-3 block text-sm leading-6 text-[#20241f]">{value}</strong>
                </article>
              ))}
            </div>
            <a className="mt-5 inline-flex rounded-lg border border-[#cbbfac] px-4 py-2 text-sm font-semibold" href="/health">ヘルスチェックを見る</a>
          </aside>
        </div>
      </section>

      <section id="updates" className="border-y border-[#d7cabc] bg-[#f5f0e8] px-5 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase text-[#8f263a]">Updates</p>
              <h2 className="mt-2 text-3xl font-semibold">公開記事</h2>
            </div>
            <p className="text-sm text-[#5e625c]">D1に保存した公開記事を表示</p>
          </div>
          {posts.length === 0 ? (
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {highlights.map((item) => (
                <article className="rounded-lg border border-[#d7cabc] bg-white p-5" key={item.title}>
                  <span className="text-xs font-semibold uppercase text-[#8f263a]">{item.label}</span>
                  <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 leading-7 text-[#5e625c]">{item.text}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {posts.map((post) => (
                <article className="rounded-lg border border-[#d7cabc] bg-white p-5" key={post.id}>
                  <span className="text-xs font-semibold uppercase text-[#8f263a]">{post.category || "Update"}</span>
                  <h3 className="mt-3 text-xl font-semibold">{post.title}</h3>
                  {post.description ? <p className="mt-3 leading-7 text-[#5e625c]">{post.description}</p> : null}
                  <p className="mt-3 line-clamp-4 whitespace-pre-wrap text-sm leading-7 text-[#5e625c]">{post.body}</p>
                  <time className="mt-4 block text-xs text-[#7f837b]">{post.pub_date || post.created_at}</time>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-5 py-12">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-[#8f263a]">Next</p>
            <h2 className="mt-2 text-3xl font-semibold">運用の流れ</h2>
            <p className="mt-4 leading-8 text-[#5e625c]">管理画面でメモを保存し、公開状態にしたものをトップへ表示します。分析画面では週次の数値と改善判断を残します。</p>
          </div>
          <ol className="grid gap-3">
            {["管理画面で記事・SNS案を作成", "公開してよい記事をpublishedにする", "トップに公開記事として表示", "分析画面で反応を確認"].map((item, index) => (
              <li className="flex gap-4 rounded-lg border border-[#d7cabc] bg-white p-4" key={item}>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#8f263a] text-sm font-semibold text-white">{index + 1}</span>
                <span className="self-center leading-7 text-[#20241f]">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}

