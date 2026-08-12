"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const POSTER = "/images/category-prayer.webp";

/**
 * Fond de la section WhatsApp. La vidéo n'est montée — donc téléchargée et
 * jouée — que si l'utilisateur n'a pas demandé à réduire les animations ;
 * sinon la photo fixe tient le rôle d'affiche. Le rendu serveur part de
 * l'affiche, l'hypothèse la plus prudente.
 *
 * `preload="auto"` : le fichier fait ~17 Mo et la section arrive tôt dans la
 * page ; avec `metadata`, le premier écran restait sur l'affiche le temps du
 * tampon — c'est l'image fixe que le client avait vue. Un appel explicite à
 * `play()` rattrape par ailleurs les navigateurs qui ignorent `autoPlay` au
 * montage (le muet est requis pour que la politique d'autoplay l'accepte).
 */
export function AmbianceVideo() {
  const [motionAllowed, setMotionAllowed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotionAllowed(!query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!motionAllowed) return;
    videoRef.current?.play().catch(() => {
      /* politique d'autoplay : l'affiche reste, c'est un repli acceptable */
    });
  }, [motionAllowed]);

  if (!motionAllowed) {
    return <Image src={POSTER} alt="" fill sizes="100vw" className="object-cover" aria-hidden />;
  }

  return (
    <video
      ref={videoRef}
      className="h-full w-full object-cover"
      src="/videos/ambiance.mp4"
      poster={POSTER}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
    />
  );
}
