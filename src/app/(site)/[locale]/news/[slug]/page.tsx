import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { SmartImage } from "@/components/ui/SmartImage";
import { getDictionary } from "@/dictionaries";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { formatDate } from "@/lib/format-date";
import { localizedHref } from "@/lib/i18n-links";
import { getAllNewsSlugs, getNewsBySlug } from "@/lib/sanity/fetch";
import { sanityImageUrl } from "@/lib/sanity/image";
import { localeAlternates } from "@/lib/seo";

type PageParams = { locale: string; slug: string };

export async function generateStaticParams(): Promise<{ locale: string; slug: string }[]> {
  const slugs = await getAllNewsSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  const post = await getNewsBySlug(slug, locale);
  if (!post) {
    const dict = await getDictionary(locale);
    return { title: dict.notFound.metaTitle };
  }

  const seo = post.seo;
  const ogImageUrl =
    seo?.ogImage && !seo.ogImage.placeholder
      ? sanityImageUrl(seo.ogImage.url, { w: 1200, h: 630 })
      : !post.coverImage.placeholder
        ? sanityImageUrl(post.coverImage.url, { w: 1200, h: 630 })
        : undefined;

  return {
    title: seo?.metaTitle || post.title,
    description: seo?.metaDescription || post.excerpt,
    openGraph: {
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : undefined,
    },
    alternates: localeAlternates(locale, `/news/${slug}`),
  };
}

export default async function NewsSlugPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  const [post, dict] = await Promise.all([getNewsBySlug(slug, locale), getDictionary(locale)]);
  if (!post) notFound();

  return (
    <Section>
      <Breadcrumbs
        ariaLabel={dict.breadcrumbs.ariaLabel}
        items={[
          { label: dict.breadcrumbs.home, href: localizedHref(locale, "/") },
          { label: dict.breadcrumbs.news, href: localizedHref(locale, "/news") },
          { label: post.title },
        ]}
      />

      <article className="mx-auto mt-8 max-w-3xl">
        <time dateTime={post.publishedAt} className="text-caption text-neutral-500">
          {formatDate(post.publishedAt, locale)}
        </time>
        <h1 className="mt-2 text-h1 font-semibold text-balance">{post.title}</h1>

        <div className="relative mt-8 aspect-video overflow-hidden rounded-md">
          <SmartImage image={post.coverImage} priority sizes="(min-width: 1024px) 768px, 100vw" />
        </div>

        <div className="mt-10">
          <RichText value={post.body} />
        </div>
      </article>
    </Section>
  );
}
