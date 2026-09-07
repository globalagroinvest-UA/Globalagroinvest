import "server-only";

import { defaultLocale, type Locale } from "@/i18n/config";
import { translatePortableText, translateTexts } from "@/lib/translate";
import type {
  AboutPage,
  Advantage,
  BusinessDirection,
  Category,
  ContactsPage,
  HomePage,
  NewsPost,
  Product,
  Seo,
  SiteSettings,
  StatValue,
} from "@/types/content";

/**
 * Per-content-type machine translation for CMS content, applied by
 * src/lib/sanity/fetch.ts whenever `locale !== "uk"`. The manager only
 * ever writes Ukrainian in Sanity (or in the offline demo content) — this
 * module is the single place that turns that Ukrainian into English.
 *
 * Explicitly NEVER translated, everywhere below: slugs, hrefs/URLs, brand
 * names and the company's own legal name (proper nouns), and factual
 * contact details (phone, email, postal address, legal registration
 * info) — translating a phone number or a legal entity name would be
 * actively wrong, not just unnecessary.
 *
 * Each function collects every translatable string for one content
 * object into a single batch (one cached Azure call per object per
 * locale, not one per field) via a small cursor over the translated
 * array, so the reconstruction stays index-safe even as fields are added.
 */

function cursor(values: string[]) {
  let i = 0;
  return () => values[i++] ?? "";
}

async function translateSeo(
  seo: Seo | undefined,
  locale: Locale,
  tags: string[],
): Promise<Seo | undefined> {
  if (!seo) return seo;
  const [metaTitle, metaDescription] = await translateTexts(
    [seo.metaTitle ?? "", seo.metaDescription ?? ""],
    locale,
    tags,
  );
  return {
    ...seo,
    metaTitle: seo.metaTitle ? metaTitle : seo.metaTitle,
    metaDescription: seo.metaDescription ? metaDescription : seo.metaDescription,
  };
}

async function translateAdvantages(
  advantages: Advantage[],
  locale: Locale,
  tags: string[],
): Promise<Advantage[]> {
  if (advantages.length === 0) return advantages;
  const texts = advantages.flatMap((a) => [a.title, a.description]);
  const translated = await translateTexts(texts, locale, tags);
  const next = cursor(translated);
  return advantages.map((a) => ({ ...a, title: next(), description: next() }));
}

async function translateStats(
  stats: StatValue[],
  locale: Locale,
  tags: string[],
): Promise<StatValue[]> {
  if (stats.length === 0) return stats;
  const translated = await translateTexts(
    stats.map((s) => s.label),
    locale,
    tags,
  );
  return stats.map((s, i) => ({ ...s, label: translated[i] ?? s.label }));
}

async function translateBusinessDirections(
  directions: BusinessDirection[],
  locale: Locale,
  tags: string[],
): Promise<BusinessDirection[]> {
  if (directions.length === 0) return directions;
  const texts = directions.flatMap((d) => [
    d.title,
    d.description,
    d.image.alt,
    d.cta?.label ?? "",
  ]);
  const translated = await translateTexts(texts, locale, tags);
  const next = cursor(translated);
  return directions.map((d) => {
    const title = next();
    const description = next();
    const alt = next();
    const ctaLabel = next();
    return {
      ...d,
      title,
      description,
      image: { ...d.image, alt },
      cta: d.cta ? { ...d.cta, label: ctaLabel } : d.cta,
    };
  });
}

export async function localizeSiteSettings(
  data: SiteSettings,
  locale: Locale,
): Promise<SiteSettings> {
  if (locale === defaultLocale) return data;
  const tags = ["siteSettings"];
  const [footerDescription, workingHours, logoAlt] = await translateTexts(
    [data.footerDescription, data.workingHours, data.logo.alt],
    locale,
    tags,
  );
  const seo = await translateSeo(data.seo, locale, tags);
  return {
    ...data,
    footerDescription,
    workingHours,
    logo: { ...data.logo, alt: logoAlt },
    seo,
    // companyName, phone, email, address, legalInfo: intentionally verbatim.
  };
}

export async function localizeHomePage(data: HomePage, locale: Locale): Promise<HomePage> {
  if (locale === defaultLocale) return data;
  const tags = ["homePage", "businessDirection", "advantage", "brand"];

  const [
    heroTitle,
    heroSubtitle,
    heroImageAlt,
    heroCtaPrimaryLabel,
    heroCtaSecondaryLabel,
    introTitle,
    introText,
    introImageAlt,
    advantagesTitle,
    brandsSectionTitle,
    finalCtaTitle,
    finalCtaText,
    finalCtaButtonLabel,
  ] = await translateTexts(
    [
      data.heroTitle,
      data.heroSubtitle,
      data.heroImage.alt,
      data.heroCtaPrimary?.label ?? "",
      data.heroCtaSecondary?.label ?? "",
      data.introTitle,
      data.introText,
      data.introImage.alt,
      data.advantagesTitle,
      data.brandsSectionTitle,
      data.finalCtaTitle,
      data.finalCtaText,
      data.finalCtaButton.label,
    ],
    locale,
    tags,
  );

  const [businessDirections, advantages, stats, seo] = await Promise.all([
    translateBusinessDirections(data.businessDirections, locale, tags),
    translateAdvantages(data.advantages, locale, tags),
    translateStats(data.stats, locale, tags),
    translateSeo(data.seo, locale, tags),
  ]);

  return {
    ...data,
    heroTitle,
    heroSubtitle,
    heroImage: { ...data.heroImage, alt: heroImageAlt },
    heroCtaPrimary: data.heroCtaPrimary
      ? { ...data.heroCtaPrimary, label: heroCtaPrimaryLabel }
      : data.heroCtaPrimary,
    heroCtaSecondary: data.heroCtaSecondary
      ? { ...data.heroCtaSecondary, label: heroCtaSecondaryLabel }
      : data.heroCtaSecondary,
    introTitle,
    introText,
    introImage: { ...data.introImage, alt: introImageAlt },
    businessDirections,
    advantagesTitle,
    advantages,
    stats,
    brandsSectionTitle,
    // brands: names are the brands' own proper nouns — never translated.
    finalCtaTitle,
    finalCtaText,
    finalCtaButton: { ...data.finalCtaButton, label: finalCtaButtonLabel },
    seo,
  };
}

