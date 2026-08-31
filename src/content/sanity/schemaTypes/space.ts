import { defineField, defineType } from "sanity";
import { apiVersion } from "../env";
import { isReservedSlug, isSlugAvailable, SlugDoc } from "../lib/slugUniqueness";

export const spaceType = defineType({
  name: "space",
  title: "Space",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Space Name",
      description: "e.g., 'Main Entrance & Doors', 'Modular Kitchen & Dining'",
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
      validation: (rule) =>
        rule.required().custom(async (value, context) => {
          if (!value?.current) return true;
          if (isReservedSlug(value.current)) {
            return `Slug cannot be "${value.current}" — reserved by the /collections route family.`;
          }
          const client = context.getClient({ apiVersion });
          const candidateId = (context.document?._id || "").replace(/^drafts\./, "");
          const existingDocs: Array<{ _id: string; _type: string; slug: string }> =
            await client.fetch(
              `*[_type in ["space", "category"] && slug.current == $slug]{ _id, _type, "slug": slug.current }`,
              { slug: value.current }
            );
          const slugDocs: SlugDoc[] = existingDocs.map((doc) => ({
            id: doc._id.replace(/^drafts\./, ""),
            type: doc._type,
            slug: doc.slug,
          }));
          if (!isSlugAvailable(value.current, candidateId, slugDocs)) {
            return `Slug "${value.current}" is already in use by another space or category document.`;
          }
          return true;
        }),
    }),
    defineField({
      name: "image",
      title: "Space Hero / Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "linkedCategories",
      title: "Linked Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
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
      subtitle: "description",
      media: "image",
    },
  },
});
