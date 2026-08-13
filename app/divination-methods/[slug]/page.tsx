import Link from "next/link";
import { getMethodBySlug, methodDetails } from "../data";

export function generateStaticParams() {
  return methodDetails.map((method) => ({ slug: method.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const method = getMethodBySlug(params.slug);
  if (!method) {
    return { title: "占術 | スカーレット・ドノバン" };
  }
  return {
    title: `${method.title} | スカーレット・ドノバンの占術`,
    description: method.description,
  };
}

export default function DivinationMethodDetailPage({ params }: { params: { slug: string } }) {
  const method = getMethodBySlug(params.slug);

  if (!method) {
    return (
      <main className="min-h-screen bg-[#211f1e] px-5 py-12 text-[#f8f1e8]">
        <div className="mx-auto max-w-3xl rounded-lg border border-[#d8b7a7]/25 bg-[#2a2d2a] p-6">
          <h1 className="text-3xl font-semibold">占術が見つかりません</h1>
          <Link className="mt-4 inline-block text-[#d8b7a7] underline underline-offset-4" href="/divination-methods/">占術一覧へ戻る</Link>
        </div>
      </main>
    );
  }

  const otherMethods = methodDetails.filter((item) => item.slug !== method.slug);

  return (
    <main className="min-h-screen bg-[#211f1e] text-[#f8f1e8]">
      <section className="bg-[linear-gradient(135deg,#211f1e_0%,#303331_48%,#5e2430_100%)] px-5 py-8">
        <div className="mx-auto max-w-5xl">
          <nav className="mb-6 flex flex-wrap gap-3 text-sm font-semibold text-[#d8b7a7]">
            <Link href="/">Scarlet Donovan</Link>
            <Link href="/divination-methods/">占術一覧</Link>
            <Link href="https://raven.fortunestudios.jp/guild">ギルド紹介</Link>
          </nav>

          <article className="rounded-lg border border-[#d8b7a7]/30 bg-[#fff8f0] p-6 text-[#2f2928] shadow-xl">
            <p className="text-sm font-extrabold uppercase text-[#7f3440]">{method.reading}</p>
            <h1 className="mt-2 text-4xl font-semibold leading-tight sm:text-5xl">{method.title}</h1>
            <p className="mt-3 text-lg font-semibold text-[#7f3440]">{method.subtitle}</p>
            <p className="mt-4 leading-8 text-[#685b55]">{method.description}</p>
            <Link className="mt-4 inline-block text-sm font-bold text-[#7f3440] underline underline-offset-4" href={`/divination-dictionary/${method.slug}/`}>
              用語と読み方を詳しく見る
            </Link>

            <div className="mt-8 grid gap-5">
              {method.sections.map((section) => (
                <section key={section.heading} className="border-t border-[#c9b3a3] pt-5">
                  <h2 className="text-2xl font-semibold">{section.heading}</h2>
                  <p className="mt-3 leading-8 text-[#685b55]">{section.body}</p>
                </section>
              ))}
            </div>

            <section className="mt-8 rounded-lg border border-[#c9b3a3] bg-white/60 p-5">
              <h2 className="text-2xl font-semibold">この占術が向いている相談</h2>
              <ul className="mt-3 grid gap-2 leading-7 text-[#685b55]">
                {method.examples.map((example) => (
                  <li key={example}>・{example}</li>
                ))}
              </ul>
            </section>
          </article>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold">他の占術も読む</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {otherMethods.map((item) => (
                <Link key={item.slug} className="rounded-lg border border-[#d8b7a7]/25 bg-[#2a2d2a] p-4" href={`/divination-methods/${item.slug}/`}>
                  <p className="text-sm font-semibold uppercase text-[#d8b7a7]">{item.reading}</p>
                  <h3 className="mt-2 text-xl font-semibold">{item.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#e4d7cb]">{item.subtitle}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

