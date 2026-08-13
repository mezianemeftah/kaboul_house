import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { imageUrl } from "@/sanity/lib/image";
import type { HOME_QUERY_RESULT } from "@/sanity/types";

type Home = NonNullable<HOME_QUERY_RESULT>;

const FALLBACK_KICKER = "La maison";
const FALLBACK_TITLE = "Kaboul House, une histoire de famille";
const FALLBACK_TEXT =
  "Depuis Kaboul jusqu'aux rives de l'Isère, Kaboul House rassemble ce que l'Orient fait de plus beau : des tapis qui traversent les générations, des objets qui réchauffent la maison, des saveurs qui racontent un pays. Chaque pièce est choisie par nos soins, auprès des artisans et des familles qui perpétuent ces savoir-faire.";

const FALLBACK_LARGE = {
  src: "/images/category-night.webp",
  alt: "Tapis d'Orient déroulé dans une cour au crépuscule",
};
const FALLBACK_SMALL = {
  src: "/images/category-prayer.webp",
  alt: "Silhouettes réunies sur un tapis au lever du soleil",
};

/**
 * Mise en page éditoriale : deux photos décalées à gauche, le récit à droite.
 * L'ordre du DOM place le texte en premier — c'est lui qui compte sur mobile —
 * et `order` rétablit la composition magazine à partir de md.
 *
 * `scroll-mt` : la nav flotte au-dessus du contenu, sans cette marge le titre
 * se retrouverait caché dessous à l'arrivée depuis « Qui sommes-nous ».
 */
export function AboutSection({
  kicker,
  title,
  text,
  imageLarge,
  imageSmall,
}: {
  kicker: string | null;
  title: string | null;
  text: string | null;
  imageLarge: Home["aboutImageLarge"];
  imageSmall: Home["aboutImageSmall"];
}) {
  const large = {
    src: imageUrl(imageLarge, 1200) ?? FALLBACK_LARGE.src,
    alt: imageLarge?.alt ?? FALLBACK_LARGE.alt,
  };
  const small = {
    src: imageUrl(imageSmall, 800) ?? FALLBACK_SMALL.src,
    alt: imageSmall?.alt ?? FALLBACK_SMALL.alt,
  };

  return (
    <section id="la-maison" className="scroll-mt-28 px-sp-4 py-sp-6 md:px-sp-5 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-sp-4 md:grid-cols-12 md:items-start md:gap-sp-5">
        <div className="md:order-3 md:col-span-4">
          <div className="text-grenat">
            <SectionLabel>{kicker ?? FALLBACK_KICKER}</SectionLabel>
          </div>
          <h2 className="mt-sp-3 font-bonny text-4xl font-bold leading-[1.05] text-encre">
            {title ?? FALLBACK_TITLE}
          </h2>
          <p className="mt-sp-4 whitespace-pre-line font-light leading-relaxed text-encre-douce">
            {text ?? FALLBACK_TEXT}
          </p>
        </div>

        <div className="relative aspect-[3/4] overflow-hidden rounded-panel md:order-1 md:col-span-5">
          <Image
            src={large.src}
            alt={large.alt}
            fill
            sizes="(min-width: 768px) 42vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="relative aspect-square overflow-hidden rounded-panel md:order-2 md:col-span-3 md:mt-sp-6">
          <Image
            src={small.src}
            alt={small.alt}
            fill
            sizes="(min-width: 768px) 25vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
