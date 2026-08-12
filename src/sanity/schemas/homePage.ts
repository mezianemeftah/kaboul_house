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
      fields: [
        defineField({
          name: "alt",
          title: "Texte alternatif",
          description: "Décrit la photo pour les lecteurs d'écran et Google (ex. « Tapis afghan rouge noué main »).",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "aboutTitle",
      title: "Titre de la section « La maison »",
      type: "string",
      description: "Titre de la section qui présente Kaboul House sur l'accueil.",
    }),
    defineField({
      name: "aboutText",
      title: "Texte de la section « La maison »",
      type: "text",
      rows: 4,
      description:
        "Quelques phrases de présentation — le lien vers « Qui sommes-nous » est ajouté automatiquement.",
    }),
  ],
  preview: { prepare: () => ({ title: "Page d'accueil" }) },
});
