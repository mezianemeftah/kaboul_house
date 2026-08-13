import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Champ « texte alternatif » répété sur chaque image de la page. Décrit la
 * photo pour les lecteurs d'écran et pour Google.
 */
const alt = (exemple: string) =>
  defineField({
    name: "alt",
    title: "Texte alternatif",
    description: `Décrit la photo pour les lecteurs d'écran et Google (ex. « ${exemple} »).`,
    type: "string",
  });

/**
 * Page d'accueil — un champ par contenu affiché.
 *
 * Les champs sont plats et répartis en groupes (les onglets du Studio), dans
 * l'ordre où les sections se suivent sur le site. Plats et non imbriqués dans
 * un objet par section : cela évite un niveau de repli dans l'interface, et
 * surtout cela préserve les champs déjà publiés (heroTitle, heroSubtitle,
 * aboutTitle, aboutText) — aucune migration de données n'est nécessaire.
 *
 * Les listes (univers, boutiques, avis) ne se saisissent pas ici : elles
 * remontent automatiquement des fiches correspondantes. Seuls les « coups de
 * cœur » se choisissent, parce que c'est une vitrine et non un inventaire.
 */
export const homePage = defineType({
  name: "homePage",
  title: "Page d'accueil",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "univers", title: "Nos univers" },
    { name: "video", title: "Bloc vidéo" },
    { name: "maison", title: "La maison" },
    { name: "coupsDeCoeur", title: "Nos coups de cœur" },
    { name: "boutiques", title: "Nous trouver" },
    { name: "avis", title: "Avis Google" },
    { name: "seo", title: "Référencement" },
  ],
  fields: [
    // ---------------------------------------------------------------- Hero
    defineField({
      name: "heroTitle",
      title: "Titre",
      description: "Le grand titre sur la photo plein écran, tout en haut du site.",
      type: "string",
      group: "hero",
      initialValue: "L'Orient entre sous votre toit.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroSubtitle",
      title: "Sous-titre",
      description: "La phrase sous le grand titre.",
      type: "text",
      rows: 2,
      group: "hero",
      initialValue:
        "Tapis noués main, toshak, textiles, art de la table et fruits secs — de Kaboul jusqu'au cœur de Grenoble et de Lyon.",
    }),
    defineField({
      name: "heroImage",
      title: "Photo de fond",
      description: "Photo plein écran derrière le titre. Sans photo, l'image par défaut est utilisée.",
      type: "image",
      options: { hotspot: true },
      group: "hero",
      fields: [alt("Tapis afghan rouge noué main")],
    }),
    defineField({
      name: "heroCtaLabel",
      title: "Libellé du bouton",
      type: "string",
      group: "hero",
      initialValue: "Découvrir la boutique",
    }),
    defineField({
      name: "heroCtaHref",
      title: "Lien du bouton",
      description: "Adresse d'une page du site, ex. « /boutique » ou « /tapis ».",
      type: "string",
      group: "hero",
      initialValue: "/boutique",
    }),

    // --------------------------------------------------------- Nos univers
    defineField({
      name: "universKicker",
      title: "Surtitre",
      description: "Le petit texte au-dessus du titre, précédé du croissant.",
      type: "string",
      group: "univers",
      initialValue: "Nos univers",
    }),
    defineField({
      name: "universTitle",
      title: "Titre",
      description:
        "Titre du bloc. Les univers affichés en dessous ne se saisissent pas ici : ce sont ceux créés dans « Univers », rangés selon leur ordre d'affichage.",
      type: "string",
      group: "univers",
      initialValue: "Cinq mondes, une même maison",
    }),
    defineField({
      name: "universIntro",
      title: "Chapeau",
      description: "Le paragraphe d'introduction, sous le titre.",
      type: "text",
      rows: 3,
      group: "univers",
      initialValue:
        "Du tapis sous vos pieds à l'assiette de votre invité, chaque pièce raconte l'hospitalité orientale. Choisissez par où commencer.",
    }),
    defineField({
      name: "universLinkLabel",
      title: "Libellé du lien des cartes",
      description: "Le mot cliquable en bas de chaque univers, suivi de la flèche.",
      type: "string",
      group: "univers",
      initialValue: "Voir",
    }),

    // ---------------------------------------------------------- Bloc vidéo
    defineField({
      name: "videoFile",
      title: "Vidéo de fond",
      description:
        "Vidéo courte et compressée, 5 Mo maximum — elle se charge sur tous les visiteurs. Sans fichier, la vidéo par défaut du site est utilisée.",
      type: "file",
      options: { accept: "video/mp4" },
      group: "video",
    }),
    defineField({
      name: "videoPoster",
      title: "Image d'attente",
      description: "Affichée le temps que la vidéo se charge.",
      type: "image",
      options: { hotspot: true },
      group: "video",
      fields: [alt("Silhouettes réunies sur un tapis au lever du soleil")],
    }),
    defineField({
      name: "videoTitle",
      title: "Titre",
      type: "string",
      group: "video",
      initialValue: "Une pièce vous fait de l'œil ?",
    }),
    defineField({
      name: "videoText",
      title: "Description",
      type: "text",
      rows: 3,
      group: "video",
      initialValue:
        "Écrivez-nous sur WhatsApp : photos, dimensions, conseils, mise de côté — on s'occupe de tout.",
    }),
    defineField({
      name: "videoCtaLabel",
      title: "Libellé du bouton",
      description:
        "Le numéro WhatsApp vers lequel il pointe se règle dans « Réglages du site ».",
      type: "string",
      group: "video",
      initialValue: "Nous écrire sur WhatsApp",
    }),

    // ---------------------------------------------------------- La maison
    defineField({
      name: "aboutKicker",
      title: "Surtitre",
      type: "string",
      group: "maison",
      initialValue: "La maison",
    }),
    defineField({
      name: "aboutTitle",
      title: "Titre",
      type: "string",
      group: "maison",
      initialValue: "Kaboul House, une histoire de famille",
    }),
    defineField({
      name: "aboutText",
      title: "Texte",
      description: "Quelques phrases de présentation de la maison.",
      type: "text",
      rows: 6,
      group: "maison",
      initialValue:
        "Depuis Kaboul jusqu'aux rives de l'Isère, Kaboul House rassemble ce que l'Orient fait de plus beau : des tapis qui traversent les générations, des objets qui réchauffent la maison, des saveurs qui racontent un pays. Chaque pièce est choisie par nos soins, auprès des artisans et des familles qui perpétuent ces savoir-faire.",
    }),
    defineField({
      name: "aboutImageLarge",
      title: "Grande photo",
      description: "La photo verticale, à gauche du texte.",
      type: "image",
      options: { hotspot: true },
      group: "maison",
      fields: [alt("Tapis d'Orient déroulé dans une cour au crépuscule")],
    }),
    defineField({
      name: "aboutImageSmall",
      title: "Petite photo",
      description: "La photo carrée, décalée sous la grande.",
      type: "image",
      options: { hotspot: true },
      group: "maison",
      fields: [alt("Silhouettes réunies sur un tapis au lever du soleil")],
    }),

    // --------------------------------------------------- Nos coups de cœur
    defineField({
      name: "featuredKicker",
      title: "Surtitre",
      type: "string",
      group: "coupsDeCoeur",
      initialValue: "Nos coups de cœur",
    }),
    defineField({
      name: "featuredTitle",
      title: "Titre",
      type: "string",
      group: "coupsDeCoeur",
      initialValue: "Cinq pièces qui font la maison",
    }),
    defineField({
      name: "featuredProducts",
      title: "Produits mis en avant",
      description:
        "Choisissez les pièces à montrer dans le carrousel, et rangez-les par glisser-déposer. Leur photo, leur nom et leur univers viennent de la fiche produit : les modifier là-bas les met à jour partout.",
      type: "array",
      group: "coupsDeCoeur",
      of: [defineArrayMember({ type: "reference", to: [{ type: "product" }] })],
      options: { layout: "grid" },
      validation: (rule) => rule.unique().max(12),
    }),

    // ------------------------------------------------------- Nous trouver
    defineField({
      name: "shopsKicker",
      title: "Surtitre",
      type: "string",
      group: "boutiques",
      initialValue: "Nous trouver",
    }),
    defineField({
      name: "shopsTitle",
      title: "Titre",
      description:
        "Titre du bloc. Les boutiques affichées en dessous ne se saisissent pas ici : ce sont celles créées dans « Boutiques », rangées selon leur ordre d'affichage.",
      type: "string",
      group: "boutiques",
      initialValue: "Deux adresses, une même maison",
    }),
    defineField({
      name: "shopsEmptyText",
      title: "Message d'une boutique sans coordonnées",
      description:
        "Affiché à la place du relevé quand une boutique n'a ni téléphone, ni email, ni horaires, ni itinéraire.",
      type: "text",
      rows: 2,
      group: "boutiques",
      initialValue: "Ouverture prochaine — écrivez-nous sur WhatsApp pour être prévenus.",
    }),

    // -------------------------------------------------------- Avis Google
    defineField({
      name: "reviewsKicker",
      title: "Surtitre",
      type: "string",
      group: "avis",
      initialValue: "Avis Google",
    }),
    defineField({
      name: "reviewsTitle",
      title: "Titre",
      description:
        "Titre du bloc. Les avis affichés en dessous ne se saisissent pas ici : ce sont ceux créés dans « Avis Google », du plus récent au plus ancien.",
      type: "string",
      group: "avis",
      initialValue: "Ils ont poussé la porte",
    }),
    defineField({
      name: "reviewsEmptyText",
      title: "Message quand aucun avis n'est publié",
      type: "text",
      rows: 2,
      group: "avis",
      initialValue: "Les avis de nos clients apparaîtront ici très bientôt.",
    }),
    defineField({
      name: "reviewsLinkLabel",
      title: "Libellé du lien vers la fiche Google",
      description:
        "L'adresse de la fiche se règle dans « Réglages du site ». La flèche est ajoutée automatiquement.",
      type: "string",
      group: "avis",
      initialValue: "Voir notre fiche Google",
    }),

    // ------------------------------------------------------ Référencement
    defineField({
      name: "seoTitle",
      title: "Titre dans Google",
      description:
        "Le titre affiché dans les résultats de recherche et l'onglet du navigateur. Environ 60 caractères. Vide, le titre par défaut du site est utilisé.",
      type: "string",
      group: "seo",
      validation: (rule) => rule.max(70).warning("Au-delà de 70 caractères, Google coupe le titre."),
    }),
    defineField({
      name: "seoDescription",
      title: "Description dans Google",
      description:
        "Le paragraphe sous le titre dans les résultats de recherche. Environ 155 caractères.",
      type: "text",
      rows: 3,
      group: "seo",
      validation: (rule) =>
        rule.max(170).warning("Au-delà de 170 caractères, Google coupe la description."),
    }),
  ],
  preview: { prepare: () => ({ title: "Page d'accueil" }) },
});
