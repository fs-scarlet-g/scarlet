const trialPrice = "￥0";
const trialApplicationHref =
  "mailto:fs.scarlet.g@gmail.com?subject=スカーレット・ドノバン AIテキスト鑑定トライアル申込み&body=希望メニュー：%0D%0A相談したい内容：%0D%0A生年月日（マヤ暦希望の場合）：%0D%0A出生時間・出生地（インド占星術希望の場合）：";

const menus = [
  {
    title: "境界線リーディング",
    subtitle: "Boundary Reading",
    body: "相手の気持ちに飲まれそうな時、自分が守るべき線と、譲ってもよい部分を分けて整理します。恋愛、人間関係、家族、職場での距離感に向いているAIテキスト鑑定です。",
  },
  {
    title: "決断前チェック",
    subtitle: "Decision Check",
    body: "別れる、進む、待つ、伝える。大きな選択の前に、感情だけで急がず、現実面と心の反応を分けて見ます。今すぐ動くこと、少し整えてから動くことを言葉にします。",
  },
  {
    title: "守りのメッセージ",
    subtitle: "Protective Message",
    body: "不安が強い時に、気持ちを落ち着けるための短い鑑定文を返します。未来を断定するのではなく、今日の自分を守るための視点と一歩を整えます。",
  },
  {
    title: "マヤ暦テキスト鑑定",
    subtitle: "Mayan Calendar Reading",
    body: "生年月日からKIN、太陽の紋章、ウェイブスペル、音を見て、本来の資質、今の流れ、関係性の噛み合いを整理します。自分のリズムを取り戻したい相談に向いています。",
  },
  {
    title: "インド占星術テキスト鑑定",
    subtitle: "Vedic Astrology Reading",
    body: "出生図、月、ラグナ、惑星、ハウス、ダシャーをもとに、人生のテーマや時期の流れを読みます。仕事、転機、パートナーシップなど長い時間軸で見たい相談に向いています。",
  },
];

const flow = [
  ["1", "メニューを選ぶ", "境界線、決断前、守りのメッセージ、マヤ暦、インド占星術から、今の相談に近いものを選びます。迷う場合は相談内容を先に書いても構いません。"],
  ["2", "必要な情報を書く", "相談したいこと、今の状況、知りたい範囲を短く整理します。マヤ暦は生年月日、インド占星術は出生時間と出生地があると読みの精度が上がります。"],
  ["3", "鑑定文を受け取る", "不安を強める断定ではなく、状況の整理、注意点、次に選べる一歩を文章で返します。読み返して使える内容を重視します。"],
];

const consultationTopics = [
  "恋愛や人間関係で、距離の取り方を見直したい",
  "別れる、進む、待つ、伝える前に気持ちと現実を整理したい",
  "自分の資質、周期、転機の流れを知りたい",
  "仕事、暮らし、役割、パートナーシップを長い時間軸で見たい",
];

const boundaries = [
  "病気、妊娠、法律、投資など専門家の判断が必要な内容は扱いません",
  "相手を操作する方法、復讐、監視、強制につながる相談は受けません",
  "鑑定結果は未来の確定ではなく、判断材料として使うための文章です",
  "送られた個人情報は鑑定目的の範囲で扱い、不要な情報は求めません",
];

const methodChoice = [
  {
    title: "マヤ暦が向いている相談",
    body: "自分の資質、役割、関係性の噛み合い、日々の流れを見たい時に向いています。今の自分が無理な役割を背負っていないか、どのペースで動くと自然かを整理します。",
  },
  {
    title: "インド占星術が向いている相談",
    body: "人生全体のテーマ、仕事や結婚の長期的な流れ、転機の時期感を見たい時に向いています。出生図とダシャーから、今強まっている課題と伸ばしやすい領域を読みます。",
  },
];

