import { RocketIcon } from "@sanity/icons/Rocket";
import { defineField, defineType } from "sanity";

export const businessDirection = defineType({
  name: "businessDirection",
  title: "Напрямок бізнесу",
  type: "document",
  icon: RocketIcon,
  fields: [
    defineField({
      name: "title",
      title: "Заголовок",
      description: "Наприклад: «ПММ», «Насіння», «Інші рішення»",
      type: "string",
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
      name: "image",
      title: "Зображення",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt-текст", type: "string" }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cta",
      title: "Кнопка",
      description: "Куди веде картка напрямку, напр. /products/pmm",
      type: "cta",
    }),
  ],
  preview: {
    select: { title: "title", media: "image" },
  },
});
