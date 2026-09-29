import { defineType, defineField } from "sanity";
import { Home } from "lucide-react";
import type { ComponentType } from "react";

export const homePageType = defineType({
  name: "homePage",
  title: "Homepage Content",
  type: "document",
  icon: Home as ComponentType,
  groups: [
    { name: "hero", title: "Hero Section" },
    { name: "brandTrust", title: "Brand Trust" },
    { name: "featuredCollections", title: "Featured Collections" },
    { name: "featuredProducts", title: "Featured Products" },
    { name: "whyChooseUs", title: "Why Hardware Collection" },
    { name: "showroom", title: "Showroom" },
    { name: "customerVoice", title: "Customer Voice" },
    { name: "materials", title: "Material Journey" },
    { name: "legacy", title: "Our Legacy" },
    { name: "finalCta", title: "Final CTA" },
  ],
  fields: [
    // --- Hero Section ---
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      group: "hero",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroDescription",
      title: "Hero Description",
      type: "text",
      group: "hero",
    }),
    defineField({
      name: "primaryCta",
      title: "Primary CTA",
      type: "cta",
      group: "hero",
    }),
    defineField({
      name: "secondaryCta",
      title: "Secondary CTA",
      type: "cta",
      group: "hero",
    }),
    defineField({
      name: "heroImageDesktop",
      title: "Hero Image (Desktop)",
      type: "image",
      group: "hero",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroImageMobile",
      title: "Hero Image (Mobile)",
      type: "image",
      group: "hero",
      options: { hotspot: true },
    }),
    
    // --- Brand Trust ---
    defineField({
      name: "trustedBrands",
      title: "Trusted Brands",
      type: "array",
      group: "brandTrust",
      of: [{ type: "reference", to: [{ type: "brand" }] }],
      validation: (Rule) => Rule.min(4).max(6).warning('Recommended to have 4-6 brands for optimal layout.'),
    }),

    // --- Featured Collections ---
    defineField({
      name: "featuredCategories",
      title: "Featured Categories",
      type: "array",
      group: "featuredCollections",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      validation: (Rule) => Rule.min(3).max(6),
    }),

    // --- Featured Products ---
    defineField({
      name: "featuredProducts",
      title: "Featured Products",
      type: "array",
      group: "featuredProducts",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      validation: (Rule) => Rule.min(4).max(8),
    }),

    // --- Why Choose Us ---
    defineField({
      name: "valuePropositions",
      title: "Value Propositions",
      type: "array",
      group: "whyChooseUs",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text" }),
            defineField({ name: "icon", title: "Icon (Lucide name)", type: "string" }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(6),
    }),

    // --- Showroom ---
    defineField({
      name: "showroomGallery",
      title: "Showroom Gallery",
      type: "array",
      group: "showroom",
      of: [{ type: "image", options: { hotspot: true } }],
    }),

    // --- Customer Voice ---
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      group: "customerVoice",
      of: [{ type: "reference", to: [{ type: "testimonial" }] }],
      validation: (Rule) => Rule.min(2).max(6),
    }),

    // --- Material Journey ---
    defineField({
      name: "materialFinishes",
      title: "Material Finishes",
      type: "array",
      group: "materials",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Material Name (e.g. SATIN)", type: "string" }),
            defineField({ name: "subName", title: "Sub Name (e.g. Satin Steel)", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text" }),
            defineField({ name: "specification", title: "Technical Specification", type: "text" }),
            defineField({ name: "image", title: "Material Image", type: "image", options: { hotspot: true } }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(5),
    }),

    // --- Our Legacy (About Story) ---
    defineField({
      name: "legacyYearsOfTrust",
      title: "Years of Trust",
      type: "number",
      group: "legacy",
      description: "Number only — displayed as '10+' on the website (e.g. enter 10 for '10+')",
      validation: (Rule) => Rule.min(1).max(100),
    }),
    defineField({
      name: "legacyBrandsCount",
      title: "Authorized Brands Count",
      type: "number",
      group: "legacy",
      description: "Number only — displayed as '20+' on the website (e.g. enter 20 for '20+')",
      validation: (Rule) => Rule.min(1).max(200),
    }),
    defineField({
      name: "legacyShowroomImage",
      title: "Showroom Legacy Image",
      type: "image",
      group: "legacy",
      options: { hotspot: true },
    }),
    defineField({
      name: "legacyPillars",
      title: "Legacy Pillars",
      type: "array",
      group: "legacy",
      description: "These appear as the 'Why Hardware Collection' section under the About Story block",
      of: [
        {
          type: "object",
          name: "legacyPillar",
          title: "Pillar",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
          ],
          preview: {
            select: { title: "title", subtitle: "description" },
          },
        },
      ],
      validation: (Rule) => Rule.max(4),
    }),

    // --- Final CTA ---
    defineField({
      name: "ctaHeading",
      title: "Final CTA Heading",
      type: "string",
      group: "finalCta",
    }),
    defineField({
      name: "ctaDescription",
      title: "Final CTA Description",
      type: "text",
      group: "finalCta",
    }),
    defineField({
      name: "cta",
      title: "Call to Action",
      type: "cta",
      group: "finalCta",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Homepage Content",
      };
    },
  },
});
