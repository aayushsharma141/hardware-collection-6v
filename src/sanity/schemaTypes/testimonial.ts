import { defineField, defineType } from "sanity";

export const testimonialType = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      initialValue: 5,
      validation: (rule) => rule.min(1).max(5),
    }),
    defineField({
      name: "source",
      title: "Source",
      description: "e.g., Google, In-Store, WhatsApp",
      type: "string",
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
    }),
    defineField({
      name: "approved",
      title: "Approved for Website",
      description: "Only approved testimonials will be displayed on the public site.",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "customerName",
      subtitle: "quote",
    },
  },
});
