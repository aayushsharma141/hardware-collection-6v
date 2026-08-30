export type ConsultationContext = {
  source:
    | "home"
    | "collections"
    | "product_drawer"
    | "shortlist"
    | "navbar"
    | "category_page"
    | "space_landing"
    | "footer"

  intent?: "consultation" | "enquiry" | "callback"

  category?: {
    slug: string
    name: string
  }

  brand?: {
    slug: string
    name: string
  }

  product?: {
    slug: string
    name: string
  }

  selectedProducts?: Array<{
    slug: string
    name: string
    brand: string
  }>
}
