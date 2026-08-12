import { Pill } from "@/components/ui/Pill";
import { AmbianceVideo } from "./AmbianceVideo";

/**
 * Section WhatsApp plein écran, en révélation « fenêtre ».
 *
 * Le fond est `position: fixed` : il ne bouge pas d'un pixel pendant le
 * défilement. La section, elle, est un simple bloc de 100svh dans le flux, et
 * son `clip-path: inset(0)` découpe ce fond à ses propres bords — clip-path
 * rogne bien ses descendants fixes sans leur créer de bloc conteneur, à la
 * différence de `transform`, `filter` ou `contain: paint`, qui les
 * repositionneraient et casseraient l'effet. Résultat : la section glisse
 * par-dessus la section précédente comme une fenêtre ouverte sur une image
 * immobile, et le texte, lui, défile normalement.
 *
 * Aucun JS de défilement n'est en jeu : l'effet reste exact sous Lenis, qui
 * pilote le défilement natif sans transformer le document.
 */
export function WhatsAppBand({ whatsappHref }: { whatsappHref: string }) {
  return (
    <section className="relative h-svh w-full [clip-path:inset(0)]">
      <div className="fixed inset-0" aria-hidden>
        <AmbianceVideo />
        <div className="absolute inset-0 bg-encre/45" />
      </div>

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
            <Pill href={whatsappHref}>Nous écrire sur WhatsApp</Pill>
          </div>
        </div>
      </div>
    </section>
  );
}
