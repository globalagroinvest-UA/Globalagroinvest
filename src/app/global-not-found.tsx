// This file bypasses the app's normal layout tree entirely (see
// PROJECT_PLAN.md §5 — the site has two independent root layouts, `(site)`
// and `studio`, so there is no single layout to compose a 404 page from).
// It must therefore import its own global styles/fonts and return a full
// <html>/<body> document — see next.config.ts `experimental.globalNotFound`.
import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { defaultLocale } from "@/i18n/config";
import { getSiteSettings } from "@/lib/sanity/fetch";

import "./(site)/globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Сторінку не знайдено",
  description: "Сторінку, яку ви шукаєте, не знайдено.",
};

export default async function GlobalNotFound() {
  // Falls back to demo content automatically if Sanity is unreachable —
  // see src/lib/sanity/fetch.ts — so the 404 page never itself fails. This
  // special top-level file bypasses the (site)/[locale] route tree
  // entirely (see the comment above), so it always renders in the default
  // locale — a real localized 404 would need its own [locale] plumbing,
  // which isn't worth it for a page whose whole point is "you got lost".
  const siteSettings = await getSiteSettings(defaultLocale);

  return (
    <html lang="uk" className={`${manrope.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex h-full min-h-screen flex-col items-center justify-center bg-base-offwhite px-6 text-center">
        <Compass size={48} strokeWidth={1.25} className="text-brand-600" aria-hidden="true" />
        <h1 className="mt-6 text-h1 font-semibold text-graphite-900">404</h1>
        <p className="mt-3 max-w-md text-body-lg text-neutral-600 text-pretty">
          Сторінку, яку ви шукаєте, не знайдено. Можливо, вона була переміщена
          або видалена.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/">На головну</Button>
          <Button href="/contacts" variant="secondary">
            Зв&apos;язатися з нами
          </Button>
        </div>
        <p className="mt-10 text-caption text-neutral-500">
          {siteSettings.companyName} ·{" "}
          <a href={`tel:${siteSettings.phone.replace(/\s+/g, "")}`} className="hover:text-brand-700">
            {siteSettings.phone}
          </a>
        </p>
      </body>
    </html>
  );
}
