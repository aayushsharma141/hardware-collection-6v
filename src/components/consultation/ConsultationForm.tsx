"use client";

import React, { useState, useEffect } from "react";
import { ConsultationSuccess } from "./ConsultationSuccess";
import { useConsultationStore } from "./store";
import { ConsultationContext } from "./ConsultationContext";
import { CATEGORIES } from "@/data/catalog";
import { buildWhatsAppUrl } from "@/lib/config";
import {
  Loader2, ArrowRight, ArrowLeft,
  Building2, PhoneCall, Calendar, Clock, MapPin,
} from "lucide-react";
import { motion } from "motion/react";

// ── Types ─────────────────────────────────────────────────────────────────────

type FormIntent = "consultation" | "enquiry" | "callback";
type ConsultationMode = "showroom" | "whatsapp" | "flexible";

interface FormValues {
  name: string;
  phone: string;
  email: string;
  projectType: string;
  category: string;
  consultationMode: ConsultationMode;
  consultationDate: string;
  consultationTime: string;
  quantity: string;
  message: string;
}

interface LeadPayload {
  intent: FormIntent;
  name: string;
  phone: string;
  email?: string;
  source?: string;
  pageUrl?: string;
  message?: string;
  projectType?: string;
  interest?: string;
  consultationDate?: string;
  consultationTime?: string;
  consultationMode?: ConsultationMode;
  selectedProducts?: ConsultationContext["selectedProducts"];
  category?: string;
  brand?: string;
  product?: string;
  quantity?: string;
}

interface ConsultationFormProps {
  onSuccess?: () => void;
  inline?: boolean;
}

// ── Static data ───────────────────────────────────────────────────────────────

const INITIAL_FORM_VALUES: FormValues = {
  name: "",
  phone: "",
  email: "",
  projectType: "",
  category: "",
  consultationMode: "showroom",
  consultationDate: "",
  consultationTime: "",
  quantity: "",
  message: "",
};

const PROJECT_TYPES = [
  { value: "Home Renovation",           label: "Home Renovation" },
  { value: "New Home / Construction",   label: "New Home / Construction" },
  { value: "Modular Kitchen",           label: "Modular Kitchen" },
  { value: "Wardrobe Systems",          label: "Wardrobe Systems" },
  { value: "Door & Security",           label: "Door & Security" },
  { value: "Commercial Project",        label: "Commercial Project" },
  { value: "Architect / Designer",      label: "Architect / Interior Designer" },
  { value: "Contractor / Builder",      label: "Contractor / Builder" },
];

const INTENT_TABS: { id: FormIntent; label: string }[] = [
  { id: "consultation", label: "CONSULTATION" },
  { id: "enquiry",      label: "PRODUCT ENQUIRY" },
  { id: "callback",     label: "REQUEST CALLBACK" },
];

const CONSULTATION_MODES: {
  id: ConsultationMode;
  label: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  recommended?: boolean;
}[] = [
  { id: "showroom",  label: "SHOWROOM",  sub: "Live tactile demo", icon: MapPin,     recommended: true },
  { id: "whatsapp",  label: "WHATSAPP",  sub: "Photos & catalog",  icon: PhoneCall },
  { id: "flexible",  label: "EITHER",    sub: "Flexible",          icon: Building2 },
];

const CATEGORY_PILLS = [
  { label: "Digital Locks",     value: "Digital Locks & Smart Access" },
  { label: "Modular Kitchen",   value: "Modular Kitchen Hardware" },
  { label: "Door Hardware",     value: "Main Door & Entrance Systems" },
  { label: "Wardrobe Systems",  value: "Wardrobe & Sliding Systems" },
  { label: "Complete Package",  value: "Complete Architectural Package" },
];

const NAMED_TIME_WINDOWS = [
  "Morning (10:30 AM – 01:00 PM)",
  "Afternoon (01:00 PM – 04:30 PM)",
  "Evening (04:30 PM – 07:30 PM)",
] as const;

const SHOWROOM_HOURS_ANYTIME = "Anytime during showroom hours (10 AM – 8 PM)";

// ── Shared style tokens ───────────────────────────────────────────────────────

const CLS_INPUT =
  "w-full bg-zinc-900/60 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#C8A96E] transition-all";
const CLS_SELECT =
  "w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8A96E] transition-all cursor-pointer";
const CLS_LABEL =
  "text-[11px] text-zinc-400 uppercase tracking-widest font-medium";
