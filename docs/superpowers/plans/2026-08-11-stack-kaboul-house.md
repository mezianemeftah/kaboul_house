# Kaboul House — Stack Next.js + Sanity + Cloudflare : plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Base propre du site vitrine Kaboul House : Next.js 16 + Sanity (studio `/admin`, contenu 100 % administrable), pages statiques revalidées par webhook, hero d'accueil au layout « BLINK », déployable sur Cloudflare Workers.

**Architecture:** Monolithe Next.js App Router en 3 couches : `app/` (routes fines), `sanity/` (seule couche qui parle au CMS, requêtes GROQ typées), `components/` (Server Components par défaut, îlots clients pour Motion/Lenis/burger). Images optimisées par le CDN Sanity via loader `next/image` custom.

**Tech Stack:** Next.js 16.3, React 19.2, TypeScript strict, Tailwind CSS 4, sanity 6.9 + next-sanity 13.3, motion, lenis, Vitest, @opennextjs/cloudflare + wrangler.

**Référence design:** `docs/superpowers/specs/2026-08-11-stack-architecture-design.md` (+ spec DA copiée en Task 2). Palette : blush `#ffebed`, grenat `#8a1a1a`, pétrole `#014652`, encre `#241a18`, crème `#fbefea`. Typo : Bonny (titres/logo), Josefin Sans (le reste, graisse 400 par défaut).

**Prérequis :** Node ≥ 20, npm. L'ancien projet `C:\Users\mezia\Desktop\Kaboul House` (avec espace) sert uniquement de source d'assets — ne rien y modifier.

---

### Task 1 : Scaffold Next.js manuel

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `.gitignore`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/(site)/page.tsx`

- [ ] **Step 1 : package.json**

```json
{
  "name": "kaboul-house",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run",
    "typecheck": "tsc --noEmit",
    "typegen": "sanity schema extract --path=.sanity/schema.json && sanity typegen generate",
    "cf:preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
    "cf:deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy"
  },
  "dependencies": {
    "@opennextjs/cloudflare": "^1.20.2",
    "@sanity/image-url": "^2.1.1",
    "@sanity/vision": "^6.9.1",
    "lenis": "^1.3.26",
    "motion": "^13.1.0",
    "next": "16.3.0",
    "next-sanity": "^13.3.1",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "sanity": "^6.9.1"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.3.0",
    "sharp": "^0.34.0",
    "tailwindcss": "^4",
    "typescript": "^5",
    "vitest": "^4.1.10",
    "wrangler": "^4.120.0"
  }
}
```

- [ ] **Step 2 : tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3 : next.config.ts** (le loader custom arrive en Task 4 — ici config minimale)

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

export default nextConfig;
```

- [ ] **Step 4 : postcss.config.mjs**

```js
const config = { plugins: ["@tailwindcss/postcss"] };
export default config;
```

- [ ] **Step 5 : eslint.config.mjs**

```js
import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  { ignores: [".next/**", ".open-next/**", "node_modules/**", "src/sanity/types.ts"] },
]);
```

- [ ] **Step 6 : .gitignore**

```
node_modules/
.next/
.open-next/
.sanity/
.env*.local
*.tsbuildinfo
next-env.d.ts
.wrangler/
```

- [ ] **Step 7 : src/app/globals.css** (provisoire — les tokens complets arrivent en Task 3)

```css
@import "tailwindcss";
```

- [ ] **Step 8 : src/app/layout.tsx** (provisoire)

```tsx
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 9 : src/app/(site)/page.tsx** (provisoire)

```tsx
export default function HomePage() {
  return <main>Kaboul House</main>;
}
```

- [ ] **Step 10 : Installer et vérifier**

Run: `npm install` puis `npm run build`
Expected: build Next.js réussi (route `/` statique).

- [ ] **Step 11 : Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 16 + Tailwind 4 (TypeScript strict)"
```

---

### Task 2 : Assets de marque (polices, photo hero, spec DA)

**Files:**
- Create: `src/app/fonts/bonny/Bonny-{Thin,Light,Regular,Medium,Bold}.woff2` (copie)
- Create: `public/images/hero-intro.png` (copie), `public/images/hero-intro.webp` (généré)
- Create: `docs/superpowers/specs/2026-08-10-design-system-design.md` (copie)
- Create: `scripts/optimize-hero.mjs`

- [ ] **Step 1 : Copier les assets depuis l'ancien projet**

```powershell
New-Item -ItemType Directory -Force src\app\fonts\bonny, public\images | Out-Null
Copy-Item "C:\Users\mezia\Desktop\Kaboul House\src\app\fonts\bonny\*.woff2" src\app\fonts\bonny\
Copy-Item "C:\Users\mezia\Desktop\Kaboul House\public\images\hero-intro.png" public\images\
Copy-Item "C:\Users\mezia\Desktop\Kaboul House\docs\superpowers\specs\2026-08-10-design-system-design.md" docs\superpowers\specs\
```

Expected: 5 fichiers woff2, le png (~6,7 Mo), la spec DA.

- [ ] **Step 2 : scripts/optimize-hero.mjs** — le png est trop lourd pour être servi tel quel ; pas d'optimisation à la volée sur Workers, donc conversion unique au format WebP.

```js
import sharp from "sharp";

await sharp("public/images/hero-intro.png")
  .resize({ width: 2560, withoutEnlargement: true })
  .webp({ quality: 80 })
  .toFile("public/images/hero-intro.webp");

console.log("hero-intro.webp généré");
```

- [ ] **Step 3 : Générer et vérifier**

Run: `node scripts/optimize-hero.mjs` puis `Get-Item public\images\hero-intro.webp | Select-Object Length`
Expected: fichier webp < 500 Ko. Le `.png` source reste hors git (trop lourd) : ajouter la ligne `public/images/hero-intro.png` à `.gitignore`.

- [ ] **Step 4 : Commit**

```bash
git add -A
git commit -m "feat: assets de marque (Bonny, hero webp, spec DA)"
```

---

### Task 3 : Tokens design + polices + layout racine

**Files:**
- Modify: `src/app/globals.css`, `src/app/layout.tsx`

- [ ] **Step 1 : globals.css complet** (tokens validés de la spec DA)

```css
@import "tailwindcss";

:root {
  --background: #ffebed;
  --foreground: #241a18;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);

  /* Palette Kaboul House — docs/superpowers/specs/2026-08-10-design-system-design.md */
  --color-blush: #ffebed;
  --color-blush-2: #f6d9da;
  --color-grenat: #8a1a1a;
  --color-grenat-vif: #b33327;
  --color-grenat-profond: #5e1212;
  --color-petrole: #014652;
  --color-petrole-clair: #0c5b69;
  --color-encre: #241a18;
  --color-encre-douce: #5c4a47;
  --color-creme: #fbefea;

  --font-bonny: var(--font-bonny-local);
  --font-josefin: var(--font-josefin-google);
  --font-sans: var(--font-josefin);

  /* Échelle d'espacement — croît en se rapprochant de l'action */
  --spacing-sp-1: 6px;
  --spacing-sp-2: 10px;
  --spacing-sp-3: 16px;
  --spacing-sp-4: 24px;
  --spacing-sp-5: 36px;
  --spacing-sp-6: 56px;

  --radius-pill: 999px;
  --radius-panel: 18px;
  --radius-hero: 28px;

  --ease-signature: cubic-bezier(0.16, 1, 0.3, 1);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-josefin), sans-serif;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2 : layout.tsx avec polices et MotionConfig**

```tsx
import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import localFont from "next/font/local";
import { MotionConfig } from "motion/react";
import "./globals.css";

