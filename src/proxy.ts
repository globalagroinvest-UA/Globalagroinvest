import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { defaultLocale, locales } from "@/i18n/config";

/**
 * Locale routing, per Next.js's own i18n guide (App Router). Ukrainian is
 * the default locale and stays unprefixed (`/products`) for backward
 * compatibility with existing links/SEO; every other locale is prefixed
 * (`/en/products`). This proxy only ever *rewrites* the default locale
 * internally to `/uk/...` — the visible URL and address bar never change,
 * so no existing link needs to be updated.
 *
 * `/studio` (Sanity Studio), `/api/*`, and Next's own internals are
 * excluded via the matcher below — they are not part of the localized
 * route tree in src/app/(site)/[locale].
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Match every path except:
     * - /api (Route Handlers — contact form, revalidate webhook)
     * - /studio (Sanity Studio — not localized)
     * - /_next/static, /_next/image (Next internals)
     * - favicon.ico, robots.txt, sitemap.xml (top-level metadata files)
     * - any path with a file extension (public/ assets: /brands/fuchs.png, etc.)
     */
    "/((?!api|studio|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
