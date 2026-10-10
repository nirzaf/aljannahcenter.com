// Turns a public Facebook, Instagram or TikTok link into an embeddable frame.
// Shared by the staff desk (live preview) and the public social feed.

export type SocialPlatform = "facebook" | "instagram" | "tiktok";

export type SocialEmbed = {
  platform: SocialPlatform;
  /** Display name, e.g. "Instagram". */
  label: string;
  /** Clean link to the original post. */
  url: string;
  /** iframe source for the embedded post. */
  src: string;
  /** Shape of the frame, used to reserve space before it loads. */
  shape: "post" | "tall" | "portrait" | "video";
};

/** Share links that only redirect to the real post and must be resolved first. */
export const SHORT_LINK_HOSTS = ["vm.tiktok.com", "vt.tiktok.com", "fb.watch"];

const hostOf = (url: URL) => url.hostname.toLowerCase().replace(/^(www|m|web|mobile)\./, "");

export function needsResolving(input: string): boolean {
  try {
    const url = new URL(input.trim());
    const host = hostOf(url);
    return (
      SHORT_LINK_HOSTS.includes(host) ||
      (host === "tiktok.com" && url.pathname.startsWith("/t/")) ||
      (host === "facebook.com" && url.pathname.startsWith("/share/")) ||
      (host === "instagram.com" && url.pathname.startsWith("/share/"))
    );
  } catch {
    return false;
  }
}

export function parseSocialUrl(input: string): SocialEmbed | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const host = hostOf(url);
  const path = url.pathname;

  if (host === "instagram.com") {
    const match = path.match(/\/(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/);
    if (!match) return null;
    const kind = match[1] === "p" ? "p" : "reel";
    const clean = `https://www.instagram.com/${kind}/${match[2]}/`;
    return {
      platform: "instagram",
      label: "Instagram",
      url: clean,
      src: clean + "embed/",
      // Instagram frames carry a profile header and footer around the picture.
      shape: kind === "p" ? "tall" : "portrait",
    };
  }

  if (host === "tiktok.com") {
    const match = path.match(/\/@([\w.-]+)\/(video|photo)\/(\d+)/);
    if (!match) return null;
    return {
      platform: "tiktok",
      label: "TikTok",
      url: `https://www.tiktok.com/@${match[1]}/${match[2]}/${match[3]}`,
      src:
        match[2] === "video"
          ? `https://www.tiktok.com/player/v1/${match[3]}?rel=0&description=0`
          : `https://www.tiktok.com/embed/v2/${match[3]}`,
      shape: "portrait",
    };
  }

  if (host === "facebook.com" || host === "fb.watch") {
    if (host === "facebook.com" && (path === "/" || path.split("/").filter(Boolean).length < 2) && !url.search) {
      return null; // a profile or the homepage, not a post
    }
    const clean = url.toString();
    const isReel = /\/(reel|share\/r)\//.test(path);
    const isVideo = isReel || host === "fb.watch" || /\/(videos|watch|share\/v)(\/|$)/.test(path);
    const href = encodeURIComponent(clean);
    return {
      platform: "facebook",
      label: "Facebook",
      url: clean,
      src: isVideo
        ? `https://www.facebook.com/plugins/video.php?href=${href}&show_text=false&width=500`
        : `https://www.facebook.com/plugins/post.php?href=${href}&show_text=true&width=500`,
      shape: isReel ? "portrait" : isVideo ? "video" : "tall",
    };
  }

  return null;
}