const bonny = localFont({
  variable: "--font-bonny-local",
  src: [
    { path: "./fonts/bonny/Bonny-Thin.woff2", weight: "100", style: "normal" },
    { path: "./fonts/bonny/Bonny-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/bonny/Bonny-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/bonny/Bonny-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/bonny/Bonny-Bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
});

const josefin = Josefin_Sans({
  variable: "--font-josefin-google",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kaboul House — Bazar oriental à Grenoble",
    template: "%s — Kaboul House",
  },
  description:
    "Tapis noués main, toshak kabuli, textiles, art de la table et fruits secs — de Kaboul, Téhéran et Istanbul jusqu'au cœur de Grenoble.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${bonny.variable} ${josefin.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
```

- [ ] **Step 3 : Vérifier**

Run: `npm run build`
Expected: build OK, pas d'erreur de police (chemins relatifs à `src/app/`).

- [ ] **Step 4 : Commit**

```bash
git add -A
git commit -m "feat: tokens DA + polices Bonny/Josefin + layout racine"
```

---

### Task 4 : Vitest + utilitaires purs (TDD) + loader d'images Sanity

**Files:**
- Create: `vitest.config.mts`, `src/lib/whatsapp.ts`, `src/lib/whatsapp.test.ts`, `src/lib/image-loader.ts`, `src/lib/image-loader.test.ts`
- Modify: `next.config.ts`

- [ ] **Step 1 : vitest.config.mts**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { environment: "node", include: ["src/**/*.test.ts"] },
});
```

- [ ] **Step 2 : Test whatsapp (échec attendu)**

`src/lib/whatsapp.test.ts` :

```ts
import { describe, expect, it } from "vitest";
import { whatsappUrl } from "./whatsapp";

describe("whatsappUrl", () => {
  it("convertit un numéro FR formaté en lien wa.me", () => {
    expect(whatsappUrl("+33 7 80 79 96 89")).toBe("https://wa.me/33780799689");
  });
  it("gère les points et tirets", () => {
    expect(whatsappUrl("+33.7-80 79 96 89")).toBe("https://wa.me/33780799689");
  });
  it("retombe sur la page boutiques sans numéro", () => {
    expect(whatsappUrl(undefined)).toBe("/boutiques");
    expect(whatsappUrl("")).toBe("/boutiques");
  });
});
```

Run: `npm test`
Expected: FAIL — `whatsapp.ts` n'existe pas.

- [ ] **Step 3 : Implémentation minimale**

`src/lib/whatsapp.ts` :

```ts
/** Lien WhatsApp cliquable à partir du numéro tel que saisi dans Sanity. */
export function whatsappUrl(phone: string | null | undefined): string {
  if (!phone) return "/boutiques";
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "/boutiques";
  return `https://wa.me/${digits.replace(/^0/, "33")}`;
}
```

Run: `npm test`
Expected: PASS (3 tests).

- [ ] **Step 4 : Test du loader d'images (échec attendu)**

`src/lib/image-loader.test.ts` :

```ts
import { describe, expect, it } from "vitest";
import loader from "./image-loader";

describe("image-loader", () => {
  it("ajoute les transformations CDN Sanity", () => {
    const out = loader({ src: "https://cdn.sanity.io/images/abc/production/x.jpg", width: 1200 });
    const url = new URL(out);
    expect(url.searchParams.get("w")).toBe("1200");
    expect(url.searchParams.get("auto")).toBe("format");
    expect(url.searchParams.get("fit")).toBe("max");
    expect(url.searchParams.get("q")).toBe("75");
  });
  it("respecte une qualité explicite", () => {
    const out = loader({ src: "https://cdn.sanity.io/images/abc/production/x.jpg", width: 800, quality: 60 });
    expect(new URL(out).searchParams.get("q")).toBe("60");
  });
  it("préserve les paramètres existants (rect, etc.)", () => {
    const out = loader({ src: "https://cdn.sanity.io/images/abc/production/x.jpg?rect=0,0,100,100", width: 800 });
    expect(new URL(out).searchParams.get("rect")).toBe("0,0,100,100");
  });
  it("laisse passer les images locales sans transformation", () => {
    expect(loader({ src: "/images/hero-intro.webp", width: 1200 })).toBe("/images/hero-intro.webp");
  });
});
```

Run: `npm test`
Expected: FAIL — `image-loader.ts` n'existe pas.

- [ ] **Step 5 : Implémentation du loader**

`src/lib/image-loader.ts` :

```ts
"use client";

/**
 * Loader next/image : délègue les transformations au CDN Sanity (gratuit),
 * pas au service d'images Cloudflare (payant). Les assets locaux sont servis
 * tels quels — ils sont pré-optimisés au build (cf. scripts/optimize-hero.mjs).
 */
export default function sanityImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (!src.includes("cdn.sanity.io")) return src;
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
}
```

Run: `npm test`
Expected: PASS (7 tests).

- [ ] **Step 6 : Brancher le loader dans next.config.ts**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

export default nextConfig;
```

Run: `npm run build`
Expected: build OK.

- [ ] **Step 7 : Commit**

```bash
git add -A
git commit -m "feat: vitest + whatsappUrl + loader images CDN Sanity (TDD)"
```

---

### Task 5 : Sanity — projet, client, studio embarqué `/admin`

**Files:**
- Create: `src/sanity/lib/env.ts`, `src/sanity/lib/client.ts`, `src/sanity/lib/image.ts`, `sanity.config.ts` (provisoire), `sanity.cli.ts`, `src/app/admin/[[...tool]]/page.tsx`, `.env.local.example`, `.env.local`

- [ ] **Step 1 : Créer/récupérer le projet Sanity** ⚠️ nécessite l'utilisateur

Demander à l'utilisateur le `projectId` Sanity (celui de l'ancien projet `Desktop\Kaboul House\.env.local` peut être réutilisé — le lire s'il existe : `Get-Content "C:\Users\mezia\Desktop\Kaboul House\.env.local"`). Sinon : `npx sanity@latest login` puis `npx sanity@latest projects create` (plan gratuit). Dataset : `production`.

- [ ] **Step 2 : .env.local.example** (commité) et `.env.local` (réel, non commité)

```
# Sanity — https://sanity.io/manage
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxx
NEXT_PUBLIC_SANITY_DATASET=production
# Token "Viewer" — requis pour le draft mode / Presentation
SANITY_API_READ_TOKEN=
# Secret partagé du webhook de revalidation (générer : openssl rand -hex 32)
SANITY_REVALIDATE_SECRET=
```

- [ ] **Step 3 : src/sanity/lib/env.ts**

```ts
function required(value: string | undefined, name: string): string {
  if (!value) throw new Error(`Variable d'environnement manquante : ${name}`);
  return value;
}

export const projectId = required(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
);
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2026-08-01";
```

- [ ] **Step 4 : src/sanity/lib/client.ts**

```ts
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: { studioUrl: "/admin" },
});
```

- [ ] **Step 5 : src/sanity/lib/image.ts**

```ts
import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageSource) =>
  builder.image(source).auto("format").fit("max");
```

- [ ] **Step 6 : sanity.config.ts provisoire** (schémas vides — Task 6 les remplit)

```ts
"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "@/sanity/lib/env";

export default defineConfig({
  basePath: "/admin",
  title: "Kaboul House",
  projectId,
  dataset,
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
  schema: { types: [] },
});
```

- [ ] **Step 7 : sanity.cli.ts** (pour `sanity schema extract` / typegen)

```ts
import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  },
});
```

- [ ] **Step 8 : Route studio `src/app/admin/[[...tool]]/page.tsx`**

```tsx
import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

- [ ] **Step 9 : Vérifier**

