import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scarlet Guardian | ブログ・SNS・分析管理",
  description: "Scarletのブログ、SNS投稿案、アクセス分析、公開文チェックを扱う運用サイトです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

