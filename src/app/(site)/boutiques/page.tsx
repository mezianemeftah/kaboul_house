import type { Metadata } from "next";
import { ContactTabs } from "@/components/sections/ContactTabs";
import { Pill } from "@/components/ui/Pill";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { whatsappUrl } from "@/lib/whatsapp";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SETTINGS_QUERY, SHOPS_QUERY } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Nos boutiques",
  description:
    "Kaboul House vous accueille à Grenoble et bientôt à Lyon — adresses, horaires et itinéraire.",
};

export default async function BoutiquesPage() {
  const [shops, settings] = await Promise.all([
    sanityFetch({ query: SHOPS_QUERY, tags: ["shop"] }),
    sanityFetch({ query: SETTINGS_QUERY, tags: ["settings"] }),
  ]);
  const wa = whatsappUrl(settings?.whatsapp);

  return (
    <>
      {/* pt généreux : la navigation flottante passe par-dessus la bande. */}
      <section className="bg-petrole px-sp-4 pb-sp-6 pt-32 text-blush md:px-sp-5">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>Nos boutiques</SectionLabel>
          <h1 className="mt-sp-3 max-w-2xl font-bonny text-4xl font-bold leading-[1.05] md:text-6xl">
            Venez pousser la porte
          </h1>
          <p className="mt-sp-4 max-w-xl font-light leading-relaxed opacity-90">
            Rien ne remplace la main posée sur un tapis. Nos deux adresses vous attendent — on vous
            sert le thé.
          </p>
        </div>
      </section>

      {/*
        Mêmes onglets que sur l'accueil : une seule mise en forme à maintenir,
        et le visiteur retrouve la présentation qu'il connaît déjà.
      */}
      <ContactTabs shops={shops} fallbackPhone={settings?.phone ?? settings?.whatsapp ?? null} />

      <section className="px-sp-4 pb-sp-6 md:px-sp-5 md:pb-24">
        <div className="mx-auto max-w-6xl rounded-panel bg-blush-2 p-sp-5 text-center md:p-sp-6">
          <h2 className="font-bonny text-3xl font-bold text-encre md:text-4xl">
            Une question avant de venir ?
          </h2>
          <p className="mx-auto mt-sp-3 max-w-lg font-light leading-relaxed text-encre-douce">
            Dimensions, disponibilité, mise de côté : écrivez-nous, on vous répond dans la journée.
          </p>
          <div className="mt-sp-5 flex justify-center">
            <Pill href={wa} variant="onLight">
              Nous écrire sur WhatsApp
            </Pill>
          </div>
        </div>
      </section>
    </>
  );
}
