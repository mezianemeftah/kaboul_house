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

const LINK_CLASSES = "text-encre underline-offset-4 transition-colors hover:underline";

/** Une ligne du relevé de droite — libellé effacé à gauche, valeur alignée à droite. */
function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-sp-4 py-sp-3">
      <span className="font-light text-encre-douce">{label}</span>
      <span className="text-right">{children}</span>
    </div>
  );
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
  const hasDetails = Boolean(shop.phone || shop.email || shop.hours || shop.mapsUrl);

  return (
    <section id="contact" className="px-sp-4 py-sp-6 md:px-sp-5 md:py-24">
      <div className="mx-auto max-w-5xl">
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
          className="mt-sp-5 grid gap-sp-4 md:grid-cols-2 md:gap-sp-6"
        >
          <div>
            <h3 className="font-bonny text-3xl font-medium leading-[1.05] text-encre md:text-4xl">
              {name}
            </h3>
            {shop.address && (
              <p className="mt-sp-3 whitespace-pre-line font-light leading-relaxed text-encre-douce">
                {shop.address}
              </p>
            )}
          </div>

          <div>
            {hasDetails ? (
              <div className="divide-y divide-encre/10 border-t border-encre/10">
                {shop.phone && (
                  <DetailRow label="Téléphone">
                    <a href={`tel:${shop.phone.replace(/\s/g, "")}`} className={LINK_CLASSES}>
                      {shop.phone}
                    </a>
                  </DetailRow>
                )}
                {shop.email && (
                  <DetailRow label="Email">
                    <a href={`mailto:${shop.email}`} className={LINK_CLASSES}>
                      {shop.email}
                    </a>
                  </DetailRow>
                )}
                {shop.hours && (
                  <DetailRow label="Horaires">
                    <span className="text-encre">{shop.hours}</span>
                  </DetailRow>
                )}
                {shop.mapsUrl && (
                  <DetailRow label="Itinéraire">
                    <a
                      href={shop.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-grenat underline-offset-4 transition-colors hover:underline"
                    >
                      Ouvrir dans Google Maps →
                    </a>
                  </DetailRow>
                )}
              </div>
            ) : (
              <p className="font-light leading-relaxed text-encre-douce">
                Ouverture prochaine — écrivez-nous sur WhatsApp pour être prévenus.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
