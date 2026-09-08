import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { notFound } from "next/navigation";

import { ContactForm } from "@/components/sections/ContactForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section } from "@/components/ui/Section";
import { getDictionary } from "@/dictionaries";
import { isLocale, type Locale } from "@/i18n/config";
import { localizedHref } from "@/lib/i18n-links";
import { getAddressEmbedUrl, getAddressMapSearchUrl, getEmbeddableMapUrl } from "@/lib/google-maps";
import { getContactsPage, getSiteSettings } from "@/lib/sanity/fetch";
import { localeAlternates } from "@/lib/seo";

type Params = { locale: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  const contactsPage = await getContactsPage(locale);
  const seo = contactsPage.seo;

  return {
    title: seo?.metaTitle || contactsPage.title,
    description: seo?.metaDescription || contactsPage.intro,
    alternates: localeAlternates(locale, "/contacts"),
  };
}

export default async function ContactsPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  const [contactsPage, siteSettings, dict] = await Promise.all([
    getContactsPage(locale),
    getSiteSettings(locale),
    getDictionary(locale),
  ]);

  return (
    <Section>
      <Breadcrumbs
        ariaLabel={dict.breadcrumbs.ariaLabel}
        items={[
          { label: dict.breadcrumbs.home, href: localizedHref(locale, "/") },
          { label: dict.breadcrumbs.contacts },
        ]}
      />
      <h1 className="mt-6 text-h1 font-semibold text-balance">{contactsPage.title}</h1>
      <p className="mt-4 max-w-2xl text-body-lg text-neutral-600 text-pretty">
        {contactsPage.intro}
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-h3 font-semibold">{dict.contactsPage.contactInfoHeading}</h2>
          <ul className="mt-6 space-y-4 text-body">
            <li className="flex items-start gap-3">
              <Phone size={20} className="mt-0.5 shrink-0 text-brand-600" aria-hidden="true" />
              <a
                href={`tel:${siteSettings.phone.replace(/\s+/g, "")}`}
                className="hover:text-brand-700"
              >
                {siteSettings.phone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={20} className="mt-0.5 shrink-0 text-brand-600" aria-hidden="true" />
              <a href={`mailto:${siteSettings.email}`} className="hover:text-brand-700">
                {siteSettings.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={20} className="mt-0.5 shrink-0 text-brand-600" aria-hidden="true" />
              <span>{siteSettings.address}</span>
            </li>
            <li className="flex items-start gap-3">
              <Clock size={20} className="mt-0.5 shrink-0 text-brand-600" aria-hidden="true" />
              <span>{siteSettings.workingHours}</span>
            </li>
          </ul>

          {(() => {
            // `mapEmbedUrl` is free text typed by a non-technical editor in
            // Sanity, so we never trust it's actually embeddable — see
            // src/lib/google-maps.ts for why a regular Google Maps "share"
            // link can't be put in an <iframe> (Google itself refuses the
            // connection). We only ever render an <iframe> when the URL
            // matches an embeddable shape; otherwise we fall back to an
            // address-based embed, and finally to a plain link.
            const embedUrl =
              getEmbeddableMapUrl(siteSettings.mapEmbedUrl) ||
              (siteSettings.address ? getAddressEmbedUrl(siteSettings.address) : null);

            if (embedUrl) {
              return (
                <div className="mt-8 aspect-video overflow-hidden rounded-md">
                  <iframe
                    src={embedUrl}
                    title={dict.contactsPage.mapTitle}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full border-0"
                  />
                </div>
              );
            }

            if (siteSettings.address) {
              return (
                <a
                  href={getAddressMapSearchUrl(siteSettings.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 text-body font-medium text-brand-600 hover:text-brand-700"
                >
                  <MapPin size={18} aria-hidden="true" />
                  {dict.contactsPage.openInGoogleMaps}
                </a>
              );
            }

            return null;
          })()}
        </div>

        <div className="rounded-md bg-base-white p-6 shadow-sm ring-1 ring-neutral-100 sm:p-8">
          <h2 className="text-h3 font-semibold">{dict.contactsPage.formHeading}</h2>
          <p className="mt-2 text-body text-neutral-600">{dict.contactsPage.formSubtitle}</p>
          <div className="mt-6">
            <ContactForm dict={dict} locale={locale} />
          </div>
        </div>
      </div>
    </Section>
  );
}
