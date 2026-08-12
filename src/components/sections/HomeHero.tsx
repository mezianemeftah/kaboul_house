import Image from "next/image";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { imageUrl } from "@/sanity/lib/image";
import type { HOME_QUERY_RESULT } from "@/sanity/types";
import { HeroSubtitle, HeroTitle } from "./HeroTitle";

type Home = NonNullable<HOME_QUERY_RESULT>;

const FALLBACK_TITLE = "Trois univers, une même grande maison.";
const FALLBACK_SUBTITLE =
  "Tapis noués main, décoration choisie et fruits secs d'Orient — de Kaboul jusqu'au cœur de Grenoble et de Lyon.";
const FALLBACK_IMAGE = "/images/hero-intro.webp";

export function HomeHero({
  title,
  subtitle,
  image,
  whatsappHref,
}: {
  title: string | null;
  subtitle: string | null;
  image: Home["heroImage"];
  whatsappHref: string;
}) {
  const src = imageUrl(image, 2400) ?? FALLBACK_IMAGE;

  return (
    <section className="p-2 md:p-3">
      <div className="relative h-[calc(100svh-16px)] overflow-hidden rounded-[var(--radius-hero)] md:h-[calc(100svh-24px)]">
        <Image
          src={src}
          alt={image?.alt ?? ""}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-encre/50 via-encre/15 to-encre/55"
          aria-hidden
        />

        <SiteHeader whatsappHref={whatsappHref} variant="overlay" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-sp-4 text-center text-white">
          <HeroTitle title={title ?? FALLBACK_TITLE} />
          <HeroSubtitle>{subtitle ?? FALLBACK_SUBTITLE}</HeroSubtitle>
        </div>
      </div>
    </section>
  );
}
