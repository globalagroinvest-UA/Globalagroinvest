import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdvantagesSection } from "@/components/sections/AdvantagesSection";
import { BrandsSection } from "@/components/sections/BrandsSection";
import { BusinessDirectionsSection } from "@/components/sections/BusinessDirectionsSection";
import { CTASection } from "@/components/sections/CTASection";
import { Hero } from "@/components/sections/Hero";
import { IntroSection } from "@/components/sections/IntroSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { getDictionary } from "@/dictionaries";
import { isLocale, type Locale } from "@/i18n/config";
import { getHomePage } from "@/lib/sanity/fetch";
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

  const homePage = await getHomePage(locale);
  const seo = homePage.seo;
  const ogImageUrl =
    seo?.ogImage && !seo.ogImage.placeholder
      ? sanityImageUrl(seo.ogImage.url, { w: 1200, h: 630 })
      : undefined;

  return {
    title: seo?.metaTitle || homePage.heroTitle,
    description: seo?.metaDescription || homePage.heroSubtitle,
    openGraph: {
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : undefined,
    },
    alternates: localeAlternates(locale, "/"),
  };
}

export default async function HomePage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  const [homePage, dict] = await Promise.all([getHomePage(locale), getDictionary(locale)]);

  return (
    <>
      <Hero
        title={homePage.heroTitle}
        subtitle={homePage.heroSubtitle}
        image={homePage.heroImage}
        ctaPrimary={homePage.heroCtaPrimary}
        ctaSecondary={homePage.heroCtaSecondary}
        locale={locale}
      />
      <IntroSection
        title={homePage.introTitle}
        text={homePage.introText}
        image={homePage.introImage}
      />
      <BusinessDirectionsSection
        directions={homePage.businessDirections}
        dict={dict}
        locale={locale}
      />
      <AdvantagesSection title={homePage.advantagesTitle} advantages={homePage.advantages} />
      <StatsSection stats={homePage.stats} />
      <BrandsSection title={homePage.brandsSectionTitle} brands={homePage.brands} />
      <CTASection
        title={homePage.finalCtaTitle}
        text={homePage.finalCtaText}
        cta={homePage.finalCtaButton}
        locale={locale}
      />
    </>
  );
}
