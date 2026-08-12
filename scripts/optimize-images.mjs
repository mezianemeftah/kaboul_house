import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import sharp from "sharp";

/**
 * Conversion des photos éditoriales fournies par le client en webp.
 * Source : ~/Downloads (fichiers en lecture seule, jamais modifiés).
 * Sortie : public/images/ — largeur max 1600px, qualité 80.
 */
const SOURCE_DIR = path.join(homedir(), "Downloads");
const OUT_DIR = path.join(process.cwd(), "public", "images");

const IMAGES = [
  { from: "61a7ac23cd672b8e0cdf81b1200dd1f9.jpg", to: "category-prayer.webp" },
  { from: "e16818cfd39b40599e68a01b8e30b3bb.jpg", to: "category-night.webp" },
  { from: "d35138223b58353a04ddb00a842a476c.jpg", to: "category-sea.webp" },
];

await mkdir(OUT_DIR, { recursive: true });

for (const { from, to } of IMAGES) {
  const src = path.join(SOURCE_DIR, from);
  if (!existsSync(src)) {
    console.warn(`source introuvable, ignorée : ${src}`);
    continue;
  }
  const dest = path.join(OUT_DIR, to);
  const info = await sharp(src)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(dest);
  console.log(`${to} — ${info.width}×${info.height}, ${Math.round(info.size / 1024)} Ko`);
}
