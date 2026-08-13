/**
 * Importe dans Sanity le catalogue extrait du site du client.
 *
 *   node scripts/extraire-catalogue-client.mjs <index.html>   # produit les fichiers
 *   npx sanity exec scripts/import-produits.ts --with-user-token
 *
 * Idempotent et non destructif, comme seed-content.ts : `createIfNotExists` ne
 * recrée jamais une fiche existante, `setIfMissing` ne remplit que les champs
 * restés vides, et une photo n'est téléversée que si la fiche n'en a aucune.
 * Relancer le script après une correction dans le back-office ne l'écrase pas.
 *
 * L'identifiant du document est dérivé de l'identifiant du client
 * (`product-r-008`) et non du nom : renommer une pièce dans le back-office ne
 * crée donc pas de doublon au prochain passage.
 */
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient();
const DOSSIER = join(process.cwd(), "content", "catalogue-client");
const PHOTOS = join(DOSSIER, "photos");

type Produit = {
  id: string;
  nom: string;
  slug: string;
  categorieSlug: string;
  categorieTitre: string;
  photo: string;
  description: string;
  origine: string;
  matiere: string;
  densite: string;
  style: string;
  velours: string;
  tissage: string;
  tailles: string;
  entretien: string;
};

/** Les champs vides ne sont pas envoyés : mieux vaut absent que chaîne vide. */
function caracteristiques(p: Produit): Record<string, string> {
  const paires: [string, string][] = [
    ["description", p.description],
    ["origin", p.origine],
    ["material", p.matiere],
    ["density", p.densite],
    ["style", p.style],
    ["pile", p.velours],
    ["weave", p.tissage],
    ["sizes", p.tailles],
    ["care", p.entretien],
  ];
  return Object.fromEntries(paires.filter(([, valeur]) => valeur));
}

/**
 * Téléverse la photo, sauf si la fiche en porte déjà une : sans ce garde-fou,
 * chaque exécution referait l'aller-retour réseau pour les 55 images.
 */
async function photoSiManquante(documentId: string, produit: Produit) {
  if (!produit.photo) return {};
  const dejaPosee = await client.fetch(`*[_id == $id][0].images[0].asset._ref`, {
    id: documentId,
  });
  if (dejaPosee) return {};

  const chemin = join(PHOTOS, produit.photo);
  if (!existsSync(chemin)) {
    console.warn(`  ⚠ photo introuvable : ${produit.photo}`);
    return {};
  }
  const asset = await client.assets.upload("image", createReadStream(chemin), {
    filename: produit.photo,
  });
  return {
    images: [
      {
        _type: "image",
        _key: produit.id,
        asset: { _type: "reference", _ref: asset._id },
        alt: produit.origine ? `${produit.nom} — ${produit.origine}` : produit.nom,
      },
    ],
  };
}

async function main() {
  const fichier = join(DOSSIER, "produits.json");
  if (!existsSync(fichier)) {
    throw new Error(
      "content/catalogue-client/produits.json est absent — lancez d'abord :\n" +
        "  node scripts/extraire-catalogue-client.mjs <chemin/vers/index.html>",
    );
  }
  const produits: Produit[] = JSON.parse(readFileSync(fichier, "utf8"));

  // Les univers sont créés par seed-content.ts. On vérifie d'abord qu'ils sont
  // tous là : mieux vaut s'arrêter net que semer 56 fiches sans univers.
  const slugsUnivers = [...new Set(produits.map((p) => p.categorieSlug))];
  const existants: string[] = await client.fetch(
    `*[_type == "category" && slug.current in $slugs].slug.current`,
    { slugs: slugsUnivers },
  );
  const manquants = slugsUnivers.filter((s) => !existants.includes(s));
  if (manquants.length) {
    throw new Error(
      `Univers absents de Sanity : ${manquants.join(", ")}.\n` +
        "Lancez d'abord : npx sanity exec scripts/seed-content.ts --with-user-token",
    );
  }
  const idParSlug = new Map<string, string>(
    (
      await client.fetch<{ _id: string; slug: string }[]>(
        `*[_type == "category" && slug.current in $slugs]{_id, "slug": slug.current}`,
        { slugs: slugsUnivers },
      )
    ).map((c) => [c.slug, c._id]),
  );

  const sansPhoto: string[] = [];
  for (const produit of produits) {
    const _id = `product-${produit.id}`;
    await client.createIfNotExists({ _id, _type: "product", title: produit.nom });

    const photo = await photoSiManquante(_id, produit);
    if (!produit.photo) sansPhoto.push(produit.nom);

    await client
      .patch(_id)
      .setIfMissing({
        title: produit.nom,
        slug: { _type: "slug", current: produit.slug },
        category: {
          _type: "reference",
          _ref: idParSlug.get(produit.categorieSlug)!,
        },
        ...caracteristiques(produit),
        ...photo,
      })
      .commit();
    console.log(`  ${produit.nom}`);
  }

  console.log(`\n${produits.length} fiches à jour.`);
  if (sansPhoto.length) {
    console.log(
      `Sans photo (le back-office les signalera comme incomplètes) : ${sansPhoto.join(", ")}`,
    );
  }
}

main().catch((erreur) => {
  console.error(erreur);
  process.exit(1);
});
