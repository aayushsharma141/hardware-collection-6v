import { defineType, defineField } from "sanity";
import { MonitorPlay } from "lucide-react";
import type { ComponentType } from "react";

export const heroManagerType = defineType({
  name: "heroManager",
  title: "Hero Manager",
  type: "document",
  icon: MonitorPlay as ComponentType,
  fields: [
    defineField({
      name: "homeHero",
      title: "Home Page Hero",
      type: "array",
      of: [{ type: "heroSlide" }],
      description: "Manage the slides visitors see first on the Home page.",
    }),
    defineField({
      name: "collectionHero",
      title: "Collection Hero",
      type: "array",
      of: [{ type: "heroSlide" }],
      description: "Manage the slides visitors see first on the Collections page.",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Hero Manager",
      };
    },
  },
});
