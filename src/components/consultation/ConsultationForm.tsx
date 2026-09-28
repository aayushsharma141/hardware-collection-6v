"use client";

import React, { useState, useId } from "react";
import { ConsultationSuccess } from "./ConsultationSuccess";
import { useConsultationStore } from "./store";
import { Loader2, AlertCircle, RefreshCw, ChevronDown } from "lucide-react";

// ── Types ───────────────────────────────────────────────────────────────────

type ProjectType =
  | "Modular Kitchen"
  | "Home Renovation"
  | "New Home / Construction"
  | "Commercial Project"
  | "Door / Security"
  | "Wardrobe"
  | "Other";

interface FormValues {
  name: string;
  phone: string;
  location: string;
  projectType: ProjectType | "";
}

interface ConsultationFormProps {
  onSuccess?: () => void;
  inline?: boolean;
}

// ── Constants ───────────────────────────────────────────────────────────────

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
  name: "",
  phone: "",
  location: "",
  projectType: "Modular Kitchen",
};

// ── Shared style tokens ─────────────────────────────────────────────────────

const CLS_FIELD =
  "w-full bg-transparent border-b border-[#1a1017]/[0.15] hover:border-[#1a1017]/[0.35] focus:border-[#8b1a42] pb-2.5 text-[15px] text-[#1a1017] placeholder:text-[#7a6872]/45 focus:outline-none transition-colors duration-200";
const CLS_SELECT = `${CLS_FIELD} appearance-none pr-8 cursor-pointer`;
const CLS_LABEL = "text-[11.5px] uppercase tracking-[0.14em] text-[#6a5a64] font-medium";
const CLS_SUBMIT =
  "w-full mt-2 py-4 px-6 rounded-full bg-[#8b1a42] hover:bg-[#721536] active:scale-[0.99] active:translate-y-[0.5px] text-white font-medium text-[13px] uppercase tracking-[0.16em] transition-all duration-200 flex items-center justify-center disabled:opacity-60 cursor-pointer shadow-[0_4px_16px_rgba(139,26,66,0.18)] hover:shadow-[0_6px_22px_rgba(139,26,66,0.26)]";

// ── Main Component ──────────────────────────────────────────────────────────

export function ConsultationForm({ onSuccess, inline = false }: ConsultationFormProps) {
  const { context } = useConsultationStore();

  // The form mounts more than once per document — the inline section form and
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

    if (!values.name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }
    if (!values.phone.trim() || values.phone.replace(/\D/g, "").length < 10) {
      setErrorMsg("Please provide a valid 10-digit phone number.");
      return;
    }
    if (!values.location.trim()) {
      setErrorMsg("Please enter your location.");
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
      name: values.name.trim(),
      phone: values.phone.trim(),
      location: values.location.trim(),
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

  // ── Success Screen ─────────────────────────────────────────────────────────

  if (successLeadId) {
    return (
      <div
        className={
          inline
            ? "bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 lg:p-10 min-h-[420px] flex flex-col items-center justify-center"
            : "h-full flex flex-col items-center justify-center p-6"
        }
      >
        <ConsultationSuccess leadId={successLeadId} />

        {/* Recoverable Retry Alert if Telegram notification failed on server */}
        {telegramStatus === "failed" && (
          <div className="mt-4 p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl flex items-center justify-between gap-3 text-[13px] text-amber-200/90 max-w-md w-full">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>We&apos;re having trouble alerting our team in real-time.</span>
            </div>
            <button
              type="button"
              onClick={handleRetryNotification}
              disabled={isRetrying}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isRetrying ? "animate-spin" : ""}`} />
              <span>Retry</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Form Screen ────────────────────────────────────────────────────────────

  return (
    <div
      className={`flex flex-col text-[var(--text-primary)] font-dmsans ${
        inline
          ? "w-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 lg:p-10"
          : "p-6 lg:p-8"
      }`}
    >
      {/* Inline, this form sits beside the section's own heading and intro, so it
          carries no header of its own. The drawer has no surrounding copy, so
          there it still gets a single line of context. */}
      {!inline && (
        <div className="mb-8">
          <h2
            className="font-cormorant text-2xl sm:text-3xl font-normal tracking-tight text-[var(--text-primary)]"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Let&apos;s discuss your project.
          </h2>
          <p className="t-body-sm text-[var(--text-secondary)] font-light mt-2">
            Four details, and our Sakchi team will call you back.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Honeypot for bot filtering */}
        <input type="text" name="_honey" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

        <div className="flex flex-col gap-1.5">
          <label className={CLS_LABEL} htmlFor={`${uid}-name`}>
            Name
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            autoComplete="name"
            required
            type="text"
            value={values.name}
            onChange={(e) => setField("name")(e.target.value)}
            placeholder="Rahul Sharma"
            className={CLS_FIELD}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={CLS_LABEL} htmlFor={`${uid}-phone`}>
            Phone
          </label>
          <input
            id={`${uid}-phone`}
            name="phone"
            autoComplete="tel"
            inputMode="tel"
            required
            type="tel"
            value={values.phone}
            onChange={(e) => setField("phone")(e.target.value)}
            placeholder="9876543210"
            className={CLS_FIELD}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={CLS_LABEL} htmlFor={`${uid}-location`}>
            Location
          </label>
          <input
            id={`${uid}-location`}
            name="location"
            autoComplete="address-level2"
            required
            type="text"
            value={values.location}
            onChange={(e) => setField("location")(e.target.value)}
            placeholder="Sakchi, Jamshedpur"
            className={CLS_FIELD}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={CLS_LABEL} htmlFor={`${uid}-project-type`}>
            Project
          </label>
          <div className="relative">
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
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]"
            />
          </div>
        </div>

        {/* Error message (WCAG 4.1.3 & 3.3.1) */}
        {errorMsg && (
          <p
            role="alert"
            aria-live="assertive"
            className="text-[13px] text-[#8b1a42] bg-[#8b1a42]/[0.06] border border-[#8b1a42]/[0.18] px-3.5 py-2.5 rounded-xl flex items-center gap-2.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-[#8b1a42]" />
            <span>{errorMsg}</span>
          </p>
        )}

        {/* Submit CTA */}
        <button type="submit" disabled={isSubmitting} className={CLS_SUBMIT}>
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Send enquiry</span>}
        </button>
      </form>
    </div>
  );
}
