# Design system Kaboul House

> **Statut : validé le 2026-08-11**, remplace intégralement la direction "gentiane/olive" ci-dessous (Phase 1 initiale). Sert de référence unique pour l'intégration de tout le site (Phase 2 de la [roadmap](../../roadmap.md)).

## Contexte et méthode

La direction a été construite par itération visuelle directe (maquettes Artifact, pas de description texte) sur le bloc Hero de la page d'accueil, en partant de trois sources fournies par le client :

1. **`index_1.html`** — premier site du client, dont les CSS custom properties révélaient déjà une palette "Lapis lazuli + manuscript gold + madder + parchment" et le logo (sceau rond navy/or/grenat).
2. **Une photo de référence** (tapis grenat au sol, silhouettes en prière, ciel dégradé rose) — fournie d'abord collée dans le chat, puis retrouvée en fichier réel via un export PDF (`Group 615.pdf`, planche de marque "Version 02").
3. **Le fichier de police réel `Bonny_Complete.zip`**, donnant le nom exact des deux polices de marque.

Plusieurs propositions ont été testées et rejetées en cours de route (palette "bazar chaud" ivoire/terracotta, lapis lazuli dominant, or comme accent, polices Fraunces/Bodoni Moda/Cinzel/Jost/Bricolage Grotesque/Hanken Grotesk) avant de converger sur le système ci-dessous. Ne pas revenir à ces pistes sans une raison explicite du client.

La planche PDF fournie réutilisait un template généraliste (reste de texte "Droit pénal contentieux des affaires…" visible en fond, non pertinent) — seuls la palette, la photo et les deux polices en ont été retenus, rien d'autre.

## Palette

| Rôle | Nom | Hex | Usage |
|---|---|---|---|
| Fond clair | Blush | `#FFEBED` | Fond de page par défaut, remplace le blanc pur |
| Fond clair secondaire | Blush 2 | `#F6D9DA` | Cartes, alternance de section, fonds de champs |
| Accent principal | Grenat | `#8A1A1A` | Texte de CTA, bordures de pilule, liens, icônes, prix |
| Accent principal (hover) | Grenat vif | `#B33327` | États hover/actifs des éléments grenat |
| Accent principal (profond) | Grenat profond | `#5E1212` | Teintes de superposition sur photo, fonds très sombres ponctuels |
| Accent secondaire | Pétrole | `#014652` | Surface sombre alternative (bandeaux, footer) — **jamais sur un CTA**, cf. révision ci-dessous |
| Accent secondaire (clair) | Pétrole clair | `#0C5B69` | Hover sur éléments pétrole |
| Texte principal | Encre | `#241A18` | Corps de texte sur fond clair |
| Texte secondaire | Encre douce | `#5C4A47` | Texte atténué, légendes |
| Texte sur fond sombre/photo | Crème | `#FBEFEA` | Texte, icônes et bordures sur fond sombre ou sur photo |

**Règles :**
- Deux couleurs seulement portent l'identité (grenat + pétrole) sur une base neutre blush/encre — ne pas ajouter de troisième accent sans validation.
- **L'or est explicitement exclu**, malgré sa présence dans le logo original du client — décision utilisateur, ne pas le réintroduire par défaut.
- Le pétrole est réservé aux **grandes surfaces sombres alternatives** (ex. un bandeau de section, le footer) pour éviter que tout le site soit rouge/photo — **pas de bouton ni de pilule en pétrole**, ce style a été testé et rejeté.

## Typographie

- **Titres, logotype, grandes citations : Bonny** — police Fontshare gratuite (Indian Type Foundry, licence FF EULA), fichiers réels fournis par le client. 5 graisses statiques disponibles : `Thin 100`, `Light 300`, `Regular 400`, `Medium 500`, `Bold 700`. **Pas de graisse 800/900, pas d'italique fournie.** Fichiers dans `src/app/fonts/bonny/`.
  - Contraste hiérarchique dans un titre multi-lignes : jouer sur la graisse (ex. `700` puis `300`), jamais sur l'italique.
- **Tout le reste (nav, boutons, corps de texte, labels) : Josefin Sans** — Google Font, poids `300` à `700` + italique `400`. Remplace toutes les polices sans précédemment testées.
- Pas de "surtitre"/eyebrow en majuscules forcées — si un eyebrow est réintroduit ailleurs sur le site, il reste en casse normale, jamais en `text-transform: uppercase`. Le Hero final n'en a d'ailleurs plus du tout : le titre est le premier élément du bloc.

### Échelle (telle qu'utilisée sur le Hero, à étendre par cohérence)

| Usage | Taille | Graisse | Line-height | Police |
|---|---|---|---|---|
| H1 hero | `clamp(42px, 5.8vw, 72px)` | 700 (ligne 2 en 300) | `.9` | Bonny |
| Logotype nav | `21px` | 700 | `1` | Bonny |
| Corps de texte | `15px` | 400 | `1.6` | Josefin Sans |
| Nav / boutons | `10.5–12px` | 400 (liens), 700 (CTA) | `1` | Josefin Sans |

## Espacement

Échelle fixe, à utiliser en marges explicites plutôt qu'en `gap` uniforme (un `gap` uniforme sur un bloc de texte hero/description/CTA a été jugé "mal géré" en review) :

```
--sp-1: 6px   --sp-2: 10px   --sp-3: 16px
--sp-4: 24px  --sp-5: 36px   --sp-6: 56px
```

