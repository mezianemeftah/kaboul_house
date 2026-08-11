const TAGS: Record<string, string[]> = {
  siteSettings: ["settings"],
  homePage: ["homePage"],
  aboutPage: ["aboutPage"],
  category: ["category"],
  product: ["product"],
  shop: ["shop"],
};

export function tagsForType(type: string): string[] {
  return TAGS[type] ?? [];
}
