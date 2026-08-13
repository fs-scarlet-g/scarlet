const copy = {
  title: "スカーレット・ドノバン | Fortune Studios",
  description: "剣と花を携え、静かな強さで門を守るスカーレット・ドノバンのプロフィールサイトです。",
  hero: "剣は抜かず、花は折らない。",
  intro:
    "スカーレット・ドノバンは、レイヴンの戦友であり、ギルドの門を守る女性です。刃を見せびらかさず、花の柔らかさも手放さない。静かな眼差しの奥に、退かない覚悟があります。",
  messageTitle: "「大丈夫。慌てなくていい。」",
  message:
    "怖さを消すことはできなくても、怖さに支配されない場所は作れます。私が守るのは、答えを急がされない時間と、傷ついた花をもう一度立たせるための静かな場所です。",
};

const profile = [
  ["名前", "スカーレット・ドノバン"],
  ["立場", "レイヴンの戦友 / ギルドの門番"],
  ["印象", "強く、穏やかで、必要な時だけ鋭い"],
  ["象徴", "剣、深紅の花、手入れされた境界線"],
];

const roles = [
  {
    label: "Blade",
    title: "鞘に収めた剣",
    text: "力は誇示するものではなく、最後まで使わずに済ませるためのもの。彼女の剣は、境界を越えようとするものにだけ向けられます。",
  },
  {
    label: "Bloom",
    title: "深紅の花",
    text: "戦いを知っているからこそ、柔らかなものを軽んじません。花を育てる時間は、彼女が守りたい日常そのものです。",
  },
  {
    label: "Poise",
    title: "大人の余裕",
    text: "声を荒げず、場を乱さず、それでも譲れない線は譲らない。落ち着きは飾りではなく、守るための技術です。",
  },
];

const relationships = [
  ["レイヴン", "長年の戦友。彼が危うい場所に立つ時、スカーレットは黙って隣に立ちます。"],
  ["ルナ", "花畑を一緒に世話する相手。柔らかなものを守る時間を共有しています。"],
  ["ギルド", "彼女が見張る場所。訪れる人が怯えずに立ち止まれるよう、門の外に目を配っています。"],
];

