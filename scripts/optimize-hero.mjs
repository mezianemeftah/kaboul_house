import sharp from "sharp";

await sharp("public/images/hero-intro.png")
  .resize({ width: 2560, withoutEnlargement: true })
  .webp({ quality: 80 })
  .toFile("public/images/hero-intro.webp");

console.log("hero-intro.webp généré");
