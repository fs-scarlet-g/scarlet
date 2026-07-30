import Link from "next/link";
import { cookies, headers } from "next/headers";

type Summary = {
  id: number;
  period: string;
  visits: number;
  readings: number;
  chat_starts: number;
  note_views: number;
  next_action: string;
  memo: string;
  created_at: string;
};

const benchmarks = [
  ["主要行動率", "8%以上", "トップの説明とCTAが伝わっているかを見る"],
  ["問い合わせ開始率", "5%以上", "不安なく次の行動へ進めているかを見る"],
  ["メモ閲覧率", "12%以上", "公開情報が読まれているかを見る"],
];

const eventNames = [
  ["page_view", "ページ閲覧"],
  ["scarlet_primary_action", "主要CTAクリック"],
  ["scarlet_contact_start", "問い合わせ開始"],
  ["scarlet_note_view", "記事閲覧"],
];

function rate(value: number, total: number) {
  if (!total) return "0.0%";
  return `${((value / total) * 100).toFixed(1)}%`;
}

function score(summary: Summary) {
  if (!summary.visits) return "未評価";
  const actionRate = summary.readings / summary.visits;
  const contactRate = summary.chat_starts / summary.visits;
  if (actionRate >= 0.08 && contactRate >= 0.05) return "良好";
  if (actionRate >= 0.04 || contactRate >= 0.025) return "改善余地あり";
  return "要見直し";
}

