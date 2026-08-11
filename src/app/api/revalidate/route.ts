import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { tagsForType } from "@/lib/revalidate-tags";

export async function POST(req: NextRequest) {
  const { isValidSignature, body } = await parseBody<{ _type?: string }>(
    req,
    process.env.SANITY_REVALIDATE_SECRET,
  );

  if (!isValidSignature) {
    return new NextResponse("Signature invalide", { status: 401 });
  }

  const tags = body?._type ? tagsForType(body._type) : [];
  // Next 16: revalidateTag exige un second argument "profile" (cacheLife
  // name ou { expire }). On force une expiration immédiate pour un webhook.
  for (const tag of tags) revalidateTag(tag, { expire: 0 });

  return NextResponse.json({ revalidated: tags });
}
