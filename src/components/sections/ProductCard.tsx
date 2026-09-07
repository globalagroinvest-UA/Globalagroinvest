import Link from "next/link";

import { SmartImage } from "@/components/ui/SmartImage";
import type { Dictionary } from "@/dictionaries";
import type { Locale } from "@/i18n/config";
import { localizedHref } from "@/lib/i18n-links";
import type { Product } from "@/types/content";

export function ProductCard({
  product,
  dict,
  locale,
}: {
  product: Product;
  dict: Dictionary;
  locale: Locale;
}) {
  const mainImage = product.images[0];

  return (
    <Link
      href={localizedHref(locale, `/products/${product.slug}`)}
      className="group flex flex-col overflow-hidden rounded-md bg-base-white shadow-sm ring-1 ring-neutral-100 transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden">
        {mainImage && (
          <SmartImage
            image={mainImage}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {product.brand && (
          <span className="absolute left-3 top-3 rounded-sm bg-base-white/90 px-2.5 py-1 text-caption font-medium text-graphite-900">
            {product.brand.name}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-body-lg font-semibold text-balance">{product.title}</h3>
        <p className="mt-2 flex-1 text-body text-neutral-600">{product.shortDescription}</p>
        <span className="mt-4 text-body font-medium text-brand-700">{dict.cards.learnMore}</span>
      </div>
    </Link>
  );
}
