"use client";

/**
 * Loader next/image : délègue les transformations au CDN Sanity (gratuit),
 * pas au service d'images Cloudflare (payant). Les assets locaux sont servis
 * tels quels — ils sont pré-optimisés au build (cf. scripts/optimize-hero.mjs).
 */
export default function sanityImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (!src.includes("cdn.sanity.io")) return src;
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
}