Run: `npm run dev` puis ouvrir `http://localhost:3000/admin`
Expected: le studio Sanity se charge (vide), connexion possible. Ajouter `http://localhost:3000` aux origines CORS du projet (https://sanity.io/manage → API → CORS origins, credentials autorisés).

- [ ] **Step 10 : Commit**

```bash
git add -A
git commit -m "feat: Sanity embarque sur /admin (client, env, image builder)"
```

---

### Task 6 : Schémas de contenu + studio en français

**Files:**
- Create: `src/sanity/schemas/siteSettings.ts`, `homePage.ts`, `aboutPage.ts`, `category.ts`, `product.ts`, `shop.ts`, `index.ts`, `src/sanity/structure.ts`
- Modify: `sanity.config.ts`

- [ ] **Step 1 : src/sanity/schemas/siteSettings.ts**

```ts
import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Réglages du site",
  type: "document",
  fields: [
    defineField({
      name: "whatsapp",
      title: "Numéro WhatsApp",
      description: "Format international, ex. +33 7 80 79 96 89 — utilisé par tous les boutons « Nous écrire ».",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "phone", title: "Téléphone (affiché)", type: "string" }),
    defineField({ name: "instagram", title: "Lien Instagram", type: "url" }),
    defineField({ name: "facebook", title: "Lien Facebook", type: "url" }),
    defineField({
      name: "seoDescription",
      title: "Description SEO par défaut",
      description: "Une à deux phrases affichées dans les résultats Google.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "ogImage",
      title: "Image de partage (réseaux sociaux)",
      type: "image",
    }),
  ],
  preview: { prepare: () => ({ title: "Réglages du site" }) },
});
```

- [ ] **Step 2 : src/sanity/schemas/homePage.ts**

```ts
import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Page d'accueil",
  type: "document",
  fields: [
    defineField({
      name: "heroTitle",
      title: "Titre du hero",
      description: "Le grand titre sur la photo, ex. « Cinq mondes, une même grande maison. »",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroSubtitle",
      title: "Sous-titre du hero",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "heroImage",
      title: "Photo du hero",
      description: "Photo plein écran derrière le titre. Sans photo, l'image par défaut est utilisée.",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: { prepare: () => ({ title: "Page d'accueil" }) },
});
```

- [ ] **Step 3 : src/sanity/schemas/aboutPage.ts**

```ts
import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "Notre maison",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "intro", title: "Introduction", type: "text", rows: 3 }),
    defineField({
      name: "story",
      title: "Histoire",
      description: "Le récit de la maison, paragraphe par paragraphe.",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: { prepare: () => ({ title: "Notre maison" }) },
});
```

- [ ] **Step 4 : src/sanity/schemas/category.ts**

```ts
import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Univers (catégorie)",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Nom",
      description: "Ex. Tapis, Toshak, Textiles, Art de la table, Fruits secs.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Adresse de la page (slug)",
      description: "Généré depuis le nom — ne pas changer une fois le site en ligne.",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({
      name: "image",
      title: "Photo de couverture",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Ordre d'affichage",
      description: "1 = premier. Ordonne les univers sur la page d'accueil.",
      type: "number",
      initialValue: 10,
    }),
  ],
  orderings: [
    { name: "orderAsc", title: "Ordre d'affichage", by: [{ field: "order", direction: "asc" }] },
  ],
});
```

- [ ] **Step 5 : src/sanity/schemas/product.ts**

```ts
import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Produit",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Nom",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Adresse de la page (slug)",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Univers",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "images",
      title: "Photos",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (rule) => rule.min(1).error("Au moins une photo."),
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
    defineField({
      name: "featured",
      title: "Mettre en avant",
      description: "Affiché en priorité dans son univers.",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category.title", media: "images.0" },
  },
});
```

- [ ] **Step 6 : src/sanity/schemas/shop.ts**

```ts
import { defineField, defineType } from "sanity";

export const shop = defineType({
  name: "shop",
  title: "Boutique",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nom",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "address",
      title: "Adresse",
      description: "Adresse complète. Pour la 2e boutique, laisser « Adresse à venir » en attendant.",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "phone", title: "Téléphone", type: "string" }),
    defineField({
      name: "hours",
      title: "Horaires",
      description: "Texte libre, ex. « Lun–Sam : 10h–19h ».",
      type: "text",
      rows: 3,
    }),
    defineField({ name: "image", title: "Photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "order", title: "Ordre d'affichage", type: "number", initialValue: 10 }),
  ],
});
```

- [ ] **Step 7 : src/sanity/schemas/index.ts**

```ts
import { aboutPage } from "./aboutPage";
import { category } from "./category";
import { homePage } from "./homePage";
import { product } from "./product";
import { shop } from "./shop";
import { siteSettings } from "./siteSettings";

export const SINGLETON_TYPES = ["siteSettings", "homePage", "aboutPage"] as const;

export const schemaTypes = [siteSettings, homePage, aboutPage, category, product, shop];
```

- [ ] **Step 8 : src/sanity/structure.ts** (menu français, singletons épinglés)

```ts
import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenu")
    .items([
      S.listItem()
        .title("Réglages du site")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem()
        .title("Page d'accueil")
        .id("homePage")
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .title("Notre maison")
        .id("aboutPage")
        .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
      S.divider(),
      S.documentTypeListItem("category").title("Univers"),
      S.documentTypeListItem("product").title("Produits"),
      S.documentTypeListItem("shop").title("Boutiques"),
    ]);
```

- [ ] **Step 9 : sanity.config.ts final** (singletons non duplicables/supprimables)

```ts
"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "@/sanity/lib/env";
import { SINGLETON_TYPES, schemaTypes } from "@/sanity/schemas";
import { structure } from "@/sanity/structure";

const singletons = new Set<string>(SINGLETON_TYPES);

export default defineConfig({
  basePath: "/admin",
  title: "Kaboul House",
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter((t) => !singletons.has(t.schemaType)),
  },
  document: {
    actions: (actions, context) =>
      singletons.has(context.schemaType)
        ? actions.filter((a) => !["unpublish", "delete", "duplicate"].includes(a.action ?? ""))
        : actions,
  },
});
```

- [ ] **Step 10 : Vérifier et saisir le contenu initial**

Run: `npm run dev` → `http://localhost:3000/admin`
Expected: menu « Contenu » en français, 3 singletons + 3 collections. Créer : les Réglages (WhatsApp `+33 7 80 79 96 89`), la Page d'accueil (titre « Cinq mondes, une même grande maison. », sous-titre « Tapis noués main, toshak kabuli et l'art de recevoir — de Kaboul, Téhéran et Istanbul jusqu'au cœur de Grenoble. »), les 5 univers, 1 boutique (1 bd Gambetta, Grenoble) + 1 boutique placeholder (« Adresse à venir »), et au moins 1 produit de test par univers.

- [ ] **Step 11 : Commit**

```bash
git add -A
git commit -m "feat: schemas Sanity (3 singletons, 3 collections) + studio francais"
```

---

### Task 7 : Requêtes GROQ typées + sanityFetch taggé

**Files:**
- Create: `src/sanity/queries/index.ts`, `src/sanity/lib/fetch.ts`, `sanity-typegen.json`
- Generate: `src/sanity/types.ts` (via typegen, commité)

- [ ] **Step 1 : src/sanity/queries/index.ts**

```ts
import { defineQuery } from "next-sanity";

export const SETTINGS_QUERY = defineQuery(
  `*[_type == "siteSettings"][0]{whatsapp, phone, instagram, facebook, seoDescription, ogImage}`,
);

export const HOME_QUERY = defineQuery(
  `*[_type == "homePage"][0]{
    heroTitle, heroSubtitle, heroImage,
    "categories": *[_type == "category"] | order(order asc){
      title, "slug": slug.current, description, image
    }
  }`,
);

export const ABOUT_QUERY = defineQuery(
  `*[_type == "aboutPage"][0]{title, intro, story, image}`,
);

export const CATEGORY_QUERY = defineQuery(
  `*[_type == "category" && slug.current == $slug][0]{
    title, description, image,
    "products": *[_type == "product" && category._ref == ^._id]
      | order(featured desc, title asc){
        title, "slug": slug.current, description, images
    }
  }`,
);

export const CATEGORY_SLUGS_QUERY = defineQuery(
  `*[_type == "category" && defined(slug.current)]{"slug": slug.current}`,
);

export const PRODUCT_QUERY = defineQuery(
  `*[_type == "product" && slug.current == $slug][0]{
    title, description, images,
    "category": category->{title, "slug": slug.current}
  }`,
);

export const PRODUCT_SLUGS_QUERY = defineQuery(
  `*[_type == "product" && defined(slug.current)]{"slug": slug.current}`,
);

export const SHOPS_QUERY = defineQuery(
  `*[_type == "shop"] | order(order asc){name, address, phone, hours, image}`,
);
```

- [ ] **Step 2 : src/sanity/lib/fetch.ts** — seul point d'accès aux données pour les pages

```ts
import { draftMode } from "next/headers";
import { client } from "./client";

/**
 * Fetch GROQ avec tags de cache. En draft mode (Presentation), lit les
 * brouillons sans cache avec stega pour les overlays d'édition visuelle.
 */
export async function sanityFetch<QueryString extends string>({
  query,
  params = {},
  tags,
}: {
  query: QueryString;
  params?: Record<string, unknown>;
  tags: string[];
}) {
  const { isEnabled: isDraft } = await draftMode();
  return client.fetch(query, params, {
    ...(isDraft && {
      token: process.env.SANITY_API_READ_TOKEN,
      perspective: "drafts",
      useCdn: false,
      stega: true,
    }),
    next: isDraft ? { revalidate: 0 } : { tags },
  });
}
```

- [ ] **Step 3 : sanity-typegen.json**

```json
{
  "path": "./src/**/*.{ts,tsx}",
  "schema": ".sanity/schema.json",
  "generates": "./src/sanity/types.ts"
}
```

- [ ] **Step 4 : Générer les types et vérifier**

Run: `npm run typegen` puis `npm run typecheck`
Expected: `src/sanity/types.ts` généré (types `HOME_QUERYResult`, etc.), typecheck OK. Commiter le fichier généré (pas de typegen en CI).

- [ ] **Step 5 : Commit**

```bash
git add -A
git commit -m "feat: requetes GROQ typees (TypeGen) + sanityFetch taggee"
```

---

### Task 8 : Webhook de revalidation (TDD)

**Files:**
- Create: `src/lib/revalidate-tags.ts`, `src/lib/revalidate-tags.test.ts`, `src/app/api/revalidate/route.ts`

- [ ] **Step 1 : Test du mapping type → tags (échec attendu)**

`src/lib/revalidate-tags.test.ts` :

```ts
import { describe, expect, it } from "vitest";
import { tagsForType } from "./revalidate-tags";

describe("tagsForType", () => {
  it("mappe chaque type de document sur son tag", () => {
    expect(tagsForType("product")).toEqual(["product"]);
    expect(tagsForType("category")).toEqual(["category"]);
    expect(tagsForType("shop")).toEqual(["shop"]);
    expect(tagsForType("homePage")).toEqual(["homePage"]);
    expect(tagsForType("aboutPage")).toEqual(["aboutPage"]);
    expect(tagsForType("siteSettings")).toEqual(["settings"]);
  });
  it("ignore les types inconnus (pas de retry storm)", () => {
    expect(tagsForType("autre")).toEqual([]);
  });
});
```

Run: `npm test`
Expected: FAIL — `revalidate-tags.ts` n'existe pas.

- [ ] **Step 2 : Implémentation**

`src/lib/revalidate-tags.ts` :

```ts
const TAGS: Record<string, string[]> = {
  siteSettings: ["settings"],
  homePage: ["homePage"],
  aboutPage: ["aboutPage"],
  category: ["category"],
  product: ["product"],
  shop: ["shop"],
};

export function tagsForType(type: string): string[] {
  return TAGS[type] ?? [];
}
```

Run: `npm test`
Expected: PASS.

- [ ] **Step 3 : Route webhook `src/app/api/revalidate/route.ts`**

```ts
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { tagsForType } from "@/lib/revalidate-tags";

export async function POST(req: NextRequest) {
  const { isValidSignature, body } = await parseBody<{ _type?: string }>(
    req,
    process.env.SANITY_REVALIDATE_SECRET,
  );

  if (!isValidSignature) {
    return new NextResponse("Signature invalide", { status: 401 });
  }

  const tags = body?._type ? tagsForType(body._type) : [];
  for (const tag of tags) revalidateTag(tag);

  return NextResponse.json({ revalidated: tags });
}
```

- [ ] **Step 4 : Vérifier**

Run: `npm run typecheck && npm test && npm run build`
Expected: tout passe. (Le webhook côté Sanity sera créé en Task 15 avec l'URL de prod.)

- [ ] **Step 5 : Commit**

```bash
git add -A
git commit -m "feat: webhook /api/revalidate signe + mapping tags (TDD)"
```

---

### Task 9 : Primitives UI — Pill (CTA) et SectionLabel

**Files:**
- Create: `src/components/ui/Pill.tsx`, `src/components/ui/SectionLabel.tsx`

- [ ] **Step 1 : src/components/ui/Pill.tsx** — style CTA validé (crème, bordure grenat, étoile qui pivote)

```tsx
import Link from "next/link";

function Star() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-3.5 shrink-0 transition-transform duration-300 group-hover:rotate-45"
      style={{ transitionTimingFunction: "var(--ease-signature)" }}
      aria-hidden
    >
      <path
        d="M8 0C8.6 4.2 11.8 7.4 16 8c-4.2.6-7.4 3.8-8 8-.6-4.2-3.8-7.4-8-8 4.2-.6 7.4-3.8 8-8Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Pill({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http");
  return (
    <Link
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className="group inline-flex items-center gap-sp-2 rounded-pill border border-grenat/30 bg-creme px-sp-4 py-sp-2 font-bold text-grenat transition-colors hover:bg-blush"
    >
      <Star />
      {children}
    </Link>
  );
}
```

- [ ] **Step 2 : src/components/ui/SectionLabel.tsx** — eyebrow (jamais en majuscules forcées, graisse 400)

```tsx
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-sp-2 font-normal text-grenat">
      <span className="inline-block size-1.5 rounded-full bg-grenat" aria-hidden />
      {children}
    </p>
  );
}
```

- [ ] **Step 3 : Vérifier + commit**

Run: `npm run typecheck`
Expected: OK.

```bash
git add -A
git commit -m "feat: primitives UI Pill (CTA etoile) + SectionLabel"
```

---

### Task 10 : SiteHeader — nav overlay layout BLINK + burger

**Files:**
- Create: `src/components/layout/SiteHeader.tsx`

- [ ] **Step 1 : SiteHeader.tsx** (client — état du burger). Layout BLINK : logo gauche / liens centrés (grille `1fr auto 1fr`) / CTA droite. `variant="overlay"` = posé sur la photo (texte blanc) ; `variant="band"` = bandeau pétrole pour les pages sans hero photo.

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Pill } from "@/components/ui/Pill";

const LINKS = [
  { href: "/notre-maison", label: "Notre maison" },
  { href: "/#univers", label: "Nos univers" },
  { href: "/boutiques", label: "Nos boutiques" },
];

export function SiteHeader({
  whatsappHref,
  variant = "overlay",
}: {
  whatsappHref: string;
  variant?: "overlay" | "band";
}) {
  const [open, setOpen] = useState(false);
  const position = variant === "overlay" ? "absolute inset-x-0 top-0" : "bg-petrole";

  return (
    <header className={`${position} z-50 px-sp-4 pt-sp-4 pb-sp-3 text-white md:px-sp-5`}>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center">
        <Link href="/" className="justify-self-start font-bonny text-2xl font-bold">
          Kaboul House
        </Link>

        <nav className="hidden justify-self-center min-[760px]:flex min-[760px]:gap-sp-5">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="whitespace-nowrap font-normal opacity-85 transition-opacity hover:opacity-100"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden justify-self-end min-[760px]:block">
          <Pill href={whatsappHref}>Nous écrire</Pill>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          className="col-start-3 justify-self-end min-[760px]:hidden"
        >
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 8h16M4 16h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="mt-sp-3 flex flex-col items-start gap-sp-3 rounded-panel bg-encre/70 p-sp-4 backdrop-blur-md min-[760px]:hidden">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="font-normal">
              {l.label}
            </Link>
          ))}
          <Pill href={whatsappHref}>Nous écrire</Pill>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 2 : Vérifier + commit**

