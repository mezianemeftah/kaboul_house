import { defineQuery } from "next-sanity";

export const SETTINGS_QUERY = defineQuery(
  `*[_type == "siteSettings"][0]{whatsapp, phone, instagram, facebook, googleReviewsUrl, seoDescription, ogImage}`,
);

export const HOME_QUERY = defineQuery(
  `*[_type == "homePage"][0]{
    heroTitle, heroSubtitle, heroImage,
    aboutTitle, aboutText,
    "categories": *[_type == "category"] | order(order asc){
      title, "slug": slug.current, kicker, description, image
    },
    "featuredProducts": *[_type == "product" && featured == true]
      | order(_updatedAt desc)[0...5]{
        title, "slug": slug.current, images,
        "categoryTitle": category->title
    },
    "shops": *[_type == "shop"] | order(order asc){
      name, address, phone, email, hours, mapsUrl
    },
    "reviews": *[_type == "googleReview"] | order(_createdAt desc)[0...6]{
      _id, author, rating, text
    }
  }`,
);

export const ABOUT_QUERY = defineQuery(
  `*[_type == "aboutPage"][0]{title, intro, story, image}`,
);

export const CATEGORY_QUERY = defineQuery(
  `*[_type == "category" && slug.current == $slug][0]{
    title, description, image,
    "products": *[_type == "product" && category._ref == ^._id]
      | order(featured desc, title asc){
        title, "slug": slug.current, description, images
    }
  }`,
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
