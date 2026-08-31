import { defineField, defineType } from "sanity";
import { apiVersion } from "../env";
import { isReservedSlug, isSlugAvailable, SlugDoc } from "../lib/slugUniqueness";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Category Name",
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
    defineField({
      name: "eyebrow",
      title: "Eyebrow / Sub-tagline",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "overview",
      title: "Editorial Overview",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "cardVariant",
      title: "Card Variant (Blueprint Grid)",
      type: "string",
      options: {
        list: [
          { title: "Standard (4-col)", value: "standard" },
          { title: "Wide (8-col)", value: "wide" },
          { title: "Feature (12-col)", value: "feature" },
        ],
        layout: "radio",
      },
      initialValue: "standard",
    }),
    defineField({
      name: "families",
      title: "Showroom Families",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Handles & Knobs", value: "handles-knobs" },
          { title: "Door Hardware", value: "door-hardware" },
          { title: "Bathroom", value: "bathroom" },
          { title: "Kitchen & Wardrobes", value: "kitchen-wardrobes" },
          { title: "Furniture Hardware", value: "furniture-hardware" },
        ],
      },
    }),
    defineField({
      name: "subcategories",
      title: "Subcategories / Product Lines",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "primaryRail",
      title: "Primary Discovery Rail Group",
      type: "string",
      options: {
        list: [
          { title: "Handles & Knobs", value: "handles-knobs" },
          { title: "Door Hardware", value: "door-hardware" },
          { title: "Bathroom", value: "bathroom" },
          { title: "Kitchen & Wardrobes", value: "kitchen-wardrobes" },
          { title: "Furniture Hardware", value: "furniture-hardware" },
          { title: "More Collections", value: "more" },
        ],
      },
      initialValue: "door-hardware",
    }),
    defineField({
      name: "suitableFor",
      title: "Suitable For",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Residential Villas & Apartments", value: "Residential" },
          { title: "Commercial & Office Spaces", value: "Commercial" },
          { title: "Hospitality & Luxury Hotels", value: "Hospitality" },
        ],
      },
    }),
    defineField({
      name: "brands",
      title: "Authorized Brands",
      type: "array",
      of: [{ type: "reference", to: [{ type: "brand" }] }],
    }),
    defineField({
      name: "keyFeatures",
      title: "Key Features",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "searchKeywords",
      title: "Search Keywords / Synonyms",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Customer-language search terms this category should also match (e.g. 'cupboard slides' for Drawer Channels). Doubles as SEO keywords.",
    }),
    defineField({
      name: "icon",
      title: "Icon Name",
      description: "Name of the lucide-react icon to use (e.g., Lock, ChefHat, Bath)",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Category Hero Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "heroImage",
      title: "Cinematic Hero Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "status",
      title: "Content Status",
      type: "string",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "In Review", value: "review" },
          { title: "Published", value: "published" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
    }),
    defineField({
      name: "verificationStatus",
      title: "Data Verification Status",
      type: "string",
      options: {
        list: [
          { title: "Unverified (Pending Source)", value: "unverified" },
          { title: "Brand Verified (Partner Mapped)", value: "brand_verified" },
          { title: "Catalog Verified (PDF/Specs Confirmed)", value: "catalog_verified" },
        ],
        layout: "radio",
      },
      initialValue: "unverified",
    }),
    defineField({
      name: "whatsappMessage",
      title: "WhatsApp Consultation Message Template",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "featured",
      title: "Featured on Homepage",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "description",
      media: "image",
    },
  },
});

