"use client";

import Image from "next/image";
import {
  cubicBezier,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useContext, useRef } from "react";
import { FIN_DE_COURSE } from "@/components/layout/FooterReveal";
import { FooterRevealContext } from "@/components/layout/footer-reveal-context";
import { useHydrated } from "@/lib/use-hydrated";

/** Glisse posée : le tapis ralentit en fin de course au lieu de s'arrêter net. */
const EASE = cubicBezier(0.33, 1, 0.68, 1);

/**
 * Cadence propre du tapis pendant la mise en place du pied de page.
 *
 * Il part *plus grand* que sa taille finale, à l'inverse du pied de page qui
 * part plus petit : au début du mouvement le tapis déborde de l'écran des deux
 * côtés, il est donc franchement collé au bord droit, et il vient se poser
 * exactement dedans. Jamais de bande de fond sur les côtés, à aucun moment.
 *
 * La courbe retient plus longtemps que celle du pied de page, si bien que les
 * deux ne bougent pas au même rythme ; mais elles se posent au même point de
 * course — `FIN_DE_COURSE`. C'est le trajet qui est désolidarisé, pas
 * l'arrivée.
 */
const EASE_TAPIS = cubicBezier(0.72, 0, 0.18, 1);
const SCALE_TAPIS_DEPART = 1.06;

/**
 * Hauteur dégagée au-dessus du pied de page pour laisser passer le tapis.
 *
 * Exprimée en `vw` parce que c'est la largeur qui commande : l'image fait 100 %
 * de large, donc sa hauteur suit. Il n'en faut qu'un tiers ; 50 vw laisse une
 * marge confortable sans rien coûter, la zone étant vide et hors flux.
 */
const RESERVE = "50vw";

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
 * À l'approche du bas de page il se met en place sur sa propre cadence, sans
 * rien devoir à celle du pied de page qui le porte (voir `EASE_TAPIS`).
 *
 * Purement décoratif, donc `aria-hidden` et insensible au pointeur pour ne pas
 * gêner les liens situés dessous.
 */
export function RugDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();
  const reduitLeMouvement = useReducedMotion();

  // Toute la traversée : de l'entrée du tapis en bas de l'écran à sa sortie en haut.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [24, -24], { ease: EASE });
  const rotate = useTransform(scrollYProgress, [0, 1], [1.5, -1.5], { ease: EASE });

  // Hors pied de page, ces valeurs neutres laissent le tapis en place.
  const reveal = useContext(FooterRevealContext);
  const neutre = useMotionValue(1);
  const progression = reveal?.progression ?? neutre;
  const echelleFooter = reveal?.echelle ?? neutre;

  /**
   * Contre-échelle qui annule la transformation du pied de page.
   *
   * Une échelle ne change pas que la taille : elle rapproche aussi tout ce
   * qu'elle contient de son origine. Diviser la seule taille du tapis ne
   * suffisait donc pas — il gardait le déplacement et se décollait du bord
   * droit de l'écran, ce qui laissait voir le fond.
   *
   * Appliquée ici, elle annule les deux d'un coup, parce que la fenêtre de
   * rognage partage exactement l'origine du pied de page : `inset-x-0 bottom-0`
   * lui donne la même largeur et le même bord bas, donc le même milieu-bas. Deux
   * échelles inverses de même origine se composent en identité. Le tapis
   * retrouve ainsi sa géométrie de mise en page — pleine largeur de fenêtre — et
   * n'obéit plus qu'à sa propre courbe.
   */
  const contreEchelleDuFooter = useTransform(echelleFooter, (echelle) => 1 / echelle);
  const scale = useTransform(
    progression,
    [0, FIN_DE_COURSE],
    reduitLeMouvement ? [1, 1] : [SCALE_TAPIS_DEPART, 1],
    { ease: EASE_TAPIS },
  );

  return (
    // Fenêtre de rognage : elle monte bien au-dessus du pied de page mais
    // s'arrête pile sur son bord bas. Le tapis peut donc déborder vers le haut
    // comme prévu, sans déborder vers le bas — c'est ce débordement-là qui
    // allongeait le document d'une quarantaine de pixels et ouvrait une bande
    // de fond sous le pied de page. Un `overflow` suffit là où `overflow-clip`
    // du pied de page échouait : dès qu'on lui donne une marge de rognage pour
    // laisser passer le tapis, le navigateur remet la zone dans le défilement.
    //
    // Le débordement vers le haut, lui, ne coûte rien : rien ne défile
    // au-dessus de l'origine du document.
    <motion.div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-10 overflow-hidden"
      style={{
        top: `calc(-1 * ${RESERVE})`,
        ...(hydrated
          ? { scale: contreEchelleDuFooter, transformOrigin: "50% 100%" }
          : undefined),
      }}
      aria-hidden
    >
      {/* Le tapis reste positionné par rapport au haut du pied de page — d'où
          le décalage qui annule la réserve — puis remonte du tiers de sa
          hauteur, comme avant. La mesure du défilement porte sur cette boîte-ci
          et non sur la fenêtre de rognage, sinon la dérive serait étalée sur
          toute la hauteur dégagée. */}
      <div ref={ref} className="absolute inset-x-0 -translate-y-1/3" style={{ top: RESERVE }}>
        <motion.div
          style={hydrated ? { y, rotate, scale, transformOrigin: "50% 100%" } : undefined}
        >
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
    </motion.div>
  );
}
