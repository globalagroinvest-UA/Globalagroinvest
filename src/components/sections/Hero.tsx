import { Container } from "@/components/ui/Container";
import { SmartImage } from "@/components/ui/SmartImage";
import { CtaButton } from "@/components/ui/CtaButton";
import type { Locale } from "@/i18n/config";
import type { Cta, SanityImage } from "@/types/content";

export function Hero({
  title,
  subtitle,
  image,
  ctaPrimary,
  ctaSecondary,
  locale,
}: {
  title: string;
  subtitle: string;
  image: SanityImage;
  ctaPrimary?: Cta;
  ctaSecondary?: Cta;
  locale: Locale;
}) {
  return (
    <section className="relative -mt-18 flex min-h-[calc(100svh)] items-end overflow-hidden pt-18">
      <div className="absolute inset-0">
        <SmartImage image={image} priority sizes="100vw" />
        {/* Scrim for text legibility — matters even more once this is a real photo. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-graphite-900/90 via-graphite-900/30 to-graphite-900/10"
        />
      </div>

      <Container className="relative pb-20 pt-32 sm:pb-28">
        <div className="max-w-3xl">
          <h1 className="text-display font-bold text-base-white text-balance">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-body-lg text-neutral-100 text-pretty">
            {subtitle}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            {ctaPrimary && (
              <CtaButton cta={ctaPrimary} locale={locale} size="lg" />
            )}
            {ctaSecondary && (
              <CtaButton
                cta={ctaSecondary}
                locale={locale}
                size="lg"
                className="border-base-white text-base-white hover:border-base-white hover:bg-base-white/10 hover:text-base-white"
              />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
