import { defaultLocale, type Locale } from "@/i18n/config";

const BCP47: Record<Locale, string> = { uk: "uk-UA", en: "en-US" };

/** Locale-aware long date formatter for news publish dates. */
export function formatDate(iso: string, locale: Locale = defaultLocale): string {
  return new Intl.DateTimeFormat(BCP47[locale], { dateStyle: "long" }).format(new Date(iso));
}
