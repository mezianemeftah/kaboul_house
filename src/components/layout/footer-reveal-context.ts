"use client";

import type { MotionValue } from "motion/react";
import { createContext } from "react";

/**
 * Ce que le pied de page partage avec ce qu'il contient pendant sa mise en
 * place.
 *
 * `progression` va de 0 quand le pied de page entre par le bas de l'écran à 1
 * quand son bord bas rejoint celui de la fenêtre, c'est-à-dire le bas du
 * document. `echelle` est l'échelle effectivement appliquée au pied de page à
 * cet instant.
 *
 * Un enfant qui veut sa propre cadence a besoin des deux : la première pour
 * tracer sa courbe, la seconde pour annuler celle qu'il hérite du parent — une
 * transformation posée sur le pied de page se multiplie à celle de l'enfant.
 */
export type FooterReveal = {
  progression: MotionValue<number>;
  echelle: MotionValue<number>;
};

/** `null` hors du pied de page : l'enfant se contente alors de son échelle propre. */
export const FooterRevealContext = createContext<FooterReveal | null>(null);
