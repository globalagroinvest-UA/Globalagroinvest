import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdvantagesSection } from "@/components/sections/AdvantagesSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { SmartImage } from "@/components/ui/SmartImage";
import { getDictionary } from "@/dictionaries";
import { isLocale, type Locale } from "@/i18n/config";
import { localizedHref } from "@/lib/i18n-links";
import { getAboutPage } from "@/lib/sanity/fetch";
import { sanityImageUrl } from "@/lib/sanity/image";
import { localeAlternates } from "@/lib/seo";

type Params = { locale: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  const aboutPage = await getAboutPage(locale);
  const seo = aboutPage.seo;
  const ogImageUrl =
    seo?.ogImage && !seo.ogImage.placeholder
      ? sanityImageUrl(seo.ogImage.url, { w: 1200, h: 630 })
      : undefined;

  return {
    title: seo?.metaTitle || aboutPage.title,
    description: seo?.metaDescription || aboutPage.intro,
    openGraph: {
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : undefined,
    },
    alternates: localeAlternates(locale, "/about"),
  };
}

export default async function AboutPageRoute({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  const [aboutPage, dict] = await Promise.all([getAboutPage(locale), getDictionary(locale)]);

  return (
    <>
      <Section className="pb-0 sm:pb-0 lg:pb-0">
        <Breadcrumbs
          ariaLabel={dict.breadcrumbs.ariaLabel}
          items={[
            { label: dict.breadcrumbs.home, href: localizedHref(locale, "/") },
            { label: dict.breadcrumbs.about },
          ]}
        />
        <h1 className="mt-6 text-h1 font-semibold text-balance">{aboutPage.title}</h1>
        <p className="mt-4 max-w-2xl text-body-lg text-neutral-600 text-pretty">
          {aboutPage.intro}
        </p>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-md lg:order-2">
            <SmartImage
              image={aboutPage.mainImage}
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
          <div className="lg:order-1">
            <RichText value={aboutPage.body} />
          </div>
        </div>
      </Section>

      {aboutPage.advantages.length > 0 && (
        <AdvantagesSection
          title={aboutPage.advantagesTitle || dict.aboutPage.advantagesTitleFallback}
          advantages={aboutPage.advantages}
        />
      )}

      <StatsSection stats={aboutPage.stats} />
    </>
  );
}
