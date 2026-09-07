import { cn } from "@/lib/utils";

import { Container } from "./Container";

type Tone = "default" | "muted" | "dark";

const toneClasses: Record<Tone, string> = {
  default: "bg-base-offwhite text-graphite-900",
  muted: "bg-brand-50 text-graphite-900",
  dark: "bg-graphite-900 text-base-white",
};

/**
 * Vertical rhythm + background tone for a full-bleed page section. Every
 * homepage/about/contacts section wraps its content in this so spacing and
 * max-width stay consistent (CLAUDE.md §4 "premium whitespace").
 */
export function Section({
  id,
  tone = "default",
  className,
  containerClassName,
  children,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("py-16 sm:py-20 lg:py-28", toneClasses[tone], className)}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
