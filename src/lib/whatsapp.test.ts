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
  it("gère le préfixe international 00", () => {
    expect(whatsappUrl("0033 7 80 79 96 89")).toBe("https://wa.me/33780799689");
  });
  it("gère le format local FR sans indicatif", () => {
    expect(whatsappUrl("07 80 79 96 89")).toBe("https://wa.me/33780799689");
  });
});
