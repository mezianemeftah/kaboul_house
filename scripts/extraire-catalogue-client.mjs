/**
 * Extrait le catalogue produits du site fourni par le client (un seul fichier
 * HTML) vers `content/catalogue-client/` : un CSV relisible, un JSON prêt pour
 * l'import Sanity, et une photo par produit.
 *
 *   node scripts/extraire-catalogue-client.mjs <chemin/vers/index.html>
 *
 * Le catalogue du client est du JavaScript, pas du HTML : un tableau `CATALOG`
 * complété par deux lots (`_NEW`, `_PDF`) et un dictionnaire `RIMG` de photos
 * en base64. Plutôt que de le parser à la regex — fragile sur des chaînes qui
 * contiennent accolades et accents — on isole les déclarations concernées et on
 * les évalue dans un bac à sable `node:vm` sans accès au système de fichiers.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";

const SOURCE = process.argv[2];
if (!SOURCE) {
  console.error("Usage : node scripts/extraire-catalogue-client.mjs <index.html>");
  process.exit(1);
}
const SORTIE = join(process.cwd(), "content", "catalogue-client");
const PHOTOS = join(SORTIE, "photos");

/**
 * Les cinq univers existent déjà dans Sanity (voir scripts/seed-content.ts).
 * Les libellés reprennent ceux de la navigation du client — Tapis, Toshak,
 * Décor, Art de la table — à une exception près : les fruits secs gardent leur
 * origine, qui est l'argument de vente de la famille.
 */
const UNIVERS = {
  carpets: { slug: "tapis", titre: "Tapis" },
  toshak: { slug: "toshak", titre: "Toshak" },
  textiles: { slug: "decor", titre: "Décor" },
  tableware: { slug: "art-de-la-table", titre: "Art de la table" },
  fruits: { slug: "fruits-secs", titre: "Fruits secs d'Afghanistan" },
};

/**
 * Le client range ses moquettes avec les tapis. Elles n'en sont pas : vendues
 * au mètre, tissées machine, posées sur toute la pièce. Laissées dans `carpets`
 * elles portaient la famille à 31 fiches sur 56 ; elles rejoignent Décor, qui
 * réunit ce qui habille la pièce sans être un tapis noué main ni un toshak.
 */
const MOQUETTE = /^moquette/i;

function universDe(it) {
  if (it.cat === "carpets" && MOQUETTE.test(it.fr.name)) return UNIVERS.textiles;
  return UNIVERS[it.cat];
}

/* ------------------------------------------------------------------ lecture */

function evaluerCatalogue(html) {
  const morceaux = [];
  let dansCatalog = false;
  for (const ligne of html.split(/\r?\n/)) {
    if (dansCatalog) {
      morceaux.push(ligne);
      if (ligne.trim() === "];") dansCatalog = false;
      continue;
    }
    if (ligne.startsWith("const CATALOG = [")) {
      dansCatalog = true;
      morceaux.push(ligne);
    } else if (
      ligne.startsWith("const RIMG=") ||
      ligne.startsWith("Object.assign(RIMG,") ||
      ligne.startsWith("var _NEW=") ||
      ligne.startsWith("var _PDF=") ||
      ligne.startsWith("_NEW.forEach") ||
      ligne.startsWith("_PDF.forEach")
    ) {
      morceaux.push(ligne);
    }
  }
  if (!morceaux.length) throw new Error("Aucune déclaration CATALOG trouvée dans le fichier.");

  const bac = vm.createContext({});
  vm.runInContext(`${morceaux.join("\n")}\n;globalThis.__sortie={CATALOG,RIMG};`, bac);
  return bac.__sortie;
}

/* ---------------------------------------------------------- normalisation */

/** Certains champs sont tantôt une chaîne, tantôt un objet bilingue {fr,en}. */
const fr = (valeur) =>
  valeur == null ? "" : typeof valeur === "string" ? valeur : (valeur.fr ?? "");

