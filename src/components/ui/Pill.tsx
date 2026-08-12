import Link from "next/link";

const PILL_CLASSES =
  "group inline-flex items-center gap-sp-2 rounded-pill border border-grenat/30 bg-creme px-sp-4 py-sp-2 font-bold text-grenat transition-colors hover:bg-blush";

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
  children,
}: {
  href: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <Link
      href={href}
      onClick={onClick}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className={PILL_CLASSES}
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
    <button type="button" onClick={onClick} className={PILL_CLASSES}>
      <Star />
      {children}
    </button>
  );
}
