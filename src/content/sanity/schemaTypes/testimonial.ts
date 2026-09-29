import { defineField, defineType } from "sanity";
import { MessageSquareQuote } from "lucide-react";
import type { ComponentType } from "react";

export const testimonialType = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  icon: MessageSquareQuote as ComponentType,
  groups: [
    { name: "content", title: "Content" },
    { name: "meta", title: "Metadata" },
    { name: "editorial", title: "Editorial" },
  ],
  fields: [
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "testimonialText",
      title: "Testimonial",
      type: "text",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      group: "meta",
      initialValue: 5,
      validation: (rule) => rule.min(1).max(5),
    }),
    defineField({
      name: "customerType",
      title: "Customer Type",
      type: "string",
      group: "meta",
      options: {
        list: [
          { title: "Homeowner", value: "Homeowner" },
          { title: "Architect", value: "Architect" },
          { title: "Builder", value: "Builder" },
          { title: "Contractor", value: "Contractor" },
        ],
      },
    }),
    defineField({
      name: "relatedCategory",
      title: "Related Category",
      type: "reference",
      group: "meta",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "customerPhoto",
      title: "Customer Photo",
      type: "image",
      group: "meta",
      options: { hotspot: true },
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "meta",
      initialValue: false,
    }),
    defineField({
      name: "editorial",
      title: "Editorial Status",
      type: "editorial",
      group: "editorial",
      description: "Use 'Needs Review' if this testimonial requires verification before publishing.",
    }),
  ],
  preview: {
    select: {
      title: "customerName",
      subtitle: "testimonialText",
      media: "customerPhoto",
    },
  },
});
