import { defineField, defineType } from "sanity";

export const seoType = defineType({
  name: "seo",
  title: "SEO Metadata",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description: "Ideal length is 50-60 characters.",
      validation: (rule) => rule.max(60).warning("Longer titles may be truncated by search engines"),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      description: "Ideal length is 150-160 characters.",
      validation: (rule) => rule.max(160).warning("Longer descriptions may be truncated by search engines"),
    }),
    defineField({
      name: "ogImage",
      title: "Social Share Image (Open Graph)",
      type: "image",
      options: { hotspot: true },
      description: "Recommended size: 1200x630 pixels.",
    }),
    defineField({
      name: "noIndex",
      title: "Hide from Search Engines",
      type: "boolean",
      description: "Check this to prevent search engines from indexing this page.",
      initialValue: false,
    }),
  ],
});
