"use client";

import Image from "next/image";
import { cubicBezier, motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useHydrated } from "@/lib/use-hydrated";

/** Fin de course douce : la photo se pose au lieu de s'arrêter net. */
const EASE = cubicBezier(0.33, 1, 0.68, 1);

/**
 * Photo de fond du pied de page, qui se resserre à mesure qu'on atteint le bas.
 *
 * L'échelle va de 1,25 à 1 sur la fenêtre qui précède l'arrivée en bas : la
 * photo semble reculer et se poser quand le pied de page prend toute sa place.
 * Un voile pétrole garde le texte lisible quelle que soit la zone de l'image.
 *
 * Isolé du pied de page (composant serveur) pour que seul ce fond embarque du
 * JavaScript côté client.
 */
export function FooterBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();

  // De « le haut du pied de page touche le bas de l'écran » à « son bas y touche ».
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.25, 1], { ease: EASE });

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div className="absolute inset-0" style={hydrated ? { scale } : undefined}>
        <Image
          src="/images/category-night.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-petrole/85" />
    </div>
  );
}