const CLS_SUBMIT =
  "py-3.5 px-6 rounded-full bg-gradient-to-r from-[#C8A96E] to-[#e5c487] hover:from-[#d8b97e] hover:to-[#f0d49e] text-[#0E0C0C] font-bold text-xs uppercase tracking-[0.16em] transition-all flex items-center justify-center gap-2 group disabled:opacity-60";

// ── Pure helper ───────────────────────────────────────────────────────────────

function buildPayload(
  intent: FormIntent,
  values: FormValues,
  context: ConsultationContext | null,
  inline: boolean,
): LeadPayload {
  const base: LeadPayload = {
    intent,
    name: values.name,
    phone: values.phone,
    email: values.email.trim() || undefined,
    source: context?.source ?? "home",
    pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
    message: values.message.trim() || undefined,
  };

  if (intent === "consultation") {
    return {
      ...base,
      projectType: values.projectType || undefined,
      interest: values.category || undefined,
      consultationDate: values.consultationDate || undefined,
      consultationTime: values.consultationTime || undefined,
      consultationMode: values.consultationMode,
      selectedProducts: context?.selectedProducts,
    };
  }

  if (intent === "enquiry") {
    return {
      ...base,
      category: context?.category?.name ?? values.category ?? undefined,
      brand: context?.brand?.name ?? undefined,
      product: context?.product?.name ?? undefined,
      quantity: values.quantity.trim() || undefined,
      projectType: values.projectType || undefined,
    };
  }

  // callback
  return { ...base, consultationTime: values.consultationTime || undefined };
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface SubmitButtonProps {
  label: string;
  isSubmitting: boolean;
  /** When false, uses flex-1 instead of w-full (for side-by-side Back/Submit row). */
  fullWidth?: boolean;
}

function SubmitButton({ label, isSubmitting, fullWidth = true }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`${fullWidth ? "w-full" : "flex-1"} ${CLS_SUBMIT}`}
    >
      {isSubmitting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          <span>{label}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </>
      )}
    </button>
  );
}

interface ContactFieldsProps {
  name: string;
  phone: string;
  namePlaceholder: string;
  onNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
}

/** Shared name + phone/WhatsApp input row — used by all three intent branches. */
function ContactFields({
  name,
  phone,
  namePlaceholder,
  onNameChange,
  onPhoneChange,
}: ContactFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div className="flex flex-col gap-1.5">
        <label className={CLS_LABEL}>YOUR NAME *</label>
        <input
          required
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={namePlaceholder}
          className={CLS_INPUT}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className={CLS_LABEL}>PHONE / WHATSAPP *</label>
        <input
          required
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="e.g. +91 98351 90738"
          className={CLS_INPUT}
        />
      </div>
    </div>
  );
}

interface StepIndicatorProps {
  step: 1 | 2;
  /** Label shown as "Next: {next}" on step 1. */
  next?: string;
  /** Back handler shown only on step 2. */
  onBack?: () => void;
}

function StepIndicator({ step, next, onBack }: StepIndicatorProps) {
  const title = step === 1 ? "Project Details" : "Timing & Details";
  return (
    <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-zinc-500 font-medium pb-2 border-b border-zinc-900">
      <span>Step {step} of 2 · {title}</span>
      {step === 1 && next && (
        <span className="text-[#C8A96E]">Next: {next}</span>
      )}
      {step === 2 && onBack && (
        <button
          type="button"
          onClick={onBack}
          className="text-[#C8A96E] hover:underline inline-flex items-center gap-1 text-[11px]"
        >
          <ArrowLeft className="w-3 h-3" /> Back
        </button>
      )}
    </div>
  );
}

interface TimeWindowSelectProps {
  value: string;
  onChange: (v: string) => void;
  /** "consultation" adds a blank default + Flexible option. "callback" adds Anytime during showroom hours. */
  mode: "consultation" | "callback";
  required?: boolean;
}

