import type { SchemaTypeDefinition } from "sanity";

import { characteristic } from "./objects/characteristic";
import { cta } from "./objects/cta";
import { seo } from "./objects/seo";
import { socialLink } from "./objects/socialLink";
import { statValue } from "./objects/statValue";

import { aboutPage } from "./documents/aboutPage";
import { advantage } from "./documents/advantage";
import { brand } from "./documents/brand";
import { businessDirection } from "./documents/businessDirection";
import { category } from "./documents/category";
import { contactsPage } from "./documents/contactsPage";
import { homePage } from "./documents/homePage";
import { newsPost } from "./documents/newsPost";
import { product } from "./documents/product";
import { siteSettings } from "./documents/siteSettings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Reusable objects
    seo,
    cta,
    statValue,
    socialLink,
    characteristic,
    // Singletons (page content)
    siteSettings,
    homePage,
    aboutPage,
    contactsPage,
    // Collections
    category,
    product,
    brand,
    advantage,
    businessDirection,
    newsPost,
  ],
};

/** Document type names that should have exactly one instance (see structure.ts). */
export const SINGLETON_TYPES = new Set([
  "siteSettings",
  "homePage",
  "aboutPage",
  "contactsPage",
]);
