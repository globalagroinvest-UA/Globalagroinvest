import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductGrid } from "@/components/sections/ProductGrid";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CtaButton } from "@/components/ui/CtaButton";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { SmartImage } from "@/components/ui/SmartImage";
import { getDictionary } from "@/dictionaries";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { SITE_URL } from "@/lib/constants";
import { localizedHref } from "@/lib/i18n-links";
import {
  getAllCategoryAndProductSlugs,
  getCategoryBySlug,
  getProductBySlug,
  getProductsByCategory,
} from "@/lib/sanity/fetch";
import { sanityImageUrl } from "@/lib/sanity/image";
import { jsonLd, localeAlternates } from "@/lib/seo";

/**
 * Single dynamic segment serving both category and product pages — see
 * PROJECT_PLAN.md §5. Next.js doesn't allow `/products/[category]` and
 * `/products/[slug]` as sibling dynamic routes, and CLAUDE.md asks for flat
 * URLs for both, so this resolver checks category first, then product, and
 * 404s if neither matches. A Sanity-side validator keeps the two slug
 * namespaces from colliding (src/sanity/schemaTypes/isUniqueSlug.ts).
 */

type PageParams = { locale: string; slug: string };

export async function generateStaticParams(): Promise<{ locale: string; slug: string }[]> {
  const { categories, products } = await getAllCategoryAndProductSlugs();
  const slugs = new Set([...categories, ...products]);
  return locales.flatMap((locale) => Array.from(slugs, (slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  const category = await getCategoryBySlug(slug, locale);
  if (category) {
    const seo = category.seo;
    const ogImageUrl =
      seo?.ogImage && !seo.ogImage.placeholder
        ? sanityImageUrl(seo.ogImage.url, { w: 1200, h: 630 })
        : !category.image.placeholder
          ? sanityImageUrl(category.image.url, { w: 1200, h: 630 })
          : undefined;
    return {
      title: seo?.metaTitle || category.title,
      description: seo?.metaDescription || category.description,
      openGraph: {
        images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : undefined,
      },
      alternates: localeAlternates(locale, `/products/${slug}`),
    };
  }

  const product = await getProductBySlug(slug, locale);
  if (product) {
    const seo = product.seo;
    const mainImage = product.images[0];
    const ogImageUrl =
      seo?.ogImage && !seo.ogImage.placeholder
        ? sanityImageUrl(seo.ogImage.url, { w: 1200, h: 630 })
        : mainImage && !mainImage.placeholder
          ? sanityImageUrl(mainImage.url, { w: 1200, h: 630 })
          : undefined;
    return {
      title: seo?.metaTitle || product.title,
      description: seo?.metaDescription || product.shortDescription,
      openGraph: {
        images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : undefined,
      },
      alternates: localeAlternates(locale, `/products/${slug}`),
    };
  }

  const dict = await getDictionary(locale);
  return { title: dict.notFound.metaTitle };
}

export default async function ProductsSlugPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  const dict = await getDictionary(locale);
  const homeCrumb = { label: dict.breadcrumbs.home, href: localizedHref(locale, "/") };
  const productsCrumb = {
    label: dict.breadcrumbs.products,
    href: localizedHref(locale, "/products"),
  };

  const category = await getCategoryBySlug(slug, locale);
  if (category) {
    const products = await getProductsByCategory(category._id, locale);
    return (
      <Section>
        <Breadcrumbs
          ariaLabel={dict.breadcrumbs.ariaLabel}
          items={[homeCrumb, productsCrumb, { label: category.title }]}
        />
        <h1 className="mt-6 text-h1 font-semibold text-balance">{category.title}</h1>
        <p className="mt-4 max-w-2xl text-body-lg text-neutral-600 text-pretty">
          {category.description}
        </p>
        <div className="mt-12">
          <ProductGrid products={products} dict={dict} locale={locale} />
        </div>
      </Section>
    );
  }

  const product = await getProductBySlug(slug, locale);
  if (product) {
    const mainImage = product.images[0];
    const galleryImages = product.images.slice(1);

    // No `offers` block: this is a presentation site, not e-commerce, and
    // CLAUDE.md explicitly forbids inventing facts like price/availability
    // we don't have. Product schema is still valid — and useful for search
    // — without it.
    const productJsonLd = jsonLd({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      description: product.shortDescription,
      category: product.category.title,
      brand: product.brand ? { "@type": "Brand", name: product.brand.name } : undefined,
      image: product.images
        .filter((image) => !image.placeholder)
        .map((image) => sanityImageUrl(image.url, { w: 1200 })),
      url: `${SITE_URL}${localizedHref(locale, `/products/${slug}`)}`,
    });

    return (
      <Section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: productJsonLd }}
        />
        <Breadcrumbs
          ariaLabel={dict.breadcrumbs.ariaLabel}
          items={[
            homeCrumb,
            productsCrumb,
            {
              label: product.category.title,
              href: localizedHref(locale, `/products/${product.category.slug}`),
            },
            { label: product.title },
          ]}
        />

        <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-md">
              {mainImage && (
                <SmartImage
                  image={mainImage}
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              )}
            </div>
            {galleryImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {galleryImages.map((image, index) => (
                  <div
                    key={`${product._id}-gallery-${index}`}
                    className="relative aspect-square overflow-hidden rounded-md"
                  >
                    <SmartImage image={image} sizes="20vw" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            {product.brand && (
              <p className="text-body font-medium text-brand-700">{product.brand.name}</p>
            )}
            <h1 className="mt-2 text-h1 font-semibold text-balance">{product.title}</h1>
            <p className="mt-4 text-body-lg text-neutral-600 text-pretty">
              {product.shortDescription}
            </p>

            {product.characteristics.length > 0 && (
              <dl className="mt-8 divide-y divide-neutral-100 border-y border-neutral-100">
                {product.characteristics.map((characteristic, index) => (
                  <div
                    key={`${characteristic.label}-${index}`}
                    className="flex justify-between gap-6 py-3 text-body"
                  >
                    <dt className="text-neutral-600">{characteristic.label}</dt>
                    <dd className="font-medium text-graphite-900">{characteristic.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-8">
              <CtaButton
                cta={{ label: dict.productDetail.ctaPriceAvailability, href: "/contacts", style: "primary" }}
                locale={locale}
                size="lg"
              />
            </div>

            {product.description.length > 0 && (
              <div className="mt-10">
                <RichText value={product.description} />
              </div>
            )}
          </div>
        </div>
      </Section>
    );
  }

  notFound();
}
