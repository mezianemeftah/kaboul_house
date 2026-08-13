import type { Metadata } from "next";
import { AboutSection } from "@/components/sections/AboutSection";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { ContactTabs } from "@/components/sections/ContactTabs";
import { FeaturedSlider } from "@/components/sections/FeaturedSlider";
import { HomeHero } from "@/components/sections/HomeHero";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { WhatsAppBand } from "@/components/sections/WhatsAppBand";
import { whatsappUrl } from "@/lib/whatsapp";
import { sanityFetch } from "@/sanity/lib/fetch";
import { imageUrl } from "@/sanity/lib/image";
import { HOME_QUERY, HOME_SEO_QUERY, SETTINGS_QUERY } from "@/sanity/queries";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await sanityFetch({ query: HOME_SEO_QUERY, tags: ["homePage"] });
  return {
    // `absolute` : le gabarit « %s — Kaboul House » du layout racine ajoute le
    // nom de la maison à chaque page. Sur l'accueil, le titre saisi doit
    // s'afficher tel quel, sans suffixe.
    ...(seo?.seoTitle && { title: { absolute: seo.seoTitle } }),
    ...(seo?.seoDescription && { description: seo.seoDescription }),
  };
}

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
        ctaLabel={home?.heroCtaLabel ?? null}
        ctaHref={home?.heroCtaHref ?? null}
      />
      {/*
        Recouvrement : « Nos univers » se fige dès que son bas touche le bas de
        l'écran (`sticky bottom-0`), et la section WhatsApp (`z-10`) glisse
        par-dessus. Le conteneur `relative` borne la prise : passé la vidéo,
        les univers repartent avec le flux et la suite de la page est intacte.
      */}
      <div className="relative">
        {/*
          Ancre de navigation posée dans le flux, hors de l'élément collant :
          un lien visant directement la section figée atterrirait sur sa
          position collée, pas sur celle qu'elle occupe dans la page.
        */}
        <span id="univers" className="absolute top-0 block scroll-mt-28" aria-hidden />
        {/*
          `min-h-svh` : sur grand écran la section est plus courte que la fenêtre.
          Sans ce plancher, elle se figerait trop tôt et une bande de blush
          s'ouvrirait au-dessus d'elle. Avec, son haut arrive pile à 0 au moment
          où elle se fige — le vide restant passe en bas, aussitôt recouvert par
          la vidéo qui monte.
        */}
        <div className="sticky bottom-0 z-0 min-h-svh">
          <CategoryGrid
            categories={home?.categories}
            kicker={home?.universKicker ?? null}
            title={home?.universTitle ?? null}
            intro={home?.universIntro ?? null}
            linkLabel={home?.universLinkLabel ?? null}
          />
        </div>
        <WhatsAppBand
          whatsappHref={wa}
          videoUrl={home?.videoUrl ?? null}
          posterUrl={imageUrl(home?.videoPoster, 1600)}
          title={home?.videoTitle ?? null}
          text={home?.videoText ?? null}
          ctaLabel={home?.videoCtaLabel ?? null}
        />
      </div>
      <AboutSection
        kicker={home?.aboutKicker ?? null}
        title={home?.aboutTitle ?? null}
        text={home?.aboutText ?? null}
        imageLarge={home?.aboutImageLarge ?? null}
        imageSmall={home?.aboutImageSmall ?? null}
      />
      <FeaturedSlider
        products={home?.featuredProducts}
        kicker={home?.featuredKicker ?? null}
        title={home?.featuredTitle ?? null}
      />
      <ContactTabs
        shops={home?.shops}
        fallbackPhone={settings?.phone ?? settings?.whatsapp ?? null}
        kicker={home?.shopsKicker ?? null}
        title={home?.shopsTitle ?? null}
        emptyText={home?.shopsEmptyText ?? null}
      />
      <ReviewsSection
        reviews={home?.reviews}
        googleReviewsUrl={settings?.googleReviewsUrl}
        kicker={home?.reviewsKicker ?? null}
        title={home?.reviewsTitle ?? null}
        emptyText={home?.reviewsEmptyText ?? null}
        linkLabel={home?.reviewsLinkLabel ?? null}
      />
    </>
  );
}
