import "server-only";

import { isSanityConfigured } from "@/sanity/env";
import * as demo from "@/lib/demo-content";
import type { Locale } from "@/i18n/config";
import type {
  AboutPage,
  Category,
  ContactsPage,
  HomePage,
  NewsPost,
  Product,
  SiteSettings,
} from "@/types/content";

import { getSanityClient } from "./client";
import {
  localizeAboutPage,
  localizeCategories,
  localizeCategory,
  localizeContactsPage,
  localizeHomePage,
  localizeNewsList,
  localizeNewsPost,
  localizeProduct,
  localizeProducts,
  localizeSiteSettings,
} from "./localize";
import {
  aboutPageQuery,
  allCategoryAndProductSlugsQuery,
  allNewsSlugsQuery,
  categoriesQuery,
  categoryBySlugQuery,
  contactsPageQuery,
  homePageQuery,
  newsBySlugQuery,
  newsListQuery,
  productBySlugQuery,
  productsByCategoryQuery,
  siteSettingsQuery,
} from "./queries";

type CacheOptions = { tags: string[]; revalidate?: number | false };

/** One hour: content edited through a CMS by a human doesn't need faster
 *  polling — the /api/revalidate webhook (triggered by Sanity on publish)
 *  covers the "I just clicked publish" case instantly via tag invalidation. */
const DEFAULT_REVALIDATE = 3600;

/**
 * Low-level query runner. Returns `null` on missing config, a genuine "not
 * found" GROQ result, or a runtime error (network/auth) — callers decide
 * what null means for them (see the two fallback helpers below).
 */
async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown>,
  { tags, revalidate = DEFAULT_REVALIDATE }: CacheOptions,
): Promise<T | null> {
  if (!isSanityConfigured) return null;

  try {
    const client = getSanityClient();
    const result = await client.fetch<T>(query, params, {
      next: { revalidate, tags },
    });
    return result ?? null;
  } catch (error) {
    console.error(
      `[sanity] query failed (${tags.join(",")}), falling back to demo content:`,
      error,
    );
    return null;
  }
}

/** For content that must never be empty (singletons, listing pages): any
 *  falsy Sanity result — unconfigured, empty dataset, or a query error —
 *  falls back to the bundled demo content. */
async function withDemoFallback<T>(
  query: string,
  params: Record<string, unknown>,
  options: CacheOptions,
  fallback: T,
): Promise<T> {
  const result = await sanityFetch<T>(query, params, options);
  if (result === null || (Array.isArray(result) && result.length === 0)) {
    return fallback;
  }
  return result;
}

/** For a single item looked up by slug: only fall back to demo content when
 *  Sanity itself isn't configured. Once a real project is connected, a
 *  missing slug is a genuine 404, not a reason to show unrelated demo data. */
async function slugLookup<T>(
  query: string,
  params: Record<string, unknown>,
  options: CacheOptions,
  demoLookup: () => T | undefined,
): Promise<T | null> {
  if (!isSanityConfigured) {
    return demoLookup() ?? null;
  }
  return sanityFetch<T>(query, params, options);
}

// ---------------------------------------------------------------------
// Singletons
//
// Every getter below always fetches/holds the Ukrainian source content
// (Sanity is authored in Ukrainian only) and applies machine translation
// as a separate, independently cached step when `locale !== "uk"` — see
// src/lib/sanity/localize.ts. This keeps the Sanity-vs-demo-content
// fallback logic above completely unaware of locales.
// ---------------------------------------------------------------------

export async function getSiteSettings(locale: Locale): Promise<SiteSettings> {
  const data = await withDemoFallback(
    siteSettingsQuery,
    {},
    { tags: ["siteSettings"] },
    demo.siteSettings,
  );
  return localizeSiteSettings(data, locale);
}

export async function getHomePage(locale: Locale): Promise<HomePage> {
  const data = await withDemoFallback(
    homePageQuery,
    {},
    { tags: ["homePage", "businessDirection", "advantage", "brand"] },
    demo.homePage,
  );
  return localizeHomePage(data, locale);
}