function TimeWindowSelect({ value, onChange, mode, required }: TimeWindowSelectProps) {
  return (
    <select
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={CLS_SELECT}
    >
      {mode === "consultation" && <option value="">Select Preferred Time</option>}
      {mode === "callback" && (
        <option value={SHOWROOM_HOURS_ANYTIME}>{SHOWROOM_HOURS_ANYTIME}</option>
      )}
      {NAMED_TIME_WINDOWS.map((t) => (
        <option key={t} value={t}>{t}</option>
      ))}
      {mode === "consultation" && (
        <option value="Flexible / Anytime">Flexible / Anytime</option>
      )}
    </select>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ConsultationForm({ onSuccess, inline = false }: ConsultationFormProps) {
  const { context } = useConsultationStore();

  const [intent, setIntent] = useState<FormIntent>(context?.intent ?? "consultation");
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successLeadId, setSuccessLeadId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [values, setValues] = useState<FormValues>({
    ...INITIAL_FORM_VALUES,
    category: context?.category?.name ?? "",
  });

  /** Type-safe single-field updater — avoids one setter per field. */
  const setField =
    <K extends keyof FormValues>(key: K) =>
    (value: FormValues[K]) =>
      setValues((prev) => ({ ...prev, [key]: value }));

  // Sync if the drawer context changes after mount
  useEffect(() => {
    if (context?.intent) setIntent(context.intent);
    if (context?.category?.name) setField("category")(context.category.name);
    if (context?.product?.name) setIntent("enquiry");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);

  const handleIntentChange = (newIntent: FormIntent) => {
    setIntent(newIntent);
    setStep(1);
    setErrorMsg("");
  };

  const handleStep1Continue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.name.trim() || !values.phone.trim()) {
      setErrorMsg("Please provide your name and phone number.");
      return;
    }
    setErrorMsg("");
    setStep(2);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    // Honeypot guard
    const formData = new FormData(e.currentTarget);
    if (formData.get("_honey")) {
      setSuccessLeadId("HC-HONEY");
      setIsSubmitting(false);
      return;
    }

    const payload = buildPayload(intent, values, context, inline);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json() as { lead_id?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to submit request.");
      setSuccessLeadId(data.lead_id ?? "HC-OK");
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again or call our showroom directly.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────

  if (successLeadId) {
    return (
      <div
        className={
          inline
            ? "bg-zinc-950 border border-zinc-850 rounded-2xl p-8 lg:p-10 min-h-[460px] flex items-center justify-center"
            : "h-full flex items-center justify-center p-6"
        }
      >
        <ConsultationSuccess leadId={successLeadId} intent={intent} />
      </div>
    );
  }

  // ── Form screen ─────────────────────────────────────────────────────────────

  return (
    <div
      className={`flex flex-col text-white font-dmsans ${
        inline
          ? "bg-zinc-950 border border-white/[0.08] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          : "p-6 lg:p-8"
      }`}
    >
      {/* Context Banner — product enquiry */}
      {context?.product && (
        <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-[#C8A96E]/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 px-2.5 py-0.5 bg-[#C8A96E]/15 text-[#C8A96E] text-[10px] uppercase font-bold tracking-widest rounded-bl-lg">
            PRODUCT ENQUIRY
          </div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#C8A96E] font-medium mb-1">
            {context.brand?.name ?? "ARCHITECTURAL HARDWARE"} · {context.category?.name ?? "CATALOG ITEM"}
          </p>
          <h3 className="text-sm font-semibold text-white tracking-wide">{context.product.name}</h3>
          <p className="text-[11px] text-zinc-400 mt-1">
            We will check physical showroom stock &amp; technical specifications for this unit.
          </p>
        </div>
      )}

      {/* Context Banner — shortlist */}
      {context?.selectedProducts && context.selectedProducts.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-[#C8A96E]/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-widest text-[#C8A96E] font-bold">
              SHORTLIST CONSULTATION ({context.selectedProducts.length} ITEMS)
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {context.selectedProducts.map((p, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-xs text-zinc-200"
              >
                <span className="text-[#C8A96E] text-[10px]">✦</span> {p.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#C8A96E] font-semibold mb-1">
          PRIVATE CONSULTATION · SAKCHI
        </p>
        <h2
          className="font-cormorant text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight text-white mb-2"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Let&apos;s discuss your project.
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
          Tell us what you&apos;re working on. Our specialists will prepare technical specifications and physical
          showroom specimens.
        </p>
      </div>

      {/* Category interest quick-pick pills */}
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium mb-2.5">
          WHAT ARE YOU LOOKING FOR?
        </p>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_PILLS.map((pill) => {
            const isSelected = values.category === pill.value;
            return (
              <button
                key={pill.value}
                type="button"
                onClick={() => setField("category")(isSelected ? "" : pill.value)}
                className={`px-3.5 py-2 rounded-full text-xs font-light tracking-wide transition-all duration-200 ${
                  isSelected
                    ? "bg-[#C8A96E] text-black font-medium border border-[#C8A96E]"
                    : "bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white"
                }`}
              >
                {isSelected && <span className="mr-1.5 font-bold">✓</span>}
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Intent tab navigation */}
      <div className="flex items-center border-b border-zinc-800/80 mb-6 overflow-x-auto no-scrollbar">
        {INTENT_TABS.map((tab) => {
          const isActive = intent === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleIntentChange(tab.id)}
              className={`relative py-2.5 px-3.5 text-xs font-semibold tracking-[0.14em] uppercase whitespace-nowrap transition-colors duration-200 focus-visible:outline-none ${
                isActive ? "text-[#C8A96E]" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="intent-active-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C8A96E]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Form ─────────────────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Honeypot */}
        <input type="text" name="_honey" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

        {/* ── CONSULTATION ─────────────────────────────────────────────────── */}
        {intent === "consultation" && (
          <>
            {step === 1 && (
              <div className="space-y-6">
                <StepIndicator step={1} next="Preferred Visit Time" />

                <ContactFields
                  name={values.name}
                  phone={values.phone}
                  namePlaceholder="e.g. Vikram Sharma"
                  onNameChange={setField("name")}
                  onPhoneChange={setField("phone")}
                />

                {/* Project type & category selects */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className={CLS_LABEL}>WHAT ARE YOU WORKING ON?</label>
                    <select
                      value={values.projectType}
                      onChange={(e) => setField("projectType")(e.target.value)}
                      className={CLS_SELECT}
                    >
                      <option value="">Select Project Type</option>
                      {PROJECT_TYPES.map((pt) => (
                        <option key={pt.value} value={pt.value} className="bg-zinc-950 text-white">
                          {pt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={CLS_LABEL}>WHAT CAN WE HELP WITH?</label>
                    <select
                      value={values.category}
                      onChange={(e) => setField("category")(e.target.value)}
                      className={CLS_SELECT}
                    >
                      <option value="">Select Canonical Collection</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.title} className="bg-zinc-950 text-white">
                          {cat.title}
                        </option>
                      ))}
                      <option value="Complete Architectural Package" className="bg-zinc-950 text-white">
                        Complete Architectural Package
                      </option>
                    </select>
                  </div>
                </div>

                {/* Preferred consultation mode */}
                <div className="flex flex-col gap-2">
                  <label className={CLS_LABEL}>HOW WOULD YOU LIKE TO CONSULT?</label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {CONSULTATION_MODES.map((mode) => {
                      const isActive = values.consultationMode === mode.id;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setField("consultationMode")(mode.id)}
                          className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 relative ${
                            isActive
                              ? "bg-[#C8A96E]/10 border-[#C8A96E]"
                              : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white"
                          }`}
                        >
                          {mode.recommended && (
                            <span className="absolute -top-2 right-2 px-1.5 py-0.2 bg-[#C8A96E] text-[9px] font-bold uppercase text-black rounded tracking-wider">
                              RECOMMENDED
                            </span>
                          )}
                          <div className="flex items-center gap-1.5 mb-1">
                            <mode.icon className={`w-3.5 h-3.5 ${isActive ? "text-[#C8A96E]" : "text-zinc-500"}`} />
                            <span
                              className={`text-[11px] font-bold tracking-wider uppercase ${
                                isActive ? "text-white" : "text-zinc-300"
                              }`}
                            >
                              {mode.label}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-500 font-light">{mode.sub}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleStep1Continue}
                  className="w-full mt-2 py-3.5 px-6 rounded-full bg-gradient-to-r from-[#C8A96E] to-[#e5c487] hover:from-[#d8b97e] hover:to-[#f0d49e] text-[#0E0C0C] font-bold text-xs uppercase tracking-[0.16em] transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Continue to Timing</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <StepIndicator step={2} onBack={() => setStep(1)} />

                {/* Date & time window */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className={`${CLS_LABEL} flex items-center gap-1.5`}>
                      <Calendar className="w-3.5 h-3.5 text-[#C8A96E]" /> PREFERRED DATE
                    </label>
                    <input
                      type="date"
                      value={values.consultationDate}
                      onChange={(e) => setField("consultationDate")(e.target.value)}
                      className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8A96E] transition-all [color-scheme:dark]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={`${CLS_LABEL} flex items-center gap-1.5`}>
                      <Clock className="w-3.5 h-3.5 text-[#C8A96E]" /> PREFERRED TIME WINDOW
                    </label>
                    <TimeWindowSelect
                      value={values.consultationTime}
                      onChange={setField("consultationTime")}
                      mode="consultation"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-zinc-500 italic -mt-2">
                  * Our showroom team will confirm your preferred time on WhatsApp.
                </p>

                <div className="flex flex-col gap-1.5">
                  <label className={CLS_LABEL}>EMAIL ADDRESS (OPTIONAL)</label>
                  <input
                    type="email"
                    value={values.email}
                    onChange={(e) => setField("email")(e.target.value)}
                    placeholder="For technical blueprints or estimates"
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#C8A96E] transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={CLS_LABEL}>ANYTHING SPECIFIC YOU&apos;D LIKE US TO PREPARE?</label>
                  <textarea
                    rows={2}
                    value={values.message}
                    onChange={(e) => setField("message")(e.target.value)}
                    placeholder="e.g. Looking for black PVD finish, mortise locks, tandem drawers..."
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#C8A96E] transition-all resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-3.5 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 text-xs font-semibold tracking-wider uppercase transition-colors"
                  >
                    Back
                  </button>
                  <SubmitButton label="Request Consultation" isSubmitting={isSubmitting} fullWidth={false} />
                </div>
              </div>
            )}
          </>
        )}

        {/* ── PRODUCT ENQUIRY ──────────────────────────────────────────────── */}
        {intent === "enquiry" && (
          <div className="space-y-5">
            <ContactFields
              name={values.name}
              phone={values.phone}
              namePlaceholder="e.g. Rajiv Sharma"
              onNameChange={setField("name")}
              onPhoneChange={setField("phone")}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className={CLS_LABEL}>PROJECT TYPE</label>
                <select
                  value={values.projectType}
                  onChange={(e) => setField("projectType")(e.target.value)}
                  className={CLS_SELECT}
                >
                  <option value="">Select Project Type</option>
                  {PROJECT_TYPES.map((pt) => (
                    <option key={pt.value} value={pt.value} className="bg-zinc-950 text-white">
                      {pt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={CLS_LABEL}>ESTIMATED QUANTITY (OPTIONAL)</label>
                <input
                  type="text"
                  value={values.quantity}
                  onChange={(e) => setField("quantity")(e.target.value)}
                  placeholder="e.g. 1 unit, 8 doors, 1 villa"
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#C8A96E] transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={CLS_LABEL}>SPECIFIC QUESTIONS OR REQUIREMENTS</label>
              <textarea
                rows={3}
                value={values.message}
                onChange={(e) => setField("message")(e.target.value)}
                placeholder="Ask about dimensions, finish availability in showroom, lead times, or pricing..."
                className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#C8A96E] transition-all resize-none"
              />
            </div>

            <SubmitButton label="Send Enquiry" isSubmitting={isSubmitting} />
          </div>
        )}

        {/* ── CALLBACK ─────────────────────────────────────────────────────── */}
        {intent === "callback" && (
          <div className="space-y-5">
            <ContactFields
              name={values.name}
              phone={values.phone}
              namePlaceholder="e.g. Anita Sen"
              onNameChange={setField("name")}
              onPhoneChange={setField("phone")}
            />

            <div className="flex flex-col gap-1.5">
              <label className={`${CLS_LABEL} flex items-center gap-1.5`}>
                <Clock className="w-3.5 h-3.5 text-[#C8A96E]" /> CONVENIENT CALLBACK WINDOW *
              </label>
              <TimeWindowSelect
                value={values.consultationTime}
                onChange={setField("consultationTime")}
                mode="callback"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={CLS_LABEL}>BRIEF TOPIC (OPTIONAL)</label>
              <input
                type="text"
                value={values.message}
                onChange={(e) => setField("message")(e.target.value)}
                placeholder="e.g. Dorset biometric lock pricing, Hafele tandem boxes"
                className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#C8A96E] transition-all"
              />
            </div>

            <SubmitButton label="Request Callback" isSubmitting={isSubmitting} />
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <p className="text-red-400 text-xs bg-red-950/40 border border-red-900/60 p-3 rounded-lg">
            {errorMsg}
          </p>
        )}

        <p className="text-center text-zinc-500 text-[11px] font-light mt-1">
          Your details are used only to respond to this request.
        </p>

        {/* Direct WhatsApp alternative */}
        <div className="pt-3 border-t border-zinc-900/80 text-center space-y-1">
          <p className="text-xs text-zinc-400 font-light">Prefer immediate answers?</p>
          <a
            href={buildWhatsAppUrl(
              "Hi Hardware Collection, I would like to consult on architectural hardware for my project.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#C8A96E] hover:text-white text-xs tracking-wider uppercase font-medium transition-colors"
          >
            Chat with the Showroom on WhatsApp →
          </a>
        </div>
      </form>
    </div>
  );
}
