import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ArrowUpRight, Check, ExternalLink, Link2, Loader2, PenLine, Send, Trash2 } from "lucide-react";
import { needsResolving, parseSocialUrl } from "../../utils/social-embed";
import type { SocialEmbed } from "../../utils/social-embed";

type Item = {
  id: string;
  slug: string | null;
  status: string;
  data: Record<string, unknown>;
  publishedAt: string | null;
  createdAt: string;
};

type Notice = { tone: "success" | "error"; text: string; href?: string; hrefLabel?: string } | null;

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

/** Calls the EmDash content API with the signed-in staff session. */
async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch("/_emdash/api" + path, {
    ...init,
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", "X-EmDash-Request": "1", ...init.headers },
  });
  const body = (await response.json().catch(() => null)) as
    | { success?: boolean; data?: unknown; error?: { message?: string } }
    | null;
  if (!response.ok || !body?.success) {
    throw new ApiError(body?.error?.message ?? "Something went wrong. Please try again.", response.status);
  }
  return body.data as T;
}

const SOCIAL_FIELDS = [
  { slug: "url", label: "Post link", type: "url", required: true },
  { slug: "platform", label: "Platform", type: "string", required: true },
  { slug: "caption", label: "Caption", type: "text", required: false },
];

/** Creates the "Social posts" collection the first time the desk is used. */
async function ensureSocialCollection() {
  try {
    await api("/schema/collections/social");
    return;
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 404) throw error;
  }
  try {
    await api("/schema/collections", {
      method: "POST",
      body: JSON.stringify({
        slug: "social",
        label: "Social posts",
        labelSingular: "Social post",
        description: "Facebook, Instagram and TikTok posts shared on the website.",
        supports: ["drafts", "revisions"],
      }),
    });
    for (const [index, field] of SOCIAL_FIELDS.entries()) {
      await api("/schema/collections/social/fields", {
        method: "POST",
        body: JSON.stringify({ ...field, validation: null, sortOrder: index }),
      });
    }
  } catch (error) {
    if (error instanceof ApiError && error.status === 403) {
      throw new Error("Social sharing needs a one-time setup. Ask a site administrator to share the first post.");
    }
    throw error;
  }
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const key = () => Math.random().toString(36).slice(2, 12);

/** Plain paragraphs → the CMS's rich-text format. */
const toBlocks = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => ({
      _type: "block",
      _key: key(),
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: key(), text: paragraph, marks: [] }],
    }));

const formatDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

function NoticeBar({ notice }: { notice: Notice }) {
  if (!notice) return null;
  return (
    <p className={"desk-notice desk-notice-" + notice.tone} role={notice.tone === "error" ? "alert" : "status"}>
      {notice.tone === "success" && <Check size={17} aria-hidden="true" />}
      <span>{notice.text}</span>
      {notice.href && (
        <a href={notice.href} target="_blank" rel="noopener noreferrer">
          {notice.hrefLabel} <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      )}
    </p>
  );
}

