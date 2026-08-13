import type { Metadata } from "next";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-K0H8MMZKNF";
const CLOUDFLARE_WEB_ANALYTICS_TOKEN = "f5fdafbd4c4e45d3bf8d2c951c60de0f";
const TENANT_ID = "scarlet-donovan";
const ANALYTICS_EVENTS_ENDPOINT = "https://fortunestudios.jp/api/public/analytics/events";

export const metadata: Metadata = {
  title: "Scarlet Donovan | Fortune Studios",
  description: "剣と花を携え、静かな強さで門を守るスカーレット・ドノバンの公式サイトです。",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  const tenantId = "${TENANT_ID}";
  const endpoint = "${ANALYTICS_EVENTS_ENDPOINT}";
  const params = new URLSearchParams(window.location.search);
  const clean = function(value, max) {
    return String(value || "").replace(/\\s+/g, " ").trim().slice(0, max);
  };
  const send = function(eventName, extra) {
    const payload = Object.assign({
      tenantId,
      eventName,
      pagePath: window.location.pathname,
      pageTitle: document.title,
      referrer: document.referrer,
      source: params.get("utm_source") || "",
      medium: params.get("utm_medium") || "",
      campaign: params.get("utm_campaign") || ""
    }, extra || {});
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
      return;
    }
    fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(function(){});
  };
  const classify = function(anchor) {
    const href = anchor.getAttribute("href") || "";
    if (href.includes("/blog") || href.includes("/oracle")) return "scarlet_note_view";
    if (href.startsWith("mailto:") || href.startsWith("tel:") || href.includes("line.me") || href.includes("lin.ee")) return "scarlet_contact_start";
    if (anchor.dataset.analyticsEvent) return clean(anchor.dataset.analyticsEvent, 60);
    return anchor.closest("nav") ? "" : "scarlet_primary_action";
  };
  send("page_view");
  document.addEventListener("click", function(event) {
    const anchor = event.target instanceof Element ? event.target.closest("a") : null;
    if (!anchor) return;
    const eventName = classify(anchor);
    if (!eventName) return;
    send(eventName, {
      eventTarget: clean(anchor.href, 500),
      eventLabel: clean(anchor.textContent, 160)
    });
  }, { capture: true });
})();
`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
