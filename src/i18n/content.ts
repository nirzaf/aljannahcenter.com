import { getEmDashCollection, getEmDashEntry } from "emdash";
import { defaultLang } from "./index";
import type { Lang } from "./index";

type CollectionOptions = { orderBy?: Record<string, "asc" | "desc">; limit?: number };

/**
 * Entries in the visitor's language. When a collection has nothing translated
 * yet, the English entries are returned instead (`translated` is then false).
 */
export async function getLocalizedCollection(collection: string, options: CollectionOptions, lang: Lang) {
  const query = (locale: Lang) =>
    getEmDashCollection(collection as any, { ...options, locale } as any) as Promise<{ entries: any[]; cacheHint?: any }>;
  const result = await query(lang);
  if (lang === defaultLang || result.entries.length > 0) return { ...result, translated: true };
  return { ...(await query(defaultLang)), translated: false };
}

/** One entry in the visitor's language, falling back to the English version. */
export async function getLocalizedEntry(collection: string, slug: string, lang: Lang) {
  const query = (locale: Lang) =>
    getEmDashEntry(collection as any, slug, { locale }) as Promise<{ entry: any; cacheHint?: any }>;
  const result = await query(lang);
  if (lang === defaultLang || result.entry) return { ...result, translated: true };
  return { ...(await query(defaultLang)), translated: false };
}
