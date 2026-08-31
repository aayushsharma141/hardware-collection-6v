import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: [{ type: "brand" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subcategory",
      title: "Subcategory",
      type: "reference",
      to: [{ type: "subcategory" }],
      description: "Optional: The specific subcategory this product belongs to.",
    }),
    defineField({
      name: "curatedCollections",
      title: "Curated Collections",
      type: "array",
      of: [{ type: "reference", to: [{ type: "curatedCollection" }] }],
      description: "Optional: Merchandising collections this product belongs to (e.g., 'Italian Collection').",
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "searchKeywords",
      title: "Search Keywords / Synonyms",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "specifications",
      title: "Specifications",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "key", title: "Key", type: "string" },
            { name: "value", title: "Value", type: "string" },
          ],
        },
      ],
    }),
    defineField({
      name: "finishes",
      title: "Available Finishes",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "applications",
      title: "Applications",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured Product",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "catalogReference",
      title: "Catalog Reference",
      description: "Page number or section in the official brand catalog",
      type: "string",
    }),
    defineField({
      name: "showroomDisplay",
      title: "On Display in Showroom",
      description: "Is this product physically displayed in the Sakchi showroom?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "officialFiles",
      title: "Official Files (CAD/BIM/PDF)",
      description: "Verified official files provided by the manufacturer",
      type: "array",
      of: [{ type: "file", options: { storeOriginalFilename: true } }],
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "brand.name",
      media: "images.0",
    },
  },
});
