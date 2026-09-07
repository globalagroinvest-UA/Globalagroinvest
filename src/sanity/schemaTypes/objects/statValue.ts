import { defineField, defineType } from "sanity";

export const statValue = defineType({
  name: "statValue",
  title: "Показник",
  type: "object",
  fields: [
    defineField({
      name: "value",
      title: "Значення",
      description: "Наприклад: 15, 500, 24",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "suffix",
      title: "Суфікс",
      description: "Наприклад: «+», «%», «регіонів»",
      type: "string",
    }),
    defineField({
      name: "label",
      title: "Підпис",
      description: "Наприклад: «років на ринку»",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { value: "value", suffix: "suffix", label: "label" },
    prepare({ value, suffix, label }) {
      return {
        title: `${value ?? ""}${suffix ?? ""}`,
        subtitle: label,
      };
    },
  },
});
