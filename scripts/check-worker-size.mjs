// Contrôle la taille compressée du worker avant déploiement.
//
// Cloudflare plafonne le bundle du worker à 3 Mo compressés sur le plan gratuit
// (10 Mo en payant) : https://developers.cloudflare.com/workers/platform/limits/
// Seuls le code et les dépendances npm comptent ici — le contenu Sanity part dans
// KV et les médias dans les static assets, ils n'entrent pas dans ce budget.
//
// Un dépassement fait échouer le déploiement côté Cloudflare avec un message peu
// explicite ; ce script échoue plus tôt et dit quoi regarder.

import { gzipSync } from "node:zlib";
import { readFileSync, statSync } from "node:fs";

const HANDLER = ".open-next/server-functions/default/handler.mjs";
const LIMIT_MB = 3;
const WARN_RATIO = 0.8;

const MB = 1024 * 1024;

try {
  statSync(HANDLER);
} catch {
  console.error(`✖ ${HANDLER} introuvable — lancer le build OpenNext d'abord.`);
  process.exit(1);
}

const gzipped = gzipSync(readFileSync(HANDLER)).length;
const sizeMb = gzipped / MB;
const ratio = sizeMb / LIMIT_MB;
const pct = Math.round(ratio * 100);

const summary = `worker : ${sizeMb.toFixed(2)} Mo gzip / ${LIMIT_MB} Mo (${pct} %)`;

if (ratio > 1) {
  console.error(`✖ ${summary}`);
  console.error(
    "  Dépassement du plan gratuit. Pistes : une dépendance npm lourde a été ajoutée,\n" +
      "  ou un module client volumineux est importé côté serveur. Comparer les chunks de\n" +
      "  .open-next/server-functions/default/.next/server/chunks/ssr/ avec le build précédent.",
  );
  process.exit(1);
}

if (ratio > WARN_RATIO) {
  console.warn(`⚠ ${summary} — marge faible, surveiller les prochains ajouts de dépendances.`);
} else {
  console.log(`✔ ${summary}`);
}
