import { defineField, defineType } from "sanity";

export const characteristic = defineType({
  name: "characteristic",
  title: "Характеристика",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Назва",
      description: "Наприклад: «В'язкість», «Клас насіння», «Об'єм тари»",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "value",
      title: "Значення",
      description: "Наприклад: «10W-40», «Еліта», «20 л»",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "value" },
  },
});
