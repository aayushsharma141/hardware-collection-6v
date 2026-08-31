import { defineField, defineType } from "sanity";

export const subcategoryType = defineType({
  name: "subcategory",
  title: "Subcategory",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Subcategory Name",
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
      name: "parentCategory",
      title: "Parent Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "image",
      title: "Subcategory Image",
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
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "parentCategory.name",
      media: "image",
    },
  },
});
