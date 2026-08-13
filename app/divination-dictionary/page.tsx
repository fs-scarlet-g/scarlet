import Link from "next/link";
import { dictionaryGroups } from "./data";

export const metadata = {
  title: "スカーレット・ドノバンの占術辞典 | マヤ暦・インド占星術",
  description: "マヤ暦とインド占星術の用語、考え方、読み方をスカーレット・ドノバンの鑑定視点で整理します。",
};

export default function DivinationDictionaryPage() {
  return (
    <main className="min-h-screen bg-[#211f1e] text-[#f8f1e8]">
      <section className="bg-[linear-gradient(135deg,#211f1e_0%,#303331_48%,#5e2430_100%)] px-5 py-8">
        <div className="mx-auto max-w-6xl">
          <nav className="mb-6 flex flex-wrap gap-3 text-sm font-semibold text-[#d8b7a7]">
            <Link href="/">Scarlet Donovan</Link>
            <Link href="/divination-methods/">占術</Link>
          </nav>
          <p className="text-sm font-extrabold uppercase text-[#d8b7a7]">Divination Dictionary</p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight sm:text-5xl">占術の用語と読み方</h1>
          <p className="mt-4 max-w-3xl leading-8 text-[#e7d8cc]">
            マヤ暦とインド占星術は、ひとつの言葉だけで説明しきれない深い体系です。ここでは専門用語を並べるだけではなく、スカーレットが鑑定でどう読み、相談者の現実の判断へどう戻すかを整理します。
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {dictionaryGroups.map((group) => (
              <article key={group.slug} className="rounded-lg border border-[#d8b7a7]/25 bg-[#2a2d2a] p-5">
                <p className="text-sm font-semibold uppercase text-[#d8b7a7]">{group.slug}</p>
                <h2 className="mt-2 text-3xl font-semibold">{group.title}</h2>
                <p className="mt-2 font-semibold text-[#f0dfd1]">{group.subtitle}</p>
                <p className="mt-3 leading-8 text-[#e4d7cb]">{group.description}</p>
                <Link className="mt-4 inline-block text-sm font-bold text-[#d8b7a7] underline underline-offset-4" href={`/divination-dictionary/${group.slug}/`}>
                  用語と読み方を詳しく見る
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
