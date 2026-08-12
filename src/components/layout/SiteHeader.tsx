"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Pill } from "@/components/ui/Pill";

const LINKS = [
  { href: "/notre-maison", label: "Qui sommes-nous" },
  { href: "/#univers", label: "Nos univers" },
  { href: "/boutiques", label: "Nos boutiques" },
];

/** Défilement au-delà duquel la carte de verre apparaît. */
const SCROLL_THRESHOLD = 24;

/**
 * Navigation flottante, fixée en haut de toutes les pages (montée une seule
 * fois dans `(site)/layout.tsx`).
 *
 * En haut de page elle n'est qu'un texte posé sur la photo du hero : aucun
 * aplat, aucun filet, aucun flou. Dès le premier défilement, la carte de verre
 * fumé se fond dedans. Les marges et le rembourrage sont identiques dans les
 * deux états — seules la couleur de fond et celle du filet changent, donc rien
 * ne bouge quand la carte apparaît.
 */
export function SiteHeader({ whatsappHref }: { whatsappHref: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sync = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    sync(); // position restaurée : l'état doit être juste dès le montage
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-sp-3 mt-sp-3 md:mx-sp-5">
        <div
          data-scrolled={scrolled}
          className={`rounded-panel border px-sp-4 py-sp-2 text-white transition-[background-color,border-color,backdrop-filter] duration-300 ${
            scrolled
              ? "border-white/10 bg-encre/35 backdrop-blur-md"
              : "border-transparent bg-transparent"
          }`}
          style={{ transitionTimingFunction: "var(--ease-signature)" }}
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-center">
            <Link href="/" className="justify-self-start font-bonny text-2xl font-bold">
              Kaboul House
            </Link>

            <nav className="hidden justify-self-center min-[760px]:flex min-[760px]:gap-sp-5">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="whitespace-nowrap font-light opacity-85 transition-opacity hover:opacity-100"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="hidden justify-self-end min-[760px]:block">
              <Pill href={whatsappHref} variant="onDark">
                Nous écrire
              </Pill>
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              className="col-start-3 justify-self-end min-[760px]:hidden"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden
              >
                {open ? (
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                ) : (
                  <path d="M4 8h16M4 16h16" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div
            id="menu-mobile"
            className="mt-sp-2 flex flex-col items-start gap-sp-3 rounded-panel border border-white/10 bg-encre/60 p-sp-4 text-white backdrop-blur-md min-[760px]:hidden"
          >
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-light"
              >
                {l.label}
              </Link>
            ))}
            <Pill href={whatsappHref} variant="onDark" onClick={() => setOpen(false)}>
              Nous écrire
            </Pill>
          </div>
        )}
      </div>
    </header>
  );
}
