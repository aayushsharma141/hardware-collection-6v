"use client";

import React, { useState, useId } from "react";
import { ConsultationSuccess } from "./ConsultationSuccess";
import { useConsultationStore } from "./store";
import { Loader2, ArrowRight, Check, AlertCircle, RefreshCw } from "lucide-react";

// â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type CustomerType =
  | "Architect / Interior Designer"
  | "Home Owner"
  | "Builder / Project"
  | "Retailer";

type ProjectType =
  | "Modular Kitchen"
  | "Home Renovation"
  | "New Home / Construction"
  | "Commercial Project"
  | "Door / Security"
  | "Wardrobe"
  | "Other";

interface FormValues {
  customerType: CustomerType | "";
  name: string;
  location: string;
  phone: string;
  projectType: ProjectType | "";
}

interface ConsultationFormProps {
  onSuccess?: () => void;
  inline?: boolean;
}

// â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const CUSTOMER_TYPES: {
  id: CustomerType;
  label: string;
  description: string;
}[] = [
  {
    id: "Architect / Interior Designer",
    label: "Architect / Designer",
    description: "Specs, CAD files & trade tiering",
  },
  {
    id: "Home Owner",
    label: "Home Owner",
    description: "Touch, feel & luxury hardware",
  },
  {
    id: "Builder / Project",
    label: "Builder / Project",
    description: "Volume procurement & schedules",
  },
  {
    id: "Retailer",
    label: "Retailer",
    description: "Distribution & dealer inquiries",
  },
];

const PROJECT_TYPES: ProjectType[] = [
  "Modular Kitchen",
  "Home Renovation",
  "New Home / Construction",
  "Commercial Project",
  "Door / Security",
  "Wardrobe",
  "Other",
];

const INITIAL_FORM_VALUES: FormValues = {
  customerType: "Home Owner",
  name: "",
  location: "",
  phone: "",
  projectType: "Modular Kitchen",
};

// â”€â”€ Shared style tokens â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const CLS_INPUT =
  "w-full bg-[var(--surface-raised)]/70 border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-zinc-600 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[#C8A96E]/50 transition-all";
const CLS_SELECT =
  "w-full bg-[var(--surface-raised)]/90 border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[#C8A96E]/50 transition-all cursor-pointer";
const CLS_LABEL =
  "text-[11px] text-[var(--text-secondary)] uppercase tracking-widest font-semibold";
const CLS_SUBMIT =
  "w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#C8A96E] to-[#e5c487] hover:from-[#d8b97e] hover:to-[#f0d49e] text-[#0E0C0C] font-bold text-xs uppercase tracking-[0.16em] transition-premium btn-tactile flex items-center justify-center gap-2 group disabled:opacity-60 shadow-[0_4px_20px_rgba(200,169,110,0.2)]";

