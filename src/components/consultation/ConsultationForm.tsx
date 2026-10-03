"use client";

import React, { useState, useId, useRef, useEffect } from "react";
import { ConsultationSuccess } from "./ConsultationSuccess";
import { useConsultationStore } from "./store";
import { parseLeadResponse } from "@/lib/leads/response";
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
  "w-full bg-transparent border-b border-[#181514]/15 hover:border-[#181514]/35 focus:border-[#6E152B] pb-3 text-[17px] xl:text-[18px] text-[#181514] placeholder:text-[#8C8681] focus:outline-none transition-colors duration-200 rounded-none";
const CLS_LABEL = "text-[11px] uppercase tracking-[0.25em] text-[#7C7671] font-semibold mb-2 block";

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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      setErrorMsg("Please provide a valid 10-digit WhatsApp number.");
      return;
    }
    if (!values.projectType) {
      setErrorMsg("Please select what you are looking for.");
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
      location: values.location?.trim() || "Sakchi, Jamshedpur",
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

      const body: unknown = await res.json().catch(() => null);
      const result = parseLeadResponse(res.ok, body);

      if (!result.ok) {
        throw new Error(result.message);
      }

      setSuccessLeadId(result.leadId);
      setTelegramStatus(result.telegramStatus);

      // Track analytics event only after confirmed PostgreSQL lead creation
      trackEnquirySubmitted(result.leadId, values);

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
            ? "w-full min-h-[420px] flex flex-col items-center justify-center py-8"
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
    <div className={`flex flex-col text-[#181514] font-dmsans ${inline ? "w-full" : "p-6 lg:p-8 h-full justify-between"}`}>
      {/* Form Editorial Header */}
      <div className="mb-8 lg:mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-6 h-[1px] bg-[#181514]/50 shrink-0" aria-hidden="true" />
          <span className="text-[12px] uppercase tracking-[0.25em] text-[#181514] font-semibold font-dmsans">
            Request a Consultation
          </span>
        </div>
        <p className="text-[17px] lg:text-[18px] text-[#3D3834] font-normal leading-relaxed max-w-sm">
          Share a few details and our showroom team will get in touch with you shortly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col pt-2">
        {/* Honeypot for bot filtering */}
        <input type="text" name="_honey" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

        {/* Form Fields Stack */}
        <div className="space-y-6 lg:space-y-8">
          {/* 1. Name */}
          <div className="flex flex-col">
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
              placeholder="Aayush Sharma"
              className={CLS_FIELD}
            />
          </div>

          {/* 2. WhatsApp Number */}
          <div className="flex flex-col">
            <label className={CLS_LABEL} htmlFor={`${uid}-phone`}>
              WhatsApp Number
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
              placeholder="+91 12345 67890"
              className={CLS_FIELD}
            />
          </div>

          {/* 3. Looking For (Project Type) */}
          <div className="flex flex-col">
            <label className={CLS_LABEL} htmlFor={`${uid}-project-type`}>
              Looking For
            </label>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                id={`${uid}-project-type`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full bg-transparent border-b border-[#181514]/15 hover:border-[#181514]/35 focus:border-[#6E152B] pb-3 text-[17px] xl:text-[18px] text-[#181514] flex items-center justify-between focus:outline-none transition-colors duration-200 rounded-none ${!values.projectType ? "text-[#8C8681]" : ""}`}
              >
                <span className="truncate">
                  {values.projectType || "Select Project Type"}
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className={`shrink-0 ml-4 w-5 h-5 text-[#1a1017]/70 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              
              {/* Dropdown Menu */}
              <div
                className={`absolute left-0 right-0 top-[calc(100%+8px)] z-50 bg-[#FAF8F5] border border-[#181514]/10 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-300 origin-top ${
                  isDropdownOpen ? "opacity-100 scale-y-100 visible" : "opacity-0 scale-y-95 invisible"
                }`}
              >
                <div className="max-h-[280px] overflow-y-auto flex flex-col py-2">
                  {PROJECT_TYPES.map((pt) => (
                    <button
                      key={pt}
                      type="button"
                      onClick={() => {
                        setField("projectType")(pt);
                        setIsDropdownOpen(false);
                      }}
                      className={`text-left px-5 py-3.5 text-[16px] transition-colors ${
                        values.projectType === pt 
                          ? "bg-[#6E152B]/5 text-[#6E152B] font-medium" 
                          : "text-[#3D3834] hover:bg-[#181514]/5 hover:text-[#181514]"
                      }`}
                    >
                      {pt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Error message */}
          {errorMsg && (
            <p
              role="alert"
              aria-live="assertive"
              className="text-[12.5px] text-[#721536] bg-[#721536]/[0.06] border border-[#721536]/[0.18] px-3 py-2 rounded-lg flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-[#721536]" />
              <span>{errorMsg}</span>
            </p>
          )}
        </div>

        {/* 4. Submit CTA — Editorial Send Enquiry with Circular Arrow Button */}
        <div className="pt-12 lg:pt-16">
          <button
            type="submit"
            disabled={isSubmitting}
            className="group flex items-center justify-between w-full cursor-pointer disabled:opacity-60 transition-all focus:outline-none"
          >
            <span className="text-[13px] font-bold uppercase tracking-[0.24em] text-[#6E152B] transition-colors group-hover:text-[#520e20]">
              Send Enquiry
            </span>
            <div className="flex-1 h-[1px] bg-[#6E152B]/20 mx-6 group-hover:bg-[#6E152B]/40 transition-colors" />
            <div className="relative flex items-center justify-center shrink-0">
              {/* Outer soft halo */}
              <div className="w-12 h-12 rounded-full bg-[#6E152B]/[0.08] flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-[#6E152B]/[0.14] group-active:scale-95">
                {/* Inner circular button */}
                <div className="w-10 h-10 rounded-full bg-[#6E152B] group-hover:bg-[#581123] flex items-center justify-center text-white transition-transform duration-300 group-hover:translate-x-0.5 shadow-sm">
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}
