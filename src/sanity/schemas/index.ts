import { category } from "./category";
import { googleReview } from "./googleReview";
import { homePage } from "./homePage";
import { product } from "./product";
import { shop } from "./shop";
import { siteSettings } from "./siteSettings";

export const SINGLETON_TYPES = ["siteSettings", "homePage"] as const;

export const schemaTypes = [siteSettings, homePage, category, product, shop, googleReview];
