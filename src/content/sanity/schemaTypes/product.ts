import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  groups: [
    { name: "identity", title: "Identity" },
    { name: "presentation", title: "Presentation" },
    { name: "productInfo", title: "Product Information" },
    { name: "technicalInfo", title: "Technical Information" },
    { name: "conversion", title: "Conversion" },
    { name: "seo", title: "SEO" },
    { name: "editorial", title: "Editorial" },
    { name: "legacy", title: "Legacy / Pre-Migration Data" },
  ],
  fields: [
    // Identity
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      group: "identity",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "catalogReference",
      title: "Catalog Reference",
      type: "string",
      group: "identity",
    }),
    defineField({
      name: "slug",
      title: "Web address (slug)",
      type: "slug",
      group: "identity",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      group: "identity",
      to: [{ type: "brand" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      group: "identity",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subcategoryTitle",
      title: "Sub-category",
      type: "string",
      group: "identity",
      description:
        "Optional, plain text, e.g. \"Long bar handles\" or \"Biometric\". /collections shows a sub-category row under a category once two or more of its products use different sub-categories. Keep the spelling identical across products.",
    }),
    defineField({
      name: "featured",
      title: "Featured Product",
      type: "boolean",
      group: "identity",
      initialValue: false,
    }),
    defineField({
      name: "showroomDisplay",
      title: "Showroom Display",
      type: "boolean",
      group: "identity",
      initialValue: false,
    }),

    // Presentation
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      group: "presentation",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "array",
      group: "presentation",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      group: "presentation",
      options: { hotspot: true },
    }),
    defineField({
      name: "productGallery",
      title: "Product Gallery",
      type: "array",
      group: "presentation",
      of: [{ type: "image", options: { hotspot: true } }],
    }),

    // Product Information
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      group: "productInfo",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "applications",
      title: "Applications",
      type: "array",
      group: "productInfo",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "suitableFor",
      title: "Suitable For",
      type: "array",
      group: "productInfo",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: 'Residential', value: 'Residential' },
          { title: 'Commercial', value: 'Commercial' },
          { title: 'Industrial', value: 'Industrial' },
        ]
      }
    }),
    defineField({
      name: "materialFinish",
      title: "Material & Finish Options",
      type: "array",
      group: "productInfo",
      of: [{ type: "string" }],
    }),

    // Technical Information
    defineField({
      name: "specifications",
      title: "Specifications",
      type: "array",
      group: "technicalInfo",
      of: [
        {
          type: "object",
          fields: [
            { name: "specName", title: "Specification Name", type: "string" },
            { name: "specValue", title: "Specification Value", type: "string" },
          ],
        },
      ],
    }),

    // Conversion
    defineField({
      name: "whatsappCtaEnabled",
      title: "WhatsApp CTA Enabled",
      type: "boolean",
      group: "conversion",
      initialValue: true,
    }),
    defineField({
      name: "ctaMessage",
      title: "CTA Message",
      type: "string",
      group: "conversion",
      description: "Pre-populated WhatsApp template. (e.g. 'Hi, I am interested in...')",
    }),
    defineField({
      name: "relatedProducts",
      title: "Related Products",
      type: "array",
      group: "conversion",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),

    // SEO
    defineField({
      name: "seo",
      title: "SEO Metadata",
      type: "seo",
      group: "seo",
    }),

    // Editorial
    defineField({
      name: "editorial",
      title: "Editorial Status",
      type: "editorial",
      group: "editorial",
    }),

    // Legacy Fields
    defineField({
      name: "subcategory",
      title: "Subcategory (Legacy)",
      type: "reference",
      to: [{ type: "subcategory" }],
      description: "Optional: The specific subcategory this product belongs to.",
      group: "legacy",
    }),
    defineField({
      name: "curatedCollections",
      title: "Curated Collections (Legacy)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "curatedCollection" }] }],
      description: "Optional: Merchandising collections this product belongs to (e.g., 'Italian Collection').",
      group: "legacy",
    }),
    defineField({
      name: "images",
      title: "Images (Legacy)",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
      group: "legacy",
    }),
    defineField({
      name: "officialFiles",
      title: "Official Files (CAD/BIM/PDF) (Legacy)",
      description: "Verified official files provided by the manufacturer",
      type: "array",
      of: [{ type: "file", options: { storeOriginalFilename: true } }],
      group: "legacy",
    }),
  ],
  preview: {
    select: {
      title: "name",
      brand: "brand.name",
      category: "category.name",
      media: "heroImage",
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
