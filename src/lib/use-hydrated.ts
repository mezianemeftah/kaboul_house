"use client";

import { useSyncExternalStore } from "react";

/** L'état ne change jamais : seul l'écart serveur/client nous intéresse. */
const subscribeNever = () => () => {};

/**
 * `false` au rendu serveur et au tout premier rendu client, `true` ensuite.
 *
 * Sert à n'appliquer les styles pilotés par le défilement qu'après hydratation :
 * sinon le premier rendu client diffère du HTML servi et React signale une
 * erreur d'hydratation qu'il ne répare pas.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
}
