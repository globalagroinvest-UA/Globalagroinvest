import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryCard } from "@/components/sections/CategoryCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section } from "@/components/ui/Section";
import { getDictionary } from "@/dictionaries";
import { isLocale, type Locale } from "@/i18n/config";
import { localizedHref } from "@/lib/i18n-links";
import { getCategories } from "@/lib/sanity/fetch";
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
    title: dict.productsPage.title,
    description: dict.productsPage.subtitle,
    alternates: localeAlternates(locale, "/products"),
  };
}

export default async function ProductsPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  const [categories, dict] = await Promise.all([getCategories(locale), getDictionary(locale)]);

  return (
    <Section>
      <Breadcrumbs
        ariaLabel={dict.breadcrumbs.ariaLabel}
        items={[
          { label: dict.breadcrumbs.home, href: localizedHref(locale, "/") },
          { label: dict.breadcrumbs.products },
        ]}
      />
      <h1 className="mt-6 text-h1 font-semibold text-balance">{dict.productsPage.title}</h1>
      <p className="mt-4 max-w-2xl text-body-lg text-neutral-600 text-pretty">
        {dict.productsPage.subtitle}
      </p>

      {categories.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category._id} category={category} dict={dict} locale={locale} />
          ))}
        </div>
      ) : (
        <p className="mt-12 rounded-md bg-neutral-50 p-8 text-center text-body text-neutral-600">
          {dict.productsPage.emptyCatalog}
        </p>
      )}
    </Section>
  );
}