const samples = [
  {
    title: "マヤ暦サンプル",
    label: "役割を背負いすぎている時",
    body: "あなたのKINは、場の空気を読み、必要な役割を自然に引き受けやすい響きを持っています。ただ、その力が強く出すぎると、本来は相手が持つべき責任まで自分の手元に集めてしまいます。今は、全部を整えるよりも、まず「自分が守る範囲」と「相手に返す範囲」を分ける時期です。関係を壊さないために我慢するのではなく、関係を長く続けるために線を引く。そこに今回のテーマがあります。",
  },
  {
    title: "インド占星術サンプル",
    label: "転機の焦りを感じている時",
    body: "出生図では、仕事や役割に関わる領域が強く反応しています。今の焦りは、ただの迷いというより、これまでの動き方を見直す時期に入っているサインとして読めます。ダシャーの流れを見ると、無理に結果を急ぐより、生活基盤、契約、働き方の条件を整えることが先です。大きく動く前に、削るもの、残すもの、次に育てるものを切り分けると、判断の精度が上がります。",
  },
];

export const metadata = {
  title: "AIテキスト鑑定 | スカーレット・ドノバン",
  description: "スカーレット・ドノバンのAIテキスト鑑定メニュー。全メニューをトライアル価格￥0で案内しています。",
};

