const SCARLET_ORIGIN = "https://scarlet-oracle.fortune-kanri.workers.dev";

export default {
  async fetch(request: Request): Promise<Response> {
    const incomingUrl = new URL(request.url);
    const targetUrl = new URL(incomingUrl.pathname + incomingUrl.search, SCARLET_ORIGIN);

    const headers = new Headers(request.headers);
    headers.set("x-forwarded-host", incomingUrl.host);
    headers.set("x-forwarded-proto", incomingUrl.protocol.replace(":", ""));

    return fetch(targetUrl, {
      method: request.method,
      headers,
      body: request.body,
      redirect: "manual",
    });
  },
};
