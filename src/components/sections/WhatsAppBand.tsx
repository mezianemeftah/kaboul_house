"use client";

import { cubicBezier, motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Pill } from "@/components/ui/Pill";
import { useHydrated } from "@/lib/use-hydrated";
import { AmbianceVideo } from "./AmbianceVideo";

/** Sortie douce : la vidéo prend vite sa taille, puis se pose. */
const EASE = cubicBezier(0.33, 1, 0.68, 1);

/**
 * Section WhatsApp plein écran, en recouvrement.
 *
 * La section précédente (« Nos univers ») est figée en `sticky bottom-0` par
 * `(site)/page.tsx` : elle s'arrête net dès que son dernier pixel touche le bas
 * de l'écran. Cette section-ci, posée juste après dans le flux et remontée en
 * `z-10`, glisse alors par-dessus elle — d'où l'impression qu'elle recouvre la
 * précédente sans que celle-ci ne bouge.
 *
 * Pendant cette montée, la vidéo grandit de 0,82 à 1 et ses angles s'ouvrent
 * de 28 px à 0 : elle arrive comme un panneau arrondi et finit plein cadre,
 * exactement quand la section atteint le haut de l'écran. La marge laissée par
 * l'échelle laisse voir la section figée derrière, ce qui signe le recouvrement.
 *
 * Aucun `fixed` n'est en jeu : l'effet reste exact sous Lenis, qui pilote le
 * défilement natif — `useScroll` lit donc des valeurs justes.
 *
 * L'échelle n'est pas coupée par `prefers-reduced-motion` : elle suit le geste
 * de défilement au lieu de se déclencher seule, et le seul mouvement autonome
 * de la section — la vidéo — dispose de son bouton pause.
 */
export function WhatsAppBand({ whatsappHref }: { whatsappHref: string }) {
  const ref = useRef<HTMLElement>(null);

  const animate = useHydrated();

  // De « le haut de la section touche le bas de l'écran » à « il touche le haut ».
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.82, 1], { ease: EASE });
  const borderRadius = useTransform(scrollYProgress, [0, 1], [28, 0], { ease: EASE });

  return (
    <section ref={ref} className="relative z-10 h-svh w-full overflow-hidden">
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={animate ? { scale, borderRadius } : undefined}
        aria-hidden
      >
        <AmbianceVideo />
        <div className="absolute inset-0 bg-encre/45" />
      </motion.div>

      <div className="relative flex h-full flex-col items-center justify-center px-sp-4 text-center text-blush">
        <div className="max-w-3xl">
          <h2 className="font-bonny text-4xl font-bold leading-[1.05] md:text-6xl">
            Une pièce vous fait de l&apos;œil ?
          </h2>
          <p className="mx-auto mt-sp-3 max-w-xl font-light leading-relaxed opacity-90">
            Écrivez-nous sur WhatsApp : photos, dimensions, conseils, mise de côté — on
            s&apos;occupe de tout.
          </p>
          <div className="mt-sp-5">
            <Pill href={whatsappHref} variant="onDark">
              Nous écrire sur WhatsApp
            </Pill>
          </div>
        </div>
      </div>
    </section>
  );
}
