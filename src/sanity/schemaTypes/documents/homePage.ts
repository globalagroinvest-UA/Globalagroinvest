import { HomeIcon } from "@sanity/icons/Home";
import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Головна сторінка",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "hero", title: "Hero" },
    { name: "intro", title: "Про компанію" },
    { name: "directions", title: "Напрямки" },
    { name: "advantages", title: "Переваги" },
    { name: "stats", title: "Статистика" },
    { name: "brands", title: "Бренди" },
    { name: "cta", title: "Фінальний CTA" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // --- Hero ---------------------------------------------------------
    defineField({
      name: "heroTitle",
      title: "Заголовок",
      type: "string",
      group: "hero",
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: "heroSubtitle",
      title: "Підзаголовок",
      type: "text",
      rows: 2,
      group: "hero",
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: "heroImage",
      title: "Фонове зображення",
      type: "image",
      options: { hotspot: true },
      group: "hero",
      fields: [
        defineField({ name: "alt", title: "Alt-текст", type: "string" }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroCtaPrimary",
      title: "Основна кнопка",
      type: "cta",
      group: "hero",
    }),
    defineField({
      name: "heroCtaSecondary",
      title: "Другорядна кнопка",
      type: "cta",
      group: "hero",
    }),

    // --- Company intro --------------------------------------------------
    defineField({
      name: "introTitle",
      title: "Заголовок",
      type: "string",
      group: "intro",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "introText",
      title: "Текст",
      type: "text",
      rows: 5,
      group: "intro",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "introImage",
      title: "Зображення",
      type: "image",
      options: { hotspot: true },
      group: "intro",
      fields: [
        defineField({ name: "alt", title: "Alt-текст", type: "string" }),
      ],
      validation: (rule) => rule.required(),
    }),

    // --- Business directions --------------------------------------------
    defineField({
      name: "businessDirections",
      title: "Напрямки бізнесу",
      description:
        "Оберіть і впорядкуйте (перетягуванням) напрямки, показані на головній.",
      type: "array",
      group: "directions",
      of: [{ type: "reference", to: [{ type: "businessDirection" }] }],
      validation: (rule) => rule.required().min(1),
    }),

    // --- Advantages -------------------------------------------------------
    defineField({
      name: "advantagesTitle",
      title: "Заголовок секції",
      type: "string",
      group: "advantages",
      initialValue: "Чому обирають нас",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "advantages",
      title: "Переваги",
      description: "Оберіть і впорядкуйте (перетягуванням) 4–6 переваг.",
      type: "array",
      group: "advantages",
      of: [{ type: "reference", to: [{ type: "advantage" }] }],
      validation: (rule) => rule.required().min(1),
    }),

    // --- Stats ------------------------------------------------------------
    defineField({
      name: "stats",
      title: "Статистика / показники довіри",
      type: "array",
      group: "stats",
      of: [{ type: "statValue" }],
      validation: (rule) => rule.required().min(1),
    }),

    // --- Brands -------------------------------------------------------
    defineField({
      name: "brandsSectionTitle",
      title: "Заголовок секції брендів",
      type: "string",
      group: "brands",
      initialValue: "Нам довіряють провідні бренди",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "brands",
      title: "Бренди / партнери",
      description: "Оберіть і впорядкуйте (перетягуванням) логотипи.",
      type: "array",
      group: "brands",
      of: [{ type: "reference", to: [{ type: "brand" }] }],
      validation: (rule) => rule.required().min(1),
    }),

    // --- Final CTA ----------------------------------------------------
    defineField({
      name: "finalCtaTitle",
      title: "Заголовок",
      type: "string",
      group: "cta",
      initialValue: "Потрібна консультація?",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "finalCtaText",
      title: "Текст",
      type: "text",
      rows: 2,
      group: "cta",
      initialValue: "Зв'яжіться з нашим менеджером.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "finalCtaButton",
      title: "Кнопка",
      type: "cta",
      group: "cta",
      validation: (rule) => rule.required(),
    }),

    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: {
    prepare: () => ({ title: "Головна сторінка" }),
  },
});
