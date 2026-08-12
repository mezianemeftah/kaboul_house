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
        whatsappHref={wa}
      />
      <CategoryGrid categories={home?.categories} />
      <WhatsAppBand whatsappHref={wa} />
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
