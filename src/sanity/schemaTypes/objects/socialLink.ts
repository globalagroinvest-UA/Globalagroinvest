import { defineField, defineType } from "sanity";

export const socialLink = defineType({
  name: "socialLink",
  title: "Соцмережа / месенджер",
  type: "object",
  fields: [
    defineField({
      name: "platform",
      title: "Платформа",
      type: "string",
      options: {
        list: [
          { title: "Facebook", value: "facebook" },
          { title: "Instagram", value: "instagram" },
          { title: "LinkedIn", value: "linkedin" },
          { title: "YouTube", value: "youtube" },
          { title: "Telegram", value: "telegram" },
          { title: "Viber", value: "viber" },
          { title: "WhatsApp", value: "whatsapp" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "Посилання",
      type: "url",
      validation: (rule) =>
        rule.required().uri({ scheme: ["http", "https", "tel"] }),
    }),
  ],
  preview: {
    select: { title: "platform", subtitle: "url" },
  },
});
