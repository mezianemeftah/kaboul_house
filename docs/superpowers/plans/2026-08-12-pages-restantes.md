# Pages restantes — état et priorités

**Date** : 2026-08-12
**Contexte** : l'accueil (`/`) et la boutique (`/boutique`) sont construites. Les autres liens de navigation mènent à des pages inexistantes.

## Existant

| Route | État |
|---|---|
| `/` | ✅ accueil, 7 sections |
| `/boutique` | ✅ toutes les pièces |
| `/admin` | ✅ studio Sanity |
| `/api/revalidate` | ✅ webhook signé |

## À créer, par priorité

### P1 — `/[categorie]` (liste produits d'un univers)
**Pourquoi d'abord** : 5 entrées du menu déroulant pointent ici (`/tapis`, `/toshak`, `/textiles`, `/art-de-la-table`, `/fruits-secs`). Ce sont les liens les plus visibles du site.

- `generateStaticParams` depuis `CATEGORY_SLUGS_QUERY`, plus les 5 slugs de repli tant que Sanity est vide.
- `CATEGORY_QUERY` (déjà écrite) : titre, description, image, produits triés (mis en avant d'abord).
- En-tête : bandeau pétrole (la nav flotte au-dessus, prévoir `pt-28`), surtitre + h1 + description.
- Grille de produits réutilisant le langage visuel des cartes existantes.
- État vide soigné : message + bouton WhatsApp. `notFound()` si le slug est inconnu.

### P2 — `/boutiques` (les deux adresses)
**Pourquoi** : entrée du menu, et destination de repli du bouton WhatsApp tant qu'aucun numéro n'est saisi dans Sanity.

- `SHOPS_QUERY` (déjà écrite) : nom, adresse, téléphone, email, horaires, itinéraire, photo.
- Reprendre le traitement des onglets contact de l'accueil, en version pleine page.
- Repli : Grenoble (1 bd Gambetta) + Lyon (« Adresse à venir »).

### P3 — `/produit/[slug]` (fiche produit)
**Pourquoi ensuite** : les cartes produits n'ont pas encore de destination, mais elles ne mènent nulle part tant que Sanity est vide (les pièces de repli ne sont pas cliquables).

- `PRODUCT_QUERY` + `PRODUCT_SLUGS_QUERY` (déjà écrites).
- Galerie photos, description, univers de rattachement, bouton WhatsApp (« Demander cette pièce »).

### P4 — Pages d'erreur
- `not-found.tsx` et `error.tsx` aux couleurs du site (le `PillButton` existe déjà pour le bouton « Réessayer »).

### Abandonné — `/notre-maison`
Plus aucun lien n'y mène : « Qui sommes-nous » pointe désormais vers la section « La maison » de l'accueil. À créer seulement si le client veut une page dédiée plus tard.

## Reste ensuite (hors pages)

- Prévisualisation visuelle Sanity (Presentation) — tâche 14 du plan initial.
- Déploiement Cloudflare — tâche 15.
- Compression de `public/videos/ambiance.mp4` (16,8 Mo, trop lourd) — nécessite ffmpeg.
