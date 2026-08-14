import type { ProductTag } from "@/lib/product-tags";

/**
 * Étiquette d'information sur une carte produit — origine, taille, prix.
 *
 * Volontairement distincte de `Pill` : une pastille est un lien ou un bouton, et
 * les cartes qui portent ces tags sont elles-mêmes des liens. Imbriquer un
 * `<a>` dans un `<a>` produirait un HTML invalide, que les navigateurs
 * réparent en cassant la carte. Un tag ne se clique pas, il se lit.
 *
 * Le prix se détache des autres : c'est la seule des trois informations qui
 * engage, les deux autres décrivent.
 */

const BASE =
  "inline-flex items-center rounded-pill border px-sp-2 py-[3px] text-xs font-light leading-none";

/** Sur blush — les cartes des listings et de la boutique. */
const SUR_CLAIR = {
  price: "border-grenat/40 text-grenat",
  autre: "border-encre/15 text-encre-douce",
};

/** Sur photo assombrie — le carrousel des coups de cœur. */
const SUR_SOMBRE = {
  price: "border-white/60 text-white",
  autre: "border-white/30 text-blush",
};

export type TagVariant = "onLight" | "onDark";

/**
 * Sous `sm`, la grille reste à deux colonnes sur un écran de 375 px : la carte
 * n'offre que 108 px de contenu, où deux tags passent systématiquement à la
 * ligne. Le second est donc masqué en CSS plutôt que rejeté sur une deuxième
 * ligne — le tri de `productTags` garantit que celui qui reste est le plus fort.
 *
 * Masquer plutôt que couper le rendu : le nombre de tags ne peut pas dépendre de
 * la largeur de l'écran côté serveur, qui l'ignore au moment du rendu.
 *
 * `max-sm:hidden` et non `hidden sm:inline-flex` : les deux sont des utilitaires
 * d'affichage de même spécificité, et c'est l'ordre dans la feuille de styles
 * qui tranche — `inline-flex` y passe après `hidden` et l'emporterait. Tailwind
 * émet les variantes après les utilitaires de base, ce qui lève l'ambiguïté.
 */
const MASQUE_SUR_MOBILE = "max-sm:hidden";

export function Tag({
  tag,
  variant,
  className = "",
}: {
  tag: ProductTag;
  variant: TagVariant;
  className?: string;
}) {
  const palette = variant === "onLight" ? SUR_CLAIR : SUR_SOMBRE;
  return (
    <span
      className={`${BASE} ${tag.kind === "price" ? palette.price : palette.autre} ${className}`}
    >
      {tag.label}
    </span>
  );
}

/**
 * La rangée de tags d'une carte. Ne rend rien du tout quand la fiche n'a aucune
 * information à montrer : une rangée vide laisserait un blanc qui déséquilibre
 * la grille d'une carte à l'autre.
 */
export function TagRow({ tags, variant }: { tags: ProductTag[]; variant: TagVariant }) {
  if (tags.length === 0) return null;
  return (
    <div className="mt-sp-2 flex flex-wrap gap-sp-1">
      {tags.map((tag, i) => (
        <Tag
          key={`${tag.kind}-${tag.label}`}
          tag={tag}
          variant={variant}
          className={i > 0 ? MASQUE_SUR_MOBILE : ""}
        />
      ))}
    </div>
  );
}
