import type { APIRoute } from "astro";
import { getEmDashCollection, getSiteSettings } from "emdash";

export const GET: APIRoute = async ({ site, url }) => {
  const siteUrl = site?.toString() || url.origin + "/";
  let title = "Al-Jannah Centre";
  let tagline = "A place where every child can shine.";
  let posts: any[] = [];

  try {
    const settings = await getSiteSettings();
    title = settings.title || title;
    tagline = settings.tagline || tagline;
    const result = await getEmDashCollection("posts", {
      orderBy: { published_at: "desc" },
      limit: 20,
    });
    posts = result.entries;
  } catch {
    // An empty feed is valid while the CMS database is being initialized.
  }

  const items = posts
    .filter((post) => post.data.publishedAt)
    .map((post) => {
      const postUrl = siteUrl.replace(/\/$/, "") + "/posts/" + post.id;
      return [
        "    <item>",
        "      <title>" + escapeXml(post.data.title || "Untitled") + "</title>",
        "      <link>" + postUrl + "</link>",
        '      <guid isPermaLink="true">' + postUrl + "</guid>",
        "      <pubDate>" + post.data.publishedAt.toUTCString() + "</pubDate>",
        "      <description>" + escapeXml(post.data.excerpt || "") + "</description>",
        "    </item>",
      ].join("\n");
    })
    .join("\n");
  const root = siteUrl.replace(/\/$/, "");
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    "    <title>" + escapeXml(title) + "</title>",
    "    <description>" + escapeXml(tagline) + "</description>",
    "    <link>" + root + "</link>",
    '    <atom:link href="' + root + '/rss.xml" rel="self" type="application/rss+xml"/>',
    "    <language>en-us</language>",
    "    <lastBuildDate>" + new Date().toUTCString() + "</lastBuildDate>",
    items,
    "  </channel>",
    "</rss>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