// â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function ConsultationForm({ onSuccess, inline = false }: ConsultationFormProps) {
  const { context } = useConsultationStore();

  // The form mounts more than once per document â€” the inline section form and
  // the navbar drawer coexist, and the mobile and desktop trees are both in the
  // DOM. Hardcoded field ids therefore collided, which points every duplicated
  // <label for> at whichever copy happens to come first.
  const uid = useId();

  const [values, setValues] = useState<FormValues>(INITIAL_FORM_VALUES);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [successLeadId, setSuccessLeadId] = useState<string | null>(null);
  const [telegramStatus, setTelegramStatus] = useState<"sent" | "failed" | "pending">("pending");
  const [errorMsg, setErrorMsg] = useState("");

  const setField =
    <K extends keyof FormValues>(key: K) =>
    (value: FormValues[K]) =>
      setValues((prev) => ({ ...prev, [key]: value }));

  // Helper for tracking analytics
  const trackEnquirySubmitted = (leadId: string, formValues: FormValues) => {
    if (typeof window !== "undefined") {
      try {
        const win = window as unknown as { dataLayer?: Record<string, unknown>[] };
        win.dataLayer = win.dataLayer || [];
        win.dataLayer.push({
          event: "enquiry_submitted",
          lead_id: leadId,
          customer_type: formValues.customerType,
          project_type: formValues.projectType,
          source: context?.source ?? (inline ? "home" : "consultation_drawer"),
        });
      } catch {
        // Safe no-op if tracking blocked
      }
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");

    if (!values.customerType) {
      setErrorMsg("Please select who you are.");
      return;
    }
    if (!values.name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }
    if (!values.location.trim()) {
      setErrorMsg("Please enter your location.");
      return;
    }
    if (!values.phone.trim() || values.phone.replace(/\D/g, "").length < 10) {
      setErrorMsg("Please provide a valid 10-digit phone number.");
      return;
    }
    if (!values.projectType) {
      setErrorMsg("Please select your project type.");
      return;
    }

    setIsSubmitting(true);

    // Honeypot guard
    const formData = new FormData(e.currentTarget);
    if (formData.get("_honey")) {
      setSuccessLeadId("HC-HONEY");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      intent: "enquiry",
      customerType: values.customerType,
      name: values.name.trim(),
      location: values.location.trim(),
      phone: values.phone.trim(),
      projectType: values.projectType,
      source: context?.source ?? (inline ? "home" : "consultation_drawer"),
      pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as {
        success?: boolean;
        lead_id?: string;
        telegram_status?: "sent" | "failed" | "pending";
        notification_error?: string;
        error?: string;
      };

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Failed to submit enquiry. Please try again.");
      }

      const generatedId = data.lead_id ?? "HC-OK";
      setSuccessLeadId(generatedId);
      setTelegramStatus(data.telegram_status ?? "sent");

      // Track analytics event only after confirmed PostgreSQL lead creation
      trackEnquirySubmitted(generatedId, values);

      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try calling our showroom directly.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRetryNotification() {
    if (!successLeadId || isRetrying) return;
    setIsRetrying(true);

    try {
      const res = await fetch("/api/leads/retry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: successLeadId }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        telegram_status?: "sent" | "failed" | "pending";
      };

      if (data.telegram_status) {
        setTelegramStatus(data.telegram_status);
      }
    } catch (err) {
      console.error("Retry failed:", err);
    } finally {
      setIsRetrying(false);
    }
  }

  // â”€â”€ Success Screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  if (successLeadId) {
    return (
      <div
        className={
          inline
            ? "bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 lg:p-10 min-h-[460px] flex flex-col items-center justify-center"
            : "h-full flex flex-col items-center justify-center p-6"
        }
      >
        <ConsultationSuccess leadId={successLeadId} />

        {/* Recoverable Retry Alert if Telegram notification failed on server */}
        {telegramStatus === "failed" && (
          <div className="mt-4 p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-200/90 max-w-md w-full">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>We&apos;re having trouble alerting our team in real-time.</span>
            </div>
            <button
              type="button"
              onClick={handleRetryNotification}
              disabled={isRetrying}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isRetrying ? "animate-spin" : ""}`} />
              <span>Retry</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // â”€â”€ Form Screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  return (
    <div
      className={`flex flex-col text-[var(--text-primary)] font-dmsans ${
        inline
          ? "w-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          : "p-6 lg:p-8"
      }`}
    >
      {/* Header. Inline, this form sits beside the section's own heading and intro,
          so it takes only the eyebrow as a label â€” repeating the headline verbatim
          in both columns read as a duplication bug. The drawer has no surrounding
          copy, so there it still carries the full heading. */}
      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--accent)] font-semibold mb-1">
          DIRECT ENQUIRY Â· SAKCHI SHOWROOM
        </p>
        {!inline && (
          <>
            <h2
              className="font-cormorant text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight text-[var(--text-primary)] mb-2"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Let&apos;s discuss your project.
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
              Tell us who you are and what you&apos;re building. Our showroom specialists will prepare recommendations immediately.
            </p>
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Honeypot for bot filtering */}
        <input type="text" name="_honey" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

        {/* Step 1: Customer Type Cards */}
        <div className="flex flex-col gap-2.5">
          <span className={CLS_LABEL} id={`${uid}-customer-type-label`}>WHO ARE YOU? *</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-labelledby={`${uid}-customer-type-label`}>
            {CUSTOMER_TYPES.map((type) => {
              const isSelected = values.customerType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setField("customerType")(type.id)}
                  role="radio"
                  aria-checked={isSelected}
                  className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 relative ${
                    isSelected
                      ? "bg-[#C8A96E]/10 border-[var(--accent)] shadow-[0_0_15px_rgba(200,169,110,0.15)]"
                      : "bg-[var(--surface-raised)]/40 border-[var(--border)] hover:border-zinc-700 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-bold tracking-wide ${
                        isSelected ? "text-[var(--text-primary)]" : "text-[var(--text-primary)]"
                      }`}
                    >
                      {type.label}
                    </span>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-[#C8A96E] flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-black font-bold" />
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] text-[var(--text-secondary)] font-light">{type.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Details Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={CLS_LABEL} htmlFor={`${uid}-name`}>YOUR NAME *</label>
            <input
              id={`${uid}-name`}
              name="name"
              autoComplete="name"
              required
              type="text"
              value={values.name}
              onChange={(e) => setField("name")(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className={CLS_INPUT}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={CLS_LABEL} htmlFor={`${uid}-location`}>LOCATION *</label>
            <input
              id={`${uid}-location`}
              name="location"
              autoComplete="address-level2"
              required
              type="text"
              value={values.location}
              onChange={(e) => setField("location")(e.target.value)}
              placeholder="e.g. Sakchi, Jamshedpur"
              className={CLS_INPUT}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={CLS_LABEL} htmlFor={`${uid}-phone`}>PHONE NUMBER *</label>
            <input
              id={`${uid}-phone`}
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              required
              type="tel"
              value={values.phone}
              onChange={(e) => setField("phone")(e.target.value)}
              placeholder="e.g. 9876543210"
              className={CLS_INPUT}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={CLS_LABEL} htmlFor={`${uid}-project-type`}>PROJECT TYPE *</label>
            <select
              id={`${uid}-project-type`}
              name="projectType"
              value={values.projectType}
              onChange={(e) => setField("projectType")(e.target.value as ProjectType)}
              className={CLS_SELECT}
            >
              {PROJECT_TYPES.map((pt) => (
                <option key={pt} value={pt} className="bg-[var(--surface)] text-[var(--text-primary)]">
                  {pt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <p className="text-red-400 text-xs bg-red-950/40 border border-red-900/60 p-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </p>
        )}

        {/* Submit CTA */}
        <button type="submit" disabled={isSubmitting} className={CLS_SUBMIT}>
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Submit Enquiry</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>

        <p className="text-center text-[var(--text-secondary)] text-[11px] font-light -mt-2">
          Your details are directly routed to the Sakchi showroom team.
        </p>
      </form>
    </div>
  );
}

