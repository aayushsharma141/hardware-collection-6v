import { defineField, defineType } from "sanity";

/**
 * Review state shared by every content document. Anything flagged
 * `needsReview` is hidden from public queries where noted (testimonials) and
 * surfaced in the Studio's "Needs Review" list.
 */
export const editorialType = defineType({
  name: "editorial",
  title: "Editorial Status",
  type: "object",
  fields: [
    defineField({
      name: "needsReview",
      title: "Needs review",
      type: "boolean",
      description: "Flag content that was migrated or drafted and has not been checked by the showroom team.",
      initialValue: false,
    }),
    defineField({
      name: "reviewNotes",
      title: "Review notes",
      type: "text",
      rows: 3,
    }),
  ],
});
