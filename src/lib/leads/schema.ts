import { z } from "zod";

export const LeadSourceSchema = z.enum([
  "home",
  "collections",
  "product_drawer",
  "navbar",
  "shortlist",
]);

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

export const SelectedProductSchema = z.object({
  slug: z.string(),
  name: z.string(),
  brand: z.string(),
});

export const BaseLeadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(8, "Valid phone number is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  source: LeadSourceSchema,
  pageUrl: z.string().url().optional().or(z.literal("")),
});

// Mode 1: Consultation
export const ConsultationLeadSchema = BaseLeadSchema.extend({
  intent: z.literal("consultation"),
  projectType: z.string().min(1, "Project type is required").optional().or(z.literal("")),
  interest: z.string().min(1, "Primary interest is required").optional().or(z.literal("")),
  consultationDate: z.string().optional().or(z.literal("")),
  consultationTime: z.string().min(1, "Preferred time is required").optional().or(z.literal("")),
  consultationMode: ConsultationModeSchema.optional(),
  message: z.string().optional().or(z.literal("")),
  selectedProducts: z.array(SelectedProductSchema).optional(),
});

// Mode 2: Enquiry
export const EnquiryLeadSchema = BaseLeadSchema.extend({
  intent: z.literal("enquiry"),
  category: z.string().optional().or(z.literal("")),
  brand: z.string().optional().or(z.literal("")),
  product: z.string().optional().or(z.literal("")),
  quantity: z.string().optional().or(z.literal("")),
  projectType: z.string().optional().or(z.literal("")),
  message: z.string().optional().or(z.literal("")),
});

// Mode 3: Callback
export const CallbackLeadSchema = BaseLeadSchema.extend({
  intent: z.literal("callback"),
  consultationTime: z.string().min(1, "Preferred callback window is required"), // re-using this for the window
  message: z.string().optional().or(z.literal("")),
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

