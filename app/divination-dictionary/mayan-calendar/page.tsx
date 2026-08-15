import Link from "next/link";
import { getDictionaryGroup } from "../data";

const group = getDictionaryGroup("mayan-calendar");

export const metadata = {
  title: "マヤ暦の用語と読み方 | スカーレット・ドノバンの占術辞典",
  description: "KIN、太陽の紋章、ウェイブスペル、音、13日周期、260日周期をスカーレットの鑑定視点で解説します。",
};

export default function MayanCalendarDictionaryPage() {
  if (!group) return null;
  return (
    <main className="min-h-screen bg-[#211f1e] text-[#f8f1e8]">
      <section className="bg-[linear-gradient(135deg,#211f1e_0%,#303331_48%,#5e2430_100%)] px-5 py-8">
        <div className="mx-auto max-w-5xl">
          <nav className="mb-6 flex flex-wrap gap-3 text-sm font-semibold text-[#d8b7a7]">
            <Link href="/divination-methods/">占術一覧</Link>
            <Link href="/divination-methods/mayan-calendar/">マヤ暦とは</Link>
            <Link href="/divination-dictionary/">占術辞典</Link>
          </nav>
          <article className="rounded-lg border border-[#d8b7a7]/30 bg-[#fff8f0] p-6 text-[#2f2928] shadow-xl">
            <p className="text-sm font-extrabold uppercase text-[#7f3440]">Mayan Calendar Terms</p>
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
              <h2 className="mt-2 text-2xl font-semibold">自分のKINを相談に重ねて読む</h2>
              <p className="mt-3 leading-8 text-[#e7d8cc]">用語を知るだけでなく、今の相談にどう表れるかまで整理したい場合は、マヤ暦テキスト鑑定で生年月日と相談内容を送ってください。</p>
              <Link className="mt-5 inline-flex rounded-lg bg-[#d8b7a7] px-5 py-3 font-bold text-[#262625]" href="/text-reading/">￥0トライアルを見る</Link>
            </section>
          </article>
        </div>
      </section>
    </main>
  );
}
