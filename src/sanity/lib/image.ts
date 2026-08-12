import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageSource) =>
  builder.image(source).auto("format").fit("max");

/**
 * URL d'une image Sanity issue d'une requête typée (dont `asset` est optionnel).
 * Renvoie null si l'image est absente — les sections affichent alors leur
 * placeholder décoratif.
 */
export function imageUrl(
  source: { asset?: unknown } | null | undefined,
  width: number,
): string | null {
  if (!source?.asset) return null;
  return urlFor(source as SanityImageSource)
    .width(width)
    .url();
}
