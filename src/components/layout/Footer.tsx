import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTelegramPlane,
  FaViber,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { Mail, MapPin, Phone } from "lucide-react";

import { SmartImage } from "@/components/ui/SmartImage";
import type { Dictionary } from "@/dictionaries";
import type { Locale } from "@/i18n/config";
import { NAV_LINKS } from "@/lib/constants";
import { localizedHref } from "@/lib/i18n-links";
import { getCategories } from "@/lib/sanity/fetch";
import type { SiteSettings, SocialLink } from "@/types/content";

const SOCIAL_ICONS: Record<SocialLink["platform"], React.ComponentType<{ size?: number }>> = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
  telegram: FaTelegramPlane,
  viber: FaViber,
  whatsapp: FaWhatsapp,
};

export async function Footer({
  siteSettings,
  dict,
  locale,
}: {
  siteSettings: SiteSettings;
  dict: Dictionary;
  locale: Locale;
}) {
  const year = new Date().getFullYear();
  // Fetched here (rather than hardcoded) so the footer's product column
  // always reflects the current CMS catalog — a manager renaming or
  // removing a category must never leave a stale link behind.
  const categories = await getCategories(locale);

  return (
    <footer className="bg-graphite-900 text-neutral-200">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-10 lg:py-20">
        <div className="sm:col-span-2 lg:col-span-1">
          <span className="relative block h-9 w-32">
            <SmartImage
              image={siteSettings.logo}
              objectFit="contain"
              className="brightness-0 invert"
            />
          </span>
          <p className="mt-4 max-w-xs text-body text-neutral-400">
            {siteSettings.footerDescription}
          </p>
          {siteSettings.socialLinks.length > 0 && (
            <div className="mt-6 flex gap-3">
              {siteSettings.socialLinks.map((link) => {
                const Icon = SOCIAL_ICONS[link.platform];
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.platform}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-graphite-800 text-base-white transition-colors hover:bg-brand-600"
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-caption font-semibold tracking-wide text-neutral-400 uppercase">
            {dict.footer.navHeading}
          </h2>
          <ul className="mt-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={localizedHref(locale, link.href)} className="text-body hover:text-base-white">
                  {dict.nav[link.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {categories.length > 0 && (
          <div>
            <h2 className="text-caption font-semibold tracking-wide text-neutral-400 uppercase">
              {dict.footer.productsHeading}
            </h2>
            <ul className="mt-4 space-y-3">
              {categories.map((category) => (
                <li key={category._id}>
                  <Link
                    href={localizedHref(locale, `/products/${category.slug}`)}
                    className="text-body hover:text-base-white"
                  >
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h2 className="text-caption font-semibold tracking-wide text-neutral-400 uppercase">
            {dict.footer.contactsHeading}
          </h2>
          <ul className="mt-4 space-y-3 text-body">
            <li className="flex items-start gap-2.5">
              <Phone size={17} className="mt-0.5 shrink-0 text-brand-400" aria-hidden="true" />
              <a href={`tel:${siteSettings.phone.replace(/\s+/g, "")}`} className="hover:text-base-white">
                {siteSettings.phone}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail size={17} className="mt-0.5 shrink-0 text-brand-400" aria-hidden="true" />
              <a href={`mailto:${siteSettings.email}`} className="hover:text-base-white">
                {siteSettings.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={17} className="mt-0.5 shrink-0 text-brand-400" aria-hidden="true" />
              <span>{siteSettings.address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-graphite-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-caption text-neutral-400 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p>
            © {year} {siteSettings.companyName}. {dict.footer.rightsReserved}
          </p>
          {siteSettings.legalInfo && <p>{siteSettings.legalInfo}</p>}
        </div>
        {locale !== "uk" && (
          <div className="mx-auto max-w-7xl px-6 pb-6 text-caption text-neutral-500 italic lg:px-10">
            {dict.footer.translationNotice}
          </div>
        )}
      </div>
    </footer>
  );
}