export default function TextReadingPage() {
  return (
    <main className="text-reading-page min-h-screen overflow-x-hidden bg-[#211f1e] text-[#f8f1e8]">
      <section className="border-b border-[#d8b7a7]/20 bg-[linear-gradient(135deg,#211f1e_0%,#303331_48%,#5e2430_100%)] px-5 py-8">
        <header className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-4">
          <a className="text-lg font-bold text-[#fff8ef]" href="/">Scarlet Donovan</a>
          <nav className="flex w-full max-w-full flex-wrap gap-2 sm:w-auto" aria-label="メインメニュー">
            <a className="rounded-lg border border-[#d8b7a7]/60 px-4 py-3 text-sm font-bold text-[#fff8ef]" href="/">トップ</a>
            <a className="rounded-lg border border-[#d8b7a7]/60 px-4 py-3 text-sm font-bold text-[#fff8ef]" href="/divination-methods/">占術</a>
            <a className="rounded-lg bg-[#d8b7a7] px-4 py-3 text-sm font-bold text-[#262625]" href="/text-reading/">AIテキスト鑑定</a>
          </nav>
        </header>
        <div className="mx-auto max-w-6xl py-16">
          <p className="text-sm font-extrabold uppercase text-[#d8b7a7]">AI Text Reading</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-[#fff8ef] sm:text-5xl md:text-7xl"><span className="block">迷いを、</span><span className="block">静かに</span><span className="block">切り分ける。</span></h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-[#e7d8cc] sm:text-lg">
            スカーレット・ドノバンのAIテキスト鑑定は、強い言葉で急かすためのものではありません。相談内容を読み、感情、現実、境界線、次に選べる一歩を落ち着いて整理します。
          </p>
          <div className="mt-8 inline-flex max-w-full flex-wrap items-center gap-3 rounded-lg border border-[#d8b7a7]/50 bg-[#fff8f0] px-5 py-4 text-[#2f2928]">
            <span className="text-sm font-extrabold text-[#7f3440]">全メニュー トライアル価格</span>
            <strong className="text-4xl">{trialPrice}</strong>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="inline-flex rounded-lg bg-[#d8b7a7] px-5 py-3 font-bold text-[#262625] shadow-sm" href={trialApplicationHref} data-analytics-event="scarlet_trial_apply">
              ￥0トライアルを申し込む
            </a>
            <a className="inline-flex rounded-lg border border-[#d8b7a7]/60 px-5 py-3 font-bold text-[#fff8ef]" href="#menu">
              メニューを選ぶ
            </a>
          </div>
        </div>
      </section>

      <section id="menu" className="bg-[#f3eee6] px-5 py-14 text-[#2f2928]">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-extrabold uppercase text-[#7f3440]">Menu</p>
          <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">AIテキスト鑑定メニュー</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {menus.map((menu) => (
              <article className="rounded-lg border border-[#bfae9e] bg-[#fffaf3] p-5 shadow-sm" key={menu.title}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-extrabold uppercase text-[#7f3440]">{menu.subtitle}</p>
                    <h3 className="mt-2 text-2xl font-semibold">{menu.title}</h3>
                  </div>
                  <strong className="rounded-lg bg-[#7f3440] px-4 py-2 text-xl text-[#fff8ef]">{trialPrice}</strong>
                </div>
                <p className="mt-4 leading-8 text-[#685b55]">{menu.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fff8f0] px-5 py-14 text-[#2f2928]">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-extrabold uppercase text-[#7f3440]">Reading Flow</p>
          <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">鑑定の流れ</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {flow.map(([number, title, body]) => (
              <article className="rounded-lg border border-[#bfae9e] bg-white p-5 shadow-sm" key={title}>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#7f3440] text-lg font-bold text-[#fff8ef]">{number}</span>
                <h3 className="mt-4 text-2xl font-semibold">{title}</h3>
                <p className="mt-3 leading-8 text-[#685b55]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f3eee6] px-5 py-14 text-[#2f2928]">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-[#bfae9e] bg-[#fffaf3] p-6 shadow-sm">
            <p className="text-sm font-extrabold uppercase text-[#7f3440]">Topics</p>
            <h2 className="mt-2 text-3xl font-semibold">相談できる内容</h2>
            <ul className="mt-5 grid gap-3 leading-8 text-[#685b55]">
              {consultationTopics.map((topic) => <li key={topic}>{topic}</li>)}
            </ul>
          </div>
          <div className="rounded-lg border border-[#bfae9e] bg-[#fffaf3] p-6 shadow-sm">
            <p className="text-sm font-extrabold uppercase text-[#7f3440]">Boundaries</p>
            <h2 className="mt-2 text-3xl font-semibold">扱えない内容と注意事項</h2>
            <ul className="mt-5 grid gap-3 leading-8 text-[#685b55]">
              {boundaries.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[#211f1e] px-5 py-14 text-[#f8f1e8]">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-extrabold uppercase text-[#d8b7a7]">How To Choose</p>
          <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">占術の使い分け</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {methodChoice.map((item) => (
              <article className="rounded-lg border border-[#d8b7a7]/25 bg-[#2a2d2a] p-5" key={item.title}>
                <h3 className="text-2xl font-semibold">{item.title}</h3>
                <p className="mt-3 leading-8 text-[#e7d8cc]">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fff8f0] px-5 py-14 text-[#2f2928]">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-extrabold uppercase text-[#7f3440]">Reading Samples</p>
          <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">鑑定文サンプル</h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {samples.map((sample) => (
              <article className="rounded-lg border border-[#bfae9e] bg-white p-6 shadow-sm" key={sample.title}>
                <p className="text-sm font-extrabold uppercase text-[#7f3440]">{sample.title}</p>
                <h3 className="mt-2 text-2xl font-semibold">{sample.label}</h3>
                <p className="mt-4 leading-8 text-[#685b55]">{sample.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#211f1e] px-5 py-14 text-[#f8f1e8]">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_0.75fr]">
          <div>
            <p className="text-sm font-extrabold uppercase text-[#d8b7a7]">Trial Application</p>
            <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">0円トライアルの申し込み</h2>
            <p className="mt-4 leading-8 text-[#e7d8cc]">
              希望メニューと相談したい内容を送ってください。マヤ暦を希望する場合は生年月日、インド占星術を希望する場合は出生時間と出生地があると、読み取れる範囲が広がります。
            </p>
          </div>
          <aside className="rounded-lg border border-[#d8b7a7]/35 bg-[#2a2d2a] p-5">
            <h3 className="text-2xl font-semibold">送る内容</h3>
            <ul className="mt-4 grid gap-3 leading-7 text-[#e7d8cc]">
              <li>希望メニュー</li>
              <li>相談したい内容</li>
              <li>必要に応じて生年月日、出生時間、出生地</li>
            </ul>
            <a className="mt-6 inline-flex rounded-lg bg-[#d8b7a7] px-5 py-3 font-bold text-[#262625]" href={trialApplicationHref} data-analytics-event="scarlet_trial_apply">
              申込みメールを作成する
            </a>
          </aside>
        </div>
      </section>
    </main>
  );
}


