import Link from "next/link";
import { RugDivider } from "@/components/layout/RugDivider";
import { Pill } from "@/components/ui/Pill";
import { whatsappUrl } from "@/lib/whatsapp";
import type { SETTINGS_QUERY_RESULT } from "@/sanity/types";

/**
 * Pied de page en pleine hauteur (60 % de l'écran au minimum), sur fond pétrole.
 *
 * La réserve de 200 px en haut accueille le tapis volant, remonté à cheval sur
 * la section précédente — le pied de page ne borne donc pas ce qui déborde.
 */
export function SiteFooter({ settings }: { settings: SETTINGS_QUERY_RESULT | null }) {
  return (
    <footer className="relative flex min-h-[60svh] flex-col justify-end bg-petrole px-sp-4 pb-sp-6 pt-[200px] text-blush md:px-sp-5">
      <RugDivider />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-sp-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-bonny text-3xl font-bold">Kaboul House</p>
          <p className="mt-sp-2 max-w-sm font-light opacity-80">
            Bazar oriental à Grenoble et Lyon — tapis noués main, décoration et fruits secs d&apos;Orient.
          </p>
        </div>
        <nav className="flex flex-col gap-sp-2">
          <Link href="/notre-maison" className="opacity-85 transition-opacity hover:opacity-100">Qui sommes-nous</Link>
          <Link href="/#univers" className="opacity-85 transition-opacity hover:opacity-100">Nos univers</Link>
          <Link href="/boutiques" className="opacity-85 transition-opacity hover:opacity-100">Nos boutiques</Link>
        </nav>
        <div className="flex flex-col items-start gap-sp-3">
          <Pill href={whatsappUrl(settings?.whatsapp)} variant="onDark">
            Nous écrire sur WhatsApp
          </Pill>
          {settings?.phone && <p className="opacity-80">{settings.phone}</p>}
          <div className="flex gap-sp-3">
            {settings?.instagram && (
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="opacity-85 transition-opacity hover:opacity-100">
                Instagram
              </a>
            )}
            {settings?.facebook && (
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="opacity-85 transition-opacity hover:opacity-100">
                Facebook
              </a>
            )}
          </div>
        </div>
      </div>
      <p className="relative z-10 mx-auto mt-sp-6 w-full max-w-6xl text-sm font-light opacity-60">
        © {new Date().getFullYear()} Kaboul House — Grenoble · Lyon
      </p>
    </footer>
  );
}
