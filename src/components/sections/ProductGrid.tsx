import { ProductCard } from "@/components/sections/ProductCard";
import type { Dictionary } from "@/dictionaries";
import type { Locale } from "@/i18n/config";
import type { Product } from "@/types/content";

export function ProductGrid({
  products,
  dict,
  locale,
}: {
  products: Product[];
  dict: Dictionary;
  locale: Locale;
}) {
  if (products.length === 0) {
    return (
      <p className="rounded-md bg-neutral-50 p-8 text-center text-body text-neutral-600">
        {dict.productGrid.emptyCategory}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} dict={dict} locale={locale} />
      ))}
    </div>
  );
}
