/**
 * Les deux ou trois informations qu'une carte produit affiche sous son nom.
 *
 * Une carte de listing n'a la place que d'un ou deux tags : ils sont donc
 * choisis, pas déversés. L'ordre est celui de ce qui décide du clic — le prix
 * d'abord, l'origine ensuite (c'est elle qui fait l'authenticité d'un tapis), la
 * taille en dernier (elle rassure celui qui mesure son salon).
 *
 * Le catalogue vient d'un import depuis l'ancien site : les champs sont remplis
 * de façon inégale et parfois détournés de leur sens. Chaque règle ci-dessous
 * répond à un cas réel du catalogue, et toutes suivent le même principe :
 * **mieux vaut aucun tag qu'un tag faux ou qui déborde.**
 */

export type ProductTagKind = "price" | "origin" | "size";

export type ProductTag = {
  label: string;
  kind: ProductTagKind;
};

export type ProductTagSource = {
  price?: string | null;
  origin?: string | null;
  sizes?: string | null;
};

/**
 * Les seules origines à afficher. Le champ « Origine » est rempli sur les 56
 * fiches, mais vingt-et-une y portent une famille de produits (« Art de la
 * table ») ou un fournisseur (« Roy Farshi ») : les annoncer comme provenance
 * serait faux. La liste blanche est volontairement fermée — une nouvelle
 * origine s'ajoute ici, en connaissance de cause.
 */
const ORIGINES = ["Iran", "Afghanistan", "Turquie"] as const;

/** Au-delà, le tag passe à la ligne et casse la carte. */
const LONGUEUR_MAX_TAILLE = 20;

/** Séparateur des valeurs composées, tel que saisi dans le back-office. */
const SEPARATEUR = "·";

function nettoyer(valeur: string | null | undefined): string {
  return (valeur ?? "").trim();
}

/**
 * Le pays, s'il en est un. Il se trouve en tête des valeurs composées
 * (« Afghanistan · Bio », « Iran · Persan ») et la casse varie d'une saisie à
 * l'autre, d'où la comparaison insensible et le renvoi de la forme canonique.
 */
function origine(valeur: string): ProductTag | null {
  const tete = valeur.split(SEPARATEUR)[0]!.trim().toLowerCase();
  const pays = ORIGINES.find((o) => o.toLowerCase() === tete);
  return pays ? { label: pays, kind: "origin" } : null;
}

/**
 * La taille, réduite à ce qui tient dans un tag.
 *
 * Trois formes cohabitent dans le catalogue : une dimension unique
 * (« ≈ 300 × 200 cm »), une liste de dimensions au choix (cinq pour les tapis
 * mécaniques) et une mention libre (« Au mètre, sur-mesure (rouleau) »).
 *
 * Une liste est résumée par son nombre : cinq dimensions ne tiennent pas, et
 * « 5 tailles » dit ce qui compte pour l'acheteur. Encore faut-il que ce soient
 * bien des dimensions au choix — « 26 · 25 · 42 cm » énumère les pièces d'un
 * service, et « 3 tailles » y serait un contresens. On exige donc qu'au moins un
 * segment ressemble à une paire largeur × hauteur.
 */
function taille(valeur: string): ProductTag | null {
  // L'approximation du catalogue n'apporte rien dans un tag de deux mots.
  const sansApprox = valeur.replace(/^[≈~]\s*/, "").trim();

  const segments = sansApprox
    .split(SEPARATEUR)
    .map((s) => s.trim())
    .filter(Boolean);

  if (segments.length > 1) {
    const dimensions = /\d+\s*[×x]\s*\d+/;
    if (!segments.some((s) => dimensions.test(s))) return null;
    return { label: `${segments.length} tailles`, kind: "size" };
  }

  // « Au mètre, sur-mesure (rouleau) » → « Au mètre » : la précision qui suit la
  // virgule appartient à la fiche produit, pas à la carte.
  const court = segments[0]?.split(",")[0]!.trim();
  if (!court || court.length > LONGUEUR_MAX_TAILLE) return null;
  return { label: court, kind: "size" };
}

/**
 * Le prix, sauf quand il est « sur demande ».
 *
 * Le schéma demande de laisser le champ vide dans ce cas, mais rien n'empêche de
 * saisir la mention : on la filtre ici plutôt que de laisser trente-huit cartes
 * répéter la même phrase creuse.
 *
 * « / pièce » est retiré, « / m² » conservé : le premier est l'unité par défaut
 * d'un tapis et ne distingue rien, le second dit qu'on vend au mètre. Sur une
 * carte de 108 px, la mention inutile coûte la moitié de la largeur du tag.
 */
const UNITE_MUETTE = /\s*\/\s*pi[eè]ce\s*$/i;

function prix(valeur: string): ProductTag | null {
  if (/sur\s+demande/i.test(valeur)) return null;
  return { label: valeur.replace(UNITE_MUETTE, ""), kind: "price" };
}

/**
 * Les tags d'une fiche, dans l'ordre d'affichage et plafonnés à `max`.
 *
 * Le plafond est un argument parce qu'il dépend du bloc : deux sur les listings,
 * un seul sur le carrousel des coups de cœur, où la carte est plus petite et
 * porte déjà le nom de l'univers.
 */
export function productTags(source: ProductTagSource, max = 2): ProductTag[] {
  const candidats = [
    { valeur: nettoyer(source.price), lire: prix },
    { valeur: nettoyer(source.origin), lire: origine },
    { valeur: nettoyer(source.sizes), lire: taille },
  ];

  const tags: ProductTag[] = [];
  for (const { valeur, lire } of candidats) {
    if (tags.length >= max) break;
    if (!valeur) continue;
    const tag = lire(valeur);
    if (tag) tags.push(tag);
  }
  return tags;
}
