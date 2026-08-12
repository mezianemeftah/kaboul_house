import Link from "next/link";

/**
 * Gabarit commun à toutes les pastilles : forme, rythme interne, graisse et
 * transition. Le style de référence est celui du bouton de navigation — pas
 * d'aplat, un filet fin, une graisse normale. Seule la couleur change selon le
 * fond qui porte le bouton.
 */
const PILL_BASE =
  "group inline-flex items-center gap-sp-2 rounded-pill border bg-transparent px-sp-4 py-sp-2 font-normal transition-colors";

/** Sur photo, vidéo, pétrole — bref, sur tout fond sombre. */
const PILL_ON_DARK =
  "border-white/40 text-white hover:border-white/70 hover:bg-white/10";

/** Sur blush, crème — bref, sur tout fond clair (grenat sur blush ≈ 7:1). */
const PILL_ON_LIGHT =
  "border-grenat/40 text-grenat hover:border-grenat/70 hover:bg-grenat/5";

export type PillVariant = "onDark" | "onLight";

function pillClasses(variant: PillVariant): string {
  return `${PILL_BASE} ${variant === "onLight" ? PILL_ON_LIGHT : PILL_ON_DARK}`;
}

function Star() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-3.5 shrink-0 transition-transform duration-300 group-hover:rotate-45"
      style={{ transitionTimingFunction: "var(--ease-signature)" }}
      aria-hidden
    >
      <path
        d="M8 0C8.6 4.2 11.8 7.4 16 8c-4.2.6-7.4 3.8-8 8-.6-4.2-3.8-7.4-8-8 4.2-.6 7.4-3.8 8-8Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Pill({
  href,
  onClick,
  variant = "onDark",
  children,
}: {
  href: string;
  onClick?: () => void;
  variant?: PillVariant;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <Link
      href={href}
      onClick={onClick}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className={pillClasses(variant)}
    >
      <Star />
      {children}
    </Link>
  );
}

export function PillButton({
  onClick,
  variant = "onDark",
  children,
}: {
  onClick: () => void;
  variant?: PillVariant;
  children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} className={pillClasses(variant)}>
      <Star />
      {children}
    </button>
  );
}
