import { Section } from "@/components/ui/Section";
import { CtaButton } from "@/components/ui/CtaButton";
import type { Locale } from "@/i18n/config";
import type { Cta } from "@/types/content";

export function CTASection({
  title,
  text,
  cta,
  locale,
}: {
  title: string;
  text: string;
  cta: Cta;
  locale: Locale;
}) {
  return (
    <Section tone="dark" className="text-center">
      <h2 className="text-h2 font-semibold text-balance">{title}</h2>
      <p className="mx-auto mt-4 max-w-xl text-body-lg text-neutral-300 text-pretty">
        {text}
      </p>
      <div className="mt-8 flex justify-center">
        <CtaButton cta={cta} locale={locale} size="lg" />
      </div>
    </Section>
  );
}
