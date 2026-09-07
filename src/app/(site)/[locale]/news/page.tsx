import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NewsCard } from "@/components/sections/NewsCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section } from "@/components/ui/Section";
import { getDictionary } from "@/dictionaries";
import { isLocale, type Locale } from "@/i18n/config";
import { localizedHref } from "@/lib/i18n-links";
import { getNewsList } from "@/lib/sanity/fetch";
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
  const dict = await getDictionary(locale);

  return {
    title: dict.newsPage.title,
    alternates: localeAlternates(locale, "/news"),
  };
}

export default async function NewsPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  const [newsList, dict] = await Promise.all([getNewsList(locale), getDictionary(locale)]);

  return (
    <Section>
      <Breadcrumbs
        ariaLabel={dict.breadcrumbs.ariaLabel}
        items={[
          { label: dict.breadcrumbs.home, href: localizedHref(locale, "/") },
          { label: dict.breadcrumbs.news },
        ]}
      />
      <h1 className="mt-6 text-h1 font-semibold text-balance">{dict.newsPage.title}</h1>

      {newsList.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {newsList.map((post) => (
            <NewsCard key={post._id} post={post} dict={dict} locale={locale} />
          ))}
        </div>
      ) : (
        <p className="mt-12 rounded-md bg-neutral-50 p-8 text-center text-body text-neutral-600">
          {dict.newsPage.empty}
        </p>
      )}
    </Section>
  );
}
