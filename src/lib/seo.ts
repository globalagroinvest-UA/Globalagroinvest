import { locales, type Locale } from "@/i18n/config";
import { localizedHref } from "@/lib/i18n-links";

/**
 * Serializes a JSON-LD object for a `<script type="application/ld+json">`
 * tag. Escapes "<" so CMS-authored text containing something like
 * `</script>` can never break out of the tag — the standard mitigation for
 * embedding JSON inside HTML (see OWASP's JSON-in-HTML guidance).
 */
export function jsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

const HREFLANG: Record<Locale, string> = { uk: "uk-UA", en: "en-US" };

/**
 * Builds `alternates.canonical` + `alternates.languages` for a page,
 * given its Ukrainian (unprefixed) path — e.g. "/products/pmm". Every
 * locale variant of a page always points back at the others via hreflang,
 * per Google's guidance for internationalized sites, with "x-default"
 * pointing at the Ukrainian original (the site's actual default/fallback).
 */
export function localeAlternates(locale: Locale, ukPath: string) {
  const languages: Record<string, string> = { "x-default": ukPath };
  for (const l of locales) {
    languages[HREFLANG[l]] = localizedHref(l, ukPath);
  }
  return {
    canonical: localizedHref(locale, ukPath),
    languages,
  };
}
