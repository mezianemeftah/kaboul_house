import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenu")
    .items([
      S.listItem()
        .title("Réglages du site")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem()
        .title("Page d'accueil")
        .id("homePage")
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.divider(),
      S.documentTypeListItem("category").title("Univers"),
      S.documentTypeListItem("product").title("Produits"),
      S.documentTypeListItem("shop").title("Boutiques"),
      S.documentTypeListItem("googleReview").title("Avis Google"),
    ]);
