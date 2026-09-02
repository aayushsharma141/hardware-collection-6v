import { defineField, defineType } from "sanity";

export const ctaType = defineType({
  name: "cta",
  title: "Call to Action",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "type",
      title: "Enquiry Type",
      type: "string",
      description: "This determines the pre-filled WhatsApp message in the frontend.",
      options: {
        list: [
          { title: "Product Enquiry", value: "product-enquiry" },
          { title: "Category Enquiry", value: "category-enquiry" },
          { title: "Brand Enquiry", value: "brand-enquiry" },
          { title: "Showroom Visit", value: "showroom-visit" },
          { title: "General Enquiry", value: "general-enquiry" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
      initialValue: "general-enquiry",
    }),
    defineField({
      name: "destination",
      title: "Destination URL (Optional)",
      type: "url",
      description: "If this CTA links to an internal or external page instead of opening WhatsApp. Leave blank to default to WhatsApp.",
      validation: (rule) => rule.uri({ allowRelative: true }),
    }),
  ],
});
