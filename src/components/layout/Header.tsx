"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import type { Dictionary } from "@/dictionaries";
import type { Locale } from "@/i18n/config";
import { NAV_LINKS } from "@/lib/constants";
import { localizedHref } from "@/lib/i18n-links";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/types/content";

import { LanguageSwitcher } from "./LanguageSwitcher";

/**
 * Transparent over the homepage hero, turning solid on scroll (CLAUDE.md
 * §11). Every other page has no hero behind it, so the header starts solid
 * there. Mobile gets a full-screen menu overlay instead of a dropdown, per
 * §27's "mobile needs its own layout logic" guidance.
 */
export function Header({
  siteSettings,
  dict,
  locale,
}: {
  siteSettings: SiteSettings;
  dict: Dictionary;
  locale: Locale;
}) {
  const pathname = usePathname();
  const homeHref = localizedHref(locale, "/");
  const isHome = pathname === homeHref;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu on navigation. Adjusted during render (React's
  // documented pattern for resetting state when a prop/value changes)
  // rather than in an effect, which would cause an extra, avoidable render
  // pass — see https://react.dev/learn/you-might-not-need-an-effect.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const solid = !isHome || scrolled || menuOpen;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid
          ? menuOpen
            ? // No backdrop-blur while the mobile menu is open: `filter`/
              // `backdrop-filter` on this element would make it the
              // containing block for its `position: fixed` descendants
              // (the menu panel below) instead of the viewport — collapsing
              // the panel's computed height to ~0 and making its background
              // invisible even though the class is applied. Fully opaque
              // white gives the same solid look without that side effect.
              "bg-base-white shadow-sm"
            : "bg-base-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-base-white/80"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link
          href={homeHref}
          className="flex items-center gap-2 text-h3 font-semibold"
          aria-label={siteSettings.companyName}
        >
          <span className="relative h-9 w-32 shrink-0">
            <SmartImage
              image={siteSettings.logo}
              objectFit="contain"
              className={cn(!solid && "brightness-0 invert")}
            />
          </span>
        </Link>

        <nav aria-label={dict.header.ariaMainNav} className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={localizedHref(locale, link.href)}
              className={cn(
                "text-body font-medium transition-colors hover:text-brand-600",
                solid ? "text-graphite-900" : "text-base-white",
              )}
            >
              {dict.nav[link.key]}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <LanguageSwitcher locale={locale} label={dict.languageSwitcher.label} solid={solid} />
          <Button
            href={localizedHref(locale, "/contacts")}
            variant={solid ? "primary" : "secondary"}
            className={
              !solid
                ? "border-base-white text-base-white hover:border-base-white hover:bg-base-white/10 hover:text-base-white"
                : undefined
            }
          >
            {dict.header.contactCta}
          </Button>
        </div>

        <button
          type="button"
          className={cn(
            "-mr-2 flex h-11 w-11 items-center justify-center rounded-sm md:hidden",
            solid ? "text-graphite-900" : "text-base-white",
          )}
          aria-label={menuOpen ? dict.header.closeMenu : dict.header.openMenu}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {menuOpen && (
        <div className="fixed inset-x-0 top-18 bottom-0 z-40 flex flex-col bg-base-white px-6 py-8 md:hidden">
          <nav aria-label={dict.header.ariaMobileNav} className="flex flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={localizedHref(locale, link.href)}
                className="text-h3 font-medium text-graphite-900"
              >
                {dict.nav[link.key]}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-6">
            <LanguageSwitcher
              locale={locale}
              label={dict.languageSwitcher.label}
              solid
              className="self-center"
            />
            <Button href={localizedHref(locale, "/contacts")} size="lg" className="w-full">
              {dict.header.contactCta}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
