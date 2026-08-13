import { redirect } from "next/navigation";

// Le studio Sanity n'est plus embarqué dans le site : son bundle faisait passer le
// worker Cloudflare de 2,8 à 3,6 Mo compressés, au-dessus des 3 Mo du plan gratuit.
// Il est désormais hébergé par Sanity (gratuit, inclus dans le projet), et /admin
// reste l'adresse que le client connaît.
const STUDIO_URL =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? "https://kaboul-house.sanity.studio";

export const dynamic = "force-static";

export const metadata = {
  title: "Administration — Kaboul House",
  robots: { index: false, follow: false },
};

export default function AdminRedirect() {
  redirect(STUDIO_URL);
}
