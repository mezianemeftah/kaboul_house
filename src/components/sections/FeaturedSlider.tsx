"use client";

import Image from "next/image";
import Link from "next/link";
import AutoScroll from "embla-carousel-auto-scroll";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FALLBACK_PRODUCTS, PLACEHOLDER_GRADIENTS } from "@/lib/fallback-content";
import { imageUrl } from "@/sanity/lib/image";
import type { HOME_QUERY_RESULT } from "@/sanity/types";

// Double NonNullable : le champ est absent tant qu'aucun produit n'est
// sélectionné dans le back-office, la requête renvoie alors null.
type Product = NonNullable<NonNullable<HOME_QUERY_RESULT>["featuredProducts"]>[number];

type Item = {
  key: string;
  title: string;
  categoryTitle: string | null;
  slug: string | null;
  src: string | null;
  alt: string;
};

const FALLBACK: Item[] = FALLBACK_PRODUCTS.map((i) => ({
  ...i,
  slug: null,
  src: null,
  alt: "",
}));

const FALLBACK_KICKER = "Nos coups de cœur";
const FALLBACK_TITLE = "Cinq pièces qui font la maison";

function toItems(products: Product[] | null | undefined): Item[] {
  const items: Item[] = [];
  for (const p of products ?? []) {
    if (!p.title) continue;
    const cover = p.images?.[0] ?? null;
    items.push({
      key: p.slug ?? p.title,
      title: p.title,
      categoryTitle: p.categoryTitle,
      slug: p.slug,
      src: imageUrl(cover, 900),
      alt: cover?.alt ?? "",
    });
  }
  return items.length > 0 ? items : FALLBACK;
}

function Slide({ item, index }: { item: Item; index: number }) {
  const content = (
    <>
      {item.src ? (
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes="(min-width: 768px) 24vw, 66vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          style={{ transitionTimingFunction: "var(--ease-signature)" }}
        />
      ) : (
        <div
          className={`absolute inset-0 transition-transform duration-700 group-hover:scale-[1.05] ${
            PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length]
          }`}
          style={{ transitionTimingFunction: "var(--ease-signature)" }}
          aria-hidden
        />
      )}
      <div
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-encre/80 to-transparent"
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 p-sp-3">
        <p className="font-bonny text-xl font-medium leading-tight text-white md:text-2xl">
          {item.title}
        </p>
        {item.categoryTitle && (
          <p className="mt-sp-1 text-sm font-light text-blush">{item.categoryTitle}</p>
        )}
      </div>
    </>
  );

  // `min-w-0` : sans lui, une piste flex refuse de rétrécir ses éléments.
  const shell =
    "group relative aspect-[3/4] min-w-0 shrink-0 basis-[66%] overflow-hidden rounded-panel bg-encre sm:basis-[36%] lg:basis-[23%]";

  if (item.slug) {
    // `draggable={false}` : sinon le navigateur lance son propre glisser d'image
    // et vole le geste au carrousel.
    return (
      <Link href={`/produit/${item.slug}`} className={shell} draggable={false}>
        {content}
      </Link>
    );
  }
  return <div className={shell}>{content}</div>;
}

/**
 * Carrousel des pièces mises en avant : défilement continu, boucle sans fin,
 * et déplacement à la souris ou au doigt.
 *
 * Le défilement automatique s'interrompt au survol et à la saisie, puis
 * reprend — on ne se bat pas avec la pièce qu'on est en train de regarder.
 * Les flèches doublent le glisser au clavier, qui ne peut pas l'imiter.
 */
export function FeaturedSlider({
  products,
  kicker,
  title,
}: {
  products: Product[] | null | undefined;
  kicker: string | null;
  title: string | null;
}) {
  const items = toItems(products);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true, containScroll: false },
    [AutoScroll({ speed: 0.7, stopOnInteraction: false, stopOnMouseEnter: true })],
  );

  const reculer = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const avancer = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="overflow-hidden bg-blush-2 py-sp-6 md:py-24">
      <div className="mx-auto max-w-6xl px-sp-4 md:px-sp-5">
        <div className="flex flex-wrap items-end justify-between gap-sp-4">
          <div>
            <div className="text-grenat">
              <SectionLabel>{kicker ?? FALLBACK_KICKER}</SectionLabel>
            </div>
            <h2 className="mt-sp-3 max-w-2xl font-bonny text-4xl font-bold leading-[1.05] text-encre md:text-5xl">
              {title ?? FALLBACK_TITLE}
            </h2>
          </div>

          <div className="flex gap-sp-2">
            <button
              type="button"
              onClick={reculer}
              aria-label="Pièce précédente"
              className="rounded-pill border border-grenat/40 p-sp-2 text-grenat transition-colors hover:border-grenat/70 hover:bg-grenat/5"
            >
              <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M10 2.5 4.5 8l5.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={avancer}
              aria-label="Pièce suivante"
              className="rounded-pill border border-grenat/40 p-sp-2 text-grenat transition-colors hover:border-grenat/70 hover:bg-grenat/5"
            >
              <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M6 2.5 11.5 8 6 13.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/*
        La piste déborde volontairement de la colonne centrée : les pièces
        entrent et sortent par les bords de l'écran plutôt que de s'arrêter net
        sur une marge. D'où le padding repris ici, et non sur un parent.
      */}
      <div
        className="mt-sp-5 cursor-grab overflow-hidden active:cursor-grabbing md:mt-sp-6"
        ref={emblaRef}
      >
        <div className="flex gap-sp-3 px-sp-4 md:px-sp-5">
          {items.map((item, index) => (
            <Slide key={item.key} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
