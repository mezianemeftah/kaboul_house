import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Univers (catégorie)",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Nom",
      description: "Ex. Tapis, Toshak, Textiles, Art de la table, Fruits secs.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Adresse de la page (slug)",
      description: "Généré depuis le nom — ne pas changer une fois le site en ligne.",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "kicker",
      title: "Thème (surtitre)",
      description:
        "Un mot affiché au-dessus du nom, après le numéro : « Sol », « Assise », « Table »… Le numéro est calculé automatiquement selon l'ordre d'affichage.",
      type: "string",
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({
      name: "image",
      title: "Photo de couverture",
      description:
        "Sans photo, la carte affiche une tuile en dégradé portant son numéro — le site reste présentable en attendant.",
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
      name: "order",
      title: "Ordre d'affichage",
      description: "1 = premier. Ordonne les univers sur la page d'accueil.",
      type: "number",
      initialValue: 10,
    }),
  ],
  orderings: [
    { name: "orderAsc", title: "Ordre d'affichage", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", media: "image" },
  },
});
