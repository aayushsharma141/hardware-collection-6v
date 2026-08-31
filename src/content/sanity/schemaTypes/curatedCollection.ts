import { defineField, defineType } from "sanity";

export const curatedCollectionType = defineType({
  name: "curatedCollection",
  title: "Curated Collection",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Collection Name",
      description: "Merchandising concept, e.g., 'Italian Collection', 'Kids Collection'",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "image",
      title: "Collection Image",
      type: "image",
      options: {
        hotspot: true,
      },
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
      title: "name",
      subtitle: "description",
      media: "image",
    },
  },
});
