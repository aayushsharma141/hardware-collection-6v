import { defineType, defineField } from "sanity";
import { Settings } from "lucide-react";
import type { ComponentType } from "react";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Business Settings",
  type: "document",
  icon: Settings as ComponentType,
  groups: [
    { name: "business", title: "🏪 Business", default: true },
    { name: "contact", title: "📞 Contact" },
    { name: "whatsapp", title: "💬 WhatsApp" },
    { name: "location", title: "📍 Location" },
    { name: "hours", title: "🕐 Opening Hours" },
    { name: "social", title: "📱 Social Media" },
    { name: "map", title: "🗺 Map" },
    { name: "media", title: "🖼 Default Media" },
    { name: "seo", title: "🔍 SEO" },
  ],
  fields: [
    // --- Business ---
    defineField({
      name: "businessName",
      title: "Business Name",
      type: "string",
      group: "business",
      initialValue: "Hardware Collection",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ownerName",
      title: "Owner / Proprietor Name",
      type: "string",
      group: "business",
      description: "Used in legal pages (e.g. 'Mukesh Khandelwal')",
    }),
    defineField({
      name: "authorizedBrands",
      title: "Authorized Brands",
      type: "array",
      group: "business",
      of: [{ type: "reference", to: [{ type: "brand" }] }],
      description: "Global list of authorized brands to display across the site (Footer, Consultation, About sections, etc.)",
    }),

    // --- Contact ---
    defineField({
      name: "phone",
      title: "Primary Phone Number",
      type: "string",
      group: "contact",
      description: "Include country code, e.g. +91 98351 90738",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "secondaryPhone",
      title: "Secondary Phone Number",
      type: "string",
      group: "contact",
      description: "Optional second number shown on contact pages",
    }),
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
      group: "contact",
    }),

    // --- WhatsApp ---
    defineField({
      name: "whatsapp",
      title: "WhatsApp Number",
      type: "string",
      group: "whatsapp",
      description: "Number only, with country code — no spaces or dashes. e.g. 919835190738",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "defaultWhatsappMessage",
      title: "Default WhatsApp Greeting",
      type: "text",
      group: "whatsapp",
      rows: 2,
      description: "Pre-filled message when a customer taps the WhatsApp button",
      initialValue: "Hi Hardware Collection, I would like to enquire about your products.",
    }),

    // --- Location ---
    defineField({
      name: "address",
      title: "Showroom Address",
      type: "text",
      group: "location",
      rows: 3,
      description: "Full postal address of the showroom",
    }),

    // --- Hours ---
    defineField({
      name: "openingHours",
      title: "Opening Hours",
      type: "text",
      group: "hours",
      rows: 4,
      description: "One line per day/range, e.g. 'Mon–Sat: 10 AM – 8 PM'",
    }),

    // --- Social ---
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
      group: "social",
    }),
    defineField({
      name: "facebookUrl",
      title: "Facebook URL",
      type: "url",
      group: "social",
    }),

    // --- Map ---
    defineField({
      name: "googleMapsUrl",
      title: "Google Maps URL",
      type: "url",
      group: "map",
      description: "The 'Share' link from Google Maps — opens in the maps app",
    }),
    defineField({
      name: "googleMapsEmbedUrl",
      title: "Google Maps Embed URL",
      type: "url",
      group: "map",
      description: "The embed src URL from Google Maps (Google Maps → Share → Embed a map → copy the src=... URL)",
    }),

    // --- Default Media ---
    defineField({
      name: "defaultCategoryImage",
      title: "Default Category Fallback Image",
      type: "image",
      group: "media",
      options: { hotspot: true },
      description: "Shown when a category has no image of its own",
    }),

    // --- SEO ---
    defineField({
      name: "seo",
      title: "SEO Defaults",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Business Settings",
        subtitle: "Showroom contact, hours & SEO",
      };
    },
  },
});
