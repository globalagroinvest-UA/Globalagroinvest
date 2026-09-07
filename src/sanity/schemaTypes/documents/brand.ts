import { StarIcon } from "@sanity/icons/Star";
import { defineField, defineType } from "sanity";

export const brand = defineType({
  name: "brand",
  title: "Бренд / партнер",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "name",
      title: "Назва бренду",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Логотип",
      description: "Бажано PNG/SVG з прозорим фоном.",
      type: "image",
      fields: [
        defineField({ name: "alt", title: "Alt-текст", type: "string" }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "Посилання на сайт бренду",
      description: "Необов'язково.",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: { title: "name", media: "logo" },
  },
});
