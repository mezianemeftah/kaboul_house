"use client";

import { useEffect, useRef, useState } from "react";

const POSTER = "/images/category-prayer.webp";

/**
 * Fond vidéo de la section WhatsApp.
 *
 * La vidéo est toujours montée et jouée : c'est un décor muet en boucle, pas
 * une animation d'interface. L'accessibilité passe ici par le bouton pause
 * (WCAG 2.2.2 : tout média qui démarre seul au-delà de 5 s doit pouvoir être
 * arrêté), et non par la suppression du média — une version antérieure la
 * remplaçait par une photo dès que le système demandait des animations
 * réduites, si bien qu'une partie des visiteurs ne voyait jamais la vidéo.
 *
 * `poster` couvre le temps de mise en tampon ; `playsInline` évite le passage
 * en plein écran sur iOS ; `muted` est requis pour que la lecture automatique
 * soit acceptée par les navigateurs.
 */
export function AmbianceVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    videoRef.current?.play().catch(() => {
      // Lecture automatique refusée : l'affiche reste, le bouton prend le relais.
      setPlaying(false);
    });
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <>
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
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Mettre la vidéo en pause" : "Lancer la vidéo"}
        className="absolute bottom-sp-4 right-sp-4 z-20 rounded-pill border border-white/40 p-sp-2 text-white transition-colors hover:border-white/70 hover:bg-white/10"
      >
        <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden>
          {playing ? (
            <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" />
          ) : (
            <path d="M4.5 2.4 13 8l-8.5 5.6z" />
          )}
        </svg>
      </button>
    </>
  );
}
