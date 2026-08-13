import Image from "next/image";
import { Pill } from "@/components/ui/Pill";
import { imageUrl } from "@/sanity/lib/image";
import type { HOME_QUERY_RESULT } from "@/sanity/types";
import { HeroSubtitle, HeroTitle } from "./HeroTitle";

type Home = NonNullable<HOME_QUERY_RESULT>;

const FALLBACK_TITLE = "L'Orient entre sous votre toit.";
const FALLBACK_SUBTITLE =
  "Tapis noués main, toshak, textiles, art de la table et fruits secs — de Kaboul jusqu'au cœur de Grenoble et de Lyon.";
const FALLBACK_IMAGE = "/images/hero-intro.webp";
const FALLBACK_CTA_LABEL = "Découvrir la boutique";
const FALLBACK_CTA_HREF = "/boutique";

export function HomeHero({
  title,
  subtitle,
  image,
  ctaLabel,
  ctaHref,
}: {
  title: string | null;
  subtitle: string | null;
  image: Home["heroImage"];
  ctaLabel: string | null;
  ctaHref: string | null;
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

        <div className="absolute inset-0 flex flex-col items-center justify-center px-sp-4 text-center text-white">
          <HeroTitle title={title ?? FALLBACK_TITLE} />
          <HeroSubtitle>{subtitle ?? FALLBACK_SUBTITLE}</HeroSubtitle>
          <div className="mt-sp-5">
            <Pill href={ctaHref ?? FALLBACK_CTA_HREF} variant="onDark">
              {ctaLabel ?? FALLBACK_CTA_LABEL}
            </Pill>
          </div>
        </div>
      </div>
    </section>
  );
}
