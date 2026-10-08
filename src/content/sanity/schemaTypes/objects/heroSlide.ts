import { defineField, defineType } from "sanity";
import { ImageIcon } from "lucide-react";
import type { ComponentType } from "react";

export const heroSlideType = defineType({
  name: "heroSlide",
  title: "Hero Slide",
  type: "object",
  icon: ImageIcon as ComponentType,
  fields: [
    defineField({
      name: "slideType",
      title: "Slide Type",
      type: "string",
      options: {
        list: [
          { title: "Promotional Banner", value: "promotional" },
          { title: "Collection", value: "collection" },
          { title: "Brand", value: "brand" },
          { title: "Offer", value: "offer" },
          { title: "Custom Hero", value: "custom" },
        ],
        layout: "radio",
      },
      initialValue: "promotional",
      validation: (Rule) => Rule.required(),
    }),
    
    // For Offer
    defineField({
      name: "offer",
      title: "Select Offer",
      type: "reference",
      to: [{ type: "offer" }],
      hidden: ({ parent }) => parent?.slideType !== "offer",
    }),

    // For Collection
    defineField({
      name: "collection",
      title: "Select Collection",
      type: "reference",
      to: [{ type: "category" }],
      hidden: ({ parent }) => parent?.slideType !== "collection",
    }),

    // For Brand
    defineField({
      name: "brand",
      title: "Select Brand",
      type: "reference",
      to: [{ type: "brand" }],
      hidden: ({ parent }) => parent?.slideType !== "brand",
    }),

    // For Promotional / Custom
    defineField({
      name: "imageDesktop",
      title: "Image (Desktop)",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => !["promotional", "custom"].includes(parent?.slideType),
    }),
    defineField({
      name: "imageMobile",
      title: "Image (Mobile)",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => !["promotional", "custom"].includes(parent?.slideType),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      hidden: ({ parent }) => !["promotional", "custom"].includes(parent?.slideType),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      hidden: ({ parent }) => !["promotional", "custom"].includes(parent?.slideType),
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "url",
      hidden: ({ parent }) => !["promotional", "custom"].includes(parent?.slideType),
    }),
    defineField({
      name: "position",
      title: "Position",
      type: "number",
      description: "Optional. Pin this slide to a specific position (1-based index). If left blank, it will float.",
    }),
  ],
  preview: {
    select: {
      type: "slideType",
      offerTitle: "offer.title",
      collectionName: "collection.name",
      brandName: "brand.name",
      customTitle: "title",
      image: "imageDesktop",
      offerImage: "offer.image",
      collectionImage: "collection.categoryImage",
      brandImage: "brand.logo",
    },
    prepare({ type, offerTitle, collectionName, brandName, customTitle, image, offerImage, collectionImage, brandImage }) {
      const titles: Record<string, string> = {
        offer: `OFFER: ${offerTitle || "No offer selected"}`,
        collection: `COLLECTION: ${collectionName || "No collection selected"}`,
        brand: `BRAND: ${brandName || "No brand selected"}`,
        promotional: `PROMO: ${customTitle || "Untitled"}`,
        custom: `CUSTOM: ${customTitle || "Untitled"}`,
      };
      
      const images: Record<string, unknown> = {
        offer: offerImage,
        collection: collectionImage,
        brand: brandImage,
        promotional: image,
        custom: image,
      };
      
      const slideType = typeof type === 'string' ? type : '';
      
      return {
        title: titles[slideType] || "Hero Slide",
        subtitle: slideType ? slideType.charAt(0).toUpperCase() + slideType.slice(1) : "Hero Slide",
        media: images[slideType] || image,
      };
    },
  },
});
