import { defineType, defineField } from "sanity";
import { HelpCircle } from "lucide-react";
import type { ComponentType } from "react";

export const faqType = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  icon: HelpCircle as ComponentType,
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "General", value: "general" },
          { title: "Products", value: "products" },
          { title: "Ordering", value: "ordering" },
          { title: "Shipping & Delivery", value: "shipping" },
          { title: "Returns & Refunds", value: "returns" },
        ],
      },
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "question",
      subtitle: "answer",
    },
  },
});
