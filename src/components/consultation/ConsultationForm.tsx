"use client";

import React, { useState, useEffect } from "react";
import { ConsultationSuccess } from "./ConsultationSuccess";
import { useConsultationStore } from "./store";
import { CATEGORIES } from "@/data/catalog";
import { Loader2, ArrowRight, ArrowLeft, Building2, PhoneCall, Calendar, Clock, MapPin } from "lucide-react";
import { motion } from "motion/react";

interface ConsultationFormProps {
  onSuccess?: () => void;
  inline?: boolean;
}

const PROJECT_TYPES = [
  { value: "Home Renovation", label: "Home Renovation" },
  { value: "New Home / Construction", label: "New Home / Construction" },
  { value: "Modular Kitchen", label: "Modular Kitchen" },
  { value: "Wardrobe Systems", label: "Wardrobe Systems" },
  { value: "Door & Security", label: "Door & Security" },
  { value: "Commercial Project", label: "Commercial Project" },
  { value: "Architect / Designer", label: "Architect / Interior Designer" },
  { value: "Contractor / Builder", label: "Contractor / Builder" },
];

export function ConsultationForm({ onSuccess, inline = false }: ConsultationFormProps) {
  const { context } = useConsultationStore();
  const initialIntent = context?.intent || "consultation";

  const [intent, setIntent] = useState<"consultation" | "enquiry" | "callback">(initialIntent);
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successLeadId, setSuccessLeadId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Form field state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [category, setCategory] = useState(context?.category?.name || "");
  const [consultationMode, setConsultationMode] = useState<"showroom" | "whatsapp" | "either">("showroom");
  const [consultationDate, setConsultationDate] = useState("");
  const [consultationTime, setConsultationTime] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");

  // Sync state if context changes
  useEffect(() => {
    if (context?.intent) {
      setIntent(context.intent);
    }
    if (context?.category?.name) {
      setCategory(context.category.name);
    }
    if (context?.product?.name) {
      setIntent("enquiry");
    }
  }, [context]);

  const handleIntentChange = (newIntent: "consultation" | "enquiry" | "callback") => {
    setIntent(newIntent);
    setStep(1);
    setErrorMsg("");
  };

  const handleStep1Continue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
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

    const formData = new FormData(e.currentTarget);

    // Honeypot check
    if (formData.get("_honey")) {
      setSuccessLeadId("HC-HONEY");
      setIsSubmitting(false);
      return;
    }

    const payload: any = {
      intent,
      name,
      phone,
      email: email.trim() || undefined,
      source: context?.source || (inline ? "home" : "unknown"),
      pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
      message: message.trim() || undefined,
    };

    if (intent === "consultation") {
      payload.projectType = projectType || undefined;
      payload.interest = category || undefined;
      payload.consultationDate = consultationDate || undefined;
      payload.consultationTime = consultationTime || undefined;
      payload.consultationMode = consultationMode;
      if (context?.selectedProducts) {
        payload.selectedProducts = context.selectedProducts;
      }
    } else if (intent === "enquiry") {
      payload.category = context?.category?.name || category || undefined;
      payload.brand = context?.brand?.name || undefined;
      payload.product = context?.product?.name || undefined;
      payload.quantity = quantity.trim() || undefined;
      payload.projectType = projectType || undefined;
    } else if (intent === "callback") {
      payload.consultationTime = consultationTime || undefined;
    }

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setSuccessLeadId(data.lead_id);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred. Please try again or call our showroom directly.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (successLeadId) {
    return (
      <div className={inline ? "bg-zinc-950 border border-zinc-850 rounded-2xl p-8 lg:p-10 min-h-[460px] flex items-center justify-center" : "h-full flex items-center justify-center p-6"}>
        <ConsultationSuccess leadId={successLeadId} intent={intent} />
      </div>
    );
  }

  return (
    <div className={`flex flex-col text-white font-dmsans ${inline ? "bg-zinc-950 border border-white/[0.08] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" : "p-6 lg:p-8"}`}>
      
      {/* Context Banner: If opened from a specific product or shortlist */}
      {context?.product && (
        <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-[#C8A96E]/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 px-2.5 py-0.5 bg-[#C8A96E]/15 text-[#C8A96E] text-[10px] uppercase font-bold tracking-widest rounded-bl-lg">
            PRODUCT ENQUIRY
          </div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#C8A96E] font-medium mb-1">
            {context.brand?.name || "ARCHITECTURAL HARDWARE"} · {context.category?.name || "CATALOG ITEM"}
          </p>
          <h3 className="text-sm font-semibold text-white tracking-wide">
            {context.product.name}
          </h3>
          <p className="text-[11px] text-zinc-400 mt-1">
            We will check physical showroom stock & technical specifications for this unit.
          </p>
        </div>
      )}

      {context?.selectedProducts && context.selectedProducts.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-[#C8A96E]/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-widest text-[#C8A96E] font-bold">
              SHORTLIST CONSULTATION ({context.selectedProducts.length} ITEMS)
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {context.selectedProducts.map((p, idx) => (
              <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-xs text-zinc-200">
                <span className="text-[#C8A96E] text-[10px]">✦</span> {p.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Header Eyebrow & Title */}
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
          Tell us what you&apos;re working on. Our specialists will help you identify the right hardware, finish and technical solution.
        </p>
      </div>

      {/* Segmented Quiet Tab Navigation with 2px Architectural Gold Underline */}
      <div className="flex items-center border-b border-zinc-800/80 mb-8 overflow-x-auto no-scrollbar">
        {[
          { id: "consultation", label: "CONSULTATION" },
          { id: "enquiry", label: "PRODUCT ENQUIRY" },
          { id: "callback", label: "REQUEST CALLBACK" },
        ].map((tab) => {
          const isActive = intent === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleIntentChange(tab.id as any)}
              className={`relative py-3 px-4 text-xs font-semibold tracking-[0.16em] uppercase whitespace-nowrap transition-colors duration-200 focus-visible:outline-none ${
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

      {/* Multi-step / Form Container */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Honeypot */}
        <input type="text" name="_honey" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

        {/* ── INTENT: CONSULTATION (Progressive Disclosure) ─────────── */}
        {intent === "consultation" && (
          <>
            {step === 1 && (
              <div className="space-y-6">
                {/* Step indicator */}
                <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-zinc-500 font-medium pb-2 border-b border-zinc-900">
                  <span>Step 1 of 2 · Project Details</span>
                  <span className="text-[#C8A96E]">Next: Preferred Visit Time</span>
                </div>

                {/* Primary Contacts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-zinc-400 uppercase tracking-widest font-medium">
                      YOUR NAME *
                    </label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Vikram Sharma"
                      className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#C8A96E] transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-zinc-400 uppercase tracking-widest font-medium">
                      PHONE / WHATSAPP *
                    </label>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98351 90738"
                      className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#C8A96E] transition-all"
                    />
                  </div>
                </div>

                {/* Project Type & Canonical 13-Category Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-zinc-400 uppercase tracking-widest font-medium">
                      WHAT ARE YOU WORKING ON?
                    </label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8A96E] transition-all cursor-pointer"
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
                    <label className="text-[11px] text-zinc-400 uppercase tracking-widest font-medium">
                      WHAT CAN WE HELP WITH?
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8A96E] transition-all cursor-pointer"
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

                {/* Preferred Consultation Mode */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] text-zinc-400 uppercase tracking-widest font-medium">
                    HOW WOULD YOU LIKE TO CONSULT?
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: "showroom", label: "SHOWROOM", sub: "Live tactile demo", icon: MapPin, recommended: true },
                      { id: "whatsapp", label: "WHATSAPP", sub: "Photos & catalog", icon: PhoneCall, recommended: false },
                      { id: "either", label: "EITHER", sub: "Flexible", icon: Building2, recommended: false },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setConsultationMode(mode.id as any)}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 relative ${
                          consultationMode === mode.id
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
                          <mode.icon className={`w-3.5 h-3.5 ${consultationMode === mode.id ? "text-[#C8A96E]" : "text-zinc-500"}`} />
                          <span className={`text-[11px] font-bold tracking-wider uppercase ${consultationMode === mode.id ? "text-white" : "text-zinc-300"}`}>
                            {mode.label}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-light">
                          {mode.sub}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Continue to Step 2 Button */}
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
                {/* Step indicator */}
                <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-zinc-500 font-medium pb-2 border-b border-zinc-900">
                  <span>Step 2 of 2 · Timing & Details</span>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[#C8A96E] hover:underline inline-flex items-center gap-1 text-[11px]"
                  >
                    <ArrowLeft className="w-3 h-3" /> Back
                  </button>
                </div>

                {/* Date & Time Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-zinc-400 uppercase tracking-widest font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#C8A96E]" /> PREFERRED DATE
                    </label>
                    <input
                      type="date"
                      value={consultationDate}
                      onChange={(e) => setConsultationDate(e.target.value)}
                      className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8A96E] transition-all [color-scheme:dark]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-zinc-400 uppercase tracking-widest font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#C8A96E]" /> PREFERRED TIME WINDOW
                    </label>
                    <select
                      value={consultationTime}
                      onChange={(e) => setConsultationTime(e.target.value)}
                      className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8A96E] transition-all cursor-pointer"
                    >
                      <option value="">Select Preferred Time</option>
                      <option value="Morning (10:30 AM – 01:00 PM)">Morning (10:30 AM – 01:00 PM)</option>
                      <option value="Afternoon (01:00 PM – 04:30 PM)">Afternoon (01:00 PM – 04:30 PM)</option>
                      <option value="Evening (04:30 PM – 07:30 PM)">Evening (04:30 PM – 07:30 PM)</option>
                      <option value="Flexible / Anytime">Flexible / Anytime</option>
                    </select>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-500 italic -mt-2">
                  * Our showroom team will confirm your preferred time on WhatsApp.
                </p>

                {/* Email (Optional) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-zinc-400 uppercase tracking-widest font-medium">
                    EMAIL ADDRESS (OPTIONAL)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="For technical blueprints or estimates"
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#C8A96E] transition-all"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-zinc-400 uppercase tracking-widest font-medium">
                    ANYTHING SPECIFIC YOU&apos;D LIKE US TO PREPARE?
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. Looking for black PVD finish, mortise locks, tandem drawers..."
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#C8A96E] transition-all resize-none"
                  />
                </div>

                {/* Submit Action */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-3.5 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 text-xs font-semibold tracking-wider uppercase transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 px-6 rounded-full bg-gradient-to-r from-[#C8A96E] to-[#e5c487] hover:from-[#d8b97e] hover:to-[#f0d49e] text-[#0E0C0C] font-bold text-xs uppercase tracking-[0.16em] transition-all flex items-center justify-center gap-2 group disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Request Consultation</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── INTENT: PRODUCT ENQUIRY ───────────────────────────────── */}
        {intent === "enquiry" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] text-zinc-400 uppercase tracking-widest font-medium">
                  YOUR NAME *
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rajiv Sharma"
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#C8A96E] transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] text-zinc-400 uppercase tracking-widest font-medium">
                  PHONE / WHATSAPP *
                </label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98351 90738"
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#C8A96E] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] text-zinc-400 uppercase tracking-widest font-medium">
                  PROJECT TYPE
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8A96E] transition-all cursor-pointer"
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
                <label className="text-[11px] text-zinc-400 uppercase tracking-widest font-medium">
                  ESTIMATED QUANTITY (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 1 unit, 8 doors, 1 villa"
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#C8A96E] transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-zinc-400 uppercase tracking-widest font-medium">
                SPECIFIC QUESTIONS OR REQUIREMENTS
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about dimensions, finish availability in showroom, lead times, or pricing..."
                className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#C8A96E] transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#C8A96E] to-[#e5c487] hover:from-[#d8b97e] hover:to-[#f0d49e] text-[#0E0C0C] font-bold text-xs uppercase tracking-[0.16em] transition-all flex items-center justify-center gap-2 group disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Send Enquiry</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        )}

        {/* ── INTENT: CALLBACK ──────────────────────────────────────── */}
        {intent === "callback" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] text-zinc-400 uppercase tracking-widest font-medium">
                  YOUR NAME *
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anita Sen"
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#C8A96E] transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] text-zinc-400 uppercase tracking-widest font-medium">
                  PHONE / WHATSAPP *
                </label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98351 90738"
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#C8A96E] transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-zinc-400 uppercase tracking-widest font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C8A96E]" /> CONVENIENT CALLBACK WINDOW *
              </label>
              <select
                required
                value={consultationTime}
                onChange={(e) => setConsultationTime(e.target.value)}
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8A96E] transition-all cursor-pointer"
              >
                <option value="Anytime during showroom hours (10 AM – 8 PM)">Anytime during showroom hours (10 AM – 8 PM)</option>
                <option value="Morning (10:30 AM – 01:00 PM)">Morning (10:30 AM – 01:00 PM)</option>
                <option value="Afternoon (01:00 PM – 04:30 PM)">Afternoon (01:00 PM – 04:30 PM)</option>
                <option value="Evening (04:30 PM – 07:30 PM)">Evening (04:30 PM – 07:30 PM)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-zinc-400 uppercase tracking-widest font-medium">
                BRIEF TOPIC (OPTIONAL)
              </label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Dorset biometric lock pricing, Hafele tandem boxes"
                className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#C8A96E] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#C8A96E] to-[#e5c487] hover:from-[#d8b97e] hover:to-[#f0d49e] text-[#0E0C0C] font-bold text-xs uppercase tracking-[0.16em] transition-all flex items-center justify-center gap-2 group disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Request Callback</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <p className="text-red-400 text-xs bg-red-950/40 border border-red-900/60 p-3 rounded-lg">
            {errorMsg}
          </p>
        )}

        {/* Quiet, Confident Trust Microcopy */}
        <p className="text-center text-zinc-500 text-[11px] font-light mt-1">
          Your details are used only to respond to this request.
        </p>
      </form>
    </div>
  );
}
