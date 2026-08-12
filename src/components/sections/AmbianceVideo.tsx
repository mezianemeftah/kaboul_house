"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const POSTER = "/images/category-prayer.webp";

/**
 * Fond de la section WhatsApp. La vidéo n'est montée — donc téléchargée et
 * jouée — que si l'utilisateur n'a pas demandé à réduire les animations ;
 * sinon la photo fixe tient le rôle d'affiche. Le rendu serveur part de
 * l'affiche, l'hypothèse la plus prudente.
 */
export function AmbianceVideo() {
  const [motionAllowed, setMotionAllowed] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotionAllowed(!query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  if (!motionAllowed) {
    return <Image src={POSTER} alt="" fill sizes="100vw" className="object-cover" aria-hidden />;
  }

  return (
    <video
      className="h-full w-full object-cover"
      src="/videos/ambiance.mp4"
      poster={POSTER}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
    />
  );
}
