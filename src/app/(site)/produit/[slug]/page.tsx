import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pill } from "@/components/ui/Pill";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { whatsappUrl } from "@/lib/whatsapp";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/fetch";
import { imageUrl } from "@/sanity/lib/image";
import { PRODUCT_QUERY, PRODUCT_SLUGS_QUERY, SETTINGS_QUERY } from "@/sanity/queries";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await client.fetch(PRODUCT_SLUGS_QUERY).catch(() => []);
  return slugs.flatMap(({ slug }) => (slug ? [{ slug }] : []));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const produit = await sanityFetch({ query: PRODUCT_QUERY, params: { slug }, tags: ["product"] });
  return {
    title: produit?.title ?? "Pièce",
    description: produit?.description ?? undefined,
  };
}

export default async function ProduitPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const [produit, settings] = await Promise.all([
    sanityFetch({ query: PRODUCT_QUERY, params: { slug }, tags: ["product"] }),
    sanityFetch({ query: SETTINGS_QUERY, tags: ["settings"] }),
  ]);

  if (!produit?.title) notFound();

  const photos = produit.images ?? [];
  const wa = whatsappUrl(settings?.whatsapp);

  return (
    <>
      {/* pt généreux : la navigation flottante passe par-dessus la bande. */}
      <section className="bg-petrole px-sp-4 pb-sp-6 pt-32 text-blush md:px-sp-5">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>{produit.category?.title ?? "Nos univers"}</SectionLabel>
          <h1 className="mt-sp-3 max-w-3xl font-bonny text-4xl font-bold leading-[1.05] md:text-6xl">
            {produit.title}
          </h1>
        </div>
      </section>

      <section className="px-sp-4 py-sp-6 md:px-sp-5 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-sp-5 md:grid-cols-2 md:items-start">
          <div className="flex flex-col gap-sp-3">
            {photos.length > 0 ? (
              photos.map((photo, i) => {
                const src = imageUrl(photo, 1200);
                if (!src) return null;
                return (
                  <div
                    key={i}
                    className="relative aspect-[4/5] overflow-hidden rounded-panel bg-blush-2"
                  >
                    <Image
                      src={src}
                      alt={photo.alt ?? `${produit.title} — photo ${i + 1}`}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                      priority={i === 0}
                    />
                  </div>
                );
              })
            ) : (
              <div
                className="flex aspect-[4/5] items-center justify-center rounded-panel bg-gradient-to-br from-grenat to-petrole"
                aria-hidden
              >
                <span className="font-bonny text-7xl font-thin text-creme/30">
                  {produit.title.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Colonne fixée au défilement : le bouton reste à portée le long de la galerie. */}
          <div className="md:sticky md:top-32">
            {produit.description && (
              <p className="font-light leading-relaxed text-encre">{produit.description}</p>
            )}

            <div className="mt-sp-5 flex flex-col items-start gap-sp-4">
              <Pill href={wa} variant="onLight">
                Demander cette pièce
              </Pill>
              <p className="max-w-sm font-light leading-relaxed text-encre-douce">
                Dimensions, prix, disponibilité dans l&apos;une de nos deux boutiques : écrivez-nous,
                on vous répond dans la journée.
              </p>
              {produit.category?.slug && (
                <Link
                  href={`/${produit.category.slug}`}
                  className="font-light text-grenat underline-offset-4 transition-colors hover:underline"
                >
                  ← Retour à {produit.category.title ?? "l'univers"}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
