import { PackageIcon } from "@sanity/icons/Package";
import { defineField, defineType } from "sanity";
import { isUniqueSlugAcrossCategoryAndProduct } from "../isUniqueSlug";

export const product = defineType({
  name: "product",
  title: "Продукт",
  type: "document",
  icon: PackageIcon,
  fields: [
    defineField({
      name: "title",
      title: "Назва продукту",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Адреса сторінки (slug)",
      description:
        "Формується автоматично з назви. Використовується в адресі /products/[slug] — не змінюйте після публікації, якщо на сторінку вже є посилання.",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: isUniqueSlugAcrossCategoryAndProduct,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Категорія",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "brand",
      title: "Бренд",
      description: "Необов'язково.",
      type: "reference",
      to: [{ type: "brand" }],
    }),
    defineField({
      name: "shortDescription",
      title: "Короткий опис",
      description: "Показується у картці продукту в каталозі.",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: "description",
      title: "Детальний опис",
      description: "Показується на сторінці продукту.",
      type: "array",
      of: [{ type: "block" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "characteristics",
      title: "Характеристики",
      description: "Наприклад: В'язкість — 10W-40, Об'єм — 20 л.",
      type: "array",
      of: [{ type: "characteristic" }],
    }),
    defineField({
      name: "images",
      title: "Зображення",
      description: "Перше зображення — головне (використовується в каталозі).",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt-текст", type: "string" }),
          ],
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "order",
      title: "Порядок показу в категорії",
      description: "Менше число — вище у списку.",
      type: "number",
      initialValue: 0,
      validation: (rule) => rule.required().integer(),
    }),
    defineField({
      name: "status",
      title: "Статус",
      description:
        "Архівовані продукти не показуються на сайті, але лишаються у CMS.",
      type: "string",
      options: {
        list: [
          { title: "Активний (показується на сайті)", value: "active" },
          { title: "Архівний (прихований)", value: "archived" },
        ],
        layout: "radio",
      },
      initialValue: "active",
      validation: (rule) => rule.required(),
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
    select: {
      title: "title",
      media: "images.0",
      category: "category.title",
      status: "status",
    },
    prepare({ title, media, category, status }) {
      return {
        title,
        media,
        subtitle: [category, status === "archived" ? "🗄 архів" : null]
          .filter(Boolean)
          .join(" · "),
      };
    },
  },
});
