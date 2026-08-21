/**
 * Vide le cache de fetch de Next avant un build de production.
 *
 *   node scripts/vider-cache-fetch.mjs
 *
 * `sanityFetch` appelle Next avec `next: { tags }` et sans `revalidate` : Next
 * range alors la réponse dans `.next/cache/fetch-cache` avec une durée de vie
 * d'un an, et compte sur `revalidateTag` pour l'invalider. Ce mécanisme vaut
 * pour le serveur qui tourne — pas pour `next build`, qui relit ce dossier tel
 * quel à chaque fois.
 *
 * Sans cette purge, un déploiement reprérend le site avec l'état du CMS au jour
 * où le cache a été écrit. C'est arrivé le 2026-08-21 : une image d'accueil
 * publiée le matin même n'est jamais apparue en ligne, le build ayant réutilisé
 * une réponse Sanity du 14 août.
 *
 * On ne touche qu'à `fetch-cache`. Le reste de `.next/cache` porte le cache de
 * compilation, qui n'a aucune raison d'être jeté et coûte cher à reconstruire.
 *
 * On vide le contenu sans retirer le dossier : sous Windows, un processus dont
 * c'est le répertoire courant le verrouille, et `rmdir` échoue en EBUSY.
 */
import { rm, readdir } from "node:fs/promises";
import { join } from "node:path";

const DOSSIER = join(process.cwd(), ".next", "cache", "fetch-cache");

let entrees = [];
try {
  entrees = await readdir(DOSSIER);
} catch (erreur) {
  if (erreur.code !== "ENOENT") throw erreur;
  console.log("Cache de fetch : rien à vider.");
  process.exit(0);
}

await Promise.all(
  entrees.map((entree) => rm(join(DOSSIER, entree), { recursive: true, force: true })),
);
console.log(`Cache de fetch vidé — ${entrees.length} entrée(s). Le build ira relire Sanity.`);
