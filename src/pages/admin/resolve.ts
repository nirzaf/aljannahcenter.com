import type { APIRoute } from "astro";
import { needsResolving } from "../../utils/social-embed";

export const prerender = false;

// Hosts a share link is allowed to redirect through. Nothing else is fetched.
const ALLOWED = /(^|\.)(tiktok\.com|facebook\.com|fb\.watch|instagram\.com)$/;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "private, no-store" },
  });

/** Follows a social share link (e.g. vm.tiktok.com/…) to the post it points at. Staff only. */
export const GET: APIRoute = async ({ url, locals }) => {
  if (!locals.user) return json({ error: "Sign in to continue." }, 401);

  const input = url.searchParams.get("url") ?? "";
  if (!needsResolving(input)) return json({ url: input });

  let current = input;
  try {
    for (let hop = 0; hop < 5; hop++) {
      const target = new URL(current);
      if (target.protocol !== "https:" || !ALLOWED.test(target.hostname.toLowerCase())) break;
      const response = await fetch(target, {
        method: "GET",
        redirect: "manual",
        headers: { "User-Agent": "Mozilla/5.0 (compatible; AlJannahCentre/1.0)" },
      });
      const location = response.headers.get("location");
      if (response.status < 300 || response.status >= 400 || !location) break;
      const next = new URL(location, target);
      if (next.protocol !== "https:" || !ALLOWED.test(next.hostname.toLowerCase())) break;
      // Drop tracking parameters so the stored link is the post itself.
      if (/tiktok\.com$/.test(next.hostname)) next.search = "";
      current = next.toString();
    }
  } catch {
    // Fall through with the furthest link reached.
  }
  return json({ url: current });
};
