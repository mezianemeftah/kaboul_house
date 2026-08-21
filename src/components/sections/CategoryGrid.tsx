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
  decor: {
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
 * Place de chaque carte dans le bento, calée sur le poids commercial des trois
 * pôles annoncés par le client : 70 % tapis et toshak (les matlas), 20 % art de
 * la table et décor, 10 % fruits secs.
 *
 * La grille fait six colonnes sur trois rangées, soit dix-huit cases :
 *
 *   Tapis           4 × 2 = 8 ┐ 12 cases → 67 %
 *   Toshak          2 × 2 = 4 ┘
 *   Décor           2 × 1 = 2 ┐  4 cases → 22 %
 *   Art de la table 2 × 1 = 2 ┘
 *   Fruits secs     2 × 1 = 2     2 cases → 11 %
 *
 * Le repère est le slug et non le rang : réordonner les univers en back-office
 * doit changer leur suite de lecture, pas la hiérarchie commerciale. Un univers
 * qu'on ajouterait plus tard prend la taille des cartes du bas.
 *
 * Sur six colonnes, aucune cellule ne descend sous deux colonnes — un premier
 * essai en 2×2 serrait trop le surtitre, le titre, la description et le lien
 * dans une même case.
 */
const BENTO_SPANS: Record<string, string> = {
  tapis: "sm:col-span-2 lg:col-span-4 lg:row-span-2",
  toshak: "sm:col-span-2 lg:col-span-2 lg:row-span-2",
  decor: "lg:col-span-2",
  "art-de-la-table": "lg:col-span-2",
  "fruits-secs": "sm:col-span-2 lg:col-span-2",
};

/**
 * Sans `sm:col-span-2`, les univers inconnus se rangent deux par deux sur
 * tablette : seuls, ils laisseraient une demi-rangée vide à côté d'eux.
 */
const DEFAULT_SPAN = "lg:col-span-2";

const FALLBACK_KICKER = "Nos univers";
const FALLBACK_TITLE = "Cinq mondes, une même maison";
const FALLBACK_INTRO =
  "Du tapis sous vos pieds à l'assiette de votre invité, chaque pièce raconte l'hospitalité orientale. Choisissez par où commencer.";
const FALLBACK_LINK_LABEL = "Voir";

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

export function CategoryGrid({
  categories,
  kicker,
  title,
  intro,
  linkLabel,
}: {
  categories: Category[] | null | undefined;
  kicker: string | null;
  title: string | null;
  intro: string | null;
  linkLabel: string | null;
}) {
  const cards = toCards(categories);

  return (
    <section className="px-sp-4 py-sp-6 md:px-sp-5 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-grenat">
          <SectionLabel>{kicker ?? FALLBACK_KICKER}</SectionLabel>
        </div>
        <h2 className="mt-sp-3 max-w-2xl font-bonny text-4xl font-bold leading-[1.05] text-encre md:text-5xl">
          {title ?? FALLBACK_TITLE}
        </h2>
        <p className="mt-sp-4 max-w-2xl whitespace-pre-line font-light leading-relaxed text-encre-douce">
          {intro ?? FALLBACK_INTRO}
        </p>

        {/*
          17rem par rangée et non 23 : la troisième rangée qu'appelle la
          hiérarchie 70/20/10 allongerait sinon une section qui se fige en bas
          de l'écran, et son titre sortirait du cadre pendant la prise.
        */}
        <div className="mt-sp-5 grid auto-rows-[20rem] gap-sp-3 sm:grid-cols-2 md:mt-sp-6 lg:auto-rows-[17rem] lg:grid-cols-6">
          {cards.map((card, i) => (
            <Link
              key={card.slug}
              href={`/${card.slug}`}
              className={`group relative overflow-hidden rounded-panel bg-encre ${BENTO_SPANS[card.slug] ?? DEFAULT_SPAN}`}
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
                    {linkLabel ?? FALLBACK_LINK_LABEL}
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
