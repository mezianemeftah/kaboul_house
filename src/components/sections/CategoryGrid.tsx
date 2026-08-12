import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { imageUrl } from "@/sanity/lib/image";
import type { HOME_QUERY_RESULT } from "@/sanity/types";

type Category = NonNullable<HOME_QUERY_RESULT>["categories"][number];

type Card = {
  slug: string;
  title: string;
  description: string | null;
  src: string | null;
  alt: string;
};

/**
 * Photos éditoriales de repli, indexées par slug. Elles habillent les cartes
 * tant qu'aucune image n'est renseignée dans Sanity ; dès qu'une catégorie
 * reçoit la sienne, `imageUrl` reprend la main.
 */
const FALLBACK_IMAGES: Record<string, { imageSrc: string; alt: string }> = {
  tapis: {
    imageSrc: "/images/category-sea.webp",
    alt: "Tapis rouge porté au-dessus de l'eau",
  },
  decoration: {
    imageSrc: "/images/category-night.webp",
    alt: "Tapis d'Orient dans une cour au crépuscule",
  },
  "fruits-secs": {
    imageSrc: "/images/category-prayer.webp",
    alt: "Silhouettes sur un tapis au lever du soleil",
  },
};

const FALLBACK: Card[] = [
  {
    slug: "tapis",
    title: "Tapis",
    description:
      "Khal Mohammadi, Boukhara, kilims — des pièces nouées main, choisies une à une à Kaboul, Téhéran et Istanbul.",
  },
  {
    slug: "decoration",
    title: "Décoration",
    description:
      "Toshak, coussins suzani, cuivres martelés et céramiques — l'art de recevoir à l'orientale.",
  },
  {
    slug: "fruits-secs",
    title: "Fruits secs",
    description:
      "Amandes, pistaches de Kandahar, mûres blanches et abricots sauvages — le goût des montagnes afghanes.",
  },
].map((c) => ({
  ...c,
  src: FALLBACK_IMAGES[c.slug].imageSrc,
  alt: FALLBACK_IMAGES[c.slug].alt,
}));

function toCards(categories: Category[] | null | undefined): Card[] {
  const cards: Card[] = [];
  for (const c of categories ?? []) {
    if (!c.slug || !c.title) continue;
    const fallbackImage = FALLBACK_IMAGES[c.slug];
    cards.push({
      slug: c.slug,
      title: c.title,
      description: c.description,
      src: imageUrl(c.image, 800) ?? fallbackImage?.imageSrc ?? null,
      alt: c.image?.alt ?? fallbackImage?.alt ?? "",
    });
  }
  return cards.length > 0 ? cards : FALLBACK;
}

export function CategoryGrid({ categories }: { categories: Category[] | null | undefined }) {
  const cards = toCards(categories);

  return (
    <section id="univers" className="px-sp-4 py-sp-6 md:px-sp-5 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-grenat">
          <SectionLabel>Nos univers</SectionLabel>
        </div>
        <h2 className="mt-sp-3 max-w-2xl font-bonny text-4xl font-bold leading-[1.05] text-encre md:text-5xl">
          Trois mondes à explorer
        </h2>

        <div className="mt-sp-5 grid gap-sp-3 sm:grid-cols-2 md:mt-sp-6 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.slug}
              href={`/${card.slug}`}
              className="group overflow-hidden rounded-panel bg-blush-2 transition-shadow duration-500 hover:shadow-lg hover:shadow-grenat/10"
              style={{ transitionTimingFunction: "var(--ease-signature)" }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {card.src ? (
                  <Image
                    src={card.src}
                    alt={card.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    style={{ transitionTimingFunction: "var(--ease-signature)" }}
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center bg-gradient-to-br from-grenat to-petrole transition-transform duration-500 group-hover:scale-[1.04]"
                    style={{ transitionTimingFunction: "var(--ease-signature)" }}
                    aria-hidden
                  >
                    <span className="font-bonny text-7xl font-thin text-creme/30">
                      {card.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-sp-4">
                <h3 className="font-bonny text-2xl font-medium text-encre">{card.title}</h3>
                {card.description && (
                  <p className="mt-sp-2 font-light leading-relaxed text-encre-douce">
                    {card.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
