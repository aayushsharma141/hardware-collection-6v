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
      name: "heroPlacement",
      title: "Also show in the hero carousel of",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Home page", value: "home" },
          { title: "Collections page", value: "collections" },
        ],
      },
      description:
        "Tick a page to put this offer in its top carousel as well as in Current Offers. Each hero shows at most 3 offers.",
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "heroOrder",
      title: "Hero order",
      type: "number",
      description:
        "Only matters when more than 3 offers are ticked for the same page: the lowest numbers (1, 2, 3) are the ones shown. Offers with no number come last, soonest-ending first.",
      validation: (rule) => rule.integer().min(1),
      hidden: ({ document }) => !(document?.heroPlacement as string[] | undefined)?.length,
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
      hero: "heroPlacement",
    },
    prepare({ title, type, until, active, media, hero }) {
      const heroOn = Array.isArray(hero) && hero.length ? `hero: ${hero.join(" + ")}` : null;
      const parts = [type, until ? `until ${until}` : "ongoing", heroOn, active === false ? "hidden" : null];
      return { title, subtitle: parts.filter(Boolean).join(" · "), media };
    },
  },
});
