import Link from "next/link";

/** Gabarit commun aux deux variantes : forme, rythme interne, transition. */
const PILL_BASE =
  "group inline-flex items-center gap-sp-2 rounded-pill border px-sp-4 py-sp-2 transition-colors";

/** Variante par défaut — crème sur fond clair, utilisée partout hors navigation. */
const PILL_SOLID = "border-grenat/30 bg-creme font-bold text-grenat hover:bg-blush";

/** Variante contour — posée sur le verre fumé de la navigation, sans aplat. */
const PILL_OUTLINE =
  "border-white/40 bg-transparent font-normal text-white hover:border-white/70 hover:bg-white/10";

export type PillVariant = "solid" | "outline";

function pillClasses(variant: PillVariant): string {
  return `${PILL_BASE} ${variant === "outline" ? PILL_OUTLINE : PILL_SOLID}`;
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
  variant = "solid",
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
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} className={pillClasses("solid")}>
      <Star />
      {children}
    </button>
  );
}
