/**
 * Structural navigation is not content — it defines the site's information
 * architecture (CLAUDE.md §11) and does not need to live in the CMS. Only
 * the (locale-independent) href and a dictionary key live here; the label
 * itself comes from the active locale's dictionary (src/dictionaries) so
 * the same nav renders in Ukrainian or English without duplicating hrefs.
 */
export const NAV_LINKS = [
  { key: "products", href: "/products" },
  { key: "about", href: "/about" },
  { key: "news", href: "/news" },
  { key: "contacts", href: "/contacts" },
] as const;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
