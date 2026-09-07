import { Section } from "@/components/ui/Section";
import { SmartImage } from "@/components/ui/SmartImage";
import type { Brand } from "@/types/content";

/**
 * A static, evenly-spaced grid rather than an auto-scrolling carousel —
 * CLAUDE.md §19 explicitly asks to avoid "an annoying infinite carousel".
 */
export function BrandsSection({
  title,
  brands,
}: {
  title: string;
  brands: Brand[];
}) {
  if (brands.length === 0) return null;

  return (
    <Section tone="muted">
      <h2 className="text-center text-h3 font-semibold text-neutral-600">{title}</h2>
      <div className="mt-10 grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
        {brands.map((brand) =>
          brand.url ? (
            <a
              key={brand._id}
              href={brand.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={brand.name}
              className="relative flex h-16 w-full items-center justify-center grayscale transition-all duration-300 hover:grayscale-0"
            >
              <SmartImage image={brand.logo} objectFit="contain" sizes="200px" />
            </a>
          ) : (
            <div
              key={brand._id}
              role="img"
              aria-label={brand.name}
              className="relative flex h-16 w-full items-center justify-center grayscale transition-all duration-300 hover:grayscale-0"
            >
              <SmartImage image={brand.logo} objectFit="contain" sizes="200px" />
            </div>
          ),
        )}
      </div>
    </Section>
  );
}
