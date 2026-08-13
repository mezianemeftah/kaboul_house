import { describe, expect, it } from "vitest";
import { googleMapsEmbedSrc } from "./maps";

const SRC = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d356323!2d4.31!3d45.75";

describe("googleMapsEmbedSrc", () => {
  // Cas nominal : le client colle le bloc entier renvoyé par « Copier le HTML ».
  it("extrait le src du bloc <iframe> collé depuis Google Maps", () => {
    const colle = `<iframe src="${SRC}" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    expect(googleMapsEmbedSrc(colle)).toBe(SRC);
  });

  it("accepte aussi l'URL seule", () => {
    expect(googleMapsEmbedSrc(SRC)).toBe(SRC);
    expect(googleMapsEmbedSrc(`  ${SRC}  `)).toBe(SRC);
  });

  it("gère les apostrophes simples et les esperluettes échappées", () => {
    expect(googleMapsEmbedSrc(`<iframe src='${SRC}&amp;z=15'></iframe>`)).toBe(`${SRC}&z=15`);
  });

  // Le champ est administrable : ce qui en sort finit dans un `src` d'iframe.
  // Tout ce qui n'est pas l'embed officiel de Google est refusé.
  it("refuse une URL qui n'est pas l'embed Google", () => {
    expect(googleMapsEmbedSrc("https://example.com/pas-une-carte")).toBeNull();
    expect(googleMapsEmbedSrc('<iframe src="https://evil.example/x"></iframe>')).toBeNull();
    expect(googleMapsEmbedSrc("javascript:alert(1)")).toBeNull();
  });

  // « google.com.evil.test » commence par la même chaîne : on compare l'hôte,
  // jamais le début de l'URL.
  it("refuse un hôte qui imite celui de Google", () => {
    expect(googleMapsEmbedSrc("https://www.google.com.evil.test/maps/embed?pb=!1m14")).toBeNull();
  });

  it("refuse un lien Google Maps ordinaire, qui n'est pas intégrable", () => {
    expect(googleMapsEmbedSrc("https://www.google.com/maps/place/Kaboul+House")).toBeNull();
    expect(googleMapsEmbedSrc("https://maps.app.goo.gl/abc123")).toBeNull();
  });

  it("renvoie null quand le champ est vide", () => {
    expect(googleMapsEmbedSrc(null)).toBeNull();
    expect(googleMapsEmbedSrc("")).toBeNull();
    expect(googleMapsEmbedSrc("   ")).toBeNull();
  });
});
