import { TagIcon } from "@sanity/icons/Tag";
import { defineField, defineType } from "sanity";
import { isUniqueSlugAcrossCategoryAndProduct } from "../isUniqueSlug";

export const category = defineType({
  name: "category",
  title: "Категорія продукції",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Назва категорії",
      description: "Наприклад: «ПММ» або «Насіння»",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Адреса сторінки (slug)",
      description:
        "Формується автоматично з назви. Використовується в адресі /products/[slug] — не змінюйте після публікації сторінки, якщо на неї вже є посилання.",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: isUniqueSlugAcrossCategoryAndProduct,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Зображення категорії",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt-текст (опис зображення)",
          type: "string",
          description: "Для доступності та SEO. Наприклад: «Каністри моторного мастила».",
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Короткий опис",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: "order",
      title: "Порядок показу",
      description: "Менше число — вище на сторінці. Наприклад: 1, 2, 3.",
      type: "number",
      initialValue: 0,
      validation: (rule) => rule.required().integer(),
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  orderings: [
    {
      title: "За порядком показу",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", media: "image", subtitle: "slug.current" },
    prepare({ title, media, subtitle }) {
      return { title, media, subtitle: subtitle ? `/products/${subtitle}` : "" };
    },
  },
});
