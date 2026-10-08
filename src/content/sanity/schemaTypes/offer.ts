import { defineField, defineType } from "sanity";
import { BadgePercent } from "lucide-react";
import type { ComponentType } from "react";

/**
 * A showroom offer, shown under "Current Offers" on /collections. To also feature
 * it in the home or collections hero, add it as an "Offer" slide in Hero Manager.
 *
 * Deliberately not a promotions engine: no prices, coupon codes or discount
 * maths — price and availability are confirmed by the showroom on WhatsApp.
 * An offer appears while `active` is on and `validUntil` (if set) has not
 * passed, and disappears by itself the day after it ends.
 */
export const offerType = defineType({
  name: "offer",
  title: "Offer",
  type: "document",
  icon: BadgePercent as ComponentType,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Short and specific, e.g. \"Diwali offer on digital locks\".",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "offerType",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Store offer", value: "store" },
          { title: "Brand offer", value: "brand" },
          { title: "Seasonal offer", value: "seasonal" },
          { title: "Occasional deal", value: "occasional" },
        ],
        layout: "radio",
      },
      initialValue: "store",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Short description",
      type: "text",
      rows: 2,
      description: "One or two lines. Do not publish prices; the showroom confirms them.",
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: [{ type: "brand" }],
      description: "Only for brand offers.",
      hidden: ({ document }) => document?.offerType !== "brand",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "validFrom",
      title: "Valid from",
      type: "date",
      description: "Leave empty to start immediately. The offer will only appear on or after this date.",
    }),
    defineField({
      name: "validUntil",
      title: "Valid until",
      type: "date",
      description: "Leave empty for an ongoing offer. The offer hides itself after this date.",
    }),
    defineField({
      name: "visibleOnHome",
      title: "Visible on Home",
      type: "boolean",
      initialValue: false,
      description: "Toggle on to feature this offer in the Home page hero carousel (up to 4 slides total).",
    }),
    defineField({
      name: "visibleOnCollection",
      title: "Visible on Collection",
      type: "boolean",
      initialValue: false,
      description: "Toggle on to feature this offer in the Collections page hero carousel (up to 7 slides total).",
    }),
    defineField({
      name: "heroOrder",
      title: "Hero order",
      type: "number",
      description: "Display priority in hero carousel (1 = highest priority).",
      initialValue: 1,
    }),
    defineField({
      name: "heroPlacement",
      title: "Hero Placement (Legacy)",
      type: "array",
      of: [{ type: "string" }],
      hidden: true,
    }),
    defineField({
      name: "active",
      title: "Show on website",
      type: "boolean",
      initialValue: true,
      description: "If turned off, the offer is hidden regardless of dates.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      type: "offerType",
      until: "validUntil",
      active: "active",
      media: "image",
      home: "visibleOnHome",
      col: "visibleOnCollection",
      legacyHero: "heroPlacement",
    },
    prepare({ title, type, until, active, media, home, col, legacyHero }) {
      const places = [
        home || legacyHero?.includes("home") ? "Home" : null,
        col || legacyHero?.includes("collections") || legacyHero?.includes("collection") ? "Collection" : null,
      ].filter(Boolean);
      const heroOn = places.length ? `hero: ${places.join(" + ")}` : null;
      const parts = [type, until ? `until ${until}` : "ongoing", heroOn, active === false ? "hidden" : null];
      return { title, subtitle: parts.filter(Boolean).join(" · "), media };
    },
  },
});
