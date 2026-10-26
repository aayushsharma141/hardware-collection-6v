import { z } from "zod";

// The single source of truth for where a lead originated. The consultation
// drawer's context type (ConsultationContext) derives its `source` from this,
// so the client can never send a value the API rejects. `consultation_drawer`
// is the fallback used when the drawer opens without a specific entry point.
export const LeadSourceSchema = z.enum([
  "home",
  "collections",
  "product_drawer",
  "navbar",
  "shortlist",
  "category_page",
  "space_landing",
  "footer",
  "consultation_drawer",
]);

export type LeadSource = z.infer<typeof LeadSourceSchema>;

export const LeadIntentSchema = z.enum([
  "consultation",
  "enquiry",
  "callback",
]);

export const LeadStatusSchema = z.enum([
  "new",
  "contacted",
  "qualified",
  "visit_scheduled",
  "quoted",
  "won",
  "lost",
]);

export const ConsultationModeSchema = z.enum([
  "showroom",
  "phone",
  "whatsapp",
  "flexible",
]);

// Upper bounds on visitor text. Every field is stored and copied into the staff
// email and the Telegram alert, which Telegram rejects outright past 4096
// characters. The limits sit far above anything the form produces.
export const LEAD_LIMITS = {
  name: 100,
  phone: 20,
  email: 254,
  short: 200,
  message: 2000,
  pageUrl: 2048,
  selectedProducts: 50,
} as const;

const shortText = z.string().max(LEAD_LIMITS.short);

export const SelectedProductSchema = z.object({
  slug: shortText,
  name: shortText,
  brand: shortText,
});

export const BaseLeadSchema = z.object({
  name: z.string().min(2, "Name is required").max(LEAD_LIMITS.name),
  phone: z.string().min(8, "Valid phone number is required").max(LEAD_LIMITS.phone),
  email: z.string().max(LEAD_LIMITS.email).email("Invalid email").optional().or(z.literal("")),
  source: LeadSourceSchema,
  // Truncated rather than rejected: a long tracking query string must never cost a lead.
  pageUrl: z.preprocess(
    (value) => (typeof value === "string" ? value.slice(0, LEAD_LIMITS.pageUrl) : value),
    z.string().url().optional().or(z.literal(""))
  ),
});

const messageText = z.string().max(LEAD_LIMITS.message);

// Mode 1: Consultation
export const ConsultationLeadSchema = BaseLeadSchema.extend({
  intent: z.literal("consultation"),
  projectType: shortText.min(1, "Project type is required").optional().or(z.literal("")),
  interest: shortText.min(1, "Primary interest is required").optional().or(z.literal("")),
  consultationDate: shortText.optional().or(z.literal("")),
  consultationTime: shortText.min(1, "Preferred time is required").optional().or(z.literal("")),
  consultationMode: ConsultationModeSchema.optional(),
  message: messageText.optional().or(z.literal("")),
  selectedProducts: z.array(SelectedProductSchema).max(LEAD_LIMITS.selectedProducts).optional(),
});

export const CustomerTypeSchema = z.enum([
  "Architect / Interior Designer",
  "Home Owner",
  "Builder / Project",
  "Retailer",
]);

export const ProjectTypeSchema = z.enum([
  "Modular Kitchen",
  "Home Renovation",
  "New Home / Construction",
  "Commercial Project",
  "Door / Security",
  "Wardrobe",
  "Other",
]);

// Mode 2: Enquiry
export const EnquiryLeadSchema = BaseLeadSchema.extend({
  intent: z.literal("enquiry"),
  customerType: CustomerTypeSchema.optional(),
  location: shortText.min(2, "Location is required"),
  projectType: ProjectTypeSchema,
  category: shortText.optional().or(z.literal("")),
  brand: shortText.optional().or(z.literal("")),
  product: shortText.optional().or(z.literal("")),
  quantity: shortText.optional().or(z.literal("")),
  message: messageText.optional().or(z.literal("")),
});

// Mode 3: Callback
export const CallbackLeadSchema = BaseLeadSchema.extend({
  intent: z.literal("callback"),
  consultationTime: shortText.min(1, "Preferred callback window is required"), // re-using this for the window
  message: messageText.optional().or(z.literal("")),
});

// Combined union for the API to accept
export const CreateLeadSchema = z.discriminatedUnion("intent", [
  ConsultationLeadSchema,
  EnquiryLeadSchema,
  CallbackLeadSchema,
]);

export type CreateLeadInput = z.infer<typeof CreateLeadSchema>;
export type ConsultationLeadInput = z.infer<typeof ConsultationLeadSchema>;
export type EnquiryLeadInput = z.infer<typeof EnquiryLeadSchema>;
export type CallbackLeadInput = z.infer<typeof CallbackLeadSchema>;

export interface LeadNotificationPayload {
  id?: string;
  name: string;
  phone: string;
  email?: string | null;
  source: string;
  pageUrl?: string | null;
  intent: string;
  customerType?: string | null;
  location?: string | null;
  message?: string | null;
  projectType?: string | null;
  interest?: string | null;
  consultationDate?: string | null;
  consultationTime?: string | null;
  consultationMode?: string | null;
  selectedProducts?: string | null;
  category?: string | null;
  brand?: string | null;
  product?: string | null;
  quantity?: string | null;
}