export async function localizeAboutPage(data: AboutPage, locale: Locale): Promise<AboutPage> {
  if (locale === defaultLocale) return data;
  const tags = ["aboutPage", "advantage"];

  const [title, intro, mainImageAlt, advantagesTitle] = await translateTexts(
    [data.title, data.intro, data.mainImage.alt, data.advantagesTitle ?? ""],
    locale,
    tags,
  );
  const [body, advantages, stats, seo] = await Promise.all([
    translatePortableText(data.body, locale, tags),
    translateAdvantages(data.advantages, locale, tags),
    translateStats(data.stats, locale, tags),
    translateSeo(data.seo, locale, tags),
  ]);

  return {
    ...data,
    title,
    intro,
    body,
    mainImage: { ...data.mainImage, alt: mainImageAlt },
    advantagesTitle: data.advantagesTitle ? advantagesTitle : data.advantagesTitle,
    advantages,
    stats,
    seo,
  };
}

export async function localizeContactsPage(
  data: ContactsPage,
  locale: Locale,
): Promise<ContactsPage> {
  if (locale === defaultLocale) return data;
  const tags = ["contactsPage"];
  const [title, intro] = await translateTexts([data.title, data.intro], locale, tags);
  const seo = await translateSeo(data.seo, locale, tags);
  return { ...data, title, intro, seo };
}

export async function localizeCategory(data: Category, locale: Locale): Promise<Category> {
  if (locale === defaultLocale) return data;
  const tags = ["category"];
  const [title, description, imageAlt] = await translateTexts(
    [data.title, data.description, data.image.alt],
    locale,
    tags,
  );
  const seo = await translateSeo(data.seo, locale, tags);
  return { ...data, title, description, image: { ...data.image, alt: imageAlt }, seo };
  // slug: intentionally verbatim — it's part of the URL.
}

export async function localizeCategories(
  data: Category[],
  locale: Locale,
): Promise<Category[]> {
  if (locale === defaultLocale || data.length === 0) return data;
  return Promise.all(data.map((category) => localizeCategory(category, locale)));
}

export async function localizeProduct(data: Product, locale: Locale): Promise<Product> {
  if (locale === defaultLocale) return data;
  const tags = ["product"];

  const [title, shortDescription, categoryTitle] = await translateTexts(
    [data.title, data.shortDescription, data.category.title],
    locale,
    tags,
  );

  const characteristicTexts = data.characteristics.flatMap((c) => [c.label, c.value]);
  const imageAlts = data.images.map((img) => img.alt);

  const [translatedCharacteristics, translatedImageAlts] = await Promise.all([
    translateTexts(characteristicTexts, locale, tags),
    translateTexts(imageAlts, locale, tags),
  ]);
  const nextChar = cursor(translatedCharacteristics);

  const [description, seo] = await Promise.all([
    translatePortableText(data.description, locale, tags),
    translateSeo(data.seo, locale, tags),
  ]);

  return {
    ...data,
    title,
    shortDescription,
    category: { ...data.category, title: categoryTitle }, // slug verbatim
    // brand.name: proper noun — never translated.
    characteristics: data.characteristics.map(() => ({
      label: nextChar(),
      value: nextChar(),
    })),
    images: data.images.map((img, i) => ({ ...img, alt: translatedImageAlts[i] ?? img.alt })),
    description,
    seo,
  };
}

export async function localizeProducts(data: Product[], locale: Locale): Promise<Product[]> {
  if (locale === defaultLocale || data.length === 0) return data;
  return Promise.all(data.map((product) => localizeProduct(product, locale)));
}

export async function localizeNewsPost(data: NewsPost, locale: Locale): Promise<NewsPost> {
  if (locale === defaultLocale) return data;
  const tags = ["newsPost"];
  const [title, excerpt, coverImageAlt] = await translateTexts(
    [data.title, data.excerpt, data.coverImage.alt],
    locale,
    tags,
  );
  const [body, seo] = await Promise.all([
    translatePortableText(data.body, locale, tags),
    translateSeo(data.seo, locale, tags),
  ]);
  return {
    ...data,
    title,
    excerpt,
    coverImage: { ...data.coverImage, alt: coverImageAlt },
    body,
    seo,
  };
}

export async function localizeNewsList(data: NewsPost[], locale: Locale): Promise<NewsPost[]> {
  if (locale === defaultLocale || data.length === 0) return data;
  return Promise.all(data.map((post) => localizeNewsPost(post, locale)));
}
