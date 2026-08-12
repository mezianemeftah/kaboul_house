"use client";

import { motion } from "motion/react";

const NBSP = " ";

/**
 * Le masque `overflow-hidden` de chaque mot gagne 0.18em sous la ligne de base
 * (`pb-[0.18em]`) pour laisser passer les jambages — le « g » de « grande » —
 * que `leading-[.9]` faisait rogner ; la marge négative jumelle annule ce gain
 * dans le flux, le rythme vertical du titre reste donc identique. Le mot part
 * de 1.08em (0.9em de ligne + 0.18em de padding) pour rester hors du masque
 * agrandi au premier frame de la révélation.
 *
 * Mesuré dans le navigateur : le masque offre 0.297em sous la ligne de base,
 * le « g » de Bonny en descend 0.222em — il reste 0.074em de marge, de quoi
 * encaisser un jambage plus profond (« j », « Q ») venu de Sanity.
 */
export function HeroTitle({ title }: { title: string }) {
  return (
    <h1 className="max-w-3xl font-bonny text-5xl font-bold leading-[.9] md:text-7xl">
      {title.split(" ").map((word, i) => (
        <span key={i} className="-mb-[0.18em] inline-block overflow-hidden pb-[0.18em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "1.08em", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
          {NBSP}
        </span>
      ))}
    </h1>
  );
}

/** Sous-titre du hero — même signature d'animation, décalée après le titre. */
export function HeroSubtitle({
  children,
  delay = 0.5,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.p
      className="mt-sp-4 max-w-xl font-light leading-relaxed"
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 0.95 }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.p>
  );
}
