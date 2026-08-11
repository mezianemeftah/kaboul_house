import { describe, expect, it } from "vitest";
import loader from "./image-loader";

describe("image-loader", () => {
  it("ajoute les transformations CDN Sanity", () => {
    const out = loader({ src: "https://cdn.sanity.io/images/abc/production/x.jpg", width: 1200 });
    const url = new URL(out);
    expect(url.searchParams.get("w")).toBe("1200");
    expect(url.searchParams.get("auto")).toBe("format");
    expect(url.searchParams.get("fit")).toBe("max");
    expect(url.searchParams.get("q")).toBe("75");
  });
  it("respecte une qualité explicite", () => {
    const out = loader({ src: "https://cdn.sanity.io/images/abc/production/x.jpg", width: 800, quality: 60 });
    expect(new URL(out).searchParams.get("q")).toBe("60");
  });
  it("préserve les paramètres existants (rect, etc.)", () => {
    const out = loader({ src: "https://cdn.sanity.io/images/abc/production/x.jpg?rect=0,0,100,100", width: 800 });
    expect(new URL(out).searchParams.get("rect")).toBe("0,0,100,100");
  });
  it("laisse passer les images locales sans transformation", () => {
    expect(loader({ src: "/images/hero-intro.webp", width: 1200 })).toBe("/images/hero-intro.webp");
  });
});
