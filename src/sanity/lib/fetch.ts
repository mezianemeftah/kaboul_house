import type { ClientReturn } from "next-sanity";
import { draftMode } from "next/headers";
import { client } from "./client";

let warnedOffline = false;

/**
 * Fetch GROQ avec tags de cache. En draft mode (Presentation), lit les
 * brouillons sans cache avec stega pour les overlays d'édition visuelle.
 * SANITY_OFFLINE=1 : renvoie null sans appel réseau (projet Sanity pas
 * encore créé) — les pages affichent leurs fallbacks.
 */
export async function sanityFetch<const QueryString extends string>({
  query,
  params = {},
  tags,
}: {
  query: QueryString;
  params?: Record<string, unknown>;
  tags: string[];
}): Promise<ClientReturn<QueryString> | null> {
  if (process.env.SANITY_OFFLINE === "1") {
    if (!warnedOffline) {
      warnedOffline = true;
      console.warn(
        "[sanity] SANITY_OFFLINE=1 — les fetchs renvoient null (fallbacks UI). Ne pas laisser ce flag en production.",
      );
    }
    return null;
  }
  const { isEnabled: isDraft } = await draftMode();
  return client.fetch(query, params, {
    ...(isDraft && {
      token: process.env.SANITY_API_READ_TOKEN,
      perspective: "drafts",
      useCdn: false,
      stega: true,
    }),
    next: isDraft ? { revalidate: 0 } : { tags },
  });
}
