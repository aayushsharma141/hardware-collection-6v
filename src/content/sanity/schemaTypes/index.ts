import { type SchemaTypeDefinition } from "sanity";

import { categoryType } from "./category";
import { spaceType } from "./space";
import { subcategoryType } from "./subcategory";
import { curatedCollectionType } from "./curatedCollection";
import { brandType } from "./brand";
import { productType } from "./product";
import { testimonialType } from "./testimonial";
import { homePageType } from "./homePage";
import { siteSettingsType } from "./siteSettings";
import { navigationType } from "./navigation";
import { galleryType } from "./gallery";
import { faqType } from "./faq";

// Objects
import { seoType } from "./objects/seo";
import { ctaType } from "./objects/cta";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    categoryType, spaceType, subcategoryType, curatedCollectionType, brandType, productType, testimonialType, homePageType, siteSettingsType, navigationType, galleryType, faqType,
    seoType, ctaType
  ],
};
