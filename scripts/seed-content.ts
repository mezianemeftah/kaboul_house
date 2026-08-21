/**
 * Injecte dans Sanity les contenus jusqu'ici codés en dur : la page d'accueil
 * complète, les cinq univers et les deux boutiques.
 *
 *   npx sanity exec scripts/seed-content.ts --with-user-token
 *
 * Idempotent, et surtout non destructif : `createIfNotExists` ne recrée jamais
 * un document existant, et `setIfMissing` ne remplit que les champs vides. Les
 * textes déjà saisis dans le back-office sont donc préservés — relancer le
 * script après une modification ne l'écrase pas.
 *
 * Les produits ne sont volontairement pas injectés : les cinq « coups de
 * cœur » actuels sont des noms de démonstration sans photo ni description, et
 * `product.images` exige au moins une photo. Les créer produirait des fiches
 * invalides et des pages produit vides.
 *
 * La vidéo d'ambiance n'est pas injectée non plus : elle pèse 16,8 Mo et le
 * front sait la servir depuis /public tant que le champ est vide.
 */
import { createReadStream } from "node:fs";
import { basename, join } from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient();
const IMAGES = join(process.cwd(), "public", "images");

type ImageRef = {
  _type: "image";
  asset: { _type: "reference"; _ref: string };
  alt: string;
};

/**
 * Téléverse une photo et renvoie la référence prête à poser dans un document.
 * Sanity dédoublonne les fichiers par empreinte : la même photo utilisée par
 * deux champs ne compte qu'une fois dans le quota.
 */
async function uploadImage(fichier: string, alt: string): Promise<ImageRef> {
  const chemin = join(IMAGES, fichier);
  const asset = await client.assets.upload("image", createReadStream(chemin), {
    filename: basename(fichier),
  });
  console.log(`  photo « ${fichier} » → ${asset._id}`);
  return { _type: "image", asset: { _type: "reference", _ref: asset._id }, alt };
}

/**
 * Ne téléverse la photo que si le champ visé est encore vide, pour ne pas
 * refaire l'aller-retour réseau à chaque exécution.
 */
async function imageSiManquante(
  documentId: string,
  champ: string,
  fichier: string,
  alt: string,
): Promise<Record<string, ImageRef>> {
  const dejaPosee = await client.fetch(`*[_id == $id][0].${champ}.asset._ref`, {
    id: documentId,
  });
  if (dejaPosee) return {};
  return { [champ]: await uploadImage(fichier, alt) };
}

async function pageAccueil() {
  console.log("Page d'accueil…");
  await client.createIfNotExists({ _id: "homePage", _type: "homePage" });

  const photos = {
    ...(await imageSiManquante(
      "homePage",
      "heroImage",
      "hero-intro.webp",
      "Tapis d'Orient déroulé dans une cour au crépuscule",
    )),
    ...(await imageSiManquante(
      "homePage",
      "aboutImageLarge",
      "category-night.webp",
      "Tapis d'Orient déroulé dans une cour au crépuscule",
    )),
    ...(await imageSiManquante(
      "homePage",
      "aboutImageSmall",
      "category-prayer.webp",
      "Silhouettes réunies sur un tapis au lever du soleil",
    )),
    ...(await imageSiManquante(
      "homePage",
      "videoPoster",
      "category-prayer.webp",
      "Silhouettes réunies sur un tapis au lever du soleil",
    )),
  };

  await client
    .patch("homePage")
    .setIfMissing({
      heroTitle: "L'Orient entre sous votre toit.",
      heroSubtitle:
        "Tapis noués main, toshak, décor, art de la table et fruits secs — de Kaboul jusqu'au cœur de Grenoble et de Lyon.",
      heroCtaLabel: "Découvrir la boutique",
      heroCtaHref: "/boutique",

      universKicker: "Nos univers",
      universTitle: "Cinq mondes, une même maison",
      universIntro:
        "Du tapis sous vos pieds à l'assiette de votre invité, chaque pièce raconte l'hospitalité orientale. Choisissez par où commencer.",
      universLinkLabel: "Voir",

      videoTitle: "Une pièce vous fait de l'œil ?",
      videoText:
        "Écrivez-nous sur WhatsApp : photos, dimensions, conseils, mise de côté — on s'occupe de tout.",
      videoCtaLabel: "Nous écrire sur WhatsApp",

      aboutKicker: "La maison",
      aboutTitle: "Kaboul House, une histoire de famille",
      aboutText:
        "Depuis Kaboul jusqu'aux rives de l'Isère, Kaboul House rassemble ce que l'Orient fait de plus beau : des tapis qui traversent les générations, des objets qui réchauffent la maison, des saveurs qui racontent un pays. Chaque pièce est choisie par nos soins, auprès des artisans et des familles qui perpétuent ces savoir-faire.",

      featuredKicker: "Nos coups de cœur",
      featuredTitle: "Cinq pièces qui font la maison",

      shopsKicker: "Nous trouver",
      shopsTitle: "Deux adresses, une même maison",
      shopsEmptyText: "Ouverture prochaine — écrivez-nous sur WhatsApp pour être prévenus.",

      reviewsKicker: "Avis Google",
      reviewsTitle: "Ils ont poussé la porte",
      reviewsEmptyText: "Les avis de nos clients apparaîtront ici très bientôt.",
      reviewsLinkLabel: "Voir notre fiche Google",

      seoTitle: "Kaboul House — Bazar oriental à Grenoble",
      seoDescription:
        "Tapis noués main, toshak kabuli, décor, art de la table et fruits secs — de Kaboul, Téhéran et Istanbul jusqu'au cœur de Grenoble.",

      ...photos,
    })
    .commit();
}

