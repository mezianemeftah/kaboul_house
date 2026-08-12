import { stat } from "node:fs/promises";
import sharp from "sharp";

const SOURCE =
  "C:/Users/mezia/Downloads/hf_20260812_095905_1b955a15-9012-45f5-9d5d-221b5a2a2dbf-Photoroom.png";

// Tapis détouré servant de séparateur : la transparence doit survivre, d'où
// WebP plutôt que JPEG. 1800 px suffisent, l'image ne dépasse jamais la largeur
// d'une page centrée.
await sharp(SOURCE)
  .resize({ width: 1800, withoutEnlargement: true })
  .webp({ quality: 82, alphaQuality: 90 })
  .toFile("public/images/tapis-volant.webp");

const { size } = await stat("public/images/tapis-volant.webp");
console.log(`tapis-volant.webp généré (${Math.round(size / 1024)} Ko)`);
