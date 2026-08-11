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
