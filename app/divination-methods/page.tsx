import Link from "next/link";
import { methodDetails } from "./data";

export const metadata = {
  title: "スカーレット・ドノバンの占術 | マヤ暦・インド占星術",
  description:
    "スカーレット・ドノバンが得意とするマヤ暦とインド占星術を詳しく解説します。",
};

export default function DivinationMethodsPage() {
  return (
    <main className="min-h-screen bg-[#211f1e] text-[#f8f1e8]">
      <section className="bg-[linear-gradient(135deg,#211f1e_0%,#303331_48%,#5e2430_100%)] px-5 py-8">
        <div className="mx-auto max-w-6xl">
          <header className="border-b border-[#d8b7a7]/35 pb-7">
            <nav className="mb-5 flex flex-wrap gap-3 text-sm font-semibold text-[#d8b7a7]">
              <Link href="/">Scarlet Donovan</Link>
              <Link href="/divination-methods/">占術</Link>
              <Link href="/#profile">プロフィール</Link>
              <Link href="https://raven.fortunestudios.jp/guild">ギルド紹介</Link>
            </nav>
            <p className="text-sm font-extrabold uppercase text-[#d8b7a7]">Divination Methods</p>
            <h1 className="mt-2 text-4xl font-semibold leading-tight sm:text-5xl">スカーレット・ドノバンの占術</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[#e7d8cc]">
              スカーレットは占いを、感情を煽るものとして扱いません。マヤ暦では生まれ持ったリズム、関係性、周期の使い方を読み、インド占星術では出生図、月、ラグナ、ダシャーから人生の大きな流れを見ます。どちらも一言で済ませられる占術ではないため、深い時間軸から相談者の現在地を整理し、自分を守りながら次の一歩を選べるように読み解きます。
            </p>
          </header>

          <section className="mt-8 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
            <aside className="rounded-lg border border-[#d8b7a7]/30 bg-[#fff8f0] p-5 text-[#2f2928] shadow-xl">
              <p className="text-sm font-extrabold uppercase text-[#7f3440]">Reading Policy</p>
              <h2 className="mt-2 text-2xl font-semibold">強さは、急がせないために使う</h2>
              <p className="mt-3 leading-8 text-[#685b55]">
                マヤ暦もインド占星術も、それぞれ単独で深く読める占術です。スカーレットは短い答えに相談者を押し込めず、生まれ持った資質、現在の周期、関係性の流れ、長期的な人生テーマを分けて見ます。未来を断定するより、今の選択を落ち着いて扱える状態へ戻すことを重視します。
              </p>
              <Link className="mt-4 inline-block text-sm font-bold text-[#7f3440] underline underline-offset-4" href="/">
                トップへ戻る
              </Link>
            </aside>

            <div className="grid gap-4">
              {methodDetails.map((method) => (
                <article key={method.slug} className="rounded-lg border border-[#d8b7a7]/25 bg-[#2a2d2a] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <p className="text-sm font-semibold uppercase text-[#d8b7a7]">{method.reading}</p>
                  <h2 className="mt-2 text-3xl font-semibold">{method.name}</h2>
                  <p className="mt-2 font-semibold text-[#f0dfd1]">{method.subtitle}</p>
                  <p className="mt-3 leading-8 text-[#e4d7cb]">{method.description}</p>
                  <Link className="mt-4 inline-block text-sm font-bold text-[#d8b7a7] underline underline-offset-4" href={`/divination-methods/${method.slug}/`}>
                    {method.name}を詳しく読む
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-lg border border-[#d8b7a7]/25 bg-[#2a2d2a] p-5">
            <p className="text-sm font-extrabold uppercase text-[#d8b7a7]">How Scarlet Reads</p>
            <h2 className="mt-2 text-2xl font-semibold">鑑定で見ること</h2>
            <div className="mt-4 grid gap-3 text-sm leading-7 text-[#e4d7cb] sm:grid-cols-3">
              <p className="rounded bg-[#211f1e]/70 p-3">生まれ持った資質と、今の周期で強まりやすいテーマを見る。</p>
              <p className="rounded bg-[#211f1e]/70 p-3">マヤ暦では関係性と役割、インド占星術では長期的な流れを整理する。</p>
              <p className="rounded bg-[#211f1e]/70 p-3">宿命論ではなく、現実の選択に戻せる判断材料として読む。</p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}



