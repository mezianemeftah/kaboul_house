import { defineField, defineType } from "sanity";

export const googleReview = defineType({
  name: "googleReview",
  title: "Avis Google",
  type: "document",
  description: "Recopier ici de vrais avis Google — jamais d'avis inventés.",
  fields: [
    defineField({
      name: "author",
      title: "Nom du client",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "rating",
      title: "Note (1 à 5)",
      type: "number",
      validation: (rule) => rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: "text",
      title: "Texte de l'avis",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "author", subtitle: "text" },
  },
});
