import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Pill } from "@/components/ui/Pill";
import { ProductCard, type ProductCardItem } from "@/components/ui/ProductCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FALLBACK_CATEGORIES } from "@/lib/fallback-content";
import { whatsappUrl } from "@/lib/whatsapp";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/fetch";
import { imageUrl } from "@/sanity/lib/image";
import { CATEGORY_QUERY, CATEGORY_SLUGS_QUERY, SETTINGS_QUERY } from "@/sanity/queries";
import type { CATEGORY_QUERY_RESULT } from "@/sanity/types";

type Params = { categorie: string };

/**
 * Slugs connus : ceux de Sanity, plus les cinq univers de repli tant que le
 * dataset est vide — sans eux, les entrées du menu déroulant tomberaient
 * toutes en 404 avant la première saisie du client.
 */
export async function generateStaticParams(): Promise<Params[]> {
  const depuisSanity = await client.fetch(CATEGORY_SLUGS_QUERY).catch(() => []);
  const slugs = new Set<string>(FALLBACK_CATEGORIES.map((c) => c.slug));
  for (const { slug } of depuisSanity) if (slug) slugs.add(slug);
  return [...slugs].map((categorie) => ({ categorie }));
}

/** Contenu d'en-tête, que l'univers vienne de Sanity ou du repli. */
function enTete(categorie: CATEGORY_QUERY_RESULT, slug: string) {
  const repli = FALLBACK_CATEGORIES.find((c) => c.slug === slug);
  if (!categorie && !repli) return null;
  return {
    titre: categorie?.title ?? repli?.title ?? "",
    description: categorie?.description ?? repli?.description ?? null,
    surtitre: repli?.kicker ?? "Nos univers",
  };
}

function toItems(categorie: CATEGORY_QUERY_RESULT): ProductCardItem[] {
  const items: ProductCardItem[] = [];
  for (const p of categorie?.products ?? []) {
    if (!p.title) continue;
    const couverture = p.images?.[0] ?? null;
    items.push({
      key: p.slug ?? p.title,
      title: p.title,
      categoryTitle: null,
      slug: p.slug,
      src: imageUrl(couverture, 800),
      alt: couverture?.alt ?? "",
    });
  }
  return items;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { categorie: slug } = await params;
  const categorie = await sanityFetch({
    query: CATEGORY_QUERY,
    params: { slug },
    tags: ["category", "product"],
  });
  const tete = enTete(categorie, slug);
  return {
    title: tete?.titre ?? "Univers",
    description: tete?.description ?? undefined,
  };
}

export default async function CategoriePage({ params }: { params: Promise<Params> }) {
  const { categorie: slug } = await params;
  const [categorie, settings] = await Promise.all([
    sanityFetch({ query: CATEGORY_QUERY, params: { slug }, tags: ["category", "product"] }),
    sanityFetch({ query: SETTINGS_QUERY, tags: ["settings"] }),
  ]);

  const tete = enTete(categorie, slug);
  if (!tete) notFound();

  const items = toItems(categorie);
  const wa = whatsappUrl(settings?.whatsapp);

  return (
    <>
      {/* pt généreux : la navigation flottante passe par-dessus la bande. */}
      <section className="bg-petrole px-sp-4 pb-sp-6 pt-32 text-blush md:px-sp-5">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>{tete.surtitre}</SectionLabel>
          <h1 className="mt-sp-3 max-w-2xl font-bonny text-4xl font-bold leading-[1.05] md:text-6xl">
            {tete.titre}
          </h1>
          {tete.description && (
            <p className="mt-sp-4 max-w-xl font-light leading-relaxed opacity-90">
              {tete.description}
            </p>
          )}
        </div>
      </section>

      <section className="px-sp-4 py-sp-6 md:px-sp-5 md:py-24">
        <div className="mx-auto max-w-6xl">
          {items.length > 0 ? (
            <div className="grid grid-cols-2 gap-sp-3 md:grid-cols-3 lg:grid-cols-4">
              {items.map((item, index) => (
                <ProductCard key={item.key} item={item} index={index} />
              ))}
            </div>
          ) : (
            <div className="rounded-panel bg-blush-2 p-sp-5 text-center md:p-sp-6">
              <p className="mx-auto max-w-lg font-light leading-relaxed text-encre-douce">
                Les pièces de cet univers arrivent bientôt en ligne. En attendant, elles vous
                attendent en boutique — écrivez-nous pour savoir ce qui est disponible.
              </p>
              <div className="mt-sp-5 flex justify-center">
                <Pill href={wa} variant="onLight">
                  Nous écrire sur WhatsApp
                </Pill>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
