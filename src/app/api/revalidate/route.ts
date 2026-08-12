import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { tagsForType } from "@/lib/revalidate-tags";

export async function POST(req: NextRequest) {
  let isValidSignature: boolean | null;
  let body: { _type?: string } | null | undefined;
  try {
    ({ isValidSignature, body } = await parseBody<{ _type?: string }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    ));
  } catch {
    // parseBody fait un JSON.parse interne avant de renvoyer
    // isValidSignature : un corps malformé jette ici, avant toute
    // vérification de signature. On renvoie 400 (corps inexploitable),
    // pas 401 (on ignore si la signature aurait été valide) — et on ne
    // revalide rien, pour ne pas déclencher de retry storm côté Sanity.
    return new NextResponse("Corps de requête invalide", { status: 400 });
  }

  if (!isValidSignature) {
    return new NextResponse("Signature invalide", { status: 401 });
  }

  const tags = body?._type ? tagsForType(body._type) : [];
  // Next 16: revalidateTag exige un second argument "profile" (cacheLife
  // name ou { expire }). { expire: 0 } force une expiration immédiate,
  // ce qui reproduit le comportement par défaut de l'ancien appel à un
  // seul argument revalidateTag(tag) d'avant Next 16.
  for (const tag of tags) revalidateTag(tag, { expire: 0 });

  return NextResponse.json({ revalidated: tags });
}
