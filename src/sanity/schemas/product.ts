import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Produit",
  type: "document",
  // Les caractéristiques sont repliées par défaut : elles sont facultatives et
  // rarement toutes renseignées, la fiche reste ainsi lisible à la saisie.
  fieldsets: [
    {
      name: "specs",
      title: "Caractéristiques",
      description:
        "Facultatives. Chaque ligne remplie apparaît dans le tableau de la fiche ; les lignes vides disparaissent.",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Nom",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Adresse de la page (slug)",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Univers",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "images",
      title: "Photos",
      type: "array",
      of: [
        {
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
        },
      ],
      validation: (rule) => rule.min(1).error("Au moins une photo."),
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4 }),

    defineField({
      name: "origin",
      title: "Origine",
      description: "Ex. « Iran », « Afghanistan », « Turquie ».",
      type: "string",
      fieldset: "specs",
    }),
    defineField({
      name: "material",
      title: "Matière",
      description: "Ex. « Laine & coton », « 100% acrylique ».",
      type: "string",
      fieldset: "specs",
    }),
    defineField({
      name: "density",
      title: "Densité",
      description: "Ex. « 1200 shana · densité 3 600 », « Noué main ».",
      type: "string",
      fieldset: "specs",
    }),
    defineField({
      name: "style",
      title: "Style",
      description: "Ex. « Médaillon floral », « Chobi / Ziegler ».",
      type: "string",
      fieldset: "specs",
    }),
    defineField({
      name: "pile",
      title: "Velours",
      description: "Hauteur du poil. Ex. « 9 ±1 mm ».",
      type: "string",
      fieldset: "specs",
    }),
    defineField({
      name: "weave",
      title: "Tissage",
      description: "Ex. « Noué main », « Tissage mécanique haute densité ».",
      type: "string",
      fieldset: "specs",
    }),
    defineField({
      name: "sizes",
      title: "Tailles disponibles",
      description: "Séparées par « · ». Ex. « 300×400 · 250×350 · 200×300 cm ».",
      type: "string",
      fieldset: "specs",
    }),
    defineField({
      name: "care",
      title: "Entretien",
      type: "text",
      rows: 2,
      fieldset: "specs",
    }),
    // La mise en avant ne se décide plus ici : elle se choisit sur la page
    // d'accueil (« Nos coups de cœur »), où l'on voit d'un coup d'œil la
    // vitrine entière et où l'ordre se règle par glisser-déposer.
  ],
  preview: {
    select: { title: "title", subtitle: "category.title", media: "images.0" },
  },
});
