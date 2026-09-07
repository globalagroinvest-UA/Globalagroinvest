/**
 * GROQ queries. Every image field is projected into the flat SanityImage
 * shape (src/types/content.ts) right here, so components never deal with
 * raw Sanity asset references.
 */

const IMAGE_FIELDS = `{
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "lqip": asset->metadata.lqip,
  "alt": coalesce(alt, "")
}`;

const SEO_FIELDS = `{
  metaTitle,
  metaDescription,
  ogImage ${IMAGE_FIELDS}
}`;

const CTA_FIELDS = `{ label, href, style }`;
const STAT_FIELDS = `{ value, suffix, label }`;

export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  companyName,
  logo ${IMAGE_FIELDS},
  footerDescription,
  phone,
  email,
  address,
  mapEmbedUrl,
  workingHours,
  socialLinks[]{ platform, url },
  legalInfo,
  seo ${SEO_FIELDS}
}`;

const BUSINESS_DIRECTION_FIELDS = `{
  _id,
  title,
  description,
  image ${IMAGE_FIELDS},
  cta ${CTA_FIELDS}
}`;

const ADVANTAGE_FIELDS = `{ _id, title, description }`;

const BRAND_FIELDS = `{ _id, name, logo ${IMAGE_FIELDS}, url }`;

export const homePageQuery = `*[_type == "homePage"][0]{
  heroTitle,
  heroSubtitle,
  heroImage ${IMAGE_FIELDS},
  heroCtaPrimary ${CTA_FIELDS},
  heroCtaSecondary ${CTA_FIELDS},
  introTitle,
  introText,
  introImage ${IMAGE_FIELDS},
  "businessDirections": businessDirections[]->${BUSINESS_DIRECTION_FIELDS},
  advantagesTitle,
  "advantages": advantages[]->${ADVANTAGE_FIELDS},
  stats[] ${STAT_FIELDS},
  brandsSectionTitle,
  "brands": brands[]->${BRAND_FIELDS},
  finalCtaTitle,
  finalCtaText,
  finalCtaButton ${CTA_FIELDS},
  seo ${SEO_FIELDS}
}`;

export const aboutPageQuery = `*[_type == "aboutPage"][0]{
  title,
  intro,
  body,
  mainImage ${IMAGE_FIELDS},
  advantagesTitle,
  "advantages": advantages[]->${ADVANTAGE_FIELDS},
  stats[] ${STAT_FIELDS},
  seo ${SEO_FIELDS}
}`;

export const contactsPageQuery = `*[_type == "contactsPage"][0]{
  title,
  intro,
  seo ${SEO_FIELDS}
}`;

const CATEGORY_FIELDS = `{
  _id,
  title,
  "slug": slug.current,
  image ${IMAGE_FIELDS},
  description,
  order,
  seo ${SEO_FIELDS}
}`;

export const categoriesQuery = `*[_type == "category"] | order(order asc)${CATEGORY_FIELDS}`;

export const categoryBySlugQuery = `*[_type == "category" && slug.current == $slug][0]${CATEGORY_FIELDS}`;

const PRODUCT_CARD_FIELDS = `{
  _id,
  title,
  "slug": slug.current,
  "category": category->{ title, "slug": slug.current },
  "brand": brand->{ name },
  shortDescription,
  images[] ${IMAGE_FIELDS},
  order,
  status
}`;

export const productsByCategoryQuery = `*[_type == "product" && status == "active" && category._ref == $categoryId] | order(order asc)${PRODUCT_CARD_FIELDS}`;

export const productBySlugQuery = `*[_type == "product" && slug.current == $slug && status == "active"][0]{
  _id,
  title,
  "slug": slug.current,
  "category": category->{ title, "slug": slug.current },
  "brand": brand->{ name },
  shortDescription,
  description,
  characteristics[]{ label, value },
  images[] ${IMAGE_FIELDS},
  order,
  status,
  seo ${SEO_FIELDS}
}`;

/** All category + active product slugs, for generateStaticParams on /products/[slug]. */
export const allCategoryAndProductSlugsQuery = `{
  "categories": *[_type == "category"].slug.current,
  "products": *[_type == "product" && status == "active"].slug.current
}`;

const NEWS_CARD_FIELDS = `{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  coverImage ${IMAGE_FIELDS}
}`;

export const newsListQuery = `*[_type == "newsPost"] | order(publishedAt desc)${NEWS_CARD_FIELDS}`;

export const newsBySlugQuery = `*[_type == "newsPost" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  coverImage ${IMAGE_FIELDS},
  body,
  seo ${SEO_FIELDS}
}`;

export const allNewsSlugsQuery = `*[_type == "newsPost"].slug.current`;
