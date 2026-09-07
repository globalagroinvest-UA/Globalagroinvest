/**
 * Content shapes shared between Sanity GROQ query results
 * (src/lib/sanity/queries.ts) and the offline demo content
 * (src/lib/demo-content.ts). Keeping one shared type per document means a
 * component never needs to know whether its data came from Sanity or from
 * the fallback — see src/lib/sanity/fetch.ts.
 */

/** Decorative art used only for offline demo content — see PlaceholderArt.tsx. */
export type PlaceholderIcon =
  | "wheat"
  | "sprout"
  | "tractor"
  | "fuel"
  | "leaf"
  | "droplet"
  | "package"
  | "building"
  | "warehouse"
  | "truck"
  | "factory"
  | "users"
  | "award"
  | "handshake"
  | "sparkles"
  | "shieldCheck"
  | "newspaper"
  | "globe"
  | "route";

export type PlaceholderSpec = {
  icon: PlaceholderIcon;
  tone: "brand" | "graphite" | "accent";
};

export type SanityImage = {
  /** Sanity asset URL, already resolved via urlFor() — never a raw asset ref. */
  url: string;
  alt: string;
  width: number;
  height: number;
  /** Tiny base64 LQIP placeholder for blur-up loading, when available. */
  lqip?: string;
  /**
   * When set, SmartImage renders generated placeholder art instead of an
   * <img>/next/image — used only by the offline demo content
   * (src/lib/demo-content.ts) so the site never ships real photography it
   * doesn't have. Real Sanity images never set this.
   */
  placeholder?: PlaceholderSpec;
};

export type Cta = {
  label: string;
  href: string;
  style: "primary" | "secondary";
};

export type StatValue = {
  value: string;
  suffix?: string;
  label: string;
};

export type SocialLink = {
  platform:
    | "facebook"
    | "instagram"
    | "linkedin"
    | "youtube"
    | "telegram"
    | "viber"
    | "whatsapp";
  url: string;
};

export type Characteristic = {
  label: string;
  value: string;
};

export type Seo = {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: SanityImage;
};

export type SiteSettings = {
  companyName: string;
  logo: SanityImage;
  footerDescription: string;
  phone: string;
  email: string;
  address: string;
  mapEmbedUrl?: string;
  workingHours: string;
  socialLinks: SocialLink[];
  legalInfo?: string;
  seo?: Seo;
};

export type Category = {
  _id: string;
  title: string;
  slug: string;
  image: SanityImage;
  description: string;
  order: number;
  seo?: Seo;
};

export type Brand = {
  _id: string;
  name: string;
  logo: SanityImage;
  url?: string;
};

export type Advantage = {
  _id: string;
  title: string;
  description: string;
};

export type BusinessDirection = {
  _id: string;
  title: string;
  description: string;
  image: SanityImage;
  cta?: Cta;
};

export type PortableTextBlock = Record<string, unknown>;

export type Product = {
  _id: string;
  title: string;
  slug: string;
  category: { title: string; slug: string };
  brand?: { name: string };
  shortDescription: string;
  description: PortableTextBlock[];
  characteristics: Characteristic[];
  images: SanityImage[];
  order: number;
  status: "active" | "archived";
  seo?: Seo;
};

export type NewsPost = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt: string;
  coverImage: SanityImage;
  body: PortableTextBlock[];
  seo?: Seo;
};

export type HomePage = {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: SanityImage;
  heroCtaPrimary?: Cta;
  heroCtaSecondary?: Cta;
  introTitle: string;
  introText: string;
  introImage: SanityImage;
  businessDirections: BusinessDirection[];
  advantagesTitle: string;
  advantages: Advantage[];
  stats: StatValue[];
  brandsSectionTitle: string;
  brands: Brand[];
  finalCtaTitle: string;
  finalCtaText: string;
  finalCtaButton: Cta;
  seo?: Seo;
};

export type AboutPage = {
  title: string;
  intro: string;
  body: PortableTextBlock[];
  mainImage: SanityImage;
  advantagesTitle?: string;
  advantages: Advantage[];
  stats: StatValue[];
  seo?: Seo;
};

export type ContactsPage = {
  title: string;
  intro: string;
  seo?: Seo;
};