/**
 * Les libellés sont ceux de la navigation du client — Tapis, Toshak, Décor,
 * Art de la table — pour qu'un visiteur passe de son site au nôtre sans
 * réapprendre le vocabulaire. Seuls les fruits secs gardent leur origine :
 * « d'Afghanistan » est ici l'argument de vente, pas un ornement. Le surtitre
 * porte la part poétique de la direction artistique.
 */
const UNIVERS = [
  {
    slug: "tapis",
    kicker: "Sol",
    title: "Tapis",
    description: "Du noué main afghan aux grands formats turcs et persans.",
    photo: { fichier: "category-sea.webp", alt: "Tapis rouge porté au-dessus de l'eau" },
  },
  {
    slug: "toshak",
    kicker: "Assise",
    title: "Toshak",
    description: "L'assise afghane traditionnelle : kabuli, 2 ou 3 baleshta.",
    photo: null,
  },
  {
    slug: "decor",
    kicker: "Intérieur",
    title: "Décor",
    description: "Surtapis, coussins de sol et moquettes — de quoi habiller la pièce.",
    photo: {
      fichier: "category-night.webp",
      alt: "Tapis d'Orient dans une cour au crépuscule",
    },
  },
  {
    slug: "art-de-la-table",
    kicker: "Table",
    title: "Art de la table",
    description: "Services dorés, plateaux, thermos. L'hospitalité dressée.",
    photo: null,
  },
  {
    slug: "fruits-secs",
    kicker: "Saveurs",
    title: "Fruits secs d'Afghanistan",
    description: "Amandes, pistaches, mûres — bio, et prêts à offrir.",
    photo: {
      fichier: "category-prayer.webp",
      alt: "Silhouettes sur un tapis au lever du soleil",
    },
  },
];

async function univers() {
  console.log("Univers…");
  for (const [index, u] of UNIVERS.entries()) {
    const _id = `category-${u.slug}`;
    await client.createIfNotExists({ _id, _type: "category", title: u.title });

    const photo = u.photo
      ? await imageSiManquante(_id, "image", u.photo.fichier, u.photo.alt)
      : {};

    await client
      .patch(_id)
      .setIfMissing({
        title: u.title,
        slug: { _type: "slug", current: u.slug },
        kicker: u.kicker,
        description: u.description,
        order: index + 1,
        ...photo,
      })
      .commit();
    console.log(`  ${u.title}`);
  }
}

const BOUTIQUES = [
  {
    _id: "shop-grenoble",
    name: "Kaboul House — Grenoble",
    address: "1 boulevard Gambetta\n38000 Grenoble",
    phone: "+33 7 67 87 61 99",
    hours: "Lun–Sam : 10h–19h",
    order: 1,
  },
  {
    _id: "shop-lyon",
    name: "Kaboul House — Lyon",
    address: "Adresse à venir — ouverture prochaine",
    order: 2,
  },
];

async function boutiques() {
  console.log("Boutiques…");
  for (const b of BOUTIQUES) {
    const { _id, ...champs } = b;
    await client.createIfNotExists({ _id, _type: "shop", name: champs.name });
    await client.patch(_id).setIfMissing(champs).commit();
    console.log(`  ${champs.name}`);
  }
}

async function main() {
  await pageAccueil();
  await univers();
  await boutiques();
  console.log("\nTerminé. Les produits restent à créer à la main (photos obligatoires).");
}

main().catch((erreur) => {
  console.error(erreur);
  process.exit(1);
});
