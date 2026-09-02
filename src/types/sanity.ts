export interface SanitySeo {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: {
    asset?: {
      _ref?: string;
      url?: string;
    };
  };
  noIndex?: boolean;
}

export interface SanityCta {
  label: string;
  type: "product-enquiry" | "category-enquiry" | "brand-enquiry" | "showroom-visit" | "general-enquiry";
  destination?: string;
}
