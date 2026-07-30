"use client";

import { useMemo, useState } from "react";

type Slide = { heading: string; body: string };

const ideas = [
  "Scarlet Guardianでできること",
  "公開前に確認する3つのこと",
  "ブログ記事を残す理由",
];

function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  let line = "";
  for (const char of text) {
    const next = line + char;
    if (ctx.measureText(next).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = char;
      y += lineHeight;
    } else {
      line = next;
    }
  }
  if (line) ctx.fillText(line, x, y);
}

export function SnsTools() {
  const [topic, setTopic] = useState(ideas[0]);
  const [goal, setGoal] = useState("公開サイトへの案内");
  const [tone, setTone] = useState("静かで正確");
  const [slides, setSlides] = useState<Slide[]>([]);
  const [message, setMessage] = useState("生成するとスライド案とキャプションを確認できます。");

  const caption = useMemo(() => {
    if (!slides.length) return "";
    return `${topic}\n\n${tone}なトーンで、Scarlet Guardianの更新内容を短く整理します。\n目的: ${goal}\n\n#ScarletGuardian #FortuneStudios #ブログ管理`;
  }, [goal, slides.length, tone, topic]);

  function generate() {
    setSlides([
      { heading: topic, body: "まず伝える内容を一つに絞ります。" },
      { heading: "運用状態を確認", body: "公開URL、管理画面、D1保存、ログイン保護を確認します。" },
      { heading: "次の一手を残す", body: "作業後に、次に見るべき指標やメモを一つ残します。" },
      { heading: "Scarlet Guardian", body: "公開情報とブログ記事を静かに整えるための場所です。" },
    ]);
    setMessage("スライド案を生成しました。下のJSONを保存フォームへ貼れます。");
  }

  async function copyCaption() {
    await navigator.clipboard.writeText(caption);
    setMessage("キャプションをコピーしました。");
  }

  async function copySlides() {
    await navigator.clipboard.writeText(JSON.stringify(slides, null, 2));
    setMessage("スライドJSONをコピーしました。");
  }

  function downloadPng(index: number) {
    const slide = slides[index];
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#f5f0e8";
    ctx.fillRect(0, 0, 1080, 1920);
    ctx.fillStyle = "#8f263a";
    ctx.fillRect(0, 0, 1080, 18);
    ctx.fillStyle = "#20241f";
    ctx.font = "700 48px sans-serif";
    ctx.fillText("Scarlet Guardian", 90, 150);
    ctx.font = "700 78px sans-serif";
    wrap(ctx, slide.heading, 90, 430, 900, 96);
    ctx.font = "500 48px sans-serif";
    wrap(ctx, slide.body, 90, 780, 900, 72);
    ctx.fillStyle = "#8f263a";
    ctx.font = "600 36px sans-serif";
    ctx.fillText(`${index + 1}/${slides.length}`, 90, 1760);
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `scarlet-slide-${String(index + 1).padStart(2, "0")}.png`;
    link.click();
  }

  return (
    <section className="rounded-lg border border-[#d7cabc] bg-[#fffaf2] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">スライド生成</h2>
        <button className="rounded-lg bg-[#20241f] px-4 py-2 text-sm font-semibold text-white" type="button" onClick={generate}>生成</button>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="grid gap-2 text-sm font-semibold text-[#7d4b56]">テーマ<textarea className="admin-field min-h-24" value={topic} onChange={(event) => setTopic(event.target.value)} /></label>
        <label className="grid gap-2 text-sm font-semibold text-[#7d4b56]">目的<select className="admin-field" value={goal} onChange={(event) => setGoal(event.target.value)}><option>公開サイトへの案内</option><option>更新告知</option><option>問い合わせ導線</option></select></label>
        <label className="grid gap-2 text-sm font-semibold text-[#7d4b56]">トーン<select className="admin-field" value={tone} onChange={(event) => setTone(event.target.value)}><option>静かで正確</option><option>短く実用的</option><option>やさしく落ち着いた</option></select></label>
      </div>
      {slides.length ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {slides.map((slide, index) => (
            <article className="rounded-lg border border-[#d7cabc] bg-white p-4" key={`${slide.heading}-${index}`}>
              <div className="aspect-[9/16] rounded-lg border border-[#d7cabc] bg-[#f6f2ea] p-5">
                <p className="text-xs font-semibold uppercase text-[#8f263a]">Scarlet Guardian</p>
                <h3 className="mt-8 text-2xl font-semibold">{slide.heading}</h3>
                <p className="mt-5 leading-7 text-[#5e625c]">{slide.body}</p>
              </div>
              <button className="mt-3 rounded-lg border border-[#d7cabc] px-3 py-2 text-sm font-semibold" type="button" onClick={() => downloadPng(index)}>PNG</button>
            </article>
          ))}
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="rounded-lg border border-[#d7cabc] px-3 py-2 text-sm font-semibold" type="button" onClick={copySlides}>スライドJSONコピー</button>
        <button className="rounded-lg border border-[#d7cabc] px-3 py-2 text-sm font-semibold" type="button" onClick={copyCaption}>キャプションコピー</button>
      </div>
      <textarea className="admin-field mt-4 min-h-32" readOnly value={caption} placeholder="キャプションがここに入ります。" />
      <p className="mt-3 text-sm text-[#5e625c]">{message}</p>
    </section>
  );
}

