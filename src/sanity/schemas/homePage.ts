import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Page d'accueil",
  type: "document",
  fields: [
    defineField({
      name: "heroTitle",
      title: "Titre du hero",
      description: "Le grand titre sur la photo, ex. « Cinq mondes, une même grande maison. »",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroSubtitle",
      title: "Sous-titre du hero",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "heroImage",
      title: "Photo du hero",
      description: "Photo plein écran derrière le titre. Sans photo, l'image par défaut est utilisée.",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: { prepare: () => ({ title: "Page d'accueil" }) },
});
