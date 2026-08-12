"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Pill } from "@/components/ui/Pill";

export type NavCategory = { title: string; slug: string };

const LINKS = [
  { href: "/#la-maison", label: "Qui sommes-nous" },
  { href: "/#univers", label: "Nos univers" },
  { href: "/boutiques", label: "Nos boutiques" },
];

/** Hauteur réservée à la nav flottante au-dessus d'une ancre. */
const NAV_OFFSET = 112;

/**
 * Défilement vers une ancre de la page courante.
 *
 * Next.js ne fait rien lorsqu'un lien vise la page déjà affichée : le clic sur
 * « Qui sommes-nous » depuis l'accueil ne bougeait pas d'un pixel. On prend
 * donc la main dès que la cible est sur cette même page, et on laisse Next
 * naviguer normalement dans le cas contraire.
 */
function useAnchorNavigation() {
  const pathname = usePathname();

  return (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const [path, hash] = href.split("#");
    if (!hash || (path !== "/" ? path : "/") !== pathname) return;

    const cible = document.getElementById(hash);
    if (!cible) return;

    event.preventDefault();
    const y = cible.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });
    window.history.pushState(null, "", href);
  };
}

function ChevronBas({ ouvert }: { ouvert: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`size-3 transition-transform duration-300 ${ouvert ? "rotate-180" : ""}`}
      style={{ transitionTimingFunction: "var(--ease-signature)" }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M3.5 6 8 10.5 12.5 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Barre de navigation flottante.
 *
 * Transparente tant qu'on est en haut de page — elle se fond alors dans la
 * photo du hero — puis le fond en verre dépoli apparaît au défilement. Les
 * marges sont identiques dans les deux états pour qu'aucun élément ne bouge
 * quand le fond se pose.
 */
export function SiteHeader({
  whatsappHref,
  categories,
}: {
  whatsappHref: string;
  categories: NavCategory[];
}) {
  const [open, setOpen] = useState(false);
  const [boutiqueOuverte, setBoutiqueOuverte] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const naviguerVersAncre = useAnchorNavigation();

  useEffect(() => {
    const sync = () => setScrolled(window.scrollY > 24);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);

  const fond = scrolled
    ? "border-white/10 bg-encre/35 backdrop-blur-md"
    : "border-transparent bg-transparent";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-sp-3 pt-sp-3 md:px-sp-5">
      <div
        className={`mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center rounded-panel border px-sp-4 py-sp-2 text-white transition-[background-color,border-color,backdrop-filter] duration-300 ${fond}`}
        style={{ transitionTimingFunction: "var(--ease-signature)" }}
      >
        <Link href="/" className="justify-self-start font-bonny text-2xl font-bold">
          Kaboul House
        </Link>

        <nav className="hidden justify-self-center min-[900px]:flex min-[900px]:items-center min-[900px]:gap-sp-5">
          {/* Le survol suffit à la souris ; le clic ouvre aussi, pour le tactile. */}
          <div
            className="relative"
            onMouseEnter={() => setBoutiqueOuverte(true)}
            onMouseLeave={() => setBoutiqueOuverte(false)}
          >
            <button
              type="button"
              onClick={() => setBoutiqueOuverte((v) => !v)}
              aria-expanded={boutiqueOuverte}
              aria-haspopup="true"
              className="flex items-center gap-sp-2 whitespace-nowrap font-light opacity-85 transition-opacity hover:opacity-100"
            >
              La boutique
              <ChevronBas ouvert={boutiqueOuverte} />
            </button>

            {boutiqueOuverte && (
              <div className="absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-sp-3">
                <div className="flex flex-col rounded-panel border border-white/10 bg-encre/80 p-sp-2 backdrop-blur-md">
                  <Link
                    href="/boutique"
                    onClick={() => setBoutiqueOuverte(false)}
                    className="rounded-[10px] px-sp-3 py-sp-2 font-light opacity-85 transition-colors hover:bg-white/10 hover:opacity-100"
                  >
                    Toutes les pièces
                  </Link>
                  <span className="my-sp-1 h-px bg-white/10" aria-hidden />
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/${c.slug}`}
                      onClick={() => setBoutiqueOuverte(false)}
                      className="rounded-[10px] px-sp-3 py-sp-2 font-light opacity-85 transition-colors hover:bg-white/10 hover:opacity-100"
                    >
                      {c.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={(e) => naviguerVersAncre(e, l.href)}
              className="whitespace-nowrap font-light opacity-85 transition-opacity hover:opacity-100"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden justify-self-end min-[900px]:block">
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
          className="col-start-3 justify-self-end min-[900px]:hidden"
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

      {open && (
        <div
          id="menu-mobile"
          className="mx-auto mt-sp-3 flex max-w-6xl flex-col items-start gap-sp-3 rounded-panel border border-white/10 bg-encre/70 p-sp-4 text-white backdrop-blur-md min-[900px]:hidden"
        >
          <p className="font-light opacity-60">La boutique</p>
          <Link
            href="/boutique"
            onClick={() => setOpen(false)}
            className="pl-sp-3 font-light opacity-85"
          >
            Toutes les pièces
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              onClick={() => setOpen(false)}
              className="pl-sp-3 font-light opacity-85"
            >
              {c.title}
            </Link>
          ))}

          <span className="h-px w-full bg-white/10" aria-hidden />

          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={(e) => {
                setOpen(false);
                naviguerVersAncre(e, l.href);
              }}
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
    </header>
  );
}
