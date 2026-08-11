import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  { ignores: [".next/**", ".open-next/**", "node_modules/**", "src/sanity/types.ts"] },
]);
