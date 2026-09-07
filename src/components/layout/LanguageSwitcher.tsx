"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { locales, type Locale } from "@/i18n/config";
import { localizedHref, stripLocaleFromPathname } from "@/lib/i18n-links";
import { cn } from "@/lib/utils";

/**
 * A plain uk/en toggle — not a full language menu, since the site only
 * ever supports these two. Preserves the current page: switching from
 * `/en/products/pmm` goes to `/products/pmm`, not back to the homepage.
 */
export function LanguageSwitcher({
  locale,
  label,
  solid,
  className,
}: {
  locale: Locale;
  label: string;
  /** Matches Header's own light/dark chrome state — see Header.tsx. */
  solid: boolean;
  className?: string;
}) {
  const pathname = usePathname();
  const basePath = stripLocaleFromPathname(pathname);

  return (
    <div
      role="group"
      aria-label={label}
      className={cn("flex items-center gap-1 text-caption font-semibold", className)}
    >
      {locales.map((l) => {
        const isActive = l === locale;
        return (
          <Link
            key={l}
            href={localizedHref(l, basePath)}
            aria-current={isActive ? "true" : undefined}
            lang={l}
            className={cn(
              "rounded-sm px-2 py-1 uppercase transition-colors",
              isActive
                ? solid
                  ? "bg-brand-600 text-base-white"
                  : "bg-base-white/25 text-base-white"
                : solid
                  ? "text-neutral-500 hover:text-graphite-900"
                  : "text-base-white/70 hover:text-base-white",
            )}
          >
            {l}
          </Link>
        );
      })}
    </div>
  );
}
