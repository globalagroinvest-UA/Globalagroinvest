import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { defineField, defineType } from "sanity";

export const contactsPage = defineType({
  name: "contactsPage",
  title: "Сторінка «Контакти»",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "title",
      title: "Заголовок сторінки",
      type: "string",
      initialValue: "Контакти",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Вступний текст",
      description:
        "Телефон, email, адреса й графік роботи беруться з «Налаштувань сайту» — тут лише короткий вступ.",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    prepare: () => ({ title: "Контакти" }),
  },
});
