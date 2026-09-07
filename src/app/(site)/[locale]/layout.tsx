import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import { notFound } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getDictionary } from "@/dictionaries";
import { isLocale, localeHtmlLang, locales, type Locale } from "@/i18n/config";
import { SITE_URL } from "@/lib/constants";
import { getSiteSettings } from "@/lib/sanity/fetch";
import { sanityImageUrl } from "@/lib/sanity/image";
import { jsonLd, localeAlternates } from "@/lib/seo";

import "../globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b2a1d",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Params = { locale: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  const siteSettings = await getSiteSettings(locale);
  const seo = siteSettings.seo;
  const ogImageUrl =
    seo?.ogImage && !seo.ogImage.placeholder
      ? sanityImageUrl(seo.ogImage.url, { w: 1200, h: 630 })
      : undefined;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: seo?.metaTitle || siteSettings.companyName,
      template: `%s — ${siteSettings.companyName}`,
    },
    description: seo?.metaDescription || siteSettings.footerDescription,
    alternates: localeAlternates(locale, "/"),
    openGraph: {
      type: "website",
      locale: locale === "uk" ? "uk_UA" : "en_US",
      siteName: siteSettings.companyName,
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : undefined,
    },
    icons: { icon: "/favicon.ico" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  const [siteSettings, dict] = await Promise.all([
    getSiteSettings(locale),
    getDictionary(locale),
  ]);

  const organizationJsonLd = jsonLd({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteSettings.companyName,
    url: SITE_URL,
    logo: siteSettings.logo.placeholder
      ? undefined
      : sanityImageUrl(siteSettings.logo.url, { w: 512 }),
    description: siteSettings.footerDescription,
    telephone: siteSettings.phone,
    email: siteSettings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteSettings.address,
    },
    sameAs: siteSettings.socialLinks.map((link) => link.url),
  });

  return (
    <html
      lang={localeHtmlLang[locale]}
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Organization structured data — helps search engines attribute
            the site to the company (CLAUDE.md §14 SEO requirements). Never
            fabricates facts: every field is pulled straight from the same
            siteSettings a human editor maintains in the CMS. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: organizationJsonLd }}
        />
        <Header siteSettings={siteSettings} dict={dict} locale={locale} />
        <main className="flex-1 pt-18">{children}</main>
        <Footer siteSettings={siteSettings} dict={dict} locale={locale} />
      </body>
    </html>
  );
}
