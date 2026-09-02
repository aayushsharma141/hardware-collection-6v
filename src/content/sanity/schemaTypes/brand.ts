import { defineField, defineType } from "sanity";

export const brandType = defineType({
  name: "brand",
  title: "Brand",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Brand Name",
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
      name: "authorizedStatus",
      title: "Authorized Status",
      type: "string",
      description: "e.g., 'Authorized Dealer' or 'Authorized Distributor'",
    }),
    defineField({
      name: "logo",
      title: "Brand Logo",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description / Tagline",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "website",
      title: "Official Website",
      type: "url",
    }),
    defineField({
      name: "catalogType",
      title: "How is the catalog provided?",
      type: "string",
      options: {
        list: [
          { title: "Upload PDF", value: "upload" },
          { title: "External URL", value: "url" },
        ],
        layout: "radio",
      },
      initialValue: "upload",
    }),
    defineField({
      name: "officialCatalogs",
      title: "Official Catalogs (PDFs)",
      description: "Uploaded official catalog PDFs.",
      type: "array",
      of: [
        {
          type: "file",
          options: {
            storeOriginalFilename: true,
            accept: ".pdf",
          },
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
        }
      ],
      hidden: ({ parent }) => parent?.catalogType === 'url',
    }),
    defineField({
      name: "officialCatalogUrl",
      title: "Official Catalog (External URL)",
      description: "Link to an external official catalog.",
      type: "url",
      hidden: ({ parent }) => parent?.catalogType !== 'url',
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: true,
    }),
    
    // --- NEW FIELDS (Additive for Phase 2) ---
    defineField({
      name: "seo",
      title: "SEO Metadata",
      type: "seo",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "description",
      media: "logo",
    },
  },
});
