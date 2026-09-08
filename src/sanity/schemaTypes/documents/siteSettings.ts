import { CogIcon } from "@sanity/icons/Cog";
import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Налаштування сайту",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "companyName",
      title: "Назва компанії",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Логотип",
      description: "Бажано SVG або PNG з прозорим фоном.",
      type: "image",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "footerDescription",
      title: "Короткий опис у підвалі сайту",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: "phone",
      title: "Телефон",
      description: "У міжнародному форматі, напр. +380 44 123 45 67",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "address",
      title: "Адреса",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mapEmbedUrl",
      title: "Посилання для карти (Google Maps embed)",
      description:
        'Тільки посилання для ВСТАВКИ карти: Google Maps → Поділитися → вкладка "Вставити карту" → скопіювати URL з атрибута src (він виглядає як https://www.google.com/maps/embed?pb=...). ' +
        'Звичайне посилання "Надіслати посилання" (google.com/maps/place/... або coротке maps.app.goo.gl/...) сюди НЕ підходить — Google Maps блокує показ таких посилань у рамці на сайті, і замість карти буде показано помилку "відхилив запит на з\'єднання".',
      type: "url",
      validation: (rule) =>
        rule.uri({ scheme: ["https"] }).custom((value) => {
          if (!value) return true;
          const isEmbed = /^https:\/\/(www\.)?google\.com\/maps\/embed(\?|\/|$)/.test(value)
            || /[?&]output=embed(&|$)/.test(value);
          return isEmbed
            ? true
            : "Це не схоже на посилання для вставки карти. Скопіюйте URL саме з вкладки \"Вставити карту\" (Embed a map), інакше карта не відобразиться на сайті.";
        }),
    }),
    defineField({
      name: "workingHours",
      title: "Графік роботи",
      description: "Наприклад: «Пн–Пт: 8:00–18:00»",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "socialLinks",
      title: "Соцмережі та месенджери",
      type: "array",
      of: [{ type: "socialLink" }],
    }),
    defineField({
      name: "legalInfo",
      title: "Юридична інформація",
      description: "Напр. повна назва юрособи, код ЄДРПОУ — показується у підвалі.",
      type: "string",
    }),
    defineField({
      name: "seo",
      title: "SEO за замовчуванням",
      description: "Використовується на сторінках, де не задано власний SEO.",
      type: "seo",
    }),
  ],
  preview: {
    select: { title: "companyName", media: "logo" },
  },
});
