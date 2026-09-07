import { defaultLocale, locales, type Locale } from "@/i18n/config";

/**
 * Prefixes an internal href with its locale segment, mirroring the
 * rewrite proxy.ts performs in the other direction: the default locale
 * (uk) stays unprefixed, every other locale is prefixed (`/en/products`).
 * Used everywhere a component builds a link from a bare content path
 * (nav links, breadcrumbs, category/product links) so links generated
 * while browsing English pages stay on English pages.
 */
export function localizedHref(locale: Locale, href: string): string {
  if (locale === defaultLocale) return href;
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}

/**
 * Inverse of localizedHref: given the current *visible* pathname (as
 * `usePathname()` reports it — `/en/products` on English, `/products` on
 * Ukrainian, since the default-locale rewrite in proxy.ts is invisible to
 * the browser), returns the bare, locale-independent path. Used by the
 * language switcher to compute the equivalent URL in the other locale.
 */
export function stripLocaleFromPathname(pathname: string): string {
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    if (pathname === `/${locale}`) return "/";
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
  }
  return pathname;
}
