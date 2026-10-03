import type { LeadSource } from "@/lib/leads/schema"

export type ConsultationContext = {
  // Derived from LeadSourceSchema so the drawer can never carry a source the
  // /api/leads validator rejects.
  source: LeadSource

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
