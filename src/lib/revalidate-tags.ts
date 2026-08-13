const TAGS: Record<string, string[]> = {
  siteSettings: ["settings"],
  homePage: ["homePage"],
  category: ["category"],
  product: ["product"],
  shop: ["shop"],
  googleReview: ["googleReview"],
};

export function tagsForType(type: string): string[] {
  return TAGS[type] ?? [];
}
