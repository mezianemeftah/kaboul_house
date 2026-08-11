import { aboutPage } from "./aboutPage";
import { category } from "./category";
import { homePage } from "./homePage";
import { product } from "./product";
import { shop } from "./shop";
import { siteSettings } from "./siteSettings";

export const SINGLETON_TYPES = ["siteSettings", "homePage", "aboutPage"] as const;

export const schemaTypes = [siteSettings, homePage, aboutPage, category, product, shop];
