import type { MetadataRoute } from "next";

import { locales } from "@/i18n/config";
import { SITE_URL } from "@/lib/constants";
import { localizedHref } from "@/lib/i18n-links";
import {
  getAllCategoryAndProductSlugs,
  getAllNewsSlugs,
} from "@/lib/sanity/fetch";

const HREFLANG: Record<(typeof locales)[number], string> = { uk: "uk-UA", en: "en-US" };

/** One sitemap entry per Ukrainian (default-locale) path, with `alternates`
 *  listing every locale's URL for that same page — the sitemap equivalent
 *  of the hreflang tags in src/lib/seo.ts. */
function entry(
  ukPath: string,
  options: Pick<MetadataRoute.Sitemap[number], "changeFrequency" | "priority">,
): MetadataRoute.Sitemap[number] {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[HREFLANG[locale]] = `${SITE_URL}${localizedHref(locale, ukPath)}`;
  }
  return {
    url: `${SITE_URL}${ukPath}`,
    alternates: { languages },
    ...options,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ categories, products }, newsSlugs] = await Promise.all([
    getAllCategoryAndProductSlugs(),
    getAllNewsSlugs(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = [
    entry("/", { changeFrequency: "monthly", priority: 1 }),
    entry("/about", { changeFrequency: "yearly", priority: 0.6 }),
    entry("/products", { changeFrequency: "weekly", priority: 0.9 }),
    entry("/contacts", { changeFrequency: "yearly", priority: 0.5 }),
    entry("/news", { changeFrequency: "weekly", priority: 0.5 }),
  ];

  const categoryEntries: MetadataRoute.Sitemap = categories.map((slug) =>
    entry(`/products/${slug}`, { changeFrequency: "weekly", priority: 0.8 }),
  );

  const productEntries: MetadataRoute.Sitemap = products.map((slug) =>
    entry(`/products/${slug}`, { changeFrequency: "weekly", priority: 0.7 }),
  );

  const newsEntries: MetadataRoute.Sitemap = newsSlugs.map((slug) =>
    entry(`/news/${slug}`, { changeFrequency: "monthly", priority: 0.4 }),
  );

  return [...staticEntries, ...categoryEntries, ...productEntries, ...newsEntries];
}
