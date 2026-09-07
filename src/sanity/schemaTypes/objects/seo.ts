import { defineField, defineType } from "sanity";

/**
 * Reusable SEO fields, embedded into every page-level document.
 * Kept intentionally small: a manager should never need to touch these
 * unless they specifically want to improve how a page looks in search
 * results or when shared on social media.
 */
export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "metaTitle",
      title: "Title для пошукових систем",
      description:
        "Показується як заголовок вкладки браузера та посилання в Google. Якщо порожньо — використовується заголовок сторінки.",
      type: "string",
      validation: (rule) => rule.max(70).warning("Оптимально до 60–70 символів"),
    }),
    defineField({
      name: "metaDescription",
      title: "Опис для пошукових систем",
      description: "Короткий опис, який Google показує під посиланням на сторінку.",
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule.max(160).warning("Оптимально до 160 символів"),
    }),
    defineField({
      name: "ogImage",
      title: "Зображення для соцмереж (Open Graph)",
      description:
        "Показується при поширенні посилання в Facebook, Telegram, Viber тощо. Рекомендований розмір 1200×630px.",
      type: "image",
      options: { hotspot: true },
    }),
  ],
});
