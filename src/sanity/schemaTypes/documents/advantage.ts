import { SparklesIcon } from "@sanity/icons/Sparkles";
import { defineField, defineType } from "sanity";

export const advantage = defineType({
  name: "advantage",
  title: "Перевага компанії",
  type: "document",
  icon: SparklesIcon,
  fields: [
    defineField({
      name: "title",
      title: "Заголовок",
      description: "Наприклад: «Надійні постачання»",
      type: "string",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "description",
      title: "Опис",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(200),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
});
