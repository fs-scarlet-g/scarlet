import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scarlet Guardian | Fortune Studios",
  description: "Scarlet Guardianの公式サイトです。鑑定案内、お知らせ、読み物を掲載しています。",
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

