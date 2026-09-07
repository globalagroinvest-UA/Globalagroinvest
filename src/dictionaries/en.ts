import type { Dictionary } from "./types";

/**
 * Hand-written English UI strings — chrome text only (nav, buttons, form
 * labels, error messages). Unlike CMS content, these are NOT run through
 * the Azure machine-translation pipeline: a fixed set of interface labels
 * is worth translating once, carefully, rather than on every request.
 */
const en: Dictionary = {
  nav: {
    products: "Products",
    about: "About Us",
    news: "News",
    contacts: "Contacts",
  },
  header: {
    ariaMainNav: "Main navigation",
    ariaMobileNav: "Mobile navigation",
    contactCta: "Contact us",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  footer: {
    navHeading: "Navigation",
    productsHeading: "Products",
    contactsHeading: "Contacts",
    rightsReserved: "All rights reserved.",
    translationNotice: "This page was machine-translated from Ukrainian.",
  },
  breadcrumbs: {
    ariaLabel: "Breadcrumbs",
    home: "Home",
    products: "Products",
    about: "About Us",
    news: "News",
    contacts: "Contacts",
  },
  productsPage: {
    title: "Products",
    subtitle: "Choose a category to see the range.",
    emptyCatalog:
      "The catalog is currently empty. Contact us — we'll tell you what's available right now.",
  },
  productDetail: {
    ctaPriceAvailability: "Ask about price and availability",
  },
  cards: {
    viewCategory: "View products",
    learnMore: "Learn more",
    readMore: "Read more",
  },
  productGrid: {
    emptyCategory: "No products in this category yet. Contact us — we'll tell you what's available right now.",
  },
  homeSections: {
    businessDirectionsTitle: "Business Directions",
  },
  newsPage: {
    title: "News",
    empty: "No news yet.",
  },
  aboutPage: {
    advantagesTitleFallback: "Why choose us",
  },
  contactsPage: {
    contactInfoHeading: "Contact information",
    mapTitle: "Map — company location",
    formHeading: "Send us a message",
    formSubtitle: "Fill out the form and we'll get back to you shortly.",
  },
  notFound: {
    metaTitle: "Page not found",
  },
  contactForm: {
    nameLabel: "Name *",
    phoneLabel: "Phone",
    emailLabel: "Email",
    messageLabel: "Message *",
    submit: "Send message",
    submitting: "Sending…",
    successMessage: "Thank you! Your message has been sent — we'll get back to you shortly.",
    genericSubmitError: "Couldn't send your message. Please try again.",
    networkError: "Couldn't reach the server. Check your connection and try again.",
    validation: {
      nameRequired: "Enter your name",
      nameTooLong: "Name is too long — 100 characters maximum",
      phoneTooLong: "Phone number is too long",
      emailInvalid: "Invalid email address",
      messageTooShort: "Please describe your request in a bit more detail (10 characters minimum)",
      messageTooLong: "Message is too long — 2000 characters maximum",
      phoneOrEmailRequired: "Provide a phone number or email so we can reach you",
    },
  },
  contactApi: {
    rateLimited: "Too many requests. Please try again in a few minutes.",
    malformedRequest: "Malformed request.",
    invalidFields: "Please check the form fields.",
    serviceUnavailable:
      "The contact form is temporarily unavailable. Please reach us by phone or email, listed on the Contacts page.",
    sendFailed: "Couldn't send your message. Please try again or contact us directly.",
    unexpectedError: "An unexpected error occurred. Please try again or contact us directly.",
  },
  languageSwitcher: {
    label: "Site language",
  },
};

export default en;
