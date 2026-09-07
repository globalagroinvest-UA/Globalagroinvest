import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SmartImage } from "@/components/ui/SmartImage";
import type { Dictionary } from "@/dictionaries";
import type { Locale } from "@/i18n/config";
import { localizedHref } from "@/lib/i18n-links";
import type { Category } from "@/types/content";

export function CategoryCard({
  category,
  dict,
  locale,
}: {
  category: Category;
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    <Link
      href={localizedHref(locale, `/products/${category.slug}`)}
      className="group flex flex-col overflow-hidden rounded-md bg-base-white shadow-sm ring-1 ring-neutral-100 transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <SmartImage
          image={category.image}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-h3 font-semibold">{category.title}</h3>
        <p className="mt-3 flex-1 text-body text-neutral-600">{category.description}</p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-body font-medium text-brand-700">
          {dict.cards.viewCategory}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