Run: `npm run typecheck`
Expected: OK.

```bash
git add -A
git commit -m "feat: SiteHeader overlay BLINK (logo/liens centres/CTA) + burger"
```

---

### Task 11 : Layout (site), footer, scroll fluide

**Files:**
- Create: `src/components/layout/SmoothScrollProvider.tsx`, `src/components/layout/SiteFooter.tsx`, `src/app/(site)/layout.tsx`

- [ ] **Step 1 : SmoothScrollProvider.tsx**

```tsx
"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScrollProvider() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true });
    return () => lenis.destroy();
  }, []);
  return null;
}
```

- [ ] **Step 2 : SiteFooter.tsx** (bandeau pétrole, contenu depuis les réglages)

```tsx
import Link from "next/link";
import { Pill } from "@/components/ui/Pill";
import { whatsappUrl } from "@/lib/whatsapp";
import type { SETTINGS_QUERYResult } from "@/sanity/types";

export function SiteFooter({ settings }: { settings: SETTINGS_QUERYResult }) {
  return (
    <footer className="bg-petrole px-sp-4 py-sp-6 text-blush md:px-sp-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-sp-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-bonny text-3xl font-bold">Kaboul House</p>
          <p className="mt-sp-2 max-w-sm font-light opacity-80">
            Bazar oriental à Grenoble — tapis, toshak, textiles, art de la table et fruits secs.
          </p>
        </div>
        <nav className="flex flex-col gap-sp-2">
          <Link href="/notre-maison" className="opacity-85 hover:opacity-100">Notre maison</Link>
          <Link href="/#univers" className="opacity-85 hover:opacity-100">Nos univers</Link>
          <Link href="/boutiques" className="opacity-85 hover:opacity-100">Nos boutiques</Link>
        </nav>
        <div className="flex flex-col items-start gap-sp-3">
          <Pill href={whatsappUrl(settings?.whatsapp)}>Nous écrire sur WhatsApp</Pill>
          {settings?.phone && <p className="opacity-80">{settings.phone}</p>}
          <div className="flex gap-sp-3">
            {settings?.instagram && (
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="opacity-85 hover:opacity-100">
                Instagram
              </a>
            )}
            {settings?.facebook && (
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="opacity-85 hover:opacity-100">
                Facebook
              </a>
            )}
          </div>
        </div>
      </div>
      <p className="mx-auto mt-sp-6 max-w-6xl text-sm font-light opacity-60">
        © {new Date().getFullYear()} Kaboul House — Grenoble
      </p>
    </footer>
  );
}
```

