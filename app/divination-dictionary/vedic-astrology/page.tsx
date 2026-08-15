import Link from "next/link";
import { getDictionaryGroup } from "../data";

const group = getDictionaryGroup("vedic-astrology");

export const metadata = {
  title: "インド占星術の用語と読み方 | スカーレット・ドノバンの占術辞典",
  description: "出生図、ラグナ、月星座、ナクシャトラ、ハウス、惑星、ダシャーをスカーレットの鑑定視点で解説します。",
};

export default function VedicAstrologyDictionaryPage() {
  if (!group) return null;
  return (
    <main className="min-h-screen bg-[#211f1e] text-[#f8f1e8]">
      <section className="bg-[linear-gradient(135deg,#211f1e_0%,#303331_48%,#5e2430_100%)] px-5 py-8">
        <div className="mx-auto max-w-5xl">
          <nav className="mb-6 flex flex-wrap gap-3 text-sm font-semibold text-[#d8b7a7]">
            <Link href="/divination-methods/">占術一覧</Link>
            <Link href="/divination-methods/vedic-astrology/">インド占星術とは</Link>
            <Link href="/divination-dictionary/">占術辞典</Link>
          </nav>
          <article className="rounded-lg border border-[#d8b7a7]/30 bg-[#fff8f0] p-6 text-[#2f2928] shadow-xl">
            <p className="text-sm font-extrabold uppercase text-[#7f3440]">Vedic Astrology Terms</p>
            <h1 className="mt-2 text-4xl font-semibold leading-tight sm:text-5xl">{group.title}</h1>
            <p className="mt-3 text-lg font-semibold text-[#7f3440]">{group.subtitle}</p>
            <p className="mt-4 leading-8 text-[#685b55]">{group.description}</p>
            <section className="mt-8 rounded-lg border border-[#c9b3a3] bg-white/60 p-5">
              <h2 className="text-2xl font-semibold">読み方の順序</h2>
              <ol className="mt-3 grid gap-2 leading-7 text-[#685b55]">
                {group.readingSteps.map((step, index) => <li key={step}>{index + 1}. {step}</li>)}
              </ol>
            </section>
            <div className="mt-8 grid gap-5">
              {group.terms.map((item) => (
                <section key={item.term} className="border-t border-[#c9b3a3] pt-5">
                  <h2 className="text-2xl font-semibold">{item.term}</h2>
                  <p className="mt-3 leading-8 text-[#685b55]">{item.body}</p>
                </section>
              ))}
            </div>
            <section className="mt-8 rounded-lg border border-[#7f3440]/25 bg-[#2a2d2a] p-5 text-[#f8f1e8]">
              <p className="text-sm font-extrabold uppercase text-[#d8b7a7]">Trial Reading</p>
              <h2 className="mt-2 text-2xl font-semibold">出生図を相談の文脈で読む</h2>
              <p className="mt-3 leading-8 text-[#e7d8cc]">ラグナ、月、惑星、ダシャーを自分の転機や関係性に重ねて整理したい場合は、出生時間・出生地と相談内容を添えて申し込めます。</p>
              <Link className="mt-5 inline-flex rounded-lg bg-[#d8b7a7] px-5 py-3 font-bold text-[#262625]" href="/text-reading/">￥0トライアルを見る</Link>
            </section>
          </article>
        </div>
      </section>
    </main>
  );
}
