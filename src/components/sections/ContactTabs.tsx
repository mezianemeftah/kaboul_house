"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { HOME_QUERY_RESULT } from "@/sanity/types";

type Shop = NonNullable<HOME_QUERY_RESULT>["shops"][number];

/** Nom court pour l'onglet : « Kaboul House — Grenoble » → « Grenoble ». */
function tabLabel(name: string): string {
  const parts = name.split(/\s[—–-]\s/);
  return parts[parts.length - 1].trim() || name;
}

function fallbackShops(phone: string | null): Shop[] {
  return [
    {
      name: "Kaboul House — Grenoble",
      address: "1 boulevard Gambetta\n38000 Grenoble",
      phone,
      email: null,
      hours: "Lun–Sam : 10h–19h",
      mapsUrl: null,
    },
    {
      name: "Kaboul House — Lyon",
      address: "Adresse à venir — ouverture prochaine",
      phone: null,
      email: null,
      hours: null,
      mapsUrl: null,
    },
  ];
}

export function ContactTabs({
  shops,
  fallbackPhone = null,
}: {
  shops: Shop[] | null | undefined;
  fallbackPhone?: string | null;
}) {
  const list = (shops ?? []).filter((s): s is Shop & { name: string } => Boolean(s.name));
  const items: Shop[] = list.length > 0 ? list : fallbackShops(fallbackPhone);
  const [active, setActive] = useState(0);
  const shop = items[Math.min(active, items.length - 1)];
  const name = shop.name ?? "Kaboul House";

  return (
    <section id="contact" className="px-sp-4 py-sp-6 md:px-sp-5 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-grenat">
          <SectionLabel>Nous trouver</SectionLabel>
        </div>
        <h2 className="mt-sp-3 font-bonny text-4xl font-bold leading-[1.05] text-encre md:text-5xl">
          Deux adresses, une même maison
        </h2>

        <div role="tablist" aria-label="Nos boutiques" className="mt-sp-5 flex flex-wrap gap-sp-2">
          {items.map((s, i) => {
            const selected = i === active;
            return (
              <button
                key={s.name ?? i}
                type="button"
                role="tab"
                id={`onglet-boutique-${i}`}
                aria-selected={selected}
                aria-controls="panneau-boutique"
                onClick={() => setActive(i)}
                className={`rounded-pill px-sp-4 py-sp-2 transition-colors ${
                  selected ? "bg-petrole text-blush" : "bg-blush-2 text-encre hover:bg-creme"
                }`}
                style={{ transitionTimingFunction: "var(--ease-signature)" }}
              >
                {tabLabel(s.name ?? `Boutique ${i + 1}`)}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id="panneau-boutique"
          aria-labelledby={`onglet-boutique-${active}`}
          className="mt-sp-4 rounded-panel bg-creme p-sp-5"
        >
          <h3 className="font-bonny text-2xl font-medium text-encre">{name}</h3>

          {shop.address && (
            <p className="mt-sp-3 whitespace-pre-line font-light leading-relaxed text-encre-douce">
              {shop.address}
            </p>
          )}
          {shop.hours && <p className="mt-sp-3 font-light text-encre-douce">{shop.hours}</p>}

          <div className="mt-sp-4 flex flex-wrap items-center gap-x-sp-5 gap-y-sp-2">
            {shop.phone && (
              <a
                href={`tel:${shop.phone.replace(/\s/g, "")}`}
                className="text-grenat underline decoration-grenat/40 underline-offset-8 transition-colors hover:decoration-grenat"
              >
                {shop.phone}
              </a>
            )}
            {shop.email && (
              <a
                href={`mailto:${shop.email}`}
                className="text-grenat underline decoration-grenat/40 underline-offset-8 transition-colors hover:decoration-grenat"
              >
                {shop.email}
              </a>
            )}
            {shop.mapsUrl && (
              <a
                href={shop.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-grenat underline decoration-grenat/40 underline-offset-8 transition-colors hover:decoration-grenat"
              >
                Itinéraire →
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
