import { defineQuery } from "next-sanity";

export const SETTINGS_QUERY = defineQuery(
  `*[_type == "siteSettings"][0]{whatsapp, phone, instagram, facebook, googleReviewsUrl, seoDescription, ogImage}`,
);

/**
 * Page d'accueil : l'habillage de chaque bloc, puis ses éléments.
 *
 * Les univers, boutiques et avis sont des listes automatiques — tout ce qui
 * existe, dans l'ordre défini sur les fiches. Les coups de cœur sont une
 * sélection : `featuredProducts[]->` déréférence les fiches choisies, si bien
 * que le nom, les photos et l'univers affichés viennent toujours du produit
 * lui-même. Rien n'est recopié dans la page.
 */
export const HOME_QUERY = defineQuery(
  `*[_type == "homePage"][0]{
    heroTitle, heroSubtitle, heroImage, heroCtaLabel, heroCtaHref,

    universKicker, universTitle, universIntro, universLinkLabel,

    "videoUrl": videoFile.asset->url,
    videoPoster, videoTitle, videoText, videoCtaLabel,

    aboutKicker, aboutTitle, aboutText, aboutImageLarge, aboutImageSmall,

    featuredKicker, featuredTitle,
    "featuredProducts": featuredProducts[]->{
      title, "slug": slug.current, images,
      "categoryTitle": category->title
    },

    shopsKicker, shopsTitle, shopsEmptyText,

    reviewsKicker, reviewsTitle, reviewsEmptyText, reviewsLinkLabel,

    seoTitle, seoDescription,

    "categories": *[_type == "category"] | order(order asc){
      title, "slug": slug.current, kicker, description, image
    },
    "shops": *[_type == "shop"] | order(order asc){
      name, address, phone, email, hours, mapsUrl
    },
    "reviews": *[_type == "googleReview"] | order(_createdAt desc)[0...6]{
      _id, author, rating, text
    }
  }`,
);

/**
 * Métadonnées de l'accueil seules. Requête distincte de HOME_QUERY parce que
 * Next appelle `generateMetadata` séparément du rendu : inutile d'y retraverser
 * les univers, les produits et les avis.
 */
export const HOME_SEO_QUERY = defineQuery(
  `*[_type == "homePage"][0]{seoTitle, seoDescription}`,
);

export const CATEGORY_QUERY = defineQuery(
  `*[_type == "category" && slug.current == $slug][0]{
    title, description, image,
    "products": *[_type == "product" && category._ref == ^._id]
      | order(title asc){
        title, "slug": slug.current, description, images
    }
  }`,
);

/** Menu déroulant de la navigation : juste de quoi construire les liens. */
export const NAV_CATEGORIES_QUERY = defineQuery(
  `*[_type == "category"] | order(order asc){title, "slug": slug.current}`,
);

export const CATEGORY_SLUGS_QUERY = defineQuery(
  `*[_type == "category" && defined(slug.current)]{"slug": slug.current}`,
);

export const PRODUCT_QUERY = defineQuery(
  `*[_type == "product" && slug.current == $slug][0]{
    title, description, images,
    "category": category->{title, "slug": slug.current}
  }`,
);

export const ALL_PRODUCTS_QUERY = defineQuery(
  `*[_type == "product"] | order(title asc){title, "slug": slug.current, images, "categoryTitle": category->title}`,
);

export const PRODUCT_SLUGS_QUERY = defineQuery(
  `*[_type == "product" && defined(slug.current)]{"slug": slug.current}`,
);

export const SHOPS_QUERY = defineQuery(
  `*[_type == "shop"] | order(order asc){name, address, phone, email, hours, mapsUrl, image}`,
);
