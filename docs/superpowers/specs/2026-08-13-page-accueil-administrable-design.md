# Page d'accueil entièrement administrable — design

Date : 2026-08-13
Statut : validé

## Problème

Sept des huit blocs de la page d'accueil contiennent des textes, des photos et
une vidéo codés en dur. Le client ne peut administrer que le titre du hero, son
sous-titre, et le texte de « La maison ». Tout le reste — surtitres, titres de
section, chapeaux, libellés de boutons, photos de « La maison », vidéo du bloc
WhatsApp — n'existe nulle part dans le back-office.

S'y ajoute une confusion de fond : les univers, produits et boutiques affichés
proviennent de contenus de repli codés en dur (`src/lib/fallback-content.ts`),
parce que le dataset ne contient aucun document de ces types. Le back-office et
le front semblent donc sans rapport l'un avec l'autre.

## Principe directeur

**Un document Sanity = un contenu, créé une fois, réutilisable partout.**

Les blocs de la page d'accueil ne conservent jamais de copie d'un contenu. Ils
administrent leur propre habillage — surtitre, titre, chapeau, libellé de bouton
— et se contentent de **désigner** ou de **filtrer** des fiches. Le nom, la
photo et la description affichés remontent toujours de la fiche source : une
modification faite une fois se propage à l'accueil, à la page catégorie et à la
boutique.

Deux mécanismes de liste en découlent :

- **Liste automatique** — le bloc affiche tout ce qui existe, dans l'ordre
  défini sur les fiches. Concerne « Nos univers », « Nous trouver » et
  « Avis Google ».
- **Liste sélective** — l'éditeur choisit les fiches à mettre en avant et les
  ordonne par glisser-déposer. Concerne « Nos coups de cœur ».

## Architecture du document `homePage`

Champs **plats**, répartis en **groupes** (onglets du Studio) suivant l'ordre
d'apparition des sections sur le site.

Le choix de champs plats plutôt que d'objets imbriqués par section a deux
motifs : il évite un niveau de repli supplémentaire dans l'interface, et surtout
il **préserve les champs déjà publiés** (`heroTitle`, `heroSubtitle`,
`aboutTitle`, `aboutText`) — aucune migration de données n'est nécessaire.

| Groupe | Champs |
|---|---|
| Hero | `heroTitle`, `heroSubtitle`, `heroImage`, `heroCtaLabel`, `heroCtaHref` |
| Nos univers | `universKicker`, `universTitle`, `universIntro`, `universLinkLabel` |
| Bloc vidéo | `videoFile`, `videoPoster`, `videoTitle`, `videoText`, `videoCtaLabel` |
| La maison | `aboutKicker`, `aboutTitle`, `aboutText`, `aboutImageLarge`, `aboutImageSmall` |
| Nos coups de cœur | `featuredKicker`, `featuredTitle`, `featuredProducts` |
| Nous trouver | `shopsKicker`, `shopsTitle`, `shopsEmptyText` |
| Avis Google | `reviewsKicker`, `reviewsTitle`, `reviewsEmptyText`, `reviewsLinkLabel` |
| Référencement | `seoTitle`, `seoDescription` |

Chaque champ porte un `initialValue` égal au texte actuellement affiché sur le
site, et une `description` qui indique où il apparaît. Sur les groupes dont la
liste est automatique, la description du champ titre précise d'où remontent les
éléments — l'éditeur ne cherche pas un champ de saisie qui n'existe pas.

## Sélection des coups de cœur

`featuredProducts` est un tableau de références vers `product`, avec aperçu
photo et réordonnancement par glisser-déposer.

**La case `featured` disparaît de la fiche produit.** Elle dispersait la
sélection sur les fiches et laissait l'ordre d'affichage au hasard de la date de
dernière modification.

Conséquence assumée : `CATEGORY_QUERY` s'en servait aussi pour remonter ces
produits en tête des pages catégorie. Ces pages passent en **tri alphabétique**
(`order(title asc)`), prévisible et sans champ fantôme. Un ordre manuel par
univers reste possible plus tard via un champ `order` sur le produit.

## Vidéo du bloc WhatsApp

Champ fichier dans le Studio, **avec repli sur `/videos/ambiance.mp4`** quand il
est vide.

Motif : le fichier actuel pèse 16,8 Mo. Le servir depuis le CDN Sanity
épuiserait le quota de bande passante du plan gratuit en quelques centaines de
vues. Tant qu'aucun fichier n'est déposé, le fichier local est servi. Le champ
porte l'avertissement « Vidéo courte et compressée, 5 Mo maximum ».

## Assouplissement des validations

`category.image` passe de obligatoire à **facultatif**. Le code sait déjà
afficher une tuile en dégradé numérotée quand la photo manque
(`CategoryGrid.toCards`) : la contrainte du schéma était plus stricte que le
besoin réel du front, et elle bloquait l'injection des deux univers sans photo.

## Injection du contenu existant

Script idempotent (identifiants fixes, `createIfNotExists` puis
`setIfMissing`) — les valeurs déjà saisies par le client ne sont jamais
écrasées, seuls les champs vides sont remplis.

Contenu injecté :

- **`homePage`** — les textes des 8 groupes, la photo du hero, les 2 photos de
  « La maison », l'image d'attente de la vidéo.
- **5 `category`** — les 3 photos existantes ; les 2 univers restants tombent
  sur la tuile en dégradé.
- **2 `shop`** — Grenoble et Lyon, telles qu'affichées aujourd'hui.

**Les produits ne sont pas injectés.** Les cinq « coups de cœur » actuels sont
des noms de démonstration sans photo ni description : les créer produirait cinq
fiches invalides au regard de `product.images` (minimum une photo) et cinq pages
produit vides. Le carrousel de repli continue de les afficher jusqu'à la saisie
des vraies fiches.

La vidéo n'est pas injectée non plus, conformément à la décision ci-dessus.

## Contenus de repli

Les contenus de repli sont **conservés** — décision du client. Chaque nouveau
champ administrable garde en repli la chaîne actuellement codée en dur, et les
listes gardent `fallback-content.ts`.

Limite connue et acceptée : vider entièrement une liste dans le back-office fait
réapparaître les contenus de repli au lieu de masquer la section.

## Nettoyage

Suppression du type `aboutPage`, de `ABOUT_QUERY`, de son entrée de structure et
de son tag de revalidation. Aucune route ne les consomme — le footer pointe vers
l'ancre `/#la-maison` de la page d'accueil.

## Vérification

- `npm run typegen` après modification du schéma, pour régénérer
  `src/sanity/types.ts`.
- `npm run typecheck`, `npm run lint`, `npm run test`.
- Contrôle visuel de la page d'accueil sur le serveur de développement, puis
  modification d'un champ dans le Studio pour vérifier la propagation.

## Hors périmètre

- **Revalidation en production** : `SANITY_REVALIDATE_SECRET` est vide et aucun
  webhook n'est déclaré côté Sanity. Une fois le site déployé, aucune
  modification ne se propagerait. À brancher séparément.
- **Module Actualités** : validé sur le principe, traité comme chantier suivant
  avec son propre design.
