export interface Env {
  DB: D1Database;
}

function html(body: string, init: ResponseInit = {}) {
  return new Response(body, {
    ...init,
    headers: {
      "content-type": "text/html; charset=utf-8",
      ...init.headers,
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      const dbReady = env.DB ? "ok" : "missing";
      return Response.json({
        service: "scarlet-guardian",
        status: "ok",
        db: dbReady,
      });
    }

    return html(`<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Scarlet Donovan</title>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: #f7f2ea;
        background: #20171a;
      }
      main {
        width: min(720px, calc(100% - 32px));
      }
      h1 {
        margin: 0 0 12px;
        font-size: clamp(2rem, 7vw, 4.5rem);
        line-height: 1;
      }
      p {
        margin: 0;
        color: #d9c9c1;
        font-size: 1rem;
        line-height: 1.7;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Scarlet Donovan</h1>
      <p>Scarlet 縺ｮ Cloudflare Worker 縺瑚ｵｷ蜍輔＠縺ｦ縺・∪縺吶・/p>
    </main>
  </body>
</html>`);
  },
};