export async function getAboutPage(locale: Locale): Promise<AboutPage> {
  const data = await withDemoFallback(
    aboutPageQuery,
    {},
    { tags: ["aboutPage", "advantage"] },
    demo.aboutPage,
  );
  return localizeAboutPage(data, locale);
}

export async function getContactsPage(locale: Locale): Promise<ContactsPage> {
  const data = await withDemoFallback(
    contactsPageQuery,
    {},
    { tags: ["contactsPage"] },
    demo.contactsPage,
  );
  return localizeContactsPage(data, locale);
}

// ---------------------------------------------------------------------
// Catalog
// ---------------------------------------------------------------------

export async function getCategories(locale: Locale): Promise<Category[]> {
  const data = await withDemoFallback(
    categoriesQuery,
    {},
    { tags: ["category"] },
    demo.categories,
  );
  return localizeCategories(data, locale);
}

export async function getCategoryBySlug(slug: string, locale: Locale): Promise<Category | null> {
  const data = await slugLookup(
    categoryBySlugQuery,
    { slug },
    { tags: ["category"] },
    () => demo.categories.find((c) => c.slug === slug),
  );
  return data ? localizeCategory(data, locale) : null;
}

/**
 * Unlike the singleton/listing getters above, an empty result here is a
 * legitimate state (a real category with no products yet) — so we only
 * substitute demo data when Sanity isn't configured at all, never merely
 * because the result was empty. Demo categories use their own slug as
 * `_id` (see demo-content.ts) so this filter works the same way whichever
 * source `category._id` came from.
 */
export async function getProductsByCategory(
  categoryId: string,
  locale: Locale,
): Promise<Product[]> {
  const data = !isSanityConfigured
    ? demo.products.filter((p) => p.category.slug === categoryId)
    : ((await sanityFetch<Product[]>(
        productsByCategoryQuery,
        { categoryId },
        { tags: ["product"] },
      )) ?? []);
  return localizeProducts(data, locale);
}

export async function getProductBySlug(slug: string, locale: Locale): Promise<Product | null> {
  const data = await slugLookup(
    productBySlugQuery,
    { slug },
    { tags: ["product"] },
    () => demo.products.find((p) => p.slug === slug),
  );
  return data ? localizeProduct(data, locale) : null;
}

/** Language-agnostic — used only for generateStaticParams, so it returns
 *  the (locale-independent) slugs directly with no translation step. */
export async function getAllCategoryAndProductSlugs(): Promise<{
  categories: string[];
  products: string[];
}> {
  if (!isSanityConfigured) {
    return {
      categories: demo.categories.map((c) => c.slug),
      products: demo.products.map((p) => p.slug),
    };
  }
  const result = await sanityFetch<{ categories: string[]; products: string[] }>(
    allCategoryAndProductSlugsQuery,
    {},
    { tags: ["category", "product"] },
  );
  return result ?? { categories: [], products: [] };
}

// ---------------------------------------------------------------------
// News
// ---------------------------------------------------------------------

export async function getNewsList(locale: Locale): Promise<NewsPost[]> {
  const data = await withDemoFallback(newsListQuery, {}, { tags: ["newsPost"] }, demo.newsList);
  return localizeNewsList(data, locale);
}

export async function getNewsBySlug(slug: string, locale: Locale): Promise<NewsPost | null> {
  const data = await slugLookup(
    newsBySlugQuery,
    { slug },
    { tags: ["newsPost"] },
    () => demo.newsList.find((n) => n.slug === slug),
  );
  return data ? localizeNewsPost(data, locale) : null;
}

/** Language-agnostic — see getAllCategoryAndProductSlugs above. */
export async function getAllNewsSlugs(): Promise<string[]> {
  if (!isSanityConfigured) {
    return demo.newsList.map((n) => n.slug);
  }
  const result = await sanityFetch<string[]>(allNewsSlugsQuery, {}, { tags: ["newsPost"] });
  return result ?? [];
}