- [ ] **Step 3 : src/app/(site)/layout.tsx** (footer + scroll ; VisualEditing arrive en Task 14)

```tsx
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SETTINGS_QUERY } from "@/sanity/queries";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await sanityFetch({ query: SETTINGS_QUERY, tags: ["settings"] });
  return (
    <>
      <SmoothScrollProvider />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} />
    </>
  );
}
```

- [ ] **Step 4 : Vérifier + commit**

Run: `npm run typecheck`
Expected: OK (le type `SETTINGS_QUERYResult` vient du typegen de Task 7).

```bash
git add -A
git commit -m "feat: layout site (footer petrole + Lenis)"
```

---

### Task 12 : Hero BLINK + page d'accueil

**Files:**
- Create: `src/components/sections/HomeHero.tsx`, `src/components/sections/HeroTitle.tsx`, `src/components/sections/CategoryGrid.tsx`, `src/components/sections/WhatsAppBand.tsx`
- Modify: `src/app/(site)/page.tsx`

- [ ] **Step 1 : HeroTitle.tsx** (îlot client — reveal mot-par-mot)

```tsx
"use client";

import { motion } from "motion/react";

export function HeroTitle({ title }: { title: string }) {
  return (
    <h1 className="max-w-3xl font-bonny text-5xl font-bold leading-[.9] md:text-7xl">
      {title.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "0.8em", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
          {"\u00A0"}
        </span>
      ))}
    </h1>
  );
}
```

- [ ] **Step 2 : HomeHero.tsx** — layout BLINK exact : carte image plein viewport, coins arrondis, marge fine sur fond blush ; nav overlay ; bloc central titre + sous-titre sans bouton.

```tsx
import Image from "next/image";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { HeroTitle } from "./HeroTitle";

export function HomeHero({
  title,
  subtitle,
  imageUrl,
  whatsappHref,
}: {
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  whatsappHref: string;
}) {
  return (
    <section className="p-2 md:p-3">
      <div className="relative h-[calc(100svh-16px)] overflow-hidden rounded-[var(--radius-hero)] md:h-[calc(100svh-24px)]">
        <Image
          src={imageUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-encre/50 via-encre/15 to-encre/55"
          aria-hidden
        />
        <SiteHeader whatsappHref={whatsappHref} variant="overlay" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-sp-4 text-center text-white">
          <HeroTitle title={title} />
          {subtitle && (
            <p className="mt-sp-4 max-w-xl font-light leading-relaxed opacity-95">{subtitle}</p>
          )}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3 : CategoryGrid.tsx**

```tsx
import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { urlFor } from "@/sanity/lib/image";
import type { HOME_QUERYResult } from "@/sanity/types";

type Categories = NonNullable<HOME_QUERYResult>["categories"];

