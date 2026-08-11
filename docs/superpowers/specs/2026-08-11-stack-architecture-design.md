# Kaboul House — Stack & architecture (refonte propre)

**Date** : 2026-08-11
**Statut** : validé par l'utilisateur (sessions brainstorming du 2026-08-11)
**Contexte** : redémarrage à zéro dans `kaboul_house` pour obtenir une base plus propre et structurée que le projet précédent (`Desktop/Kaboul House`), en conservant toutes les décisions client déjà tranchées.

## Objectif

Site vitrine multi-pages pour Kaboul House (bazar oriental, Grenoble) :

- **Créatif** : direction artistique validée (Bonny + Josefin Sans, palette blush `#FFEBED` / grenat `#8A1A1A` / pétrole `#014652`), animations Motion + Lenis.
- **Complètement administrable** : tout le contenu (textes, images, produits, horaires, coordonnées) éditable dans Sanity par le client et ses employés — back-office le plus simple possible.
- **Ultra optimisé** : pages 100 % statiques en cache, publication visible en quelques secondes, images via CDN Sanity, Lighthouse ≥ 95, JS client minimal.

## Contraintes héritées (décisions client, ne pas rouvrir)

- Stack : Next.js + Sanity, studio embarqué sur `/admin`.
- Hébergement : Cloudflare (pas Vercel — Hobby interdit en commercial). Déploiement Workers via OpenNext.
- Pas de vente en ligne : CTA final = WhatsApp. Aucun tunnel panier/paiement.
- Pas de faux avis : l'intégration de vrais avis Google viendra plus tard — aucun schéma « avis » en dur.
- 2e boutique : adresse inconnue → contenu placeholder administrable.
- Assets à reprendre de l'ancien projet : spec DA (`docs/superpowers/specs/2026-08-10-design-system-design.md`), polices Bonny (woff2, licence Fontshare), `public/images/hero-intro.png` (droits confirmés).
- Site en français uniquement — pas de couche i18n (YAGNI).

## Architecture retenue (approche A — monolithe, studio embarqué)

Un seul projet Next.js 16 (App Router, TypeScript strict), un seul deploy.

```
src/
  app/
    (site)/                 → pages publiques : accueil, notre-maison,
                              boutiques, [categorie]/, produit/[slug]
    admin/[[...tool]]/      → Sanity Studio (next-sanity)
    api/revalidate/         → webhook Sanity → revalidateTag
    api/draft-mode/         → activation/désactivation du draft mode (Presentation)
  sanity/
    schemas/                → un fichier par type de document
    queries/                → requêtes GROQ typées (Sanity TypeGen)
    lib/                    → client, image builder, sanityFetch (live)
  components/
    ui/                     → primitives DA : Pill, SectionLabel, PageHero, cartes…
    sections/               → sections de pages (assemblées par les routes)
  lib/                      → utilitaires purs, testés par Vitest
```

Rôles des couches :

- **`app/`** : routes fines — récupèrent le contenu via `sanity/queries`, assemblent des `components/sections`. Aucune logique métier.
- **`sanity/`** : seule couche qui connaît Sanity. Les composants reçoivent des données typées, jamais le client Sanity.
- **`components/`** : Server Components par défaut ; `"use client"` uniquement pour les îlots animés (Motion, Lenis, burger nav).

Stack précise : Next.js 16, React 19, Tailwind CSS 4, `next-sanity`, `sanity` v6, `@sanity/image-url`, `motion`, `lenis`, `@opennextjs/cloudflare`, `wrangler`, Vitest.

## Modèle de contenu Sanity

**Singletons** (non supprimables, épinglés en haut du menu studio) :

- `siteSettings` : nom, WhatsApp, téléphone, réseaux sociaux, SEO par défaut (title/description/OG image).
- `homePage` : hero (photo, titre, accroche), sections d'intro, mises en avant.
- `aboutPage` (« Notre maison ») : histoire, photos, valeurs.

**Collections** :

- `category` : titre, slug, description, image — les 5 univers (tapis, toshak, textiles, art de la table, fruits secs), ordonnables.
- `product` : titre, slug, catégorie (référence), photos, description, mise en avant.
- `shop` : nom, adresse, horaires, téléphone, photo — la 2e boutique reste en placeholder éditable.

**Studio simple** :

- Menu latéral custom en français (structure définie par code, pas la liste brute des types).
- Champs minimaux, chacun avec une `description` en français.
- Validation `required` sur les champs critiques (titre, slug, image de couverture).
- Rien d'autre : pas de workflow, pas de rôles avancés.

## Flux de données & cache

1. Toutes les pages sont **statiques** : `generateStaticParams` pour `[categorie]` et `produit/[slug]`, le reste est statique par nature.
2. Chaque fetch GROQ est taggé (`sanityFetch` avec tags par type : `product`, `category`, `settings`…).
3. **Webhook Sanity** (GROQ-powered, secret partagé en header) → `POST /api/revalidate` → `revalidateTag` du/des tags concernés → la page est régénérée à la prochaine requête. Publication visible en quelques secondes.
4. **Live preview (Presentation tool)** : le studio embarque l'outil Presentation ; le client voit ses brouillons en direct sur le site (draft mode + overlays cliquables via `next-sanity`). L'édition visuelle est le mode par défaut proposé aux éditeurs.

## Optimisation

- **Images** : transformations par le CDN Sanity (`auto=format` → AVIF/WebP, resize, qualité ~75) via un **loader `next/image` custom** — zéro coût, pas de service d'optimisation Cloudflare nécessaire. `hero-intro.png` (asset local) passe par le même loader ou est pré-optimisé en AVIF au build.
- **Polices** : Bonny en `next/font/local` (woff2, subset), Josefin Sans en `next/font/google` — preload, `font-display: swap`, zéro CLS.
- **JS minimal** : Server Components partout ; seuls îlots clients : SmoothScrollProvider (Lenis), reveals Motion, burger nav. `MotionConfig reducedMotion="user"` global.
- **Budget** : Lighthouse ≥ 95 (mobile) sur toutes les pages, LCP < 2 s, CLS < 0.1.

## Gestion d'erreurs

- `not-found.tsx` et `error.tsx` stylés DA.
- Tout champ Sanity optionnel a un fallback dans le rendu (composants tolérants : champ vide → élément masqué, jamais de page cassée).
- Webhook : secret invalide → 401 ; payload inconnu → 200 sans action (pas de retry storm Sanity).

## Tests & qualité

- **Vitest** : utilitaires `lib/`, logique de mapping des données Sanity, validation du loader d'images.
- **`typecheck`** (`tsc --noEmit`) + **ESLint** : passent avant tout commit.
- **Sanity TypeGen** : `sanity typegen generate` — les requêtes GROQ produisent des types vérifiés, script `typegen` dans `package.json`.
- Vérification manuelle Lighthouse avant mise en ligne.

## Déploiement

- Scripts : `dev`, `build`, `cf:preview`, `cf:deploy` (OpenNext → Cloudflare Workers), `typegen`, `test`, `typecheck`.
- `.env.local.example` documenté : `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN` (draft mode), `SANITY_REVALIDATE_SECRET`.
- CORS Sanity : localhost + domaine de prod.
- Webhook Sanity configuré vers `https://<domaine>/api/revalidate`.

## Hors périmètre

- E-commerce, paiement, panier.
- i18n.
- Avis Google (intégration ultérieure).
- Recherche interne, newsletter.
