/**
 * Shape of the static UI-string dictionaries (src/dictionaries/uk.ts,
 * src/dictionaries/en.ts). This is chrome text only — nav labels, buttons,
 * form labels, error messages — never CMS content. CMS content (page
 * titles, descriptions, product data) is authored in Ukrainian in Sanity
 * and machine-translated on demand for English — see
 * src/lib/sanity/localize.ts.
 */
export type Dictionary = {
  nav: {
    products: string;
    about: string;
    news: string;
    contacts: string;
  };
  header: {
    ariaMainNav: string;
    ariaMobileNav: string;
    contactCta: string;
    openMenu: string;
    closeMenu: string;
  };
  footer: {
    navHeading: string;
    productsHeading: string;
    contactsHeading: string;
    rightsReserved: string;
    translationNotice: string;
  };
  breadcrumbs: {
    ariaLabel: string;
    home: string;
    products: string;
    about: string;
    news: string;
    contacts: string;
  };
  productsPage: {
    title: string;
    subtitle: string;
    emptyCatalog: string;
  };
  productDetail: {
    ctaPriceAvailability: string;
  };
  cards: {
    viewCategory: string;
    learnMore: string;
    readMore: string;
  };
  productGrid: {
    emptyCategory: string;
  };
  homeSections: {
    businessDirectionsTitle: string;
  };
  newsPage: {
    title: string;
    empty: string;
  };
  aboutPage: {
    advantagesTitleFallback: string;
  };
  contactsPage: {
    contactInfoHeading: string;
    mapTitle: string;
    openInGoogleMaps: string;
    formHeading: string;
    formSubtitle: string;
  };
  notFound: {
    metaTitle: string;
  };
  contactForm: {
    nameLabel: string;
    phoneLabel: string;
    emailLabel: string;
    messageLabel: string;
    submit: string;
    submitting: string;
    successMessage: string;
    genericSubmitError: string;
    networkError: string;
    validation: {
      nameRequired: string;
      nameTooLong: string;
      phoneTooLong: string;
      emailInvalid: string;
      messageTooShort: string;
      messageTooLong: string;
      phoneOrEmailRequired: string;
    };
  };
  contactApi: {
    rateLimited: string;
    malformedRequest: string;
    invalidFields: string;
    serviceUnavailable: string;
    sendFailed: string;
    unexpectedError: string;
  };
  languageSwitcher: {
    label: string;
  };
};
