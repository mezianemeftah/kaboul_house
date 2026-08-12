import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Réglages du site",
  type: "document",
  fields: [
    defineField({
      name: "whatsapp",
      title: "Numéro WhatsApp",
      description: "Format international, ex. +33 7 80 79 96 89 — utilisé par tous les boutons « Nous écrire ».",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "phone", title: "Téléphone (affiché)", type: "string" }),
    defineField({ name: "instagram", title: "Lien Instagram", type: "url" }),
    defineField({ name: "facebook", title: "Lien Facebook", type: "url" }),
    defineField({
      name: "googleReviewsUrl",
      title: "Lien vers la fiche Google (avis)",
      type: "url",
      description: "Lien « Voir tous les avis » affiché sous la section Avis Google.",
    }),
    defineField({
      name: "seoDescription",
      title: "Description SEO par défaut",
      description: "Une à deux phrases affichées dans les résultats Google.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "ogImage",
      title: "Image de partage (réseaux sociaux)",
      type: "image",
      fields: [
        defineField({
          name: "alt",
          title: "Texte alternatif",
          description: "Décrit la photo pour les lecteurs d'écran et Google (ex. « Tapis afghan rouge noué main »).",
          type: "string",
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Réglages du site" }) },
});
