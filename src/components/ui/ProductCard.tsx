import Image from "next/image";
import Link from "next/link";
import { PLACEHOLDER_GRADIENTS } from "@/lib/fallback-content";

export type ProductCardItem = {
  key: string;
  title: string;
  categoryTitle: string | null;
  /** `null` pour les pièces de repli : elles n'ont pas de fiche à ouvrir. */
  slug: string | null;
  src: string | null;
  alt: string;
};

/**
 * Carte produit partagée par la boutique et les pages d'univers.
 *
 * Sans photo, la tuile tombe sur un dégradé portant l'initiale de la pièce —
 * `index` sert à varier ce dégradé pour que les cartes voisines ne soient pas
 * jumelles.
 */
export function ProductCard({ item, index }: { item: ProductCardItem; index: number }) {
  const contenu = (
    <>
      <div className="relative aspect-[4/5] overflow-hidden">
        {item.src ? (
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            style={{ transitionTimingFunction: "var(--ease-signature)" }}
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center transition-transform duration-500 group-hover:scale-[1.04] ${
              PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length]
            }`}
            style={{ transitionTimingFunction: "var(--ease-signature)" }}
            aria-hidden
          >
            <span className="font-bonny text-6xl font-thin text-creme/30">
              {item.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div className="p-sp-4">
        <h2 className="font-bonny text-xl font-medium leading-tight text-encre md:text-2xl">
          {item.title}
        </h2>
        {item.categoryTitle && (
          <p className="mt-sp-1 text-sm font-light text-encre-douce">{item.categoryTitle}</p>
        )}
      </div>
    </>
  );

  const habillage =
    "group overflow-hidden rounded-panel bg-blush-2 transition-shadow duration-500 hover:shadow-lg hover:shadow-grenat/10";
  const easing = { transitionTimingFunction: "var(--ease-signature)" };

  if (item.slug) {
    return (
      <Link href={`/produit/${item.slug}`} className={habillage} style={easing}>
        {contenu}
      </Link>
    );
  }
  return (
    <div className={habillage} style={easing}>
      {contenu}
    </div>
  );
}
