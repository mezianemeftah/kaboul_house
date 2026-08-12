import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FALLBACK_CATEGORIES } from "@/lib/fallback-content";
import { imageUrl } from "@/sanity/lib/image";
import type { HOME_QUERY_RESULT } from "@/sanity/types";

type Category = NonNullable<HOME_QUERY_RESULT>["categories"][number];

type Card = {
  slug: string;
  kicker: string | null;
  title: string;
  description: string | null;
  src: string | null;
  alt: string;
};

/**
 * Photos éditoriales de repli, indexées par slug. Elles habillent les cartes
 * tant qu'aucune image n'est renseignée dans Sanity ; dès qu'un univers reçoit
 * la sienne, `imageUrl` reprend la main.
 *
 * Trois photos seulement pour cinq univers : les deux cartes restantes tombent
 * sur la tuile en dégradé (voir plus bas). Répéter une même photo à l'écran se
 * verrait davantage que cette alternance, qui se lit comme un parti pris.
 */
const FALLBACK_IMAGES: Record<string, { imageSrc: string; alt: string }> = {
  tapis: {
    imageSrc: "/images/category-sea.webp",
    alt: "Tapis rouge porté au-dessus de l'eau",
  },
  textiles: {
    imageSrc: "/images/category-night.webp",
    alt: "Tapis d'Orient dans une cour au crépuscule",
  },
  "fruits-secs": {
    imageSrc: "/images/category-prayer.webp",
    alt: "Silhouettes sur un tapis au lever du soleil",
  },
};

const FALLBACK: Card[] = FALLBACK_CATEGORIES.map((c) => ({
  ...c,
  src: FALLBACK_IMAGES[c.slug]?.imageSrc ?? null,
  alt: FALLBACK_IMAGES[c.slug]?.alt ?? "",
}));

/**
 * Place de chaque carte dans le bento : deux larges en haut, trois en dessous.
 *
 * Sur six colonnes, aucune cellule ne descend sous deux colonnes — un premier
 * essai en 2×2 serrait trop le surtitre, le titre, la description et le lien
 * dans une même case. Au-delà de cinq univers, les suivants reprennent la
 * largeur des cartes du bas.
 */
const BENTO_SPANS = [
  "sm:col-span-2 lg:col-span-3",
  "sm:col-span-2 lg:col-span-3",
  "lg:col-span-2",
  "lg:col-span-2",
  "sm:col-span-2 lg:col-span-2",
];

const DEFAULT_SPAN = "lg:col-span-2";

function toCards(categories: Category[] | null | undefined): Card[] {
  const cards: Card[] = [];
  for (const c of categories ?? []) {
    if (!c.slug || !c.title) continue;
    const fallbackImage = FALLBACK_IMAGES[c.slug];
    cards.push({
      slug: c.slug,
      kicker: c.kicker ?? null,
      title: c.title,
      description: c.description,
      src: imageUrl(c.image, 1200) ?? fallbackImage?.imageSrc ?? null,
      alt: c.image?.alt ?? fallbackImage?.alt ?? "",
    });
  }
  return cards.length > 0 ? cards : FALLBACK;
}

/** « 01 », « 02 »… d'après la place dans la grille. */
const numero = (index: number) => String(index + 1).padStart(2, "0");

export function CategoryGrid({ categories }: { categories: Category[] | null | undefined }) {
  const cards = toCards(categories);

  return (
    <section className="px-sp-4 py-sp-6 md:px-sp-5 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-grenat">
          <SectionLabel>Nos univers</SectionLabel>
        </div>
        <h2 className="mt-sp-3 max-w-2xl font-bonny text-4xl font-bold leading-[1.05] text-encre md:text-5xl">
          Cinq mondes, une même maison
        </h2>
        <p className="mt-sp-4 max-w-2xl font-light leading-relaxed text-encre-douce">
          Du tapis sous vos pieds à l&apos;assiette de votre invité, chaque pièce raconte
          l&apos;hospitalité orientale. Choisissez par où commencer.
        </p>

        <div className="mt-sp-5 grid auto-rows-[20rem] gap-sp-3 sm:grid-cols-2 md:mt-sp-6 lg:auto-rows-[23rem] lg:grid-cols-6">
          {cards.map((card, i) => (
            <Link
              key={card.slug}
              href={`/${card.slug}`}
              className={`group relative overflow-hidden rounded-panel bg-encre ${BENTO_SPANS[i] ?? DEFAULT_SPAN}`}
            >
              {card.src ? (
                <Image
                  src={card.src}
                  alt={card.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  style={{ transitionTimingFunction: "var(--ease-signature)" }}
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-grenat via-grenat-profond to-petrole transition-transform duration-700 group-hover:scale-[1.05]"
                  style={{ transitionTimingFunction: "var(--ease-signature)" }}
                  aria-hidden
                >
                  <span className="font-bonny text-[7rem] font-thin leading-none text-creme/15">
                    {numero(i)}
                  </span>
                </div>
              )}

              {/* Voile du bas : garde le texte lisible quelle que soit la photo. */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-encre/85 via-encre/25 to-transparent"
                aria-hidden
              />

              <div className="relative flex h-full flex-col justify-between p-sp-5 text-blush">
                <p className="font-light tracking-wide opacity-80">
                  {numero(i)}
                  {card.kicker ? ` — ${card.kicker}` : ""}
                </p>

                <div>
                  <h3 className="font-bonny text-3xl font-medium leading-tight md:text-4xl">
                    {card.title}
                  </h3>
                  {card.description && (
                    <p className="mt-sp-3 max-w-md font-light leading-relaxed opacity-85">
                      {card.description}
                    </p>
                  )}
                  <span className="mt-sp-4 inline-flex items-center gap-sp-2 font-light">
                    Voir
                    <span
                      className="transition-transform duration-300 group-hover:translate-x-1"
                      style={{ transitionTimingFunction: "var(--ease-signature)" }}
                      aria-hidden
                    >
                      →
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
