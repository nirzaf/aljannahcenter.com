import type { ExecutionContext } from "@cloudflare/workers-types";
import emdashWorker from "@emdash-cms/cloudflare/worker";

export default {
  ...emdashWorker,
  async fetch(
    request: Request,
    env: Record<string, unknown>,
    ctx: ExecutionContext,
  ) {
    const fetchHandler = emdashWorker.fetch;
    if (!fetchHandler) return new Response("EmDash worker is unavailable", { status: 503 });
    const response = await fetchHandler(
      request as unknown as Parameters<typeof fetchHandler>[0],
      env,
      ctx,
    );
    const headers = new Headers(response.headers);
    const pathname = new URL(request.url).pathname;

    if (
      pathname.startsWith("/_emdash/") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/api/") ||
      pathname.startsWith("/preview") ||
      pathname === "/rss.xml"
    ) {
      headers.set("Cache-Control", "private, no-store");
    }

    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
  scheduled: emdashWorker.scheduled,
};
