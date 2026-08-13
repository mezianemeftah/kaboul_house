"use client";

import { cubicBezier, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { FooterRevealContext } from "@/components/layout/footer-reveal-context";

/**
 * Courbe d'arrivée. Presque plate au départ, elle concentre l'agrandissement
 * sur la fin de course puis se pose sur 1 sans à-coup : le pied de page se met
 * en place au moment où l'on atteint le bas, et pas avant.
 *
 * Une ease-out classique (celle du tapis, `0.33, 1, 0.68, 1`) aurait épuisé le
 * mouvement dès l'apparition du pied de page, alors qu'il reste tout un écran à
 * parcourir — on n'aurait plus rien vu bouger en arrivant vraiment en bas.
 */
const EASE = cubicBezier(0.5, 0, 0.2, 1);

/**
 * Amorce du fondu d'échelle.
 *
 * Il a fallu monter progressivement : 5 % passait inaperçu, 10 % restait discret
 * — d'autant que le tapis ne suit plus le pied de page depuis qu'il a sa propre
 * cadence, et que c'est lui qui portait l'essentiel du mouvement visible. À 15 %
 * le bloc rentre d'une centaine de pixels de chaque côté, ce qui se voit
 * franchement ; la courbe se charge d'éviter que ça saute.
 */
const SCALE_DEPART = 0.85;

/** Rayon des coins à l'amorce, aplani à 0 en fin de course. Vaut `--radius-hero`. */
const RAYON_DEPART = 28;

/**
 * Le mouvement s'achève à 85 % de la course, pas à 100 %. Les derniers pixels
 * de défilement se font donc pied de page déjà posé : sans cette réserve, la
 * dernière fraction d'agrandissement resterait suspendue à un défilement que
 * l'inertie n'atteint pas toujours au pixel près.
 *
 * Le tapis partage ce point d'arrivée (voir `RugDivider`) : les deux échelles
 * suivent des cadences distinctes mais se posent ensemble.
 */
export const FIN_DE_COURSE = 0.85;

/**
 * Pied de page qui s'agrandit légèrement depuis le bas de l'écran à l'approche
 * du bas de page, coins arrondis le temps du mouvement.
 *
 * L'origine de la transformation est le bord inférieur : quelle que soit
 * l'échelle, le pied de page reste collé au bas du document — seul son bord
 * haut descend, découvrant brièvement le fond. Les coins s'arrondissent d'autant
 * qu'il est réduit, ce qui le détache du fond comme une carte qui se pose, puis
 * redeviennent francs une fois en place.
 *
 * L'échelle est écrite à la main sur le nœud plutôt que confiée à `motion.footer`.
 * Un composant `motion` traite le passage de `style` indéfini (rendu serveur) à
 * `style` renseigné (après hydratation) comme un changement à animer : il
 * lançait une animation d'origine et d'échelle qui prenait le pas sur la valeur
 * pilotée par le défilement. Ici le nœud ne porte aucune transformation dans le
 * HTML servi, et n'en reçoit qu'au montage — sans écart serveur/client.
 */
export function FooterReveal({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const enveloppe = useRef<HTMLDivElement>(null);
  const reduitLeMouvement = useReducedMotion();

  // De l'entrée du pied de page par le bas de l'écran jusqu'à son alignement
  // sur le bas de la fenêtre — c'est-à-dire jusqu'au bas du document.
  //
  // La mesure porte sur l'enveloppe, que rien ne transforme. Mesurer le pied de
  // page lui-même reviendrait à lire une géométrie que l'échelle en cours a
  // déjà réduite : la progression dépendrait de ce qu'elle commande.
  const { scrollYProgress } = useScroll({ target: enveloppe, offset: ["start end", "end end"] });
  // Mouvement réduit : on neutralise les valeurs elles-mêmes, pas seulement leur
  // écriture. `echelle` est partagée par contexte — le tapis s'en sert pour
  // annuler la transformation qu'il hérite. Une valeur figurant une échelle qui
  // n'est pas appliquée le ferait grossir d'autant, dans le vide.
  const echelle = useTransform(
    scrollYProgress,
    [0, FIN_DE_COURSE],
    reduitLeMouvement ? [1, 1] : [SCALE_DEPART, 1],
    { ease: EASE },
  );
  const rayon = useTransform(
    scrollYProgress,
    [0, FIN_DE_COURSE],
    reduitLeMouvement ? [0, 0] : [RAYON_DEPART, 0],
    { ease: EASE },
  );

  useMotionValueEvent(echelle, "change", (valeur) => {
    if (ref.current) ref.current.style.transform = `scale(${valeur})`;
  });
  useMotionValueEvent(rayon, "change", (valeur) => {
    if (ref.current) ref.current.style.borderRadius = `${valeur}px`;
  });

  // Pose initiale. Le défilement peut déjà être engagé au montage — rechargement
  // en bas de page, arrivée sur une ancre — auquel cas aucun changement de
  // valeur ne surviendra avant le prochain geste.
  useEffect(() => {
    const noeud = ref.current;
    if (!noeud) return;
    noeud.style.transformOrigin = "50% 100%";
    noeud.style.transform = `scale(${echelle.get()})`;
    noeud.style.borderRadius = `${rayon.get()}px`;
  }, [echelle, rayon]);

  return (
    <FooterRevealContext.Provider value={{ progression: scrollYProgress, echelle }}>
      <div ref={enveloppe}>
        <footer ref={ref} className={className}>
          {children}
        </footer>
      </div>
    </FooterRevealContext.Provider>
  );
}
