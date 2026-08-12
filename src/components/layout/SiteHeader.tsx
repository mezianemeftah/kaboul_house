"use client";

import Link from "next/link";
import { useState } from "react";
import { Pill } from "@/components/ui/Pill";

const LINKS = [
  { href: "/notre-maison", label: "Qui sommes-nous" },
  { href: "/#univers", label: "Nos univers" },
  { href: "/boutiques", label: "Nos boutiques" },
];

/**
 * Navigation flottante en verre fumé, fixée en haut de toutes les pages
 * (montée une seule fois dans `(site)/layout.tsx`). Détachée des bords par
 * une marge, elle laisse voir la photo du hero — puis le contenu — au travers.
 */
export function SiteHeader({ whatsappHref }: { whatsappHref: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-sp-3 mt-sp-3 md:mx-sp-5">
        <div className="rounded-panel border border-white/10 bg-encre/35 px-sp-4 py-sp-2 text-white backdrop-blur-md">
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
              <Pill href={whatsappHref} variant="outline">
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
            <Pill href={whatsappHref} variant="outline" onClick={() => setOpen(false)}>
              Nous écrire
            </Pill>
          </div>
        )}
      </div>
    </header>
  );
}
