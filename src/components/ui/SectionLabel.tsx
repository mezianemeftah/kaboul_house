/**
 * Croissant de lune des surtitres — même grammaire que l'étoile des boutons :
 * viewBox de 16, aplat en `currentColor`, poids optique voisin. Le tracé est la
 * différence de deux cercles (extérieur centré à 8,8 r 6,8 ; entaille à 12,5.6
 * r 7), les arcs partant des deux points d'intersection exacts — d'où une
 * épaisseur régulière d'environ 4,5 unités, ni filet ni pleine lune.
 */
function Crescent() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 shrink-0" aria-hidden>
      <path
        d="M6.41 1.39A6.8 6.8 0 1 0 13.08 12.52A7 7 0 0 1 6.41 1.39Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-sp-2 font-normal text-current">
      <Crescent />
      {children}
    </p>
  );
}
