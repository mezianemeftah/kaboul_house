import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  },
  // Le back-office est hébergé par Sanity plutôt qu'embarqué dans le site :
  // son bundle faisait passer le worker Cloudflare au-dessus du plan gratuit.
  // Fixer studioHost ici évite la question interactive de `sanity deploy` et
  // garantit que l'adresse reste celle vers laquelle /admin redirige.
  studioHost: "kaboul-house",
  // Identifiant de l'application créée au premier `sanity deploy` : sans lui, le
  // CLI redemande à quelle application publier à chaque déploiement.
  deployment: { appId: "qqyw99mqmc4jr19s64qymsno" },
  // Le build du studio passe par Vite, qui remonte jusqu'à postcss.config.mjs —
  // écrit pour Next, où les plugins sont déclarés sous forme de chaînes que Vite
  // ne sait pas résoudre (« Invalid PostCSS Plugin found at: plugins[0] »).
  // Le studio n'utilise pas Tailwind : on lui donne une config PostCSS vide,
  // ce qui coupe aussi la recherche de fichier de config. Next n'est pas affecté.
  vite: (config) => ({
    ...config,
    css: { ...config.css, postcss: {} },
  }),
});
