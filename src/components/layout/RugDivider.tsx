import Image from "next/image";

/**
 * Tapis volant posé à cheval sur la limite haute du pied de page.
 *
 * Il occupe toute la largeur et n'est remonté que du tiers de sa hauteur :
 * l'essentiel de l'image reste dans la réserve de 200 px ménagée en haut du
 * pied de page, et seule sa pointe mord sur la section des avis — assez pour
 * effacer la coupure entre les deux blocs, pas assez pour la recouvrir.
 *
 * Purement décoratif, donc `aria-hidden` et insensible au pointeur pour ne pas
 * gêner les liens situés dessous.
 */
export function RugDivider() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 -translate-y-1/3" aria-hidden>
      <Image
        src="/images/tapis-volant.webp"
        alt=""
        width={1800}
        height={1005}
        sizes="100vw"
        className="w-full drop-shadow-[0_28px_45px_rgba(36,26,24,0.35)]"
      />
    </div>
  );
}
