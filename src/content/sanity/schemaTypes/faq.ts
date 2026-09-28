import { defineType, defineField } from "sanity";
import { HelpCircle } from "lucide-react";
import type { ComponentType } from "react";

export const faqType = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  icon: HelpCircle as ComponentType,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "organisation", title: "Organisation" },
    { name: "editorial", title: "Editorial" },
  ],
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      group: "content",
      description: "Write the question exactly as a customer would ask it",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      group: "content",
      rows: 5,
      description: "Clear, concise answer. Keep it under 100 words for best readability.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      group: "organisation",
      to: [{ type: "category" }],
      description: "Link to a product category to group this FAQ (optional)",
    }),
    defineField({
      name: "featured",
      title: "Show on FAQ Page",
      type: "boolean",
      group: "organisation",
      description: "Featured FAQs appear first on the FAQ page",
      initialValue: true,
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      group: "organisation",
      description: "Lower numbers appear first. Leave blank to sort by date.",
    }),
    defineField({
      name: "editorial",
      title: "Editorial Status",
      type: "editorial",
      group: "editorial",
    }),
  ],
  preview: {
    select: {
      title: "question",
      subtitle: "answer",
    },
  },
  orderings: [
    {
      title: "Sort Order",
      name: "sortOrderAsc",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
    {
      title: "Date Added (Newest)",
      name: "createdAtDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
});
