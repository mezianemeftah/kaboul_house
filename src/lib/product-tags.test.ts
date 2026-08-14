import { describe, expect, it } from "vitest";
import { productTags } from "./product-tags";

describe("productTags", () => {
  // Le prix passe devant : c'est l'information qui décide du clic.
  it("classe prix, puis origine, puis taille", () => {
    expect(
      productTags({ price: "690 €", origin: "Iran · Persan", sizes: "≈ 300 × 200 cm" }, 3),
    ).toEqual([
      { label: "690 €", kind: "price" },
      { label: "Iran", kind: "origin" },
      { label: "300 × 200 cm", kind: "size" },
    ]);
  });

  it("plafonne à deux tags par défaut", () => {
    const tags = productTags({ price: "690 €", origin: "Iran", sizes: "≈ 300 × 200 cm" });
    expect(tags).toHaveLength(2);
    expect(tags.map((t) => t.kind)).toEqual(["price", "origin"]);
  });

  it("ne renvoie rien quand la fiche n'a aucun des trois champs", () => {
    expect(productTags({})).toEqual([]);
    expect(productTags({ price: null, origin: "", sizes: "   " })).toEqual([]);
  });

  describe("origine", () => {
    // Le champ `origin` est rempli sur les 56 fiches, mais 21 d'entre elles y
    // portent autre chose qu'un pays : afficher « Art de la table » comme
    // origine serait faux. D'où la liste blanche.
    it("ne garde que les origines géographiques", () => {
      expect(productTags({ origin: "Iran" })).toEqual([{ label: "Iran", kind: "origin" }]);
      expect(productTags({ origin: "Afghanistan" })).toEqual([
        { label: "Afghanistan", kind: "origin" },
      ]);
      expect(productTags({ origin: "Turquie" })).toEqual([{ label: "Turquie", kind: "origin" }]);
    });

    it("écarte les valeurs qui ne sont pas des pays", () => {
      expect(productTags({ origin: "Art de la table" })).toEqual([]);
      expect(productTags({ origin: "Oriental" })).toEqual([]);
      expect(productTags({ origin: "Roy Farshi" })).toEqual([]);
    });

    // « Afghanistan · Bio », « Iran · Persan » : le pays est le premier segment.
    it("retient le pays d'une valeur composée", () => {
      expect(productTags({ origin: "Afghanistan · Bio" })).toEqual([
        { label: "Afghanistan", kind: "origin" },
      ]);
      expect(productTags({ origin: "Turquie · Turc" })).toEqual([
        { label: "Turquie", kind: "origin" },
      ]);
    });

    // Le champ est saisi à la main dans le back-office : la casse varie.
    it("reconnaît le pays quelle que soit la casse", () => {
      expect(productTags({ origin: "iran" })).toEqual([{ label: "Iran", kind: "origin" }]);
      expect(productTags({ origin: "AFGHANISTAN " })).toEqual([
        { label: "Afghanistan", kind: "origin" },
      ]);
    });
  });

  describe("taille", () => {
    it("retire l'approximation devant une taille unique", () => {
      expect(productTags({ sizes: "≈ 300 × 200 cm" })).toEqual([
        { label: "300 × 200 cm", kind: "size" },
      ]);
    });

    // Douze fiches listent cinq dimensions. Les afficher toutes déborderait de
    // la carte ; le nombre de tailles dit l'essentiel : « il y a la mienne ».
    it("résume une liste de dimensions par leur nombre", () => {
      expect(
        productTags({ sizes: "300×400 · 250×350 · 200×300 · 150×225 · 100×200 cm" }),
      ).toEqual([{ label: "5 tailles", kind: "size" }]);
    });

    // « 26 · 25 · 42 cm » énumère les pièces d'un service, pas des tailles au
    // choix. Faute de pouvoir les distinguer, on n'affiche rien plutôt qu'un
    // « 3 tailles » mensonger — l'origine ou le prix prend la place.
    it("écarte une énumération qui n'est pas une liste de dimensions", () => {
      expect(productTags({ sizes: "26 · 25 · 42 cm" })).toEqual([]);
      expect(productTags({ sizes: "33 · 24 · 17 · 15 cm" })).toEqual([]);
    });

    it("coupe une taille à sa première précision", () => {
      expect(productTags({ sizes: "Au mètre, sur-mesure (rouleau)" })).toEqual([
        { label: "Au mètre", kind: "size" },
      ]);
    });

    it("garde les mentions courtes telles quelles", () => {
      expect(productTags({ sizes: "Lot de 3 tailles" })).toEqual([
        { label: "Lot de 3 tailles", kind: "size" },
      ]);
      expect(productTags({ sizes: "Ovale" })).toEqual([{ label: "Ovale", kind: "size" }]);
    });

    // Un tag qui déborde casse la carte : mieux vaut pas de tag.
    it("écarte une taille trop longue pour un tag", () => {
      expect(productTags({ sizes: "Grand format pour salon double séjour" })).toEqual([]);
    });
  });

  describe("prix", () => {
    it("garde l'unité quand elle informe", () => {
      expect(productTags({ price: "39 € / m²" })).toEqual([{ label: "39 € / m²", kind: "price" }]);
    });

    // « / pièce » ne distingue rien : c'est l'unité par défaut d'un tapis. Le
    // retirer fait gagner la moitié de la largeur du tag, décisive sur mobile.
    it("retire le « / pièce », qui ne dit rien", () => {
      expect(productTags({ price: "690 € / pièce" })).toEqual([
        { label: "690 €", kind: "price" },
      ]);
      expect(productTags({ price: "329 €/piece" })).toEqual([{ label: "329 €", kind: "price" }]);
    });

    // Le champ doit rester vide quand le prix est sur demande. Si la mention est
    // tout de même saisie, on ne l'affiche pas : trente-huit cartes portant le
    // même « sur demande » n'apprennent rien.
    it("ignore la mention « sur demande »", () => {
      expect(productTags({ price: "sur demande" })).toEqual([]);
      expect(productTags({ price: "Sur Demande" })).toEqual([]);
      expect(productTags({ price: "prix sur demande" })).toEqual([]);
    });
  });
});
