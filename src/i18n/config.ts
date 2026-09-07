/**
 * Central locale configuration — the single source of truth for which
 * languages the site supports. Everything else (proxy.ts, dictionaries,
 * generateStaticParams, the language switcher, translation caching) reads
 * from here rather than hardcoding the locale list twice.
 *
 * `uk` is the "invisible" default: the manager only ever writes Ukrainian
 * in Sanity, and Ukrainian pages are served with no `/uk` prefix
 * (`/products`, not `/uk/products`) to avoid breaking any links or SEO
 * already pointing at the unprefixed URLs. English is served under `/en`
 * and is always a machine translation of the Ukrainian source — see
 * src/lib/translate.ts.
 */
export const locales = ["uk", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "uk";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Locale metadata for <html lang>, hreflang tags, and the switcher UI. */
export const localeNames: Record<Locale, string> = {
  uk: "Українська",
  en: "English",
};

export const localeHtmlLang: Record<Locale, string> = {
  uk: "uk",
  en: "en",
};
