import { defineType, defineField } from "sanity";
import { Menu } from "lucide-react";
import type { ComponentType } from "react";

export const navigationType = defineType({
  name: "navigation",
  title: "Global Navigation",
  type: "document",
  icon: Menu as ComponentType,
  fields: [
    defineField({
      name: "logo",
      title: "Site Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "announcementBar",
      title: "Announcement Bar Text",
      type: "string",
      description: "Optional top bar text (e.g. 'Showroom closed for Diwali'). Leave empty to hide.",
    }),
    defineField({
      name: "mainMenu",
      title: "Main Menu Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "path", title: "Path", type: "string", description: "e.g., '/collections'", validation: (rule) => rule.required() }),
          ],
        },
      ],
    }),
    defineField({
      name: "footerLegalLinks",
      title: "Footer Legal Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "path", title: "Path", type: "string" }),
          ],
        },
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "platform", title: "Platform", type: "string", options: { list: ['Instagram', 'Facebook', 'LinkedIn', 'WhatsApp', 'Other'] } }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Global Navigation",
      };
    },
  },
});