export function CategoryGrid({ categories }: { categories: Categories }) {
  if (!categories?.length) return null;
  return (
    <section id="univers" className="mx-auto max-w-6xl px-sp-4 py-sp-6 md:px-sp-5">
      <SectionLabel>Nos univers</SectionLabel>
      <h2 className="mt-sp-3 font-bonny text-4xl font-bold text-encre md:text-5xl">
        Cinq mondes à explorer
      </h2>
      <div className="mt-sp-5 grid gap-sp-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) =>
          cat.slug ? (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="group overflow-hidden rounded-panel bg-blush-2"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {cat.image ? (
                  <Image
                    src={urlFor(cat.image).width(800).url()}
                    alt={cat.title ?? ""}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    style={{ transitionTimingFunction: "var(--ease-signature)" }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-grenat to-petrole" aria-hidden />
                )}
              </div>
              <div className="p-sp-4">
                <h3 className="font-bonny text-2xl font-medium text-encre">{cat.title}</h3>
                {cat.description && (
                  <p className="mt-sp-2 font-light text-encre-douce">{cat.description}</p>
                )}
              </div>
            </Link>
          ) : null,
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 4 : WhatsAppBand.tsx**

```tsx
import { Pill } from "@/components/ui/Pill";

export function WhatsAppBand({ whatsappHref }: { whatsappHref: string }) {
  return (
    <section className="bg-petrole px-sp-4 py-sp-6 text-center text-blush">
      <h2 className="mx-auto max-w-2xl font-bonny text-4xl font-bold md:text-5xl">
        Une pièce vous fait de l'œil ?
      </h2>
      <p className="mx-auto mt-sp-3 max-w-xl font-light opacity-90">
        Écrivez-nous sur WhatsApp — photos, dimensions, conseils, mise de côté.
      </p>
      <div className="mt-sp-5 flex justify-center">
        <Pill href={whatsappHref}>Nous écrire sur WhatsApp</Pill>
      </div>
    </section>
  );
}
```

- [ ] **Step 5 : src/app/(site)/page.tsx**

```tsx
import { whatsappUrl } from "@/lib/whatsapp";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { HomeHero } from "@/components/sections/HomeHero";
import { WhatsAppBand } from "@/components/sections/WhatsAppBand";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import { HOME_QUERY, SETTINGS_QUERY } from "@/sanity/queries";

export default async function HomePage() {
  const [home, settings] = await Promise.all([
    sanityFetch({ query: HOME_QUERY, tags: ["homePage", "category"] }),
    sanityFetch({ query: SETTINGS_QUERY, tags: ["settings"] }),
  ]);
  const wa = whatsappUrl(settings?.whatsapp);

  return (
    <>
      <HomeHero
        title={home?.heroTitle ?? "Cinq mondes, une même grande maison."}
        subtitle={home?.heroSubtitle}
        imageUrl={home?.heroImage ? urlFor(home.heroImage).width(2560).url() : "/images/hero-intro.webp"}
        whatsappHref={wa}
      />
      <CategoryGrid categories={home?.categories ?? []} />
      <WhatsAppBand whatsappHref={wa} />
    </>
  );
}
```

- [ ] **Step 6 : Vérifier visuellement**

Run: `npm run dev` → `http://localhost:3000`
Expected: hero carte arrondie plein écran sur fond blush, nav overlay (logo gauche / liens centrés / pilule droite), titre Bonny blanc en 2 lignes avec reveal, sous-titre dessous, pas de bouton au centre. Grille des univers + bandeau WhatsApp en dessous. Burger < 760 px.

- [ ] **Step 7 : Commit**

```bash
git add -A
git commit -m "feat: hero accueil layout BLINK + grille univers + bandeau WhatsApp"
```

---

### Task 13 : Pages univers, produit, notre maison, boutiques

**Files:**
- Create: `src/app/(site)/[categorie]/page.tsx`, `src/app/(site)/produit/[slug]/page.tsx`, `src/app/(site)/notre-maison/page.tsx`, `src/app/(site)/boutiques/page.tsx`, `src/components/layout/PageIntro.tsx`

- [ ] **Step 1 : PageIntro.tsx** — en-tête commun des pages intérieures (bandeau pétrole + header band)

```tsx
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function PageIntro({
  eyebrow,
  title,
  description,
  whatsappHref,
}: {
  eyebrow: string;
  title: string;
  description?: string | null;
  whatsappHref: string;
}) {
  return (
    <div className="bg-petrole text-blush">
      <SiteHeader whatsappHref={whatsappHref} variant="band" />
      <div className="mx-auto max-w-6xl px-sp-4 pb-sp-6 pt-sp-5 md:px-sp-5">
        <SectionLabel>{eyebrow}</SectionLabel>
        <h1 className="mt-sp-3 max-w-2xl font-bonny text-5xl font-bold leading-[.9] md:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-sp-4 max-w-xl font-light leading-relaxed opacity-90">{description}</p>
        )}
      </div>
    </div>
  );
}
```

Note : dans `SectionLabel` le texte hérite `text-grenat` — sur fond pétrole c'est illisible. Ajuster `SectionLabel` pour hériter la couleur : remplacer `text-grenat` par `text-current` et `bg-grenat` par `bg-current` dans `SectionLabel.tsx` (les usages sur fond clair passent la couleur via un wrapper `text-grenat`, ex. `<div className="text-grenat"><SectionLabel>…</SectionLabel></div>` dans `CategoryGrid` — mettre à jour cet usage en même temps).

- [ ] **Step 2 : Page univers `src/app/(site)/[categorie]/page.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/layout/PageIntro";
import { whatsappUrl } from "@/lib/whatsapp";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import { CATEGORY_QUERY, CATEGORY_SLUGS_QUERY, SETTINGS_QUERY } from "@/sanity/queries";

export async function generateStaticParams() {
  const slugs = await client.fetch(CATEGORY_SLUGS_QUERY);
  return slugs.map((s) => ({ categorie: s.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorie: string }>;
}) {
  const { categorie } = await params;
  const [category, settings] = await Promise.all([
    sanityFetch({ query: CATEGORY_QUERY, params: { slug: categorie }, tags: ["category", "product"] }),
    sanityFetch({ query: SETTINGS_QUERY, tags: ["settings"] }),
  ]);
  if (!category) notFound();
  const wa = whatsappUrl(settings?.whatsapp);

  return (
    <>
      <PageIntro
        eyebrow="Nos univers"
        title={category.title ?? categorie}
        description={category.description}
        whatsappHref={wa}
      />
      <section className="mx-auto max-w-6xl px-sp-4 py-sp-6 md:px-sp-5">
        {category.products?.length ? (
          <div className="grid gap-sp-4 sm:grid-cols-2 lg:grid-cols-3">
            {category.products.map((p) =>
              p.slug ? (
                <Link key={p.slug} href={`/produit/${p.slug}`} className="group overflow-hidden rounded-panel bg-blush-2">
                  <div className="relative aspect-square overflow-hidden">
                    {p.images?.[0] ? (
                      <Image
                        src={urlFor(p.images[0]).width(800).url()}
                        alt={p.title ?? ""}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        style={{ transitionTimingFunction: "var(--ease-signature)" }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-grenat to-petrole" aria-hidden />
                    )}
                  </div>
                  <div className="p-sp-4">
                    <h2 className="font-bonny text-xl font-medium text-encre">{p.title}</h2>
                  </div>
                </Link>
              ) : null,
            )}
          </div>
        ) : (
          <p className="font-light text-encre-douce">
            Les pièces de cet univers arrivent bientôt — écrivez-nous sur WhatsApp pour en savoir plus.
          </p>
        )}
      </section>
    </>
  );
}
```

- [ ] **Step 3 : Page produit `src/app/(site)/produit/[slug]/page.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/layout/PageIntro";
import { Pill } from "@/components/ui/Pill";
import { whatsappUrl } from "@/lib/whatsapp";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import { PRODUCT_QUERY, PRODUCT_SLUGS_QUERY, SETTINGS_QUERY } from "@/sanity/queries";

export async function generateStaticParams() {
  const slugs = await client.fetch(PRODUCT_SLUGS_QUERY);
  return slugs.map((s) => ({ slug: s.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    sanityFetch({ query: PRODUCT_QUERY, params: { slug }, tags: ["product"] }),
    sanityFetch({ query: SETTINGS_QUERY, tags: ["settings"] }),
  ]);
  if (!product) notFound();
  const wa = whatsappUrl(settings?.whatsapp);

  return (
    <>
      <PageIntro
        eyebrow={product.category?.title ?? "Nos univers"}
        title={product.title ?? slug}
        whatsappHref={wa}
      />
      <section className="mx-auto grid max-w-6xl gap-sp-5 px-sp-4 py-sp-6 md:grid-cols-2 md:px-sp-5">
        <div className="flex flex-col gap-sp-3">
          {product.images?.map((img, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-panel bg-blush-2">
              <Image
                src={urlFor(img).width(1200).url()}
                alt={`${product.title ?? ""} — photo ${i + 1}`}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
        <div className="md:sticky md:top-sp-5 md:self-start">
          {product.description && (
            <p className="font-light leading-relaxed text-encre">{product.description}</p>
          )}
          <div className="mt-sp-5 flex flex-col items-start gap-sp-3">
            <Pill href={wa}>Demander sur WhatsApp</Pill>
            {product.category?.slug && (
              <Link href={`/${product.category.slug}`} className="font-normal text-encre-douce underline-offset-4 hover:underline">
                ← Retour aux {product.category.title?.toLowerCase()}
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 4 : Page `src/app/(site)/notre-maison/page.tsx`**

```tsx
import Image from "next/image";
import { PortableText } from "next-sanity";
import { PageIntro } from "@/components/layout/PageIntro";
import { whatsappUrl } from "@/lib/whatsapp";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import { ABOUT_QUERY, SETTINGS_QUERY } from "@/sanity/queries";

export const metadata = { title: "Notre maison" };

export default async function AboutPage() {
  const [about, settings] = await Promise.all([
    sanityFetch({ query: ABOUT_QUERY, tags: ["aboutPage"] }),
    sanityFetch({ query: SETTINGS_QUERY, tags: ["settings"] }),
  ]);
  const wa = whatsappUrl(settings?.whatsapp);

  return (
    <>
      <PageIntro
        eyebrow="Notre maison"
        title={about?.title ?? "Notre maison"}
        description={about?.intro}
        whatsappHref={wa}
      />
      <section className="mx-auto max-w-3xl px-sp-4 py-sp-6 md:px-sp-5">
        {about?.image && (
          <div className="relative mb-sp-5 aspect-[3/2] overflow-hidden rounded-panel">
            <Image
              src={urlFor(about.image).width(1600).url()}
              alt=""
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>
        )}
        {about?.story && (
          <div className="prose-p:mb-sp-4 font-light leading-relaxed text-encre [&_p]:mb-sp-4">
            <PortableText value={about.story} />
          </div>
        )}
      </section>
    </>
  );
}
```

- [ ] **Step 5 : Page `src/app/(site)/boutiques/page.tsx`**

```tsx
import Image from "next/image";
import { PageIntro } from "@/components/layout/PageIntro";
import { Pill } from "@/components/ui/Pill";
import { whatsappUrl } from "@/lib/whatsapp";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import { SETTINGS_QUERY, SHOPS_QUERY } from "@/sanity/queries";

export const metadata = { title: "Nos boutiques" };

export default async function ShopsPage() {
  const [shops, settings] = await Promise.all([
    sanityFetch({ query: SHOPS_QUERY, tags: ["shop"] }),
    sanityFetch({ query: SETTINGS_QUERY, tags: ["settings"] }),
  ]);
  const wa = whatsappUrl(settings?.whatsapp);

  return (
    <>
      <PageIntro
        eyebrow="Nos boutiques"
        title="Venez pousser la porte"
        description="Deux adresses à Grenoble pour toucher les tapis, essayer les toshak et goûter les fruits secs."
        whatsappHref={wa}
      />
      <section className="mx-auto grid max-w-6xl gap-sp-4 px-sp-4 py-sp-6 md:grid-cols-2 md:px-sp-5">
        {shops.map((shop, i) => (
          <article key={i} className="overflow-hidden rounded-panel bg-blush-2">
            {shop.image && (
              <div className="relative aspect-[3/2]">
                <Image
                  src={urlFor(shop.image).width(1000).url()}
                  alt={shop.name ?? ""}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-sp-4">
              <h2 className="font-bonny text-2xl font-medium text-encre">{shop.name}</h2>
              <p className="mt-sp-2 whitespace-pre-line font-light text-encre-douce">{shop.address}</p>
              {shop.hours && (
                <p className="mt-sp-2 whitespace-pre-line font-light text-encre-douce">{shop.hours}</p>
              )}
              {shop.phone && <p className="mt-sp-2 font-normal text-encre">{shop.phone}</p>}
            </div>
          </article>
        ))}
        <div className="flex items-center justify-center rounded-panel border border-grenat/20 p-sp-5 md:col-span-2">
          <Pill href={wa}>Une question ? WhatsApp</Pill>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 6 : Vérifier**

Run: `npm run dev` — parcourir `/tapis` (ou slug réel), un produit, `/notre-maison`, `/boutiques`.
Expected: chaque page rend avec header band pétrole, contenu Sanity, fallbacks OK (catégorie vide → message WhatsApp).

- [ ] **Step 7 : Commit**

```bash
git add -A
git commit -m "feat: pages univers/produit/notre-maison/boutiques"
```

---

### Task 14 : Draft mode + Presentation (édition visuelle)

**Files:**
- Create: `src/app/api/draft-mode/enable/route.ts`, `src/components/DisableDraftMode.tsx`
- Modify: `sanity.config.ts`, `src/app/(site)/layout.tsx`

- [ ] **Step 1 : Route d'activation `src/app/api/draft-mode/enable/route.ts`**

```ts
import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/lib/client";

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),
});
```

- [ ] **Step 2 : Ajouter presentationTool dans sanity.config.ts** (dans `plugins`, avant visionTool)

```ts
import { presentationTool } from "sanity/presentation";
// ...
plugins: [
  structureTool({ structure }),
  presentationTool({
    title: "Aperçu du site",
    previewUrl: { previewMode: { enable: "/api/draft-mode/enable" } },
  }),
  visionTool({ defaultApiVersion: apiVersion }),
],
```

- [ ] **Step 3 : DisableDraftMode.tsx**

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function DisableDraftMode() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (typeof window !== "undefined" && window !== window.parent) return null; // dans l'iframe Presentation

  return (
    <button
      type="button"
      className="fixed bottom-4 right-4 z-50 rounded-pill bg-encre px-sp-4 py-sp-2 text-sm text-white"
      onClick={() =>
        startTransition(async () => {
          await fetch("/api/draft-mode/disable");
          router.refresh();
        })
      }
    >
      {pending ? "…" : "Quitter l'aperçu"}
    </button>
  );
}
```

Et la route de sortie `src/app/api/draft-mode/disable/route.ts` :

```ts
import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  (await draftMode()).disable();
  return NextResponse.json({ disabled: true });
}
```

- [ ] **Step 4 : Brancher VisualEditing dans src/app/(site)/layout.tsx**

```tsx
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity";
import { DisableDraftMode } from "@/components/DisableDraftMode";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SETTINGS_QUERY } from "@/sanity/queries";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await sanityFetch({ query: SETTINGS_QUERY, tags: ["settings"] });
  const { isEnabled: isDraft } = await draftMode();
  return (
    <>
      <SmoothScrollProvider />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} />
      {isDraft && (
        <>
          <VisualEditing />
          <DisableDraftMode />
        </>
      )}
    </>
  );
}
```

- [ ] **Step 5 : Vérifier**

Run: `npm run dev` → `/admin` → onglet « Aperçu du site » ; modifier le titre du hero en brouillon.
Expected: l'aperçu montre le brouillon en direct, overlays cliquables sur les champs, publication → visible sur `/` après revalidation.

- [ ] **Step 6 : Commit**

```bash
git add -A
git commit -m "feat: draft mode + Presentation (edition visuelle en direct)"
```

---

### Task 15 : Déploiement Cloudflare (OpenNext) + webhook prod

**Files:**
- Create: `wrangler.jsonc`, `open-next.config.ts`, `README.md`
- Modify: `next.config.ts`, `package.json` (rien à changer — scripts déjà en place)

- [ ] **Step 1 : open-next.config.ts** — cache R2 + tags D1 (nécessaires pour `revalidateTag` sur Workers)

```ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  tagCache: d1NextTagCache,
  queue: doQueue,
});
```

- [ ] **Step 2 : wrangler.jsonc**

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "kaboul-house",
  "main": ".open-next/worker.js",
  "compatibility_date": "2026-08-01",
  "compatibility_flags": ["nodejs_compat"],
  "assets": { "directory": ".open-next/assets", "binding": "ASSETS" },
  "r2_buckets": [
    { "binding": "NEXT_INC_CACHE_R2_BUCKET", "bucket_name": "kaboul-house-cache" }
  ],
  "d1_databases": [
    { "binding": "NEXT_TAG_CACHE_D1", "database_name": "kaboul-house-tags", "database_id": "REMPLACER_APRES_CREATION" }
  ],
  "durable_objects": {
    "bindings": [
      { "name": "NEXT_CACHE_DO_QUEUE", "class_name": "DOQueueHandler" }
    ]
  },
  "migrations": [
    { "tag": "v1", "new_sqlite_classes": ["DOQueueHandler"] }
  ]
}
```

