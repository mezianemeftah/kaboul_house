import type { Metadata } from "next";
import { ProductCard, type ProductCardItem } from "@/components/ui/ProductCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FALLBACK_PRODUCTS } from "@/lib/fallback-content";
import { productTags } from "@/lib/product-tags";
import { sanityFetch } from "@/sanity/lib/fetch";
import { imageUrl } from "@/sanity/lib/image";
import { ALL_PRODUCTS_QUERY } from "@/sanity/queries";
import type { ALL_PRODUCTS_QUERY_RESULT } from "@/sanity/types";

export const metadata: Metadata = {
  title: "La boutique",
  description:
    "Toutes les pièces disponibles chez Kaboul House — tapis noués main, décoration et fruits secs d'Orient, à Grenoble et à Lyon.",
};

// Les pièces de repli n'ont ni prix ni origine : elles meublent la grille tant
// que le dataset est vide, sans prétendre décrire un produit réel.
const FALLBACK: ProductCardItem[] = FALLBACK_PRODUCTS.map((p) => ({
  ...p,
  slug: null,
  src: null,
  alt: "",
  tags: [],
}));

function toItems(products: ALL_PRODUCTS_QUERY_RESULT | null): ProductCardItem[] {
  const items: ProductCardItem[] = [];
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
      tags: productTags(p),
    });
  }
  return items.length > 0 ? items : FALLBACK;
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
            <ProductCard key={item.key} item={item} index={index} />
          ))}
        </div>
      </section>
    </>
  );
}
