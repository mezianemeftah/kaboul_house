/**
 * Compose la sélection « Nos coups de cœur » de la page d'accueil au prorata
 * des ventes du client.
 *
 *   npx sanity exec scripts/mettre-en-avant.ts --with-user-token
 *
 * Le client répartit son activité en trois pôles : 70 % tapis et toshak (les
 * matlas), 20 % art de la table et décor, 10 % fruits secs. Dix vignettes est
 * le plus petit nombre qui rend ces trois parts sans arrondi : sept, deux, une.
 *
 * La sélection précédente, faite à la main, ne montrait ni fruits secs ni art
 * de la table — 30 % du chiffre d'affaires n'apparaissait pas sur l'accueil.
 *
 * Le script écrit avec `set` : c'est le but, il remplace la sélection. Le titre
 * de la section n'est retouché que s'il porte encore la valeur par défaut, pour
 * ne pas écraser une formule choisie en back-office.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient();

/**
 * Combien de vignettes pour chaque pôle, et de quels univers on les tire.
 *
 * `univers` est ordonné : on sert le premier tant qu'il a des candidats. Cinq
 * tapis avant deux toshak, parce que le tapis porte l'essentiel du pôle ; un
 * art de la table avant un décor, pour la même raison.
 */
const POLES = [
  { nom: "Tapis & toshak", part: 7, univers: [{ slug: "tapis", max: 5 }, { slug: "toshak", max: 2 }] },
  {
    nom: "Art de la table & décor",
    part: 2,
    univers: [{ slug: "art-de-la-table", max: 1 }, { slug: "decor", max: 1 }],
  },
  { nom: "Fruits secs", part: 1, univers: [{ slug: "fruits-secs", max: 1 }] },
];

/**
 * Ordre de passage dans le carrousel. Sept tapis à la suite se liraient comme
 * une seule famille : on intercale, la proportion reste la même mais l'œil
 * traverse toute la maison.
 */
const RYTHME = [
  "tapis",
  "toshak",
  "tapis",
  "art-de-la-table",
  "tapis",
  "fruits-secs",
  "tapis",
  "decor",
  "toshak",
  "tapis",
];

const TITRE_PAR_DEFAUT = "Cinq pièces qui font la maison";
const TITRE_VOULU = "Les pièces qui font la maison";

type Produit = { id: string; nom: string; categorieSlug: string; coupDeCoeur: string };

async function main() {
  const fichier = join(process.cwd(), "content", "catalogue-client", "produits.json");
  if (!existsSync(fichier)) throw new Error(`${fichier} est absent.`);
  const catalogue: Produit[] = JSON.parse(readFileSync(fichier, "utf8"));

  // Le vivier est celui que le client a déjà marqué « coup de cœur » sur son
  // propre site : on choisit parmi ses préférées, pas dans tout le stock.
  const vivier = catalogue.filter((p) => p.coupDeCoeur === "oui");

  const parUnivers = new Map<string, Produit[]>();
  for (const p of vivier) {
    const liste = parUnivers.get(p.categorieSlug) ?? [];
    liste.push(p);
    parUnivers.set(p.categorieSlug, liste);
  }

  const retenus: Produit[] = [];
  for (const pole of POLES) {
    const avant = retenus.length;
    for (const { slug, max } of pole.univers) {
      const dispo = parUnivers.get(slug) ?? [];
      retenus.push(...dispo.slice(0, max));
    }
    const pris = retenus.length - avant;
    if (pris < pole.part) {
      console.warn(
        `⚠ ${pole.nom} : ${pris} pièce(s) sur ${pole.part} — vivier trop mince, la proportion sera approximative.`,
      );
    }
  }

  // Remise dans l'ordre de lecture voulu ; ce qui ne trouve pas sa place dans
  // le rythme est simplement ajouté à la suite.
  const restants = [...retenus];
  const ordonnes: Produit[] = [];
  for (const slug of RYTHME) {
    const i = restants.findIndex((p) => p.categorieSlug === slug);
    if (i !== -1) ordonnes.push(...restants.splice(i, 1));
  }
  ordonnes.push(...restants);

  const ids = ordonnes.map((p) => `product-${p.id}`);
  const presents: string[] = await client.fetch(`*[_id in $ids]._id`, { ids });
  const manquants = ids.filter((id) => !presents.includes(id));
  if (manquants.length) {
    throw new Error(
      `Fiches absentes du dataset : ${manquants.join(", ")}.\n` +
        "Lancez d'abord : npx sanity exec scripts/import-produits.ts --with-user-token",
    );
  }

  const titreActuel: string | undefined = await client.fetch(
    `*[_type == "homePage"][0].featuredTitle`,
  );

  await client
    .patch("homePage")
    .set({
      featuredProducts: ids.map((id) => ({
        _type: "reference",
        _key: id,
        _ref: id,
      })),
      ...(titreActuel === TITRE_PAR_DEFAUT ? { featuredTitle: TITRE_VOULU } : {}),
    })
    .commit();

  console.log(`Coups de cœur — ${ordonnes.length} pièces :`);
  for (const p of ordonnes) console.log(`  ${p.categorieSlug.padEnd(16)} ${p.nom}`);
  if (titreActuel === TITRE_PAR_DEFAUT) console.log(`\nTitre de section → « ${TITRE_VOULU} »`);
}

main().catch((erreur) => {
  console.error(erreur);
  process.exit(1);
});
