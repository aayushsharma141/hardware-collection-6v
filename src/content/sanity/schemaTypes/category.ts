import { defineField, defineType } from "sanity";
import { apiVersion } from "../env";
import { isReservedSlug, isSlugAvailable, SlugDoc } from "../lib/slugUniqueness";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  groups: [
    { name: "identity", title: "Identity" },
    { name: "content", title: "Content" },
    { name: "applications", title: "Applications" },
    { name: "media", title: "Media" },
    { name: "catalogues", title: "Catalogues" },
    { name: "seo", title: "SEO" },
    { name: "editorial", title: "Editorial" },
  ],
  fields: [
    // Identity
    defineField({
      name: "name",
      title: "Category Name",
      type: "string",
      group: "identity",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Web address (slug)",
      type: "slug",
      group: "identity",
      options: {
        source: "name",
      },
      validation: (rule) =>
        rule.required().custom(async (value, context) => {
          if (!value?.current) return true;
          if (isReservedSlug(value.current)) {
            return `Slug cannot be "${value.current}" — reserved by the /collections route family.`;
          }
          const client = context.getClient({ apiVersion });
          const candidateId = (context.document?._id || "").replace(/^drafts\./, "");
          const existingDocs: Array<{ _id: string; _type: string; slug: string }> =
            await client.fetch(
              `*[_type in ["space", "category"] && slug.current == $slug]{ _id, _type, "slug": slug.current }`,
              { slug: value.current }
            );
          const slugDocs: SlugDoc[] = existingDocs.map((doc) => ({
            id: doc._id.replace(/^drafts\./, ""),
            type: doc._type,
            slug: doc.slug,
          }));
          if (!isSlugAvailable(value.current, candidateId, slugDocs)) {
            return `Slug "${value.current}" is already in use by another space or category document.`;
          }
          return true;
        }),
    }),
    
    // Content
    defineField({
      name: "eyebrow",
      title: "Eyebrow Text",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "icon",
      title: "Icon Name",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      group: "content",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "overview",
      title: "Editorial Overview",
      type: "text",
      group: "content",
      rows: 4,
    }),
    defineField({
      name: "keyFeatures",
      title: "Key Features",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
    }),

    // Applications
    defineField({
      name: "suitableFor",
      title: "Suitable For",
      type: "array",
      group: "applications",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Residential", value: "Residential" },
          { title: "Commercial", value: "Commercial" },
          { title: "Industrial", value: "Industrial" },
          { title: "Hospitality", value: "Hospitality" },
        ],
      },
    }),
    defineField({
      name: "applications",
      title: "Applications",
      type: "array",
      group: "applications",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "materialFinishOptions",
      title: "Material & Finish Options",
      type: "array",
      group: "applications",
      of: [{ type: "string" }],
    }),

    // Media
    defineField({
      name: "categoryImage",
      title: "Category Image",
      type: "image",
      group: "media",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "media",
      of: [{ type: "image", options: { hotspot: true } }],
    }),

    // Catalogues
    defineField({
      name: "catalogues",
      title: "Catalogues",
      type: "array",
      group: "catalogues",
      of: [{ type: "reference", to: [{ type: "catalogue" }] }],
    }),

    // UI Configuration
    defineField({
      name: "cardVariant",
      title: "Card Variant",
      type: "string",
      group: "identity",
      options: {
        list: ["standard", "wide", "feature"],
      },
    }),
    defineField({
      name: "primaryRail",
      title: "Showroom family",
      type: "string",
      group: "identity",
      description:
        "Which family tile this category appears under on /collections. Older values (handles-knobs, kitchen-wardrobes…) still work and map to the nearest family.",
      options: {
        list: [
          { title: "Door Hardware", value: "door" },
          { title: "Smart & Security", value: "smart-security" },
          { title: "Kitchen Hardware", value: "kitchen" },
          { title: "Wardrobe & Furniture", value: "wardrobe-furniture" },
          { title: "Bathroom Hardware", value: "bathroom-hardware" },
          { title: "Glass Hardware", value: "glass" },
          { title: "Furniture Fittings", value: "furniture-fittings" },
        ],
      },
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      group: "identity",
      initialValue: 0,
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "identity",
      initialValue: false,
    }),

    defineField({
      name: "families",
      title: "Showroom Families",
      type: "array",
      group: "identity",
      description: "Family ids this category is listed under (handles-knobs, door-hardware, bathroom, kitchen-wardrobes, furniture-hardware).",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "brands",
      title: "Brands",
      type: "array",
      group: "identity",
      description: "Brands shown on this category's family section.",
      of: [{ type: "reference", to: [{ type: "brand" }] }],
    }),
    defineField({
      name: "searchKeywords",
      title: "Search Keywords",
      type: "array",
      group: "content",
      description: "Customer-language names (e.g. board sub-items) that should find this category in search.",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "verificationStatus",
      title: "Verification Status",
      type: "string",
      group: "editorial",
    }),
    defineField({
      name: "image",
      title: "Image (legacy)",
      type: "image",
      group: "media",
      description: "Pre-migration photograph field. The site still reads it when Category Image is empty; move it to Category Image when convenient.",
      options: { hotspot: true },
      hidden: ({ document }) => Boolean(document?.categoryImage),
    }),

    // SEO
    defineField({
      name: "whatsappMessage",
      title: "WhatsApp Message Template",
      type: "text",
      group: "seo",
      rows: 2,
    }),
    defineField({
      name: "seo",
      title: "SEO Metadata",
      type: "seo",
      group: "seo",
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
      subtitle: "description",
      media: "categoryImage",
    },
  },
});
