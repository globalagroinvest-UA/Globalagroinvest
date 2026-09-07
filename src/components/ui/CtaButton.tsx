import { Button } from "@/components/ui/Button";
import type { Locale } from "@/i18n/config";
import { localizedHref } from "@/lib/i18n-links";
import type { Cta } from "@/types/content";

/** Renders a CMS-authored `cta` object with the shared Button component.
 *  `cta.href` is always a Ukrainian-form internal path (e.g. "/products")
 *  — localizedHref prefixes it for every locale but the default. */
export function CtaButton({
  cta,
  locale,
  size,
  className,
}: {
  cta: Cta;
  locale: Locale;
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <Button href={localizedHref(locale, cta.href)} variant={cta.style} size={size} className={className}>
      {cta.label}
    </Button>
  );
}
