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
    { name: "legacy", title: "Legacy Section" },
    { name: "features", title: "Why Choose Us" },
    { name: "showroom", title: "Showroom Experience" },
  ],
  fields: [
    // --- Hero Section ---
    defineField({
      name: "heroSlides",
      title: "Hero Slides",
      type: "array",
      group: "hero",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "eyebrow", title: "Eyebrow", type: "string", description: "Small text above the main title (e.g., '10+ YEARS IN SAKCHI')" }),
            defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "description", title: "Description", type: "text" }),
            defineField({ name: "primaryCta", title: "Primary CTA Text", type: "string" }),
            defineField({ name: "ctaTarget", title: "CTA Target URL/Route", type: "string", description: "e.g., '/collections'" }),
            defineField({ name: "image", title: "Background Image", type: "image", options: { hotspot: true }, validation: (Rule) => Rule.required() }),
          ],
        },
      ],
      description: "Slides for the cinematic hero carousel. The order here determines the order on the website.",
    }),
    
    // --- Legacy Section ---
    defineField({
      name: "legacyHeading",
      title: "Legacy Heading",
      type: "string",
      group: "legacy",
      description: "Heading for the legacy section (e.g., 'Over a Decade of Architectural Expertise')",
    }),
    defineField({
      name: "legacyDescription",
      title: "Legacy Description",
      type: "text",
      group: "legacy",
      description: "Paragraph explaining the company's legacy and founding.",
    }),

    // --- Why Choose Us Section ---
    defineField({
      name: "featuresHeading",
      title: "Features Heading",
      type: "string",
      group: "features",
      description: "Heading for the Why Choose Us section.",
    }),
    defineField({
      name: "featuresDescription",
      title: "Features Subtitle / Description",
      type: "text",
      group: "features",
    }),
    defineField({
      name: "featuresList",
      title: "Feature Points",
      type: "array",
      group: "features",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text" }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: "featuresImage",
      title: "Features Side Image",
      type: "image",
      group: "features",
      options: { hotspot: true },
    }),

    // --- Showroom CTA Section ---
    defineField({
      name: "showroomHeading",
      title: "Showroom CTA Heading",
      type: "string",
      group: "showroom",
    }),
    defineField({
      name: "showroomDescription",
      title: "Showroom CTA Description",
      type: "text",
      group: "showroom",
    }),

    // --- NEW FIELDS (Additive for Phase 2) ---
    defineField({
      name: "seo",
      title: "SEO Metadata",
      type: "seo",
    }),
    defineField({
      name: "trustedBrands",
      title: "Trusted Brands",
      type: "array",
      of: [{ type: "reference", to: [{ type: "brand" }] }],
    }),
    defineField({
      name: "featuredCategories",
      title: "Featured Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),
    defineField({
      name: "featuredProducts",
      title: "Featured Products",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),
    defineField({
      name: "showroomGallery",
      title: "Showroom Gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      of: [{ type: "reference", to: [{ type: "testimonial" }] }],
    }),
    defineField({
      name: "finalCTA",
      title: "Final Call to Action",
      type: "cta",
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
