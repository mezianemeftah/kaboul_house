import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Produit",
  type: "document",
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
    // La mise en avant ne se décide plus ici : elle se choisit sur la page
    // d'accueil (« Nos coups de cœur »), où l'on voit d'un coup d'œil la
    // vitrine entière et où l'ordre se règle par glisser-déposer.
  ],
  preview: {
    select: { title: "title", subtitle: "category.title", media: "images.0" },
  },
});
