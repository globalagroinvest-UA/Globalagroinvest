import type { Dictionary } from "./types";

/** Canonical dictionary — Ukrainian is the source language for everything
 *  in this app, including these hand-written UI strings. */
const uk: Dictionary = {
  nav: {
    products: "Продукція",
    about: "Про компанію",
    news: "Новини",
    contacts: "Контакти",
  },
  header: {
    ariaMainNav: "Основна навігація",
    ariaMobileNav: "Мобільна навігація",
    contactCta: "Зв'язатися з нами",
    openMenu: "Відкрити меню",
    closeMenu: "Закрити меню",
  },
  footer: {
    navHeading: "Навігація",
    productsHeading: "Продукція",
    contactsHeading: "Контакти",
    rightsReserved: "Усі права захищені.",
    translationNotice:
      "Ця сторінка перекладена автоматично з української мови.",
  },
  breadcrumbs: {
    ariaLabel: "Хлібні крихти",
    home: "Головна",
    products: "Продукція",
    about: "Про компанію",
    news: "Новини",
    contacts: "Контакти",
  },
  productsPage: {
    title: "Продукція",
    subtitle: "Оберіть напрямок, щоб переглянути асортимент.",
    emptyCatalog:
      "Каталог наразі порожній. Зв'яжіться з нами — підкажемо актуальний асортимент.",
  },
  productDetail: {
    ctaPriceAvailability: "Дізнатись ціну та наявність",
  },
  cards: {
    viewCategory: "Переглянути продукцію",
    learnMore: "Детальніше",
    readMore: "Читати далі",
  },
  productGrid: {
    emptyCategory:
      "У цій категорії поки немає продукції. Зв'яжіться з нами — підкажемо актуальний асортимент.",
  },
  homeSections: {
    businessDirectionsTitle: "Напрямки бізнесу",
  },
  newsPage: {
    title: "Новини",
    empty: "Новин поки немає.",
  },
  aboutPage: {
    advantagesTitleFallback: "Чому обирають нас",
  },
  contactsPage: {
    contactInfoHeading: "Контактна інформація",
    mapTitle: "Карта — місцезнаходження компанії",
    openInGoogleMaps: "Відкрити в Google Maps",
    formHeading: "Написати нам",
    formSubtitle: "Заповніть форму — ми зв'яжемося з вами найближчим часом.",
  },
  notFound: {
    metaTitle: "Сторінку не знайдено",
  },
  contactForm: {
    nameLabel: "Ім'я *",
    phoneLabel: "Телефон",
    emailLabel: "Email",
    messageLabel: "Повідомлення *",
    submit: "Надіслати повідомлення",
    submitting: "Надсилаємо…",
    successMessage:
      "Дякуємо! Ваше повідомлення надіслано — ми зв'яжемося з вами найближчим часом.",
    genericSubmitError: "Не вдалося надіслати повідомлення. Спробуйте, будь ласка, ще раз.",
    networkError: "Не вдалося з'єднатися з сервером. Перевірте інтернет-з'єднання та спробуйте ще раз.",
    validation: {
      nameRequired: "Введіть ваше ім'я",
      nameTooLong: "Ім'я закоротке для перевірки — максимум 100 символів",
      phoneTooLong: "Занадто довгий номер телефону",
      emailInvalid: "Некоректна адреса email",
      messageTooShort: "Опишіть запит трохи детальніше (мінімум 10 символів)",
      messageTooLong: "Повідомлення занадто довге — максимум 2000 символів",
      phoneOrEmailRequired: "Вкажіть телефон або email, щоб ми могли з вами зв'язатися",
    },
  },
  contactApi: {
    rateLimited: "Забагато запитів. Будь ласка, спробуйте ще раз через кілька хвилин.",
    malformedRequest: "Некоректний запит.",
    invalidFields: "Перевірте, будь ласка, поля форми.",
    serviceUnavailable:
      "Форма зворотного зв'язку тимчасово недоступна. Будь ласка, зв'яжіться з нами за телефоном або email, вказаними на сторінці «Контакти».",
    sendFailed: "Не вдалося надіслати повідомлення. Спробуйте, будь ласка, ще раз або зв'яжіться з нами напряму.",
    unexpectedError: "Сталася непередбачена помилка. Спробуйте, будь ласка, ще раз або зв'яжіться з нами напряму.",
  },
  languageSwitcher: {
    label: "Мова сайту",
  },
};

export default uk;