Principe : l'espacement **croît** à mesure qu'on se rapproche de l'action (ex. titre → description : 24px ; description → CTA : 36px), jamais une valeur uniforme entre tous les éléments.

## Rayons

- `999px` (pilule complète) : boutons, CTA, nav.
- `14–22px` : conteneurs image, panneaux de menu mobile.

## Composants validés

### Bouton / CTA (pilule)

- Fond `blush` (`#FFEBED`), texte `grenat`, bordure `1px solid rgba(138,26,26,.14)`.
- Majuscules, graisse 700, `letter-spacing: .06–.07em`.
- Icône : étoile à 4 branches en SVG (pas d'emoji), couleur grenat, qui pivote `45deg` + `scale(1.2)` au survol.
- Hover : fond → `blush-2`, léger `translateY(-1 à -2px)`, ombre qui s'accentue sur le CTA principal.
- **Centrage texte/icône impératif** : `line-height: 1` sur le bouton + `display: block` sur le SVG (sinon les métriques de police décalent visuellement le texte par rapport à l'icône).
- Un seul style de CTA sur tout le site (petite variante nav vs. grande variante hero, mêmes règles).

### Navigation

- **Pilule flottante** décollée des bords (`margin` autour, pas plaquée en haut), fond `rgba(8,5,4,.34)` + `backdrop-filter: blur(16px) saturate(160%)`, bordure `1px solid rgba(255,255,255,.14)`.
- **Logo à gauche** (Bonny, "Kaboul House" seul — pas de baseline/tagline en dessous). Ne pas forcer son centrage géométrique dans la nav : un centrage par grid a été testé et cassait l'alignement des liens dès que leur largeur variait (retour à la ligne).
- Liens groupés à droite, **sur une seule ligne** (`white-space: nowrap`), graisse 400 (pas 600/700 — jugé "pas cohérent" en graisse forte), fond `rgba(255,255,255,.16)` au survol.
- CTA ("Nous écrire") en pilule crème/grenat à l'extrémité droite, même traitement que le CTA hero.
- **Burger obligatoire sous ~760px** dès que la nav combine plusieurs liens + un CTA sur fond flouté : logo + bouton burger seuls visibles, le reste se déroule dans un panneau avec le même traitement verre dépoli.

### Hero / bandeaux photo plein cadre

- Photo en plein cadre (`object-fit: cover`), pas de panneau texte séparé.
- Double scrim en dégradé : haut `rgba(6,4,4,.5)→transparent` (lisibilité de la nav), bas `rgba(6,4,4,.82)→transparent` (lisibilité du texte).
- Réveil au chargement : la photo apparaît via `clip-path: inset(100% 0 0 0) → inset(0 0 0 0)` (~1.1s) + zoom interne `scale(1.08)→1` (~1.2s), `cubic-bezier(.16,1,.3,1)`.
- Titre en cascade mot par mot : chaque mot dans un `span` overflow-hidden, translateY(100%)→0 + opacity, décalage ~90ms entre mots.

## Mouvement — principes généraux

- Easing signature : `cubic-bezier(.16,1,.3,1)` (ease-out prononcé) pour toutes les transitions/reveals.
- Reveal au scroll (hors hero) : fade + `translateY(8-10px)`, `.6-.7s`, staggered ~80-90ms entre éléments d'une même grille, déclenché une seule fois (`viewport: { once: true, margin: "-10%" }` en Framer Motion).
- Toujours respecter `prefers-reduced-motion: reduce` (durées ramenées à `.01ms`, pas de transform).
- Pas d'effet superflu (pas de parallax lourd, pas de WebGL) — le niveau d'ambition retenu est "premium sobre", pas "showcase agence".

## Implémentation technique (Next.js / Tailwind v4)

- **Tokens** : à porter dans `src/app/globals.css`, bloc `@theme inline`, en remplacement de `--color-gentiane-*` / `--color-vert-olive` / `--color-gris-claire`.
- **Polices** :
  - Josefin Sans via `next/font/google` (comme Manrope/Lora actuellement dans `src/app/[locale]/layout.tsx`).
  - Bonny via `next/font/local`, fichiers déjà copiés dans `src/app/fonts/bonny/` (`Bonny-{Thin,Light,Regular,Medium,Bold}.woff2`, licence dans le même dossier).
- **Animations** : Framer Motion (reveals, hover, transitions de page) + Lenis (scroll fluide global) — aucune des deux n'est encore installée, à ajouter en dépendances lors de l'implémentation.
- **Composants existants impactés** (`src/components/ui/`, `src/components/layout/`) : `Pill.tsx`, `SectionLabel.tsx`, `DarkBand.tsx`, `OrnamentalPattern.tsx`, `PageHero.tsx`, `PlaceholderImage.tsx`, `SiteHeader.tsx`, `SiteFooter.tsx` — tous à retravailler sur ces tokens en Phase 2, aucun n'est encore à jour.

## Portée de cette spec

Couvre les tokens, la grammaire visuelle et les deux composants entièrement maquettés et validés (Hero, navigation). Ne couvre pas encore, à maquetter par cohérence lors de l'implémentation des autres blocs :
- Cartes (catégories, produits, avis, actualités)
- Bandeau sombre à citation (probablement en pétrole, à confirmer)
- Footer
- Formulaires / onglets boutique (`ShopContactTabs`)