function ShareSocial({ onChange, items }: { onChange: () => void; items: Item[] | null }) {
  const [link, setLink] = useState("");
  const [caption, setCaption] = useState("");
  const [embed, setEmbed] = useState<SocialEmbed | null>(null);
  const [checking, setChecking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  // Recognise the link as it is pasted, following share links to the real post.
  useEffect(() => {
    const value = link.trim();
    setEmbed(null);
    if (!value) return;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      let target = value;
      if (needsResolving(value)) {
        setChecking(true);
        try {
          const response = await fetch("/admin/resolve?url=" + encodeURIComponent(value), { credentials: "same-origin" });
          const body = (await response.json()) as { url?: string };
          if (body?.url) target = body.url;
        } catch {
          // Use the link as pasted.
        }
        if (!cancelled) setChecking(false);
      }
      if (!cancelled) setEmbed(parseSocialUrl(target));
    }, 350);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [link]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!embed) return;
    setBusy(true);
    setNotice(null);
    try {
      await ensureSocialCollection();
      const created = await api<{ item: Item }>("/content/social", {
        method: "POST",
        body: JSON.stringify({
          // The CMS needs a slug before it will publish an entry.
          slug: `${embed.platform}-${Date.now().toString(36)}`,
          data: { url: embed.url, platform: embed.platform, caption: caption.trim() },
        }),
      });
      try {
        await api(`/content/social/${created.item.id}/publish`, { method: "POST", body: "{}" });
      } catch (error) {
        // Don't leave an unpublished entry behind.
        await api(`/content/social/${created.item.id}`, { method: "DELETE" }).catch(() => {});
        throw error;
      }
      setLink("");
      setCaption("");
      setNotice({ tone: "success", text: `${embed.label} post is now on the website.`, href: "/updates#social", hrefLabel: "View it" });
      onChange();
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Could not share the post." });
    } finally {
      setBusy(false);
    }
  }

  async function remove(item: Item) {
    if (!window.confirm("Remove this post from the website?")) return;
    try {
      await api(`/content/social/${item.id}`, { method: "DELETE" });
      onChange();
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Could not remove the post." });
    }
  }

  const value = link.trim();
  const unrecognised = Boolean(value) && !checking && !embed;

  return (
    <section className="desk-card" aria-labelledby="desk-social-title">
      <header className="desk-card-head">
        <span className="desk-card-icon"><Link2 size={20} aria-hidden="true" /></span>
        <div>
          <h2 id="desk-social-title">Share a social post</h2>
          <p>Paste a Facebook, Instagram or TikTok link and it appears on the Stories page and homepage.</p>
        </div>
      </header>

      <form className="desk-form" onSubmit={submit}>
        <div className="field">
          <label htmlFor="desk-link">Post link</label>
          <input
            id="desk-link"
            type="url"
            inputMode="url"
            autoComplete="off"
            placeholder="https://www.instagram.com/p/…"
            value={link}
            onChange={(event) => setLink(event.target.value)}
            aria-describedby="desk-link-hint"
            aria-invalid={unrecognised}
            required
          />
          <p className="field-hint" id="desk-link-hint" aria-live="polite">
            {checking && "Checking the link…"}
            {embed && <span className="field-ok"><Check size={15} aria-hidden="true" /> {embed.label} post recognised</span>}
            {unrecognised && <span className="field-error">That doesn’t look like a public Facebook, Instagram or TikTok post link. Open the post, choose Share → Copy link, and paste it here.</span>}
            {!value && "In the app, open the post and choose Share → Copy link."}
          </p>
        </div>

        <div className="field">
          <label htmlFor="desk-caption">Caption <span>(optional)</span></label>
          <textarea
            id="desk-caption"
            rows={2}
            maxLength={280}
            placeholder="A line of context for visitors"
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
          />
        </div>

        {embed && (
          <div className="desk-preview">
            <p className="desk-preview-label">Preview</p>
            <div className={"social-frame social-frame-" + embed.shape}>
              <iframe src={embed.src} title={embed.label + " post preview"} loading="lazy" allow="encrypted-media; fullscreen; picture-in-picture" />
            </div>
          </div>
        )}

        <NoticeBar notice={notice} />

        <button className="button button-primary button-lg" type="submit" disabled={!embed || busy}>
          {busy ? <Loader2 size={18} className="desk-spin" aria-hidden="true" /> : <Send size={17} aria-hidden="true" />}
          {busy ? "Sharing…" : "Share on the website"}
        </button>
      </form>

      <div className="desk-list">
        <h3>Shared posts</h3>
        {items === null && <p className="desk-empty">Loading…</p>}
        {items?.length === 0 && <p className="desk-empty">Nothing shared yet. Your first post will show up here.</p>}
        {items && items.length > 0 && (
          <ul>
            {items.map((item) => {
              const url = String(item.data.url ?? "");
              const parsed = parseSocialUrl(url);
              return (
                <li key={item.id}>
                  <div>
                    <strong>{parsed?.label ?? "Post"}</strong>
                    <span>{String(item.data.caption || url.replace(/^https?:\/\/(www\.)?/, ""))}</span>
                  </div>
                  <small>{formatDate(item.publishedAt ?? item.createdAt)}</small>
                  <a className="desk-icon-button" href={url} target="_blank" rel="noopener noreferrer" aria-label="Open the original post">
                    <ExternalLink size={17} aria-hidden="true" />
                  </a>
                  <button className="desk-icon-button desk-icon-danger" type="button" onClick={() => remove(item)} aria-label="Remove from the website">
                    <Trash2 size={17} aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

function WriteArticle({ onChange, items }: { onChange: () => void; items: Item[] | null }) {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState<"publish" | "draft" | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

  async function save(mode: "publish" | "draft") {
    if (!title.trim() || !body.trim()) {
      setNotice({ tone: "error", text: "Add a title and some text before saving." });
      return;
    }
    setBusy(mode);
    setNotice(null);
    try {
      const slug = slugify(title) || undefined;
      const created = await api<{ item: Item }>("/content/posts", {
        method: "POST",
        body: JSON.stringify({
          slug,
          data: { title: title.trim(), excerpt: excerpt.trim(), content: toBlocks(body) },
        }),
      });
      const editHref = `/_emdash/admin/content/posts/${created.item.id}`;
      if (mode === "publish") {
        await api(`/content/posts/${created.item.id}/publish`, { method: "POST", body: "{}" });
        setNotice({ tone: "success", text: "Article published.", href: `/posts/${created.item.slug ?? created.item.id}`, hrefLabel: "View it" });
      } else {
        setNotice({ tone: "success", text: "Draft saved.", href: editHref, hrefLabel: "Open in the editor" });
      }
      setTitle("");
      setExcerpt("");
      setBody("");
      onChange();
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Could not save the article." });
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="desk-card" aria-labelledby="desk-article-title">
      <header className="desk-card-head">
        <span className="desk-card-icon"><PenLine size={20} aria-hidden="true" /></span>
        <div>
          <h2 id="desk-article-title">Write an article</h2>
          <p>Publish a quick update here. For photos and rich formatting, use the full editor.</p>
        </div>
      </header>

      <form
        className="desk-form"
        onSubmit={(event) => {
          event.preventDefault();
          save("publish");
        }}
      >
        <div className="field">
          <label htmlFor="desk-title">Title</label>
          <input id="desk-title" type="text" maxLength={140} value={title} onChange={(event) => setTitle(event.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="desk-excerpt">Summary <span>(optional)</span></label>
          <textarea id="desk-excerpt" rows={2} maxLength={240} placeholder="One or two sentences shown on story cards" value={excerpt} onChange={(event) => setExcerpt(event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="desk-body">Article</label>
          <textarea id="desk-body" rows={9} placeholder="Leave a blank line between paragraphs." value={body} onChange={(event) => setBody(event.target.value)} required />
        </div>

        <NoticeBar notice={notice} />

        <div className="desk-actions">
          <button className="button button-primary button-lg" type="submit" disabled={busy !== null}>
            {busy === "publish" ? <Loader2 size={18} className="desk-spin" aria-hidden="true" /> : <Send size={17} aria-hidden="true" />}
            {busy === "publish" ? "Publishing…" : "Publish now"}
          </button>
          <button className="button button-outline button-lg" type="button" disabled={busy !== null} onClick={() => save("draft")}>
            {busy === "draft" ? "Saving…" : "Save as draft"}
          </button>
        </div>
        <a className="text-link desk-editor-link" href="/_emdash/admin/content/posts/new">
          Open the full editor <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </form>

      <div className="desk-list">
        <h3>Recent articles</h3>
        {items === null && <p className="desk-empty">Loading…</p>}
        {items?.length === 0 && <p className="desk-empty">No articles yet.</p>}
        {items && items.length > 0 && (
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <div>
                  <strong>{String(item.data.title ?? "Untitled")}</strong>
                  <span className={"desk-status desk-status-" + item.status}>{item.status === "published" ? "Published" : "Draft"}</span>
                </div>
                <small>{formatDate(item.publishedAt ?? item.createdAt)}</small>
                <a className="desk-icon-button" href={`/_emdash/admin/content/posts/${item.id}`} aria-label={"Edit " + String(item.data.title ?? "article")}>
                  <PenLine size={17} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default function StaffDesk() {
  const [social, setSocial] = useState<Item[] | null>(null);
  const [articles, setArticles] = useState<Item[] | null>(null);

  const loadSocial = useCallback(() => {
    api<{ items: Item[] }>("/content/social?limit=12")
      .then((data) => setSocial(data.items))
      .catch(() => setSocial([])); // the collection does not exist until the first share
  }, []);
  const loadArticles = useCallback(() => {
    api<{ items: Item[] }>("/content/posts?limit=6")
      .then((data) => setArticles(data.items))
      .catch(() => setArticles([]));
  }, []);

  useEffect(() => {
    loadSocial();
    loadArticles();
  }, [loadSocial, loadArticles]);

  return (
    <div className="desk-grid">
      <ShareSocial items={social} onChange={loadSocial} />
      <WriteArticle items={articles} onChange={loadArticles} />
    </div>
  );
}