- [ ] **Step 3 : initOpenNextCloudflareForDev dans next.config.ts** (ajout en fin de fichier)

```ts
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

void initOpenNextCloudflareForDev();
```

- [ ] **Step 4 : Ressources Cloudflare** ⚠️ nécessite le compte Cloudflare de l'utilisateur

```bash
npx wrangler login
npx wrangler r2 bucket create kaboul-house-cache
npx wrangler d1 create kaboul-house-tags
```

Reporter le `database_id` retourné dans `wrangler.jsonc`. Puis secrets :

```bash
npx wrangler secret put SANITY_API_READ_TOKEN
npx wrangler secret put SANITY_REVALIDATE_SECRET
```

Les variables publiques (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`) sont inlinées au build — rien à configurer côté Workers.

- [ ] **Step 5 : Preview locale puis deploy**

Run: `npm run cf:preview`
Expected: site complet sur l'URL de preview wrangler.
Run: `npm run cf:deploy`
Expected: URL `*.workers.dev` fonctionnelle.

- [ ] **Step 6 : Webhook Sanity + CORS prod** ⚠️ manuel

Sur https://sanity.io/manage → API :
- CORS origins : ajouter l'URL de prod.
- Webhooks : créer « Revalidation » → URL `https://<url-prod>/api/revalidate`, dataset `production`, trigger create/update/delete, projection `{_type}`, secret = `SANITY_REVALIDATE_SECRET`.

Tester : publier une modif dans le studio → la page concernée change en quelques secondes.

- [ ] **Step 7 : README.md**

```markdown
# Kaboul House

Site vitrine — Next.js 16 + Sanity (studio sur `/admin`) + Cloudflare Workers.

## Démarrer

npm install
cp .env.local.example .env.local   # remplir les valeurs
npm run dev                        # site sur :3000, studio sur :3000/admin

## Scripts

- `npm run dev` / `npm run build` — dev / build Next.js
- `npm test` / `npm run typecheck` / `npm run lint` — qualité
- `npm run typegen` — régénérer les types Sanity après un changement de schéma
- `npm run cf:preview` / `npm run cf:deploy` — preview / deploy Cloudflare

## Contenu

Tout le contenu est administré dans Sanity (`/admin`). La publication est
visible en quelques secondes (webhook → `/api/revalidate`). L'édition
visuelle se fait dans l'onglet « Aperçu du site » du studio.

## Docs

- Spec architecture : `docs/superpowers/specs/2026-08-11-stack-architecture-design.md`
- Spec design system : `docs/superpowers/specs/2026-08-10-design-system-design.md`
```

- [ ] **Step 8 : Commit**

```bash
git add -A
git commit -m "feat: deploiement Cloudflare Workers (OpenNext, R2+D1) + README"
```

---

### Task 16 : Pages d'erreur + vérification finale

**Files:**
- Create: `src/app/not-found.tsx`, `src/app/(site)/error.tsx`

- [ ] **Step 1 : src/app/not-found.tsx**

```tsx
import Link from "next/link";
import { Pill } from "@/components/ui/Pill";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-blush px-sp-4 text-center">
      <p className="font-bonny text-7xl font-bold text-grenat">404</p>
      <h1 className="mt-sp-3 font-bonny text-3xl font-medium text-encre">
        Cette page s'est perdue dans le bazar
      </h1>
      <p className="mt-sp-3 max-w-md font-light text-encre-douce">
        L'adresse n'existe pas ou plus. Revenez à l'accueil pour retrouver votre chemin.
      </p>
      <div className="mt-sp-5 flex items-center gap-sp-4">
        <Pill href="/">Retour à l'accueil</Pill>
        <Link href="/boutiques" className="text-encre-douce underline-offset-4 hover:underline">
          Nos boutiques
        </Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 2 : src/app/(site)/error.tsx**

```tsx
"use client";

import { Pill } from "@/components/ui/Pill";

export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-blush px-sp-4 text-center">
      <h1 className="font-bonny text-3xl font-medium text-encre">Un imprévu est survenu</h1>
      <p className="mt-sp-3 max-w-md font-light text-encre-douce">
        Réessayez — si le problème persiste, écrivez-nous.
      </p>
      <div className="mt-sp-5">
        <button type="button" onClick={reset}>
          <Pill href="#">Réessayer</Pill>
        </button>
      </div>
    </main>
  );
}
```

Note : `Pill` rend un `Link` — pour le bouton retry, remplacer par le même style en `<button>` : dupliquer les classes du `Link` de `Pill` sur le `<button>` et supprimer le wrapper `Pill href="#"` :

```tsx
<button
  type="button"
  onClick={reset}
  className="group inline-flex items-center gap-sp-2 rounded-pill border border-grenat/30 bg-creme px-sp-4 py-sp-2 font-bold text-grenat transition-colors hover:bg-blush"
