"use client";

import Image from "next/image";
import { cubicBezier, motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useHydrated } from "@/lib/use-hydrated";

/** Glisse posée : le tapis ralentit en fin de course au lieu de s'arrêter net. */
const EASE = cubicBezier(0.33, 1, 0.68, 1);

/**
 * Tapis volant posé à cheval sur la limite haute du pied de page.
 *
 * Il occupe toute la largeur et n'est remonté que du tiers de sa hauteur :
 * l'essentiel de l'image reste dans la réserve de 200 px ménagée en haut du
 * pied de page, et seule sa pointe mord sur la section des avis — assez pour
 * effacer la coupure entre les deux blocs, pas assez pour la recouvrir.
 *
 * Au défilement il dérive doucement — 48 px de haut en bas, avec une bascule
 * de 1,5° — pour qu'il paraisse flotter plutôt que collé au fond. Le mouvement
 * suit le geste de l'utilisateur, il ne se déclenche pas seul.
 *
 * Purement décoratif, donc `aria-hidden` et insensible au pointeur pour ne pas
 * gêner les liens situés dessous.
 */
export function RugDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();

  // Toute la traversée : de l'entrée du tapis en bas de l'écran à sa sortie en haut.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [24, -24], { ease: EASE });
  const rotate = useTransform(scrollYProgress, [0, 1], [1.5, -1.5], { ease: EASE });

  return (
    // `overflow-x-clip` : la bascule élargit la boîte de l'image de quelques
    // pixels et ouvrait une barre de défilement horizontale. Contrairement à
    // `hidden`, `clip` sur un seul axe laisse l'autre déborder — le tapis peut
    // donc toujours remonter au-dessus du pied de page.
    <div
      ref={ref}
      className="pointer-events-none absolute inset-x-0 top-0 z-10 -translate-y-1/3 overflow-x-clip"
      aria-hidden
    >
      <motion.div style={hydrated ? { y, rotate } : undefined}>
        <Image
          src="/images/tapis-volant.webp"
          alt=""
          width={1800}
          height={1005}
          sizes="100vw"
          className="w-full drop-shadow-[0_28px_45px_rgba(36,26,24,0.35)]"
        />
      </motion.div>
    </div>
  );
}
