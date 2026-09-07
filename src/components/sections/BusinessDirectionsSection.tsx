import { Section } from "@/components/ui/Section";
import { SmartImage } from "@/components/ui/SmartImage";
import { CtaButton } from "@/components/ui/CtaButton";
import type { Dictionary } from "@/dictionaries";
import type { Locale } from "@/i18n/config";
import type { BusinessDirection } from "@/types/content";

export function BusinessDirectionsSection({
  directions,
  dict,
  locale,
}: {
  directions: BusinessDirection[];
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    <Section tone="muted">
      <h2 className="text-h2 font-semibold text-balance">{dict.homeSections.businessDirectionsTitle}</h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {directions.map((direction) => (
          <article
            key={direction._id}
            className="group flex flex-col overflow-hidden rounded-md bg-base-white shadow-sm ring-1 ring-neutral-100"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <SmartImage
                image={direction.image}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-h3 font-semibold">{direction.title}</h3>
              <p className="mt-3 flex-1 text-body text-neutral-600">
                {direction.description}
              </p>
              {direction.cta && (
                <div className="mt-6">
                  <CtaButton cta={direction.cta} locale={locale} />
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
