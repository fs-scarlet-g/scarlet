import Link from "next/link";
import { getPersona, personaSummary } from "@/app/lib/personas";

const links = [
  {
    href: "/admin/analytics",
    title: "アクセス分析",
    description: "GA4や手入力の数値から、次の改善アクションを整理します。",
  },
  {
    href: "/admin/blog",
    title: "ブログ管理",
    description: "ブログ記事案、下書き、Markdown出力を管理します。",
  },
  {
    href: "/admin/sns",
    title: "SNSコンテンツ生成",
    description: "投稿案、キャプション、告知文の準備を行います。",
  },
  {
    href: "/oracle",
    title: "公開文チェック",
    description: "記事、告知、SNS文面を公開前に簡易確認します。",
  },
];

export const metadata = {
  title: "管理ダッシュボード | Scarlet Guardian",
};

export default function AdminPage() {
  const persona = getPersona();

  return (
    <main className="min-h-screen bg-[#f5f0e8] px-5 py-8 text-[#20241f]">
      <div className="mx-auto max-w-6xl">
        <Link className="text-sm font-semibold text-[#8f263a]" href="/">
          Scarlet Guardian
        </Link>
        <header className="mt-5 border-b border-[#d7cabc] pb-6">
          <p className="text-sm font-semibold uppercase text-[#7d4b56]">Admin</p>
          <h1 className="mt-2 text-4xl font-semibold">管理ダッシュボード</h1>
          <p className="mt-3 max-w-2xl leading-7 text-[#5e625c]">
            Scarletの公開サイト、記事、SNS投稿案、運用状態を確認する管理画面です。
          </p>
          <pre className="mt-5 max-w-3xl whitespace-pre-wrap rounded-lg border border-[#d7cabc] bg-[#fffaf2] p-4 text-sm leading-7 text-[#5e625c]">
            {personaSummary(persona)}
          </pre>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-4" aria-label="管理メニュー">
          {links.map((item) => (
            <Link className="rounded-lg border border-[#d7cabc] bg-white p-5 transition hover:border-[#8f263a]" href={item.href} key={item.href}>
              <span className="text-sm font-semibold text-[#8f263a]">{item.title}</span>
              <p className="mt-3 leading-7 text-[#5e625c]">{item.description}</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}



