import { defineCliConfig } from "sanity/cli";

// Échoue au build plutôt que de produire un studio qui plante à l'ouverture :
// JSON.stringify(undefined) renvoie undefined, ce qui casserait silencieusement
// l'injection Vite plus bas.
function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} est absent de l'environnement. Le build du studio a besoin de cette ` +
        `variable : vérifier .env.local avant de relancer sanity deploy.`,
    );
  }
  return value;
}

const projectId = requiredEnv("NEXT_PUBLIC_SANITY_PROJECT_ID");
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

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
  //
  // `define` : sanity.config.ts lit son projectId via src/sanity/lib/env.ts, qui
  // s'appuie sur des variables NEXT_PUBLIC_*. Next les remplace par leur valeur au
  // build ; Vite ne le fait pas, et le studio publié plantait donc au démarrage sur
  // « Variable d'environnement manquante ». On les injecte explicitement ici.
  // Ces deux valeurs sont publiques (elles figurent déjà dans le bundle client du
  // site) : rien de sensible n'est exposé. SANITY_OFFLINE est neutralisé pour que
  // la branche de repli de env.ts ne référence pas un `process` inexistant.
  vite: (config) => ({
    ...config,
    css: { ...config.css, postcss: {} },
    define: {
      ...config.define,
      "process.env.NEXT_PUBLIC_SANITY_PROJECT_ID": JSON.stringify(
        process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      ),
      "process.env.NEXT_PUBLIC_SANITY_DATASET": JSON.stringify(
        process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
      ),
      "process.env.SANITY_OFFLINE": JSON.stringify(""),
    },
  }),
});
