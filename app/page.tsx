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

export const dynamic = "force-dynamic";
export const revalidate = 0;

const highlights = [
  { label: "Concept", title: "静かに整える鑑定体験", text: "迷いや違和感を言葉にし、次に選ぶ行動を落ち着いて見つけるための場所です。" },
  { label: "Reading", title: "相談内容に合わせた案内", text: "恋愛、仕事、人間関係、これからの選択など、状況に合わせて読み解きます。" },
  { label: "Aftercare", title: "受け取った後も迷わない", text: "鑑定結果を日常で使えるように、要点と次の一歩をわかりやすく残します。" },
];

const operations = [
  ["鑑定テーマ", "恋愛 / 仕事 / 人間関係"],
  ["受付", "オンライン中心"],
  ["更新", "お知らせと読み物を掲載"],
  ["案内", "鑑定前の確認を掲載"],
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
  description: "Scarlet Guardianの公式サイトです。鑑定案内、お知らせ、読み物を掲載しています。",
};

export default async function Home() {
  const posts = await getPublicPosts();

  return (
    <main className="min-h-screen bg-[#f6f2ea] text-[#1d2320]">
      <header className="sticky top-0 z-20 border-b border-[#d7cabc] bg-[#f6f2ea]/95 px-5 py-3 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4" aria-label="サイトナビゲーション">
          <a className="text-base font-semibold text-[#20241f]" href="/">
            Scarlet Guardian
          </a>
          <div className="flex items-center gap-2 text-sm font-semibold text-[#5e625c]">
            <a className="rounded-lg px-3 py-2 hover:bg-[#fffaf2] hover:text-[#8f263a]" href="#updates">
              お知らせ
            </a>
            <a className="rounded-lg px-3 py-2 hover:bg-[#fffaf2] hover:text-[#8f263a]" href="#guide">
              鑑定案内
            </a>
          </div>
        </nav>
      </header>
      <section className="px-5 pb-10 pt-8">
        <div className="mx-auto grid min-h-[72vh] max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-[#8f263a]">Fortune Studios / Scarlet</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-tight text-[#20241f] md:text-7xl">Scarlet Guardian</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5e625c]">
              迷いの輪郭をほどき、次に進むための言葉を整える鑑定サイトです。お知らせ、鑑定案内、日々の読み物をここに集約します。
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a className="rounded-lg bg-[#20241f] px-5 py-3 text-sm font-semibold text-white" href="#updates">お知らせを見る</a>
              <a className="rounded-lg border border-[#cbbfac] px-5 py-3 text-sm font-semibold text-[#20241f]" href="#guide">鑑定案内を見る</a>
            </div>
          </div>

          <aside className="rounded-lg border border-[#d7cabc] bg-[#fffaf2] p-5" aria-label="サイト概要">
            <p className="text-sm font-semibold uppercase text-[#7d4b56]">Profile</p>
            <h2 className="mt-2 text-2xl font-semibold">Scarletの案内</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {operations.map(([label, value]) => (
                <article className="rounded-lg border border-[#d7cabc] bg-white p-4" key={label}>
                  <span className="text-xs font-semibold uppercase text-[#8f263a]">{label}</span>
                  <strong className="mt-3 block text-sm leading-6 text-[#20241f]">{value}</strong>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section id="updates" className="border-y border-[#d7cabc] bg-[#f5f0e8] px-5 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase text-[#8f263a]">Updates</p>
              <h2 className="mt-2 text-3xl font-semibold">お知らせ</h2>
            </div>
            <p className="text-sm text-[#5e625c]">最新の案内と読み物</p>
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

      <section id="guide" className="px-5 py-12">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-[#8f263a]">Guide</p>
            <h2 className="mt-2 text-3xl font-semibold">鑑定の流れ</h2>
            <p className="mt-4 leading-8 text-[#5e625c]">相談したい内容を整理し、鑑定結果を受け取り、日常で使える行動に落とし込みます。</p>
          </div>
          <ol className="grid gap-3">
            {["相談したいテーマを選ぶ", "今の状況や迷っている点を伝える", "鑑定結果と要点を受け取る", "次の一歩を決める"].map((item, index) => (
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



