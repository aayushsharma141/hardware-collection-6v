import { defineArrayMember, defineField, defineType } from "sanity";
import { FileText } from "lucide-react";
import type { ComponentType } from "react";

export const legalPageType = defineType({
  name: "legalPage",
  title: "Legal Page",
  type: "document",
  icon: FileText as ComponentType,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Use privacy-policy or terms-and-conditions; the site looks these up by slug.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "lastUpdated",
      title: "Last updated",
      type: "datetime",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({ name: "seo", title: "SEO Metadata", type: "seo" }),
  ],
  preview: { select: { title: "title", subtitle: "slug.current" } },
});
