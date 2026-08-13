/**
 * Importe dans Sanity les avis de la fiche Google de Kaboul House.
 *
 *   npx sanity exec scripts/import-avis-google.ts --with-user-token
 *
 * Les avis sont figés ici plutôt que relus d'un fichier généré : Google Maps ne
 * se laisse pas moissonner de façon reproductible, ce tableau est donc un
 * relevé manuel de la fiche fait le 13/08/2026 (25 avis au total, dont 23 en
 * 5 étoiles). N'ont été retenus que les 14 avis portant un texte citable :
 * les six autres se réduisent à des emoji, et un « Top » que Google rend par
 * « Haut ». Aucun avis n'est reformulé — seul le « … » de troncature ajouté
 * par l'interface Google est retiré.
 *
 * Plusieurs textes sont eux-mêmes des traductions automatiques Google (les
 * originaux sont en anglais ou en dari) ; c'est la version française affichée
 * par Google qui est reprise. Les noms sont réduits au prénom suivi de
 * l'initiale, et translittérés en alphabet latin quand la source ne l'est pas.
 *
 * Idempotent et non destructif, comme import-produits.ts : `createIfNotExists`
 * ne recrée jamais un avis existant et `setIfMissing` ne remplit que les champs
 * restés vides. Une correction faite dans le back-office survit donc à une
 * relance. L'identifiant est un numéro stable et non le nom : corriger un
 * prénom ne crée pas de doublon au passage suivant.
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient();

type Avis = {
  /** Numéro stable, sert d'identifiant de document. */
  id: string;
  auteur: string;
  note: number;
  texte: string;
};

/** L'ordre du tableau fait l'ordre d'affichage : les six premiers tiennent la page d'accueil. */
const AVIS: Avis[] = [
  {
    id: "01",
    auteur: "Sarvinaz A.",
    note: 5,
    texte:
      "J'ai récemment acheté un tapis dans ce magasin et je suis restée très satisfaite. Excellente qualité des produits, grand choix et prix agréables. Le personnel nous a accueillis chaleureusement et nous a conseillés avec professionnalisme. Je voudrais également souligner le très beau choix de vaisselle et d'articles pour la maison. Merci à toute l'équipe pour cet excellent service ! Je recommande ce magasin.",
  },
  {
    id: "02",
    auteur: "Obaidullah R.",
    note: 5,
    texte:
      "Profitez d'un emplacement idéal et de services pratiques à Grenoble avec Kabul House. Vous y trouverez de magnifiques tapis, matelas, oreillers, rideaux et les fameux fruits secs d'Afghanistan à des prix raisonnables.\n\nKabul House est le plus grand magasin afghan de Grenoble !",
  },
  {
    id: "03",
    auteur: "Aminullah A.",
    note: 5,
    texte:
      "Cet endroit est une fusion de personnes exceptionnelles et de produits merveilleux. Ici, vous pouvez raviver vos souvenirs du cher Afghanistan et profiter de ses excellents produits. Je remercie les responsables de Kabul House en m'offrant les meilleurs produits surtout le drapeau afghan.",
  },
  {
    id: "04",
    auteur: "Jan S.",
    note: 5,
    texte:
      "Des produits de très bonne qualité à des prix abordables. Le choix de tapis est également excellent.",
  },
  {
    id: "05",
    auteur: "Arbaz K.",
    note: 5,
    texte:
      "Des produits afghans de grande qualité et très variés. Je recommande vivement Kabul House à Grenoble ! 👍",
  },
  {
    id: "06",
    auteur: "Samsul A.",
    note: 5,
    texte:
      "Une collection très variée. J'ai beaucoup apprécié le service et le comportement du personnel.",
  },
  {
    id: "07",
    auteur: "Mohammed R.",
    note: 5,
    texte: "Ils offrent les meilleurs services, le tapis que j'ai acheté est très doux.",
  },
  {
    id: "08",
    auteur: "Kheira A.",
    note: 5,
    texte:
      "J'ai adoré la culture afghane et je l'ai apprise grâce à la boutique. Tout mon amour pour toi, je recommande vivement aux gens d'y aller 💙🇦🇫💙🇩🇿💙🇫🇷",
  },
  {
    id: "09",
    auteur: "Mohammad Nazir M.",
    note: 5,
    texte: "Des articles de qualité, un personnel adorable ! 🛍️ Merci ! 👏",
  },
  {
    id: "10",
    auteur: "Feraidon R.",
    note: 5,
    texte: "Accueil agréable et des produits de qualité",
  },
  {
    id: "11",
    auteur: "Magdam M.",
    note: 5,
    texte: "Des produits merveilleux, beaux et distinctifs 😍",
  },
  {
    id: "12",
    auteur: "Samim S.",
    note: 5,
    texte: "Bon travail, Mashallah, c'est un très bon marché 🇦🇫🇫🇷",
  },
  { id: "13", auteur: "Zubair S.", note: 5, texte: "Magnifique déco" },
  { id: "14", auteur: "Mehdi T.", note: 5, texte: "J'adore le magasin" },
];

async function main() {
  for (const [index, avis] of AVIS.entries()) {
    const _id = `google-review-${avis.id}`;
    await client.createIfNotExists({ _id, _type: "googleReview", author: avis.auteur });
    await client
      .patch(_id)
      .setIfMissing({
        author: avis.auteur,
        rating: avis.note,
        text: avis.texte,
        order: index + 1,
      })
      .commit();
    console.log(`  ${avis.auteur}`);
  }

  console.log(
    `\n${AVIS.length} avis à jour. Les 6 premiers dans l'ordre d'affichage tiennent la page d'accueil.`,
  );
}

main().catch((erreur) => {
  console.error(erreur);
  process.exit(1);
});