export const metadata = {
  title: copy.title,
  description: copy.description,
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#211f1e] text-[#f8f1e8]">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#211f1e_0%,#303331_45%,#5e2430_100%)] px-5 pb-12 pt-8">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute left-[8%] top-28 h-72 w-px bg-gradient-to-b from-transparent via-[#d9c6b6] to-transparent" />
          <div className="absolute left-[8%] top-28 h-8 w-8 -translate-x-1/2 rotate-45 border-l border-t border-[#d9c6b6]/80" />
          <div className="absolute bottom-10 right-[10%] h-28 w-28 rounded-full border border-[#d8b7a7]/20" />
          <div className="absolute bottom-20 right-[15%] h-12 w-20 rotate-[-22deg] rounded-[50%] border border-[#a84251]/45" />
          <div className="absolute bottom-28 right-[9%] h-10 w-16 rotate-[28deg] rounded-[50%] border border-[#c35a67]/35" />
        </div>
        <header className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 pb-10">
          <a className="text-lg font-bold text-[#fff8ef]" href="/">Scarlet Donovan</a>
          <nav className="flex flex-wrap gap-2" aria-label="メインメニュー">
            <a className="rounded-lg border border-[#d8b7a7]/60 px-4 py-3 text-sm font-bold text-[#fff8ef]" href="/">トップ</a>
            <a className="rounded-lg border border-[#d8b7a7]/60 px-4 py-3 text-sm font-bold text-[#fff8ef]" href="#profile">プロフィール</a>
            <a className="rounded-lg border border-[#d8b7a7]/60 px-4 py-3 text-sm font-bold text-[#fff8ef]" href="#relationship">レイヴンとの関係</a>
            <a className="rounded-lg border border-[#d8b7a7]/60 px-4 py-3 text-sm font-bold text-[#fff8ef]" href="/divination-methods/">占術</a>
            <a className="rounded-lg border border-[#d8b7a7]/60 px-4 py-3 text-sm font-bold text-[#fff8ef]" href="/text-reading/">AIテキスト鑑定</a>
            <a className="rounded-lg bg-[#d8b7a7] px-4 py-3 text-sm font-bold text-[#262625]" href="https://raven.fortunestudios.jp/guild">ギルド紹介</a>
          </nav>
        </header>

        <div className="relative mx-auto grid min-h-[68vh] max-w-6xl items-center gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <p className="text-sm font-extrabold uppercase text-[#d8b7a7]">Scarlet Donovan / Sword and Flowers</p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight text-[#fff8ef] md:text-7xl">{copy.hero}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e7d8cc]">{copy.intro}</p>
          </div>
          <aside className="relative overflow-hidden rounded-lg border border-[#c9b3a3] bg-[#fff8f0] p-6 text-[#2f2928] shadow-xl">
            <div className="absolute right-6 top-5 h-36 w-10 rounded-full border-l border-[#7f3440]/30" />
            <div className="absolute right-9 top-8 h-24 w-px bg-[#7f3440]/40" />
            <p className="text-sm font-extrabold uppercase text-[#7f3440]">Vow</p>
            <h2 className="mt-3 max-w-[20rem] text-3xl font-semibold">{copy.messageTitle}</h2>
            <p className="mt-4 max-w-[28rem] leading-8 text-[#685b55]">{copy.message}</p>
          </aside>
        </div>
      </section>

      <section id="profile" className="bg-[#f3eee6] px-5 py-14 text-[#2f2928]">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <div>
            <p className="text-sm font-extrabold uppercase text-[#7f3440]">Profile</p>
            <h2 className="mt-2 text-4xl font-semibold">スカーレットについて</h2>
            <p className="mt-4 leading-8 text-[#685b55]">落ち着いた大人の女性としての余裕と、守護者としての厳しさをあわせ持つ人です。優しいだけではなく、甘いだけでもない。だからこそ、彼女のそばには安心があります。</p>
          </div>
          <div className="grid gap-3">
            {profile.map(([label, value]) => (
              <article className="rounded-lg border border-[#bfae9e] bg-[#fffaf3] p-4 shadow-sm" key={label}>
                <span className="text-sm font-extrabold text-[#7f3440]">{label}</span>
                <strong className="mt-2 block">{value}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <p className="text-sm font-extrabold uppercase text-[#d8b7a7]">Sword / Flowers / Poise</p>
        <h2 className="mt-2 text-4xl font-semibold">彼女を形づくるもの</h2>
        <p className="mt-4 max-w-3xl leading-8 text-[#e4d7cb]">スカーレットの魅力は、派手な戦いではなく、剣を抜かずに守り切る姿勢にあります。</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {roles.map((item) => (
            <article className="rounded-lg border border-[#d8b7a7]/25 bg-[#2a2d2a] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" key={item.title}>
              <span className="text-xs font-extrabold uppercase text-[#d8b7a7]">{item.label}</span>
              <h3 className="mt-3 text-2xl font-semibold">{item.title}</h3>
              <p className="mt-3 leading-8 text-[#e4d7cb]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="relationship" className="bg-[#f3eee6] px-5 py-14 text-[#2f2928]">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <div>
            <p className="text-sm font-extrabold uppercase text-[#7f3440]">Relationship</p>
            <h2 className="mt-2 text-4xl font-semibold">レイヴンGuildでのスカーレット</h2>
            <p className="mt-4 leading-8 text-[#685b55]">レイヴンの物語の中で、スカーレットはただの護衛ではありません。彼が背中を預けられる、数少ない戦友です。</p>
          </div>
          <div className="grid gap-3">
            {relationships.map(([title, text]) => (
              <article className="rounded-lg border border-[#bfae9e] bg-[#fffaf3] p-5 shadow-sm" key={title}>
                <h3 className="text-2xl font-semibold">{title}</h3>
                <p className="mt-3 leading-8 text-[#685b55]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-14 text-center">
        <p className="text-sm font-extrabold uppercase text-[#d8b7a7]">Guild</p>
        <h2 className="mt-2 text-4xl font-semibold">彼女のいるギルドへ</h2>
        <p className="mt-4 leading-8 text-[#e7d8cc]">スカーレットは、レイヴンGuildの仲間たちとともにいます。マヤ暦とインド占星術の読み方もあわせて見ると、彼女の立ち位置がよりはっきりします。</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a className="inline-flex rounded-lg bg-[#d8b7a7] px-5 py-3 font-bold text-[#262625]" href="/text-reading/">AIテキスト鑑定を見る</a>
          <a className="inline-flex rounded-lg bg-[#d8b7a7] px-5 py-3 font-bold text-[#262625]" href="/divination-methods/">スカーレットの占術を見る</a>
          <a className="inline-flex rounded-lg border border-[#d8b7a7]/60 px-5 py-3 font-bold text-[#fff8ef]" href="https://raven.fortunestudios.jp/guild">レイヴンGuildの紹介を見る</a>
        </div>
      </section>
    </main>
  );
}