>
  Réessayer
</button>
```

- [ ] **Step 3 : Vérification complète**

Run:

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

Expected: tout passe, zéro warning bloquant. Puis Lighthouse (Chrome DevTools, mobile) sur `/`, une page univers, une page produit : Performance ≥ 95, CLS < 0.1.

- [ ] **Step 4 : Commit final**

```bash
git add -A
git commit -m "feat: pages 404/erreur + verification finale"
```

---

## Auto-revue du plan (faite à l'écriture)

- **Couverture spec** : architecture 3 couches (T1, T5-8, T9-13) ; modèle de contenu + studio FR + singletons (T6) ; revalidation webhook (T8, T15) ; Presentation/draft (T14) ; loader images CDN Sanity (T4) ; polices/CLS (T2-3) ; hero BLINK (T12) ; erreurs (T16) ; Cloudflare (T15) ; tests (T4, T8).
- **Hors plan assumé** : saisie du contenu réel complet (fait par le client dans le studio) ; transfert du nom de domaine (codes pas encore récupérés) ; avis Google (hors périmètre spec).
- **Points d'attention exécution** : versions npm épinglées sur celles du projet existant qui fonctionne ; si `next-sanity` a bougé, vérifier les imports `next-sanity/draft-mode`, `next-sanity/webhook`, `next-sanity/studio`. Les Steps marqués ⚠️ nécessitent l'utilisateur (projectId Sanity, compte Cloudflare).