function csvCell(value: string | number) {
  const text = String(value).replace(/"/g, '""');
  return `"${text}"`;
}

async function getSummaries() {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "scarlet.fortunestudios.jp";
  const proto = headerStore.get("x-forwarded-proto") ?? "https";
  const response = await fetch(`${proto}://${host}/api/admin/analytics`, {
    cache: "no-store",
    headers: { cookie: cookieStore.toString() },
  });

  if (!response.ok) return [] as Summary[];
  const data = (await response.json()) as { summaries?: Summary[] };
  return data.summaries ?? [];
}

export const metadata = {
  title: "アクセス分析 | Scarlet Guardian",
};

export default async function AnalyticsPage() {
  const summaries = await getSummaries();
  const latest = summaries[0];
  const previous = summaries[1];
  const visitDelta = latest && previous ? latest.visits - previous.visits : 0;
  const csv = [
    "period,visits,primary_actions,contact_starts,note_views,next_action",
    ...summaries.map((item) => [item.period, item.visits, item.readings, item.chat_starts, item.note_views, item.next_action].map(csvCell).join(",")),
  ].join("\n");

  return (
    <main className="min-h-screen bg-[#f5f0e8] px-5 py-8 text-[#20241f]">
      <div className="mx-auto max-w-6xl">
        <Link className="text-sm font-semibold text-[#8f263a]" href="/admin">
          管理ダッシュボードへ戻る
        </Link>
        <header className="mt-5 border-b border-[#d7cabc] pb-6">
          <p className="text-sm font-semibold uppercase text-[#7d4b56]">Analytics</p>
          <h1 className="mt-2 text-4xl font-semibold">アクセス分析</h1>
          <p className="mt-3 max-w-3xl leading-7 text-[#5e625c]">
            GA4、Cloudflare Web Analytics、Search Consoleの数値を週次で入力し、Scarletの導線改善メモとして残します。
            個人情報や相談文は保存せず、集計値と改善判断だけを扱います。
          </p>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-5" aria-label="最新サマリー">
          <Metric label="最新期間" value={latest?.period ?? "未入力"} />
          <Metric label="主要行動率" value={latest ? rate(latest.readings, latest.visits) : "0.0%"} />
          <Metric label="問い合わせ開始率" value={latest ? rate(latest.chat_starts, latest.visits) : "0.0%"} />
          <Metric label="評価" value={latest ? score(latest) : "未評価"} />
          <Metric label="前回比" value={latest && previous ? `${visitDelta >= 0 ? "+" : ""}${visitDelta.toLocaleString("ja-JP")} visits` : "未評価"} />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <form className="rounded-lg border border-[#d7cabc] bg-[#fffaf2] p-5" action="/api/admin/analytics" method="post">
            <h2 className="text-2xl font-semibold">週次入力</h2>
            <p className="mt-2 text-sm leading-7 text-[#5e625c]">まず数字だけ入れれば保存できます。メモ欄を空にすると、数値から振り返り文を自動作成します。</p>
            <label className="mt-4 grid gap-2 text-sm font-semibold text-[#7d4b56]">
              期間
              <input className="admin-field" name="period" required placeholder="例: 2026年7月 第5週" />
            </label>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <NumberField label="訪問数" name="visits" hint="GA4 users / Cloudflare visits" />
              <NumberField label="主要行動" name="readings" hint="CTAクリック、登録、詳細表示など" />
              <NumberField label="問い合わせ開始" name="chat_starts" hint="フォーム開始、連絡導線クリック" />
              <NumberField label="メモ閲覧" name="note_views" hint="記事、ブログ、詳細ページ閲覧" />
            </div>
            <label className="mt-4 grid gap-2 text-sm font-semibold text-[#7d4b56]">
              観察メモ
              <textarea className="admin-field min-h-40" name="memo" placeholder="例: トップから管理導線へのクリックはあるが、問い合わせ前で離脱が多い。" />
            </label>
            <button className="mt-4 rounded-lg bg-[#20241f] px-5 py-3 text-sm font-semibold text-white" type="submit">
              分析メモを保存
            </button>
          </form>

          <div className="grid gap-4">
            <section className="rounded-lg border border-[#d7cabc] bg-white p-5">
              <h2 className="text-2xl font-semibold">判断基準</h2>
              <div className="mt-4 grid gap-3">
                {benchmarks.map(([label, target, note]) => (
                  <article className="rounded-lg border border-[#d7cabc] bg-[#fffaf2] p-4" key={label}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-semibold">{label}</h3>
                      <span className="text-sm font-semibold text-[#8f263a]">目安 {target}</span>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-[#5e625c]">{note}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-[#d7cabc] bg-white p-5">
              <h2 className="text-2xl font-semibold">計測イベント</h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {eventNames.map(([event, label]) => (
                  <code className="rounded-lg border border-[#d7cabc] bg-[#fffaf2] px-3 py-2 text-sm" key={event}>
                    {event} / {label}
                  </code>
                ))}
              </div>
            </section>
          </div>
        </section>

        <section className="mt-8" aria-label="保存済み分析メモ">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase text-[#8f263a]">History</p>
              <h2 className="mt-1 text-2xl font-semibold">保存済み分析メモ</h2>
            </div>
            <a className="rounded-lg border border-[#d7cabc] px-3 py-2 text-sm font-semibold" href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`} download="scarlet-analytics.csv">CSV出力</a>
          </div>
          {summaries.length === 0 ? (
            <article className="mt-4 rounded-lg border border-[#d7cabc] bg-white p-5 text-[#5e625c]">まだ分析メモはありません。</article>
          ) : (
            <div className="mt-4 grid gap-3">
              {summaries.map((summary) => (
                <article className="rounded-lg border border-[#d7cabc] bg-white p-5" key={summary.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold uppercase text-[#8f263a]">{summary.period}</span>
                      <h3 className="mt-1 text-xl font-semibold">{score(summary)}</h3>
                    </div>
                    <time className="text-xs text-[#7f837b]">{summary.created_at}</time>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-4">
                    <Metric label="訪問" value={summary.visits.toLocaleString("ja-JP")} compact />
                    <Metric label="主要行動率" value={rate(summary.readings, summary.visits)} compact />
                    <Metric label="開始率" value={rate(summary.chat_starts, summary.visits)} compact />
                    <Metric label="閲覧率" value={rate(summary.note_views, summary.visits)} compact />
                  </div>
                  <p className="mt-4 font-semibold text-[#20241f]">次の一手: {summary.next_action}</p>
                  <p className="mt-3 whitespace-pre-wrap leading-7 text-[#5e625c]">{summary.memo}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function NumberField({ label, name, hint }: { label: string; name: string; hint: string }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#7d4b56]">
      {label}
      <input className="admin-field" inputMode="numeric" name={name} defaultValue="0" />
      <span className="text-xs font-normal leading-5 text-[#7f837b]">{hint}</span>
    </label>
  );
}

function Metric({ label, value, compact = false }: { label: string; value: string; compact?: boolean }) {
  return (
    <div className="rounded-lg border border-[#d7cabc] bg-white p-4">
      <p className="text-xs text-[#5e625c]">{label}</p>
      <p className={compact ? "mt-1 text-xl font-semibold" : "mt-2 text-2xl font-semibold"}>{value}</p>
    </div>
  );
}




