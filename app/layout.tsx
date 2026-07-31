import type { Metadata } from "next";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-K0H8MMZKNF";
const CLOUDFLARE_WEB_ANALYTICS_TOKEN = "f5fdafbd4c4e45d3bf8d2c951c60de0f";

export const metadata: Metadata = {
  title: "Scarlet Guardian | Fortune Studios",
  description:
    "\u843d\u3061\u7740\u3044\u305f\u5f37\u3055\u3067\u82b1\u7551\u3068\u9580\u3092\u5b88\u308b\u3001\u30b9\u30ab\u30fc\u30ec\u30c3\u30c8\u30fb\u30ac\u30fc\u30c7\u30a3\u30a2\u30f3\u306e\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb\u30b5\u30a4\u30c8\u3067\u3059\u3002",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag("js", new Date());
gtag("config", "${GA_MEASUREMENT_ID}");
`,
          }}
        />
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={`{"token":"${CLOUDFLARE_WEB_ANALYTICS_TOKEN}"}`}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
