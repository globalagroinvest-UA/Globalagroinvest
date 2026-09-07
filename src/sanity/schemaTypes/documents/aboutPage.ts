import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "Сторінка «Про компанію»",
  type: "document",
  icon: InfoOutlineIcon,
  groups: [
    { name: "content", title: "Контент" },
    { name: "advantages", title: "Переваги" },
    { name: "stats", title: "Статистика" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Заголовок сторінки",
      type: "string",
      group: "content",
      initialValue: "Про компанію",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Вступний текст",
      description: "Великий вступний абзац одразу під заголовком.",
      type: "text",
      rows: 4,
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Основний текст",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mainImage",
      title: "Головне зображення",
      type: "image",
      options: { hotspot: true },
      group: "content",
      fields: [
        defineField({ name: "alt", title: "Alt-текст", type: "string" }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "advantagesTitle",
      title: "Заголовок секції переваг",
      type: "string",
      group: "advantages",
      initialValue: "Чому обирають нас",
    }),
    defineField({
      name: "advantages",
      title: "Переваги",
      description: "Необов'язково — можна лишити порожнім.",
      type: "array",
      group: "advantages",
      of: [{ type: "reference", to: [{ type: "advantage" }] }],
    }),
    defineField({
      name: "stats",
      title: "Статистика / показники довіри",
      description: "Необов'язково — можна лишити порожнім.",
      type: "array",
      group: "stats",
      of: [{ type: "statValue" }],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: {
    prepare: () => ({ title: "Про компанію" }),
  },
});
