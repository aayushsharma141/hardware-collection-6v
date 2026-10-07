import { defineField, defineType } from "sanity";
import { BadgePercent } from "lucide-react";
import type { ComponentType } from "react";

/**
 * A showroom offer, shown under "Current Offers" on /collections and, when
 * ticked in `heroPlacement`, in the hero carousel of the home and/or collections page.
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
      name: "validUntil",
      title: "Valid until",
      type: "date",
      description: "Leave empty for an ongoing offer. The offer hides itself after this date.",
    }),
    defineField({
      name: "active",
      title: "Show on website",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      type: "offerType",
      until: "validUntil",
      active: "active",
      media: "image",
    },
    prepare({ title, type, until, active, media }) {
      const parts = [type, until ? `until ${until}` : "ongoing", active === false ? "hidden" : null];
      return { title, subtitle: parts.filter(Boolean).join(" · "), media };
    },
  },
});
