/**
 * Aligne les univers de Sanity sur la navigation du site du client, et
 * réattribue les produits.
 *
 *   npx sanity exec scripts/reorganiser-univers.ts --with-user-token
 *
 * Trois choses, dans cet ordre :
 *
 *   1. Les libellés passent à ceux du client — Tapis, Toshak, Décor, Art de la
 *      table — les fruits secs gardant leur origine.
 *   2. L'univers « Textiles & Décor » (slug `textiles`) devient « Décor »
 *      (slug `decor`). Comme `seed-content.ts` dérive l'identifiant du document
 *      du slug, garder l'ancien document sous un nouveau slug ferait naître un
 *      doublon au prochain semis : on migre donc vers `category-decor` et on
 *      supprime l'ancien une fois qu'il n'est plus référencé.
 *   3. Chaque produit est repointé sur l'univers que lui donne
 *      `content/catalogue-client/produits.json` — ce qui déplace au passage les
 *      six moquettes de Tapis vers Décor.
 *
 * Contrairement à `seed-content.ts`, ce script écrit avec `set` : c'est une
 * migration, elle doit corriger des champs déjà remplis. Elle ne touche que le
 * titre, le slug et la description des univers, plus la référence d'univers des
 * produits — photos, prix et textes de fiche sont laissés intacts.
 *
 * Idempotente : une seconde exécution ne signale plus aucun changement.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient();

type Univers = {
  slug: string;
  title: string;
  description: string;
  /** Slug d'origine, quand il change : le document doit alors être migré. */
  ancienSlug?: string;
};

/** Doit rester le miroir de `UNIVERS` dans scripts/seed-content.ts. */
const UNIVERS: Univers[] = [
  {
    slug: "tapis",
    title: "Tapis",
    description: "Du noué main afghan aux grands formats turcs et persans.",
  },
  {
    slug: "toshak",
    title: "Toshak",
    description: "L'assise afghane traditionnelle : kabuli, 2 ou 3 baleshta.",
  },
  {
    slug: "decor",
    title: "Décor",
    description: "Surtapis, coussins de sol et moquettes — de quoi habiller la pièce.",
    ancienSlug: "textiles",
  },
  {
    slug: "art-de-la-table",
    title: "Art de la table",
    description: "Services dorés, plateaux, thermos. L'hospitalité dressée.",
  },
  {
    slug: "fruits-secs",
    title: "Fruits secs d'Afghanistan",
    description: "Amandes, pistaches, mûres — bio, et prêts à offrir.",
  },
];

type Produit = { id: string; nom: string; categorieSlug: string };

type DocUnivers = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  description?: string;
  kicker?: string;
  order?: number;
  image?: unknown;
};

/**
 * Renomme un univers, en migrant le document quand son slug change : le nouveau
 * reprend le surtitre, l'ordre et la photo de l'ancien, qui ne sera supprimé
 * qu'après le repointage des produits.
 */
async function poserUnivers(u: Univers): Promise<{ id: string; aSupprimer?: string }> {
  const id = `category-${u.slug}`;
  const ancienId = u.ancienSlug ? `category-${u.ancienSlug}` : null;

  const [existant, ancien] = await Promise.all([
    client.fetch<DocUnivers | null>(`*[_id == $id][0]`, { id }),
    ancienId
      ? client.fetch<DocUnivers | null>(`*[_id == $id][0]`, { id: ancienId })
      : Promise.resolve(null),
  ]);

  if (!existant) {
    // Repartir de l'ancien document conserve le travail fait en back-office
    // (photo de couverture, surtitre, ordre d'affichage).
    const socle: DocUnivers | Record<string, never> = ancien ?? {};
    await client.create({
      _id: id,
      _type: "category",
      title: u.title,
      slug: { _type: "slug", current: u.slug },
      description: u.description,
      ...(socle.kicker ? { kicker: socle.kicker } : {}),
      ...(typeof socle.order === "number" ? { order: socle.order } : {}),
      ...(socle.image ? { image: socle.image } : {}),
    });
    console.log(`  ${u.title} — créé${ancien ? ` depuis ${ancienId}` : ""}`);
  } else {
    const change =
      existant.title !== u.title ||
      existant.slug?.current !== u.slug ||
      existant.description !== u.description;
    if (change) {
      await client
        .patch(id)
        .set({
          title: u.title,
          slug: { _type: "slug", current: u.slug },
          description: u.description,
        })
        .commit();
      console.log(`  ${u.title} — mis à jour`);
    } else {
      console.log(`  ${u.title} — déjà conforme`);
    }
  }

  return { id, aSupprimer: ancien && ancienId && ancienId !== id ? ancienId : undefined };
}

async function main() {
  const fichier = join(process.cwd(), "content", "catalogue-client", "produits.json");
  if (!existsSync(fichier)) {
    throw new Error(`${fichier} est absent — impossible de savoir où ranger les produits.`);
  }
  const produits: Produit[] = JSON.parse(readFileSync(fichier, "utf8"));

  console.log("Univers…");
  const idParSlug = new Map<string, string>();
  const aSupprimer: string[] = [];
  for (const u of UNIVERS) {
    const { id, aSupprimer: vieux } = await poserUnivers(u);
    idParSlug.set(u.slug, id);
    if (vieux) aSupprimer.push(vieux);
  }

  console.log("\nProduits…");
  let deplaces = 0;
  let absents = 0;
  for (const produit of produits) {
    const _id = `product-${produit.id}`;
    const attendu = idParSlug.get(produit.categorieSlug);
    if (!attendu) throw new Error(`Univers inconnu « ${produit.categorieSlug} » (${produit.nom})`);

    // Les brouillons portent le même champ : les oublier laisserait la fiche
    // repartir vers l'ancien univers à la prochaine publication.
    const fiches = await client.fetch<{ _id: string; ref?: string }[]>(
      `*[_id in [$id, $draft]]{_id, "ref": category._ref}`,
      { id: _id, draft: `drafts.${_id}` },
    );
    if (!fiches.length) {
      absents += 1;
      continue;
    }
    for (const fiche of fiches) {
      if (fiche.ref === attendu) continue;
      await client
        .patch(fiche._id)
        .set({ category: { _type: "reference", _ref: attendu } })
        .commit();
      deplaces += 1;
      console.log(`  ${produit.nom} → ${produit.categorieSlug}`);
    }
  }
  if (!deplaces) console.log("  aucun déplacement — tout est déjà rangé.");
  if (absents) {
    console.log(`  ${absents} fiche(s) absente(s) du dataset — lancez import-produits.ts.`);
  }

  // On ne supprime qu'après : tant qu'un document est référencé, Sanity refuse
  // la suppression, et c'est très bien ainsi.
  for (const id of aSupprimer) {
    const restants = await client.fetch<number>(
      `count(*[_type == "product" && category._ref == $id])`,
      { id },
    );
    if (restants > 0) {
      console.log(`\n⚠ ${id} garde ${restants} produit(s) — non supprimé.`);
      continue;
    }
    await client.delete(id);
    console.log(`\n${id} supprimé (remplacé par category-decor).`);
  }

  console.log("\nTerminé.");
}

main().catch((erreur) => {
  console.error(erreur);
  process.exit(1);
});
