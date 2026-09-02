import { defineType, defineField } from "sanity";
import { Image as ImageIcon } from "lucide-react";
import type { ComponentType } from "react";

export const galleryType = defineType({
  name: "gallery",
  title: "Showroom Gallery",
  type: "document",
  icon: ImageIcon as ComponentType,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Internal reference title for this gallery collection (e.g. 'Main Showroom 2024')",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "images",
      title: "Gallery Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "caption",
              type: "string",
              title: "Caption",
              description: "Optional caption for this image",
            },
            {
              name: "altText",
              type: "string",
              title: "Alt Text",
              description: "Important for SEO and accessibility",
            },
          ],
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "images.0",
    },
  },
});
