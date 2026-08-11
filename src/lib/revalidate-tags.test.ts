import { describe, expect, it } from "vitest";
import { tagsForType } from "./revalidate-tags";

describe("tagsForType", () => {
  it("mappe chaque type de document sur son tag", () => {
    expect(tagsForType("product")).toEqual(["product"]);
    expect(tagsForType("category")).toEqual(["category"]);
    expect(tagsForType("shop")).toEqual(["shop"]);
    expect(tagsForType("homePage")).toEqual(["homePage"]);
    expect(tagsForType("aboutPage")).toEqual(["aboutPage"]);
    expect(tagsForType("siteSettings")).toEqual(["settings"]);
  });
  it("ignore les types inconnus (pas de retry storm)", () => {
    expect(tagsForType("autre")).toEqual([]);
  });
});
