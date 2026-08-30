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

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [categoryType, spaceType, subcategoryType, curatedCollectionType, brandType, productType, testimonialType, homePageType, siteSettingsType],
};
