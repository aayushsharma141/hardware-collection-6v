import { defineType, defineField } from "sanity";
import { Image as ImageIcon } from "lucide-react";
import type { ComponentType } from "react";

export const galleryType = defineType({
  name: "gallery",
  title: "Gallery Image",
  type: "document",
  icon: ImageIcon as ComponentType,
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Showroom", value: "Showroom" },
          { title: "Products", value: "Products" },
          { title: "Team", value: "Team" },
          { title: "Projects", value: "Projects" },
          { title: "Exterior", value: "Exterior" },
          { title: "Interior", value: "Interior" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
    defineField({
      name: "altText",
      title: "Alt Text",
      type: "string",
      description: "Important for SEO and accessibility",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "relatedBrand",
      title: "Related Brand",
      type: "reference",
      to: [{ type: "brand" }],
    }),
    defineField({
      name: "relatedProduct",
      title: "Related Product",
      type: "reference",
      to: [{ type: "product" }],
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "caption",
      subtitle: "category",
      altText: "altText",
      media: "image",
    },
    prepare(selection) {
      const { title, subtitle, altText, media } = selection;
      return {
        title: title || altText || 'Untitled Image',
        subtitle,
        media,
      };
    },
  },
});
