import { defineType, defineField } from "sanity";
import { Settings } from "lucide-react";
import type { ComponentType } from "react";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: Settings as ComponentType,
  groups: [
    { name: "contact", title: "Contact Info" },
    { name: "location", title: "Location" },
    { name: "media", title: "Media Defaults" },
  ],
  fields: [
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp Number",
      type: "string",
      group: "contact",
      description: "The primary WhatsApp number for leads. Include country code without '+' (e.g., 919835190738)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "defaultWhatsappMessage",
      title: "Default WhatsApp Message",
      type: "text",
      group: "contact",
      description: "The default text pre-filled when a user clicks the global WhatsApp button.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "primaryPhone",
      title: "Primary Phone Number",
      type: "string",
      group: "contact",
      description: "The main phone number displayed on the site for calling (e.g., +91 98351 90738).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "secondaryPhone",
      title: "Secondary Phone Number",
      type: "string",
      group: "contact",
      description: "Additional showroom phone number displayed in the footer (e.g., +91 70336 50739).",
    }),
    defineField({
      name: "showroomAddress",
      title: "Showroom Address",
      type: "text",
      group: "location",
      description: "The physical address of the showroom displayed in the footer and contact sections.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "showroomHours",
      title: "Showroom Hours",
      type: "string",
      group: "location",
      description: "Operating hours (e.g., '10:00 AM — 8:00 PM (Mon-Sun)').",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "googleMapsUrl",
      title: "Google Maps Link",
      type: "url",
      group: "location",
      description: "The shareable Google Maps URL for getting directions.",
    }),
    defineField({
      name: "googleMapsEmbedUrl",
      title: "Google Maps Embed URL",
      type: "url",
      group: "location",
      description: "The URL used inside the <iframe> to render the map on the page.",
    }),
    defineField({
      name: "defaultCategoryImage",
      title: "Default Category Fallback Image",
      type: "image",
      group: "media",
      options: { hotspot: true },
      description:
        "Used when a category has no heroImage/image and a product has no images[] (D-12 resolution chain terminus).",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Site Settings",
      };
    },
  },
});
