import { defineField, defineType } from "sanity";

export const cta = defineType({
  name: "cta",
  title: "Кнопка (CTA)",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Текст кнопки",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "Посилання",
      description:
        "Внутрішнє посилання (напр. /products або /contacts) або зовнішнє (напр. https://...).",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "style",
      title: "Вигляд кнопки",
      type: "string",
      options: {
        list: [
          { title: "Основна (заповнена)", value: "primary" },
          { title: "Другорядна (контур)", value: "secondary" },
        ],
        layout: "radio",
      },
      initialValue: "primary",
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});
