import { ar } from "./ar";
import { en } from "./en";
import type { Dictionary, TranslationKey } from "./en";
import { si } from "./si";
import { ta } from "./ta";

// `glyph` is a letter from the language's own script, used as its icon in the switcher.
export const languages = {
  en: { label: "English", glyph: "A", dir: "ltr", dateLocale: "en-GB" },
  ta: { label: "தமிழ்", glyph: "அ", dir: "ltr", dateLocale: "ta-LK" },
  si: { label: "සිංහල", glyph: "අ", dir: "ltr", dateLocale: "si-LK" },
  ar: { label: "العربية", glyph: "ع", dir: "rtl", dateLocale: "ar" },
} as const;

export type Lang = keyof typeof languages;
export const defaultLang: Lang = "en";
export const translatedLangs: Lang[] = ["ta", "si", "ar"];

const dictionaries: Record<Lang, Dictionary> = { en, ta, si, ar };

export const isLang = (value: unknown): value is Lang => typeof value === "string" && value in languages;

/** The language of the current request, taken from the URL prefix (/ta/…, /si/…). */
export function getLang(astro: { currentLocale?: string; url: URL }): Lang {
  if (isLang(astro.currentLocale)) return astro.currentLocale;
  const first = astro.url.pathname.split("/")[1];
  return isLang(first) ? first : defaultLang;
}

export type Translate = (key: TranslationKey, values?: Record<string, string | number>) => string;

/** Returns a translator that falls back to English for any missing text. */
export function useTranslations(lang: Lang): Translate {
  return (key, values) => {
    let text: string = dictionaries[lang][key] ?? en[key];
    if (values) {
      for (const [name, value] of Object.entries(values)) text = text.replaceAll(`{${name}}`, String(value));
    }
    return text;
  };
}

/** Prefixes an internal path with the language, e.g. ("ta", "/updates") → "/ta/updates". */
export function localePath(lang: Lang, path: string): string {
  if (lang === defaultLang || !path.startsWith("/") || path.startsWith("/_emdash") || path.startsWith("/admin")) return path;
  return path === "/" ? `/${lang}/` : `/${lang}${path}`;
}

/** Removes the language prefix from a pathname: "/ta/updates" → "/updates". */
export function stripLang(pathname: string): string {
  const parts = pathname.split("/");
  if (isLang(parts[1]) && parts[1] !== defaultLang) {
    const rest = "/" + parts.slice(2).join("/");
    return rest === "//" ? "/" : rest;
  }
  return pathname;
}

export const formatDate = (date: Date, lang: Lang, month: "short" | "long" = "short") =>
  date.toLocaleDateString(languages[lang].dateLocale, { year: "numeric", month, day: "numeric" });
