"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Reading = {
  score: number;
  title: string;
  summary: string;
  actions: string[];
  flags: string[];
};

function analyze(text: string): Reading {
  const source = text.trim();
  if (!source) {
    return {
      score: 0,
      title: "入力待ち",
      summary: "公開文、告知文、返信文などを貼り付けると、Scarlet用の簡易チェックを表示します。",
      actions: ["まず文章を貼り付ける", "公開対象か下書きかを決める", "最後に読み手の次の行動を一つだけ書く"],
      flags: ["未入力"],
    };
  }

  const lengthScore = Math.min(35, Math.round(source.length / 14));
  const hasAction = /(確認|保存|公開|問い合わせ|見る|読む|進む|連絡|登録|click|check|contact|read)/i.test(source);
  const hasAudience = /(お客様|利用者|読者|管理者|Scarlet|Fortune Studios|あなた)/i.test(source);
  const hasRisk = /(秘密|個人情報|パスワード|認証|支払い|契約|トラブル|エラー)/i.test(source);
  const score = Math.min(100, 25 + lengthScore + (hasAction ? 20 : 0) + (hasAudience ? 15 : 0) + (hasRisk ? 10 : 0));

  return {
    score,
    title: score >= 80 ? "公開前チェック良好" : score >= 55 ? "あと少し整える文章" : "目的と導線を補う文章",
    summary: hasAction
      ? "読み手の次の行動が見えています。公開前に、対象者と保存してよい情報だけが含まれているか確認してください。"
      : "文章の説明はありますが、読んだ後に何をしてほしいかが弱い状態です。最後に一つだけ行動を足すと運用しやすくなります。",
    actions: [
      hasAudience ? "対象者の表現は残す" : "誰に向けた文章かを一文で足す",
      hasAction ? "次の行動を目立つ位置へ置く" : "最後に確認、問い合わせ、記事閲覧などの行動を一つ足す",
      hasRisk ? "個人情報や認証情報が含まれていないか再確認する" : "公開してよい情報だけで構成されているか確認する",
    ],
    flags: [hasAudience ? "対象あり" : "対象不明", hasAction ? "導線あり" : "導線不足", hasRisk ? "注意情報あり" : "低リスク"],
  };
}

export default function ScarletOraclePage() {
  const [text, setText] = useState("");
  const reading = useMemo(() => analyze(text), [text]);

  return (
    <main className="min-h-screen bg-[#f5f0e8] px-5 py-8 text-[#20241f]">
      <div className="mx-auto max-w-6xl">
        <Link className="text-sm font-semibold text-[#8f263a]" href="/">Scarlet Guardian</Link>
        <header className="mt-5 border-b border-[#d7cabc] pb-6">
          <p className="text-sm font-semibold uppercase text-[#7d4b56]">Scarlet Check</p>
          <h1 className="mt-2 text-4xl font-semibold">公開文チェック</h1>
          <p className="mt-3 max-w-3xl leading-7 text-[#5e625c]">
            ブログ記事、告知、SNSキャプション、返信文を公開前に確認するための簡易チェックです。
            文章の目的、読み手、次の行動、注意情報を整理します。
          </p>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <label className="grid gap-3 rounded-lg border border-[#d7cabc] bg-white p-5 text-sm font-semibold text-[#7d4b56]">
            チェックする文章
            <textarea
              className="admin-field min-h-[520px] text-base leading-8"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="公開前の記事本文、告知文、SNSキャプションなどを貼り付けてください。"
            />
            <span className="text-xs font-normal text-[#7f837b]">{text.trim().length.toLocaleString("ja-JP")}文字</span>
          </label>

          <aside className="rounded-lg border border-[#d7cabc] bg-[#fffaf2] p-5">
            <p className="text-sm font-semibold uppercase text-[#8f263a]">Score</p>
            <div className="mt-3 flex items-end gap-3">
              <strong className="text-6xl font-semibold">{reading.score}</strong>
              <span className="pb-2 text-sm text-[#5e625c]">/ 100</span>
            </div>
            <h2 className="mt-5 text-2xl font-semibold">{reading.title}</h2>
            <p className="mt-3 leading-7 text-[#5e625c]">{reading.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {reading.flags.map((flag) => (
                <span className="rounded-lg border border-[#d7cabc] bg-white px-3 py-1 text-sm font-semibold text-[#8f263a]" key={flag}>{flag}</span>
              ))}
            </div>
            <section className="mt-6">
              <h3 className="text-lg font-semibold">次の確認</h3>
              <ol className="mt-3 grid gap-3">
                {reading.actions.map((action, index) => (
                  <li className="flex gap-3 rounded-lg border border-[#d7cabc] bg-white p-3" key={action}>
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#8f263a] text-xs font-semibold text-white">{index + 1}</span>
                    <span className="leading-7 text-[#5e625c]">{action}</span>
                  </li>
                ))}
              </ol>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