const slugifier = (texte) =>
  texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function normaliser(CATALOG, photosEcrites) {
  const slugsPris = new Set();
  return CATALOG.map((it) => {
    const univers = universDe(it);
    if (!univers) throw new Error(`Univers inconnu « ${it.cat} » (produit ${it.id})`);

    const nom = it.fr.name;
    let slug = slugifier(nom);
    if (slugsPris.has(slug)) slug = `${slug}-${slugifier(it.id)}`;
    slugsPris.add(slug);

    return {
      id: it.id,
      nom,
      slug,
      categorieSlug: univers.slug,
      categorieTitre: univers.titre,
      photo: photosEcrites.get(it.id) ?? "",
      description: fr(it.desc),
      // `origin` est l'origine géographique ; `fr.org` est le libellé affiché
      // sur la carte, plus riche (« Iran · Persan ») mais parfois non
      // géographique (« Art de la table »). On garde les deux : Sanity reçoit
      // `origine`, et `origine_affichee` reste au CSV pour arbitrage.
      origine: fr(it.origin) || it.fr.org || "",
      origineAffichee: it.fr.org || "",
      matiere: fr(it.material),
      densite: fr(it.density),
      style: it.fr.style || "",
      velours: fr(it.pile),
      tissage: fr(it.weave),
      tailles: fr(it.sizes) || fr(it.size),
      entretien: fr(it.care),
      // Hors périmètre du schéma Sanity, conservé au CSV pour information :
      contenu: fr(it.content) || fr(it.service) || fr(it.pieces),
      prix: it.eur ? `${it.eur} €${it.unit ? ` / ${fr(it.unit)}` : ""}` : "sur demande",
      histoire: fr(it.story),
      coupDeCoeur: it.feat ? "oui" : "",
      ruban: fr(it.ribbon),
      nomEn: it.en?.name || "",
    };
  });
}

/* -------------------------------------------------------------- livrables */

const COLONNES = [
  ["id", "id"],
  ["nom", "nom"],
  ["slug", "slug"],
  ["categorie", "categorieTitre"],
  ["photo", "photo"],
  ["description", "description"],
  ["origine", "origine"],
  ["origine_affichee", "origineAffichee"],
  ["matiere", "matiere"],
  ["densite", "densite"],
  ["style", "style"],
  ["velours", "velours"],
  ["tissage", "tissage"],
  ["tailles_disponibles", "tailles"],
  ["entretien", "entretien"],
  ["contenu", "contenu"],
  ["prix", "prix"],
  ["histoire", "histoire"],
  ["coup_de_coeur", "coupDeCoeur"],
  ["ruban", "ruban"],
  ["nom_en", "nomEn"],
];

/** Point-virgule et BOM : c'est ce qu'Excel en français ouvre sans broncher. */
function versCsv(produits) {
  const cellule = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lignes = [
    COLONNES.map(([entete]) => cellule(entete)).join(";"),
    ...produits.map((p) => COLONNES.map(([, cle]) => cellule(p[cle])).join(";")),
  ];
  return `﻿${lignes.join("\r\n")}\r\n`;
}

function ecrirePhotos(RIMG) {
  mkdirSync(PHOTOS, { recursive: true });
  const ecrites = new Map();
  for (const [id, donnees] of Object.entries(RIMG)) {
    // RIMG contient aussi des clés d'habillage (`_showroom`) : on ne garde que
    // ce qui porte un identifiant de produit.
    if (id.startsWith("_")) continue;
    const trouve = /^data:image\/(\w+);base64,(.+)$/.exec(donnees || "");
    if (!trouve) continue;
    const fichier = `${id}.${trouve[1] === "jpeg" ? "jpg" : trouve[1]}`;
    writeFileSync(join(PHOTOS, fichier), Buffer.from(trouve[2], "base64"));
    ecrites.set(id, fichier);
  }
  return ecrites;
}

/* ------------------------------------------------------------------ marche */

const { CATALOG, RIMG } = evaluerCatalogue(readFileSync(SOURCE, "utf8"));
mkdirSync(SORTIE, { recursive: true });

const photos = ecrirePhotos(RIMG);
const produits = normaliser(CATALOG, photos);

writeFileSync(join(SORTIE, "produits.csv"), versCsv(produits), "utf8");
writeFileSync(join(SORTIE, "produits.json"), `${JSON.stringify(produits, null, 2)}\n`, "utf8");

console.log(`${produits.length} produits · ${photos.size} photos → content/catalogue-client/`);
const CHAMPS = [
  "photo",
  "description",
  "origine",
  "matiere",
  "densite",
  "style",
  "velours",
  "tissage",
  "tailles",
  "entretien",
];
for (const champ of CHAMPS) {
  const vides = produits.filter((p) => !p[champ]);
  const detail = vides.length ? `  — vide : ${vides.map((p) => p.id).join(" ")}` : "";
  console.log(`  ${champ.padEnd(12)} ${produits.length - vides.length}/${produits.length}${detail}`);
}
