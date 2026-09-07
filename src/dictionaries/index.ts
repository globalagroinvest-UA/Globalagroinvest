import "server-only";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "./types";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  uk: () => import("./uk").then((m) => m.default),
  en: () => import("./en").then((m) => m.default),
};

/** Per Next.js's own App Router i18n guide: a small per-request dictionary
 *  loader, dynamically imported so unused-locale strings never reach the
 *  client bundle. Call once per request (layout/page) and thread the
 *  resolved plain object down as a prop — components below don't need to
 *  know how it was loaded, which is what lets client components like
 *  Header (mobile menu state) consume it too. */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}

export type { Dictionary };
