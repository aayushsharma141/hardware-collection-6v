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
    }),
    defineField({
      name: "description",
      title: "Description / Tagline",
      type: "text",
    }),
    defineField({
      name: "website",
      title: "Official Website",
      type: "url",
    }),
    defineField({
      name: "officialCatalog",
      title: "Official Catalog (PDF)",
      description: "Uploaded official catalog PDF.",
      type: "file",
      options: {
        storeOriginalFilename: true,
      },
    }),
    defineField({
      name: "officialCatalogUrl",
      title: "Official Catalog (External URL)",
      description: "Link to an external official catalog (used if no PDF is uploaded).",
      type: "url",
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
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "description",
      media: "logo",
    },
  },
});
