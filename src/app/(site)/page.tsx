import { AboutSection } from "@/components/sections/AboutSection";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { ContactTabs } from "@/components/sections/ContactTabs";
import { FeaturedBento } from "@/components/sections/FeaturedBento";
import { HomeHero } from "@/components/sections/HomeHero";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { WhatsAppBand } from "@/components/sections/WhatsAppBand";
import { whatsappUrl } from "@/lib/whatsapp";
import { sanityFetch } from "@/sanity/lib/fetch";
import { HOME_QUERY, SETTINGS_QUERY } from "@/sanity/queries";

export default async function HomePage() {
  const [home, settings] = await Promise.all([
    sanityFetch({
      query: HOME_QUERY,
      tags: ["homePage", "category", "product", "shop", "googleReview"],
    }),
    sanityFetch({ query: SETTINGS_QUERY, tags: ["settings"] }),
  ]);
  const wa = whatsappUrl(settings?.whatsapp);

  return (
    <>
      <HomeHero
        title={home?.heroTitle ?? null}
        subtitle={home?.heroSubtitle ?? null}
        image={home?.heroImage ?? null}
      />
      {/*
        Recouvrement : « Nos univers » se fige dès que son bas touche le bas de
        l'écran (`sticky bottom-0`), et la section WhatsApp (`z-10`) glisse
        par-dessus. Le conteneur `relative` borne la prise : passé la vidéo,
        les univers repartent avec le flux et la suite de la page est intacte.
      */}
      <div className="relative">
        {/*
          `min-h-svh` : sur grand écran la section est plus courte que la fenêtre.
          Sans ce plancher, elle se figerait trop tôt et une bande de blush
          s'ouvrirait au-dessus d'elle. Avec, son haut arrive pile à 0 au moment
          où elle se fige — le vide restant passe en bas, aussitôt recouvert par
          la vidéo qui monte.
        */}
        <div className="sticky bottom-0 z-0 min-h-svh">
          <CategoryGrid categories={home?.categories} />
        </div>
        <WhatsAppBand whatsappHref={wa} />
      </div>
      <AboutSection title={home?.aboutTitle ?? null} text={home?.aboutText ?? null} />
      <FeaturedBento products={home?.featuredProducts} />
      <ContactTabs
        shops={home?.shops}
        fallbackPhone={settings?.phone ?? settings?.whatsapp ?? null}
      />
      <ReviewsSection reviews={home?.reviews} googleReviewsUrl={settings?.googleReviewsUrl} />
    </>
  );
}
