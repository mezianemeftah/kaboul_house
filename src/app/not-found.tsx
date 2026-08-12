import Link from "next/link";
import { Pill } from "@/components/ui/Pill";

/**
 * Page 404. Volontairement autonome : elle sert aussi les adresses hors du
 * groupe `(site)`, sans en-tête ni pied de page à charger.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-blush px-sp-4 text-center">
      <p className="font-bonny text-7xl font-bold text-grenat md:text-8xl">404</p>
      <h1 className="mt-sp-4 font-bonny text-3xl font-medium text-encre md:text-4xl">
        Cette page s&apos;est perdue dans le bazar
      </h1>
      <p className="mt-sp-3 max-w-md font-light leading-relaxed text-encre-douce">
        L&apos;adresse demandée n&apos;existe pas, ou n&apos;existe plus. Reprenons depuis
        l&apos;entrée.
      </p>
      <div className="mt-sp-5 flex flex-wrap items-center justify-center gap-sp-4">
        <Pill href="/" variant="onLight">
          Retour à l&apos;accueil
        </Pill>
        <Link
          href="/boutique"
          className="font-light text-encre-douce underline-offset-4 transition-colors hover:underline"
        >
          Voir la boutique
        </Link>
      </div>
    </main>
  );
}
