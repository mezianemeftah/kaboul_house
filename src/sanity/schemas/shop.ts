import { defineField, defineType } from "sanity";

export const shop = defineType({
  name: "shop",
  title: "Boutique",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nom",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "address",
      title: "Adresse",
      description: "Adresse complète. Pour la 2e boutique, laisser « Adresse à venir » en attendant.",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "phone", title: "Téléphone", type: "string" }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      description: "Adresse email de contact de la boutique.",
    }),
    defineField({
      name: "mapsUrl",
      title: "Lien itinéraire (Google Maps)",
      type: "url",
      description: "Coller le lien de partage Google Maps de la boutique.",
    }),
    defineField({
      name: "mapEmbed",
      title: "Carte à intégrer",
      description:
        "Sur Google Maps : zoomer sur la boutique, puis Partager → Intégrer une carte → Copier le HTML, et coller le bloc entier ici. Le cadrage affiché sur le site est celui de la carte au moment de la copie. Sans ça, la carte n'apparaît pas.",
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule.custom((valeur) => {
          if (!valeur) return true;
          return /src=["']?https:\/\/www\.google\.com\/maps\/embed\?/.test(valeur)
            ? true
            : "Coller le bloc <iframe> fourni par « Intégrer une carte » de Google Maps.";
        }),
    }),
    defineField({
      name: "hours",
      title: "Horaires",
      description: "Texte libre, ex. « Lun–Sam : 10h–19h ».",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "image",
      title: "Photo",
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
    defineField({ name: "order", title: "Ordre d'affichage", type: "number", initialValue: 10 }),
  ],
  preview: {
    select: { title: "name", media: "image" },
  },
});
