import { DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES, handleImageOptimization } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  ADMIN_SESSION_SECRET?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

type AdminSession = {
  email: string;
  exp: number;
};

const ADMIN_EMAIL = "fs.scarlet.g@gmail.com";
const ADMIN_SESSION_COOKIE = "scarlet_admin_session";

function json(body: unknown, init: ResponseInit = {}) {
  return Response.json(body, {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      ...init.headers,
    },
  });
}

function redirect(location: string, status = 303) {
  return new Response(null, {
    status,
    headers: { location },
  });
}

function formValue(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function formNumber(form: FormData, key: string) {
  return Number(formValue(form, key).replace(/,/g, "")) || 0;
}

function rate(value: number, total: number) {
  if (!total) return "0.0%";
  return `${((value / total) * 100).toFixed(1)}%`;
}

function nextAnalyticsAction(visits: number, readings: number, chatStarts: number) {
  if (!visits) return "GA4またはCloudflareの数値を入力してください。";
  if (readings / visits < 0.08) return "トップページの主要導線と説明文を見直してください。";
  if (chatStarts / visits < 0.05) return "管理画面や問い合わせ導線までの流れを短くしてください。";
  return "閲覧から行動までの流れを検証し、次の改善メモに残してください。";
}

async function requireAdmin(request: Request, env: Env) {
  const cookie = request.headers.get("cookie") ?? "";
  const value = cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${ADMIN_SESSION_COOKIE}=`))
    ?.slice(ADMIN_SESSION_COOKIE.length + 1);

  if (!value || !env.ADMIN_SESSION_SECRET) return false;

  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;

  const expected = await hmac(payload, env.ADMIN_SESSION_SECRET);
  if (!timingSafeEqual(signature, expected)) return false;

  try {
    const session = JSON.parse(base64UrlDecode(payload)) as AdminSession;
    return session.email.toLowerCase() === ADMIN_EMAIL && session.exp >= Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

async function hmac(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return base64UrlEncodeBytes(new Uint8Array(signature));
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

function base64UrlEncodeBytes(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    process.env.ADMIN_SESSION_SECRET = env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_SESSION_SECRET;
    process.env.GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID ?? process.env.GOOGLE_CLIENT_ID;
    process.env.GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET ?? process.env.GOOGLE_CLIENT_SECRET;

    if (url.pathname === "/health") {
      return Response.json({
        service: "scarlet-guardian",
        status: "ok",
        db: env.DB ? "ok" : "missing",
        runtime: "vinext",
      });
    }

    if (url.pathname === "/api/scarlet/status") {
      return Response.json(
        {
          service: "scarlet-guardian",
          status: "ok",
          site: "scarlet.fortunestudios.jp",
          worker: "scarlet-guardian",
          database: "scarlet-guardian",
          parentDomainManagedBy: "fortune.kanri@gmail.com",
        },
        { headers: { "Cache-Control": "no-store" } },
      );
    }


    if (url.pathname === "/api/public/posts") {
      const rows = await env.DB.prepare(
        "SELECT id, slug, title, description, body, pub_date, category, tags, featured, created_at FROM posts WHERE status = 'published' ORDER BY featured DESC, id DESC LIMIT 6",
      ).all();
      return json({ posts: rows.results });
    }    if (url.pathname === "/api/admin/analytics") {
      if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, { status: 401 });

      if (request.method === "GET") {
        const rows = await env.DB.prepare(
          "SELECT id, period, visits, readings, chat_starts, note_views, next_action, memo, created_at FROM analytics_summaries ORDER BY id DESC LIMIT 20",
        ).all();
        return json({ summaries: rows.results });
      }

      if (request.method === "POST") {
        const form = await request.formData();
        const period = formValue(form, "period");
        const visits = formNumber(form, "visits");
        const readings = formNumber(form, "readings");
        const chatStarts = formNumber(form, "chat_starts");
        const noteViews = formNumber(form, "note_views");
        const nextAction = nextAnalyticsAction(visits, readings, chatStarts);
        const memo =
          formValue(form, "memo") ||
          `${period}の振り返りです。訪問数は${visits.toLocaleString("ja-JP")}、実行率は${rate(readings, visits)}、チャット開始率は${rate(chatStarts, visits)}、メモ閲覧率は${rate(noteViews, visits)}でした。\n\n次の一手: ${nextAction}`;
        if (!period) return json({ error: "period is required." }, { status: 400 });

        await env.DB.prepare(
          "INSERT INTO analytics_summaries (period, visits, readings, chat_starts, note_views, next_action, memo) VALUES (?, ?, ?, ?, ?, ?, ?)",
        )
          .bind(period, visits, readings, chatStarts, noteViews, nextAction, memo)
          .run();
        return redirect("/admin/analytics");
      }
    }

    if (url.pathname === "/api/admin/posts") {
      if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, { status: 401 });

      if (request.method === "GET") {
        const rows = await env.DB.prepare(
          "SELECT id, slug, title, description, body, pub_date, category, tags, featured, status, created_at, updated_at FROM posts ORDER BY id DESC LIMIT 20",
        ).all();
        return json({ posts: rows.results });
      }

      if (request.method === "POST") {
        const form = await request.formData();
        const title = formValue(form, "title");
        const body = formValue(form, "body");
        const status = formValue(form, "status") || "draft";
        if (!title || !body) return json({ error: "title and body are required." }, { status: 400 });

        await env.DB.prepare(
          "INSERT INTO posts (slug, title, description, body, pub_date, category, tags, featured, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        )
          .bind(
            formValue(form, "slug"),
            title,
            formValue(form, "description"),
            body,
            formValue(form, "pub_date"),
            formValue(form, "category"),
            formValue(form, "tags"),
            form.get("featured") ? 1 : 0,
            status,
          )
          .run();
        return redirect("/admin/blog");
      }
    }

    if (url.pathname === "/api/admin/sns-drafts") {
      if (!(await requireAdmin(request, env))) return json({ error: "Unauthorized" }, { status: 401 });

      if (request.method === "GET") {
        const rows = await env.DB.prepare(
          "SELECT id, platform, topic, goal, tone, body, caption, slides_json, status, created_at, updated_at FROM sns_drafts ORDER BY id DESC LIMIT 20",
        ).all();
        return json({ drafts: rows.results });
      }

      if (request.method === "POST") {
        const form = await request.formData();
        const platform = formValue(form, "platform") || "x";
        const body = formValue(form, "body");
        const caption = formValue(form, "caption");
        const status = formValue(form, "status") || "draft";
        if (!body && !caption) return json({ error: "body or caption is required." }, { status: 400 });

        await env.DB.prepare(
          "INSERT INTO sns_drafts (platform, topic, goal, tone, body, caption, slides_json, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        )
          .bind(
            platform,
            formValue(form, "topic"),
            formValue(form, "goal"),
            formValue(form, "tone"),
            body,
            caption,
            formValue(form, "slides_json"),
            status,
          )
          .run();
        return redirect("/admin/sns");
      }
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(
        request,
        {
          fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
          transformImage: async (body, { width, format, quality }) => {
            const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
            return result.response();
          },
        },
        allowedWidths,
      );
    }

    const response = await handler.fetch(request, env, ctx);
    const forwardedHost = request.headers.get("x-forwarded-host");
    const location = response.headers.get("location");

    if (forwardedHost && location?.startsWith("https://scarlet-guardian.fs-scarlet-g.workers.dev")) {
      const headers = new Headers(response.headers);
      headers.set("location", location.replace("https://scarlet-guardian.fs-scarlet-g.workers.dev", `https://${forwardedHost}`));
      return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
    }

    return response;
  },
};

export default worker;

