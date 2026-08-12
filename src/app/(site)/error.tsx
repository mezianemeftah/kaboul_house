"use client";

import { PillButton } from "@/components/ui/Pill";

/**
 * Écran d'erreur des pages du site. `reset` relance le rendu du segment fautif
 * sans recharger toute la page — d'où un bouton plutôt qu'un lien.
 */
export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-blush px-sp-4 text-center">
      <h1 className="font-bonny text-3xl font-medium text-encre md:text-4xl">
        Un imprévu est survenu
      </h1>
      <p className="mt-sp-3 max-w-md font-light leading-relaxed text-encre-douce">
        La page n&apos;a pas pu s&apos;afficher. Réessayez — et si cela recommence, écrivez-nous,
        on s&apos;en occupe.
      </p>
      <div className="mt-sp-5">
        <PillButton onClick={reset} variant="onLight">
          Réessayer
        </PillButton>
      </div>
    </main>
  );
}
