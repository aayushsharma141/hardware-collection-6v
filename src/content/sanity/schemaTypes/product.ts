import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  groups: [
    { name: "essentials", title: "Essentials" },
    { name: "description", title: "Description" },
    { name: "photos", title: "Photos" },
    { name: "whereItBelongs", title: "Where it belongs" },
    { name: "files", title: "Files" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      group: "essentials",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Web address (slug)",
      type: "slug",
      group: "essentials",
      options: {
        source: "name",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      group: "whereItBelongs",
      to: [{ type: "brand" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      group: "whereItBelongs",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subcategory",
      title: "Subcategory",
      type: "reference",
      group: "whereItBelongs",
      to: [{ type: "subcategory" }],
      description: "Optional: The specific subcategory this product belongs to.",
    }),
    defineField({
      name: "curatedCollections",
      title: "Curated Collections",
      type: "array",
      group: "whereItBelongs",
      of: [{ type: "reference", to: [{ type: "curatedCollection" }] }],
      description: "Optional: Merchandising collections this product belongs to (e.g., 'Italian Collection').",
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      group: "description",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "array",
      group: "description",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      group: "description",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "searchKeywords",
      title: "Search Keywords / Synonyms",
      type: "array",
      group: "seo",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "specifications",
      title: "Specifications",
      type: "array",
      group: "description",
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
      group: "description",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "applications",
      title: "Applications",
      type: "array",
      group: "description",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "images",
      title: "Product Photos",
      type: "array",
      group: "photos",
      validation: (rule) => rule.required().min(1),
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
      group: "essentials",
      initialValue: false,
    }),
    defineField({
      name: "catalogReference",
      title: "Catalog Reference Page",
      description: "Page number or section in the official brand catalog",
      type: "string",
      group: "essentials",
    }),
    defineField({
      name: "showroomDisplay",
      title: "On Display in Showroom",
      description: "Is this product physically displayed in the Sakchi showroom?",
      type: "boolean",
      group: "essentials",
      initialValue: false,
    }),
    defineField({
      name: "officialFiles",
      title: "Official Files (CAD/BIM/PDF)",
      description: "Verified official files provided by the manufacturer",
      type: "array",
      group: "files",
      of: [{ 
        type: "file", 
        options: { storeOriginalFilename: true },
        fields: [
          { name: "assetTitle", title: "Asset Title", type: "string" },
          { 
            name: "assetType", 
            title: "Asset Type", 
            type: "string", 
            options: { 
              list: [
                { title: 'Catalog', value: 'catalog' },
                { title: 'Specification', value: 'specification' },
                { title: 'Certificate', value: 'certificate' },
                { title: 'CAD', value: 'cad' },
                { title: 'Marketing', value: 'marketing' },
                { title: 'Other', value: 'other' }
              ] 
            } 
          },
          { name: "version", title: "Version", type: "string" },
          { name: "releaseDate", title: "Release Date", type: "date" }
        ]
      }],
    }),
    
    // --- NEW FIELDS (Additive for Phase 2) ---
    defineField({
      name: "seo",
      title: "SEO Metadata",
      type: "seo",
      group: "seo",
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
