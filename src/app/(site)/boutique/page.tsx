import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FALLBACK_PRODUCTS, PLACEHOLDER_GRADIENTS } from "@/lib/fallback-content";
import { sanityFetch } from "@/sanity/lib/fetch";
import { imageUrl } from "@/sanity/lib/image";
import { ALL_PRODUCTS_QUERY } from "@/sanity/queries";
import type { ALL_PRODUCTS_QUERY_RESULT } from "@/sanity/types";

export const metadata: Metadata = {
  title: "La boutique",
  description:
    "Toutes les pièces disponibles chez Kaboul House — tapis noués main, décoration et fruits secs d'Orient, à Grenoble et à Lyon.",
};

type Item = {
  key: string;
  title: string;
  categoryTitle: string | null;
  slug: string | null;
  src: string | null;
  alt: string;
};

const FALLBACK: Item[] = FALLBACK_PRODUCTS.map((p) => ({
  ...p,
  slug: null,
  src: null,
  alt: "",
}));

function toItems(products: ALL_PRODUCTS_QUERY_RESULT | null): Item[] {
  const items: Item[] = [];
  for (const p of products ?? []) {
    if (!p.title) continue;
    const cover = p.images?.[0] ?? null;
    items.push({
      key: p.slug ?? p.title,
      title: p.title,
      categoryTitle: p.categoryTitle,
      slug: p.slug,
      src: imageUrl(cover, 800),
      alt: cover?.alt ?? "",
    });
  }
  return items.length > 0 ? items : FALLBACK;
}

function Card({ item, index }: { item: Item; index: number }) {
  const content = (
    <>
      <div className="relative aspect-[4/5] overflow-hidden">
        {item.src ? (
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            style={{ transitionTimingFunction: "var(--ease-signature)" }}
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center transition-transform duration-500 group-hover:scale-[1.04] ${
              PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length]
            }`}
            style={{ transitionTimingFunction: "var(--ease-signature)" }}
            aria-hidden
          >
            <span className="font-bonny text-6xl font-thin text-creme/30">
              {item.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div className="p-sp-4">
        <h2 className="font-bonny text-xl font-medium leading-tight text-encre md:text-2xl">
          {item.title}
        </h2>
        {item.categoryTitle && (
          <p className="mt-sp-1 text-sm font-light text-encre-douce">{item.categoryTitle}</p>
        )}
      </div>
    </>
  );

  const shell =
    "group overflow-hidden rounded-panel bg-blush-2 transition-shadow duration-500 hover:shadow-lg hover:shadow-grenat/10";

  if (item.slug) {
    return (
      <Link
        href={`/produit/${item.slug}`}
        className={shell}
        style={{ transitionTimingFunction: "var(--ease-signature)" }}
      >
        {content}
      </Link>
    );
  }
  return (
    <div className={shell} style={{ transitionTimingFunction: "var(--ease-signature)" }}>
      {content}
    </div>
  );
}

export default async function BoutiquePage() {
  const products = await sanityFetch({ query: ALL_PRODUCTS_QUERY, tags: ["product"] });
  const items = toItems(products);

  return (
    <>
      {/* pt généreux : la navigation flottante passe par-dessus la bande. */}
      <section className="bg-petrole px-sp-4 pt-32 pb-sp-6 text-blush md:px-sp-5">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>La boutique</SectionLabel>
          <h1 className="mt-sp-3 max-w-2xl font-bonny text-4xl font-bold leading-[1.05] md:text-6xl">
            Toutes nos pièces
          </h1>
          <p className="mt-sp-4 max-w-xl font-light leading-relaxed opacity-90">
            Le stock vivant de nos deux boutiques — écrivez-nous pour réserver une pièce.
          </p>
        </div>
      </section>

      <section className="px-sp-4 py-sp-6 md:px-sp-5 md:py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-sp-3 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item, index) => (
            <Card key={item.key} item={item} index={index} />
          ))}
        </div>
      </section>
    </>
  );
}
