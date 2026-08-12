import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";

const FALLBACK_TITLE = "Kaboul House, une histoire de famille";
const FALLBACK_TEXT =
  "Depuis Kaboul jusqu'aux rives de l'Isère, Kaboul House rassemble ce que l'Orient fait de plus beau : des tapis qui traversent les générations, des objets qui réchauffent la maison, des saveurs qui racontent un pays. Chaque pièce est choisie par nos soins, auprès des artisans et des familles qui perpétuent ces savoir-faire.";

/** Étapes du voyage — accent visuel de la section (aucune photo disponible). */
const ETAPES = [
  { lieu: "Kaboul", note: "l'origine, les ateliers, les familles" },
  { lieu: "Grenoble", note: "la maison, 1 boulevard Gambetta" },
  { lieu: "Lyon", note: "prochainement" },
];

export function AboutSection({
  title,
  text,
}: {
  title: string | null;
  text: string | null;
}) {
  return (
    <section className="px-sp-4 py-sp-6 md:px-sp-5 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-sp-6 lg:grid-cols-2 lg:gap-sp-6">
        <div>
          <div className="text-grenat">
            <SectionLabel>La maison</SectionLabel>
          </div>
          <h2 className="mt-sp-3 font-bonny text-4xl font-bold leading-[1.05] text-encre md:text-5xl">
            {title ?? FALLBACK_TITLE}
          </h2>
          <p className="mt-sp-4 max-w-xl font-light leading-relaxed text-encre-douce">
            {text ?? FALLBACK_TEXT}
          </p>
          <Link
            href="/notre-maison"
            className="mt-sp-5 inline-block font-normal text-grenat underline decoration-grenat/40 underline-offset-8 transition-colors hover:decoration-grenat"
          >
            Découvrir qui nous sommes →
          </Link>
        </div>

        <div className="rounded-panel bg-creme p-sp-5 md:p-sp-6">
          <p className="font-light text-encre-douce">Le voyage d&apos;une pièce</p>
          <ol className="mt-sp-4">
            {ETAPES.map((etape, i) => (
              <li key={etape.lieu} className="flex gap-sp-4">
                <div className="flex flex-col items-center pt-2">
                  <span className="size-2 shrink-0 rounded-full bg-grenat" aria-hidden />
                  {i < ETAPES.length - 1 && (
                    <span className="w-px flex-1 bg-grenat/25" aria-hidden />
                  )}
                </div>
                <div className={i < ETAPES.length - 1 ? "pb-sp-4" : undefined}>
                  <p className="font-bonny text-3xl font-medium leading-none text-encre md:text-4xl">
                    {etape.lieu}
                  </p>
                  <p className="mt-sp-1 font-light text-encre-douce">{etape.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
