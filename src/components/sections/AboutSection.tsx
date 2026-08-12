import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";

const FALLBACK_TITLE = "Kaboul House, une histoire de famille";
const FALLBACK_TEXT =
  "Depuis Kaboul jusqu'aux rives de l'Isère, Kaboul House rassemble ce que l'Orient fait de plus beau : des tapis qui traversent les générations, des objets qui réchauffent la maison, des saveurs qui racontent un pays. Chaque pièce est choisie par nos soins, auprès des artisans et des familles qui perpétuent ces savoir-faire.";

/**
 * Mise en page éditoriale : deux photos décalées à gauche, le récit à droite.
 * L'ordre du DOM place le texte en premier — c'est lui qui compte sur mobile —
 * et `order` rétablit la composition magazine à partir de md.
 */
export function AboutSection({ title, text }: { title: string | null; text: string | null }) {
  return (
    <section className="px-sp-4 py-sp-6 md:px-sp-5 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-sp-4 md:grid-cols-12 md:items-start md:gap-sp-5">
        <div className="md:order-3 md:col-span-4">
          <div className="text-grenat">
            <SectionLabel>La maison</SectionLabel>
          </div>
          <h2 className="mt-sp-3 font-bonny text-4xl font-bold leading-[1.05] text-encre">
            {title ?? FALLBACK_TITLE}
          </h2>
          <p className="mt-sp-4 font-light leading-relaxed text-encre-douce">
            {text ?? FALLBACK_TEXT}
          </p>
          <Link
            href="/notre-maison"
            className="mt-sp-5 inline-block font-normal text-grenat underline-offset-4 transition-colors hover:underline"
          >
            Découvrir qui nous sommes →
          </Link>
        </div>

        <div className="relative aspect-[3/4] overflow-hidden rounded-panel md:order-1 md:col-span-5">
          <Image
            src="/images/category-night.webp"
            alt="Tapis d'Orient déroulé dans une cour au crépuscule"
            fill
            sizes="(min-width: 768px) 42vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="relative aspect-square overflow-hidden rounded-panel md:order-2 md:col-span-3 md:mt-sp-6">
          <Image
            src="/images/category-prayer.webp"
            alt="Silhouettes réunies sur un tapis au lever du soleil"
            fill
            sizes="(min-width: 768px) 25vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
