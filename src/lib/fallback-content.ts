/**
 * Contenu de repli partagé — affiché tant que Sanity ne renvoie rien
 * (projet hors ligne, dataset vide). Une seule source de vérité pour la
 * page d'accueil et la boutique.
 */

export type FallbackCategory = {
  slug: string;
  kicker: string;
  title: string;
  description: string;
};

/** Les cinq univers, tant que Sanity n'en renvoie aucun. */
export const FALLBACK_CATEGORIES: FallbackCategory[] = [
  {
    slug: "tapis",
    kicker: "Sol",
    title: "Tapis & Qali",
    description: "Du noué main afghan aux grands formats turcs et persans.",
  },
  {
    slug: "toshak",
    kicker: "Assise",
    title: "Toshak & Majlis",
    description: "L'assise afghane traditionnelle : kabuli, 2 ou 3 baleshta.",
  },
  {
    slug: "textiles",
    kicker: "Intérieur",
    title: "Textiles & Décor",
    description: "Sarqalini, rojayi, balesht — pour habiller chaque pièce.",
  },
  {
    slug: "art-de-la-table",
    kicker: "Table",
    title: "Art de la Table",
    description: "Services dorés, plateaux, thermos. L'hospitalité dressée.",
  },
  {
    slug: "fruits-secs",
    kicker: "Saveurs",
    title: "Fruits Secs d'Afghanistan",
    description: "Amandes, pistaches, mûres — bio, et prêts à offrir.",
  },
];

export type FallbackProduct = {
  /** Clé de rendu stable, sans slug réel : ces pièces ne sont pas cliquables. */
  key: string;
  title: string;
  categoryTitle: string;
};

export const FALLBACK_PRODUCTS: FallbackProduct[] = [
  { key: "tapis-khal", title: "Tapis Khal Mohammadi", categoryTitle: "Tapis & Qali" },
  { key: "toshak", title: "Toshak kabuli brodé main", categoryTitle: "Toshak & Majlis" },
  { key: "plateau", title: "Plateau en cuivre martelé", categoryTitle: "Art de la Table" },
  { key: "pistaches", title: "Pistaches de Kandahar", categoryTitle: "Fruits Secs d'Afghanistan" },
  { key: "balesht", title: "Balesht brodé", categoryTitle: "Textiles & Décor" },
];

/** Dégradés de placeholder — variés pour que les cartes ne soient pas jumelles. */
export const PLACEHOLDER_GRADIENTS = [
  "bg-gradient-to-br from-grenat to-petrole",
  "bg-gradient-to-tr from-petrole to-grenat-vif",
  "bg-gradient-to-b from-grenat-vif to-grenat-profond",
  "bg-gradient-to-bl from-petrole-clair to-petrole",
  "bg-gradient-to-tl from-grenat-profond to-petrole",
];
