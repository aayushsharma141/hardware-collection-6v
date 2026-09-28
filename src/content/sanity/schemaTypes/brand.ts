import { defineField, defineType } from "sanity";

export const brandType = defineType({
  name: "brand",
  title: "Brand",
  type: "document",
  groups: [
    { name: "identity", title: "Identity" },
    { name: "story", title: "Brand Story" },
    { name: "categories", title: "Categories" },
    { name: "assets", title: "Internal Assets" },
    { name: "visibility", title: "Visibility" },
    { name: "editorial", title: "Editorial" },
  ],
  fields: [
    // Identity
    defineField({
      name: "name",
      title: "Brand Name",
      type: "string",
      group: "identity",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "identity",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Brand Logo",
      type: "image",
      group: "identity",
      options: { hotspot: true },
    }),
    defineField({
      name: "country",
      title: "Country of Origin",
      type: "string",
      group: "identity",
    }),
    defineField({
      name: "authorizedStatus",
      title: "Authorized Status",
      type: "string",
      group: "identity",
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      group: "identity",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "identity",
    }),

    // Story
    defineField({
      name: "description",
      title: "Tagline/Short Description",
      type: "string",
      group: "story",
    }),
    defineField({
      name: "brandPositioning",
      title: "Brand Positioning (Internal)",
      type: "string",
      group: "story",
      description: "e.g., Premium, Luxury, Standard",
    }),
    defineField({
      name: "brandStory",
      title: "Brand Story",
      type: "array",
      group: "story",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "knownFor",
      title: "Known For",
      type: "string",
      group: "story",
    }),
    defineField({
      name: "usp",
      title: "Unique Selling Proposition (USP)",
      type: "string",
      group: "story",
    }),

    // Categories
    defineField({
      name: "popularCategories",
      title: "Popular Categories",
      type: "array",
      group: "categories",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),

    // Assets (Internal)
    defineField({
      name: "officialCatalogue",
      title: "Official Catalogue (Internal Reference)",
      type: "file",
      group: "assets",
      options: { accept: ".pdf" },
      description: "Use the Catalogue document type for public catalogues. This is for internal reference.",
    }),
    defineField({
      name: "dealerCertificate",
      title: "Dealer Certificate",
      type: "file",
      group: "assets",
      options: { accept: ".pdf,image/*" },
    }),
    defineField({
      name: "marketingAssets",
      title: "Marketing Assets",
      type: "array",
      group: "assets",
      of: [{ type: "file" }],
    }),

    // Visibility
    defineField({
      name: "showBrand",
      title: "Show Brand on Website",
      type: "boolean",
      group: "visibility",
      initialValue: true,
    }),
    defineField({
      name: "showOnHomepage",
      title: "Show on Homepage",
      type: "boolean",
      group: "visibility",
      initialValue: false,
    }),

    // Editorial
    defineField({
      name: "editorial",
      title: "Editorial Status",
      type: "editorial",
      group: "editorial",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "country",
      media: "logo",
    },
  },
});
