import { defineField, defineType } from "sanity";
import { BookOpen } from "lucide-react";
import type { ComponentType } from "react";

export const catalogueType = defineType({
  name: "catalogue",
  title: "Catalogue",
  type: "document",
  icon: BookOpen as ComponentType,
  groups: [
    { name: "identity", title: "Identity" },
    { name: "file", title: "File" },
    { name: "version", title: "Version" },
    { name: "editorial", title: "Editorial" },
  ],
  fields: [
    defineField({
      name: "catalogueName",
      title: "Catalogue Name",
      type: "string",
      group: "identity",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: [{ type: "brand" }],
      group: "identity",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      group: "identity",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pdfFile",
      title: "PDF File",
      type: "file",
      group: "file",
      options: {
        accept: "application/pdf",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      group: "file",
      options: { hotspot: true },
    }),
    defineField({
      name: "version",
      title: "Version",
      type: "string",
      group: "version",
    }),
    defineField({
      name: "releaseDate",
      title: "Release Date",
      type: "date",
      group: "version",
    }),
    defineField({
      name: "editorial",
      title: "Editorial",
      type: "editorial",
      group: "editorial",
    }),
  ],
  preview: {
    select: {
      title: "catalogueName",
      brand: "brand.name",
      category: "category.name",
      media: "coverImage",
    },
    prepare(selection) {
      const { title, brand, category, media } = selection;
      return {
        title,
        subtitle: `${brand || "No Brand"} • ${category || "No Category"}`,
        media,
      };
    },
  },
});
