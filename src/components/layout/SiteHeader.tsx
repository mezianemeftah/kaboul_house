"use client";

import Link from "next/link";
import { useState } from "react";
import { Pill } from "@/components/ui/Pill";

const LINKS = [
  { href: "/notre-maison", label: "Qui sommes-nous" },
  { href: "/#univers", label: "Nos univers" },
  { href: "/boutiques", label: "Nos boutiques" },
];

export function SiteHeader({
  whatsappHref,
  variant = "overlay",
}: {
  whatsappHref: string;
  variant?: "overlay" | "band";
}) {
  const [open, setOpen] = useState(false);
  const position = variant === "overlay" ? "absolute inset-x-0 top-0" : "bg-petrole";

  return (
    <header className={`${position} z-50 px-sp-4 pt-sp-4 pb-sp-3 text-white md:px-sp-5`}>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center">
        <Link href="/" className="justify-self-start font-bonny text-2xl font-bold">
          Kaboul House
        </Link>

        <nav className="hidden justify-self-center min-[760px]:flex min-[760px]:gap-sp-5">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="whitespace-nowrap font-normal opacity-85 transition-opacity hover:opacity-100"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden justify-self-end min-[760px]:block">
          <Pill href={whatsappHref}>Nous écrire</Pill>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          className="col-start-3 justify-self-end min-[760px]:hidden"
        >
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 8h16M4 16h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="mt-sp-3 flex flex-col items-start gap-sp-3 rounded-panel bg-encre/70 p-sp-4 backdrop-blur-md min-[760px]:hidden">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="font-normal">
              {l.label}
            </Link>
          ))}
          <Pill href={whatsappHref}>Nous écrire</Pill>
        </div>
      )}
    </header>
  );
}
