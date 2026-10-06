# Phase 14: UI/UX Refinement & Anti-UI-Slop Standardization - Research

**Date:** 2026-10-07
**Phase:** 14-ui-ux-refinement-anti-ui-slop
**Status:** Complete

---

## 1. Executive Summary

Phase 14 addresses the findings of the comprehensive UI/UX and anti-ui-slop audit. The codebase transitioned away from generic SaaS template conventions (excessive rounded corners, pill badges, noisy controls, redundant sticky bars) toward an architectural luxury standard suitable for a high-end architectural hardware showroom.

This research analyzes all components affected by the locked decisions in `14-CONTEXT.md`, establishes exact component boundaries, and outlines the precise refactoring steps needed for planning and execution.

---

## 2. Architecture & Codebase Map

### Key Affected Surfaces
1. **Mobile Navigation & Action Primitives:**
   - [`src/components/ui/FloatingActionButtons.tsx`](file:///e:/Hardware-Collection/src/components/ui/FloatingActionButtons.tsx) (Newly added, mobile-only dual action button for WhatsApp + Call).
   - [`src/components/layout/Navbar.tsx`](file:///e:/Hardware-Collection/src/components/layout/Navbar.tsx) (Header island, borderless hamburger button).
   - [`src/components/layout/MobileMenu.tsx`](file:///e:/Hardware-Collection/src/components/layout/MobileMenu.tsx) (Legacy `rounded-3xl` popup card needs transformation into an architectural full-screen luxury overlay per D-04).
   - [`src/components/consultation/FloatingConsultationCapsule.tsx`](file:///e:/Hardware-Collection/src/components/consultation/FloatingConsultationCapsule.tsx) (Redundant legacy capsule still imported in `CatalogsClient.tsx`; must be harmonized or retired).

2. **Showroom Consultation & Contact Section:**
   - [`src/components/home/ConsultationSection.tsx`](file:///e:/Hardware-Collection/src/components/home/ConsultationSection.tsx) (Showroom stats row updated to verified truth: `10+ Years in Sakchi`, `20+ Authorized Brands`, `Sakchi Flagship HQ`; live Google Maps embed).
   - [`src/components/consultation/ConsultationForm.tsx`](file:///e:/Hardware-Collection/src/components/consultation/ConsultationForm.tsx) (Standard 4 fields per D-08, dual submission pathway per D-05 to record lead and trigger WhatsApp prefilled link).

3. **Collections Hero & Promotional Offers:**
   - [`src/components/collections/CollectionsHero.tsx`](file:///e:/Hardware-Collection/src/components/collections/CollectionsHero.tsx) (Embla carousel autoplay stability via `api.plugins().autoplay`, calm 6-7s cycle, linear progress bars, minimal typography, and subtle brass badge for offers).
   - [`src/components/home/HeroStage.tsx`](file:///e:/Hardware-Collection/src/components/home/HeroStage.tsx) (Homepage aperture hero, sleek progress bars, zero rounded pill artifacts).

4. **Design System & Anti-UI-Slop Token Enforcement:**
   - [`src/components/layout/Footer.tsx`](file:///e:/Hardware-Collection/src/components/layout/Footer.tsx) (Eliminate `rounded-xl` containers; standardize borders and surfaces).
   - [`src/components/collections/ProductQuickView.tsx`](file:///e:/Hardware-Collection/src/components/collections/ProductQuickView.tsx) (Validate `rounded-none`, clean ivory dialog, tactile button states).
   - [`src/app/globals.css`](file:///e:/Hardware-Collection/src/app/globals.css) (CSS variables: `--surface`, `--text-primary`, `--text-secondary`, `--border`, `--color-wine`, `--color-brass`).

---

## 3. Detailed Component Analysis & Implementation Findings

### A. Mobile Menu Overhaul (`MobileMenu.tsx`)
* **Current State:** Currently renders `<motion.div className="rounded-3xl p-6 bg-[#fbf5ea]/95 backdrop-blur-xl border border-[#1a1017]/[0.08] shadow-[0_16px_48px_...]">` centered on screen like a floating modal bubble.
* **Target State (D-04):** Full-screen luxury architectural overlay (`fixed inset-0 z-50 bg-[var(--surface)] text-[var(--text-primary)]`). High-contrast typography (`hc-serif` for primary nav), crisp hairline dividers, direct showroom contact links (Call, WhatsApp, Sakchi showroom address), and a clean borderless close button.
* **Dependencies:** Framer Motion animation (`opacity` and clean Y-axis fade or slide; no spring bouncing).

### B. Floating Action Buttons & Legacy Floating Capsules
* **Current State:** `FloatingActionButtons.tsx` operates cleanly at `bottom-6 right-6` with `lg:hidden`. However, `CatalogsClient.tsx` still renders `FloatingConsultationCapsule.tsx` (`rounded-full bg-[#8b1a42] animate-pulse`).
* **Target State (D-01, D-02, D-03):** Ensure `FloatingActionButtons.tsx` is the sole global mobile floating action trigger across all routes. Remove or disable redundant floating widgets in catalog pages to prevent double-button stacking.

### C. Consultation Section Dual-Handoff Flow (`ConsultationForm.tsx`)
* **Current State:** Form handles submission via standard action/API endpoint.
* **Target State (D-05, D-08):**
  1. Standard 4 fields: Full Name, Phone Number, Project Type (dropdown), and Message / Preferred Timeline.
  2. On submit: Post payload to backend lead store (`/api/leads` / Google Sheets webhook), then immediately format and redirect to WhatsApp (`https://wa.me/919835190738?text=...`) with structured lead details so showroom staff can respond within minutes.
  3. Form provides instant confirmation UI while initiating the external redirect.

### D. Collections Hero & Offers System (`CollectionsHero.tsx`)
* **Current State:** Fixed runtime TypeError on line 67 by fetching `api.plugins().autoplay`. Linear indicator bars and clean typography already started.
* **Target State (D-09, D-10, D-11, D-12):**
  1. Autoplay: Configured with `delay: 6500, stopOnInteraction: false, stopOnMouseEnter: true`.
  2. Indicators: `h-[2px]` bars, active bar smooth width expansion with `transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]`.
  3. Offer distinction: Active promotional slides receive a subtle brass tag (`hc-mono text-[9.5px] uppercase tracking-[0.25em] text-[var(--color-brass)] font-semibold`) and dual actions (`Enquire Offer` cream button + `All offers` outline button).

### E. Global Anti-UI-Slop Token Audit
* **Footer (`Footer.tsx`):** Replace 6 instances of `rounded-xl bg-[#fbf5ea]` with crisp rectilinear borders (`rounded-none border border-[var(--border)] bg-[var(--surface-raised)]`).
* **Success states (`ConsultationSuccess.tsx`):** Replace `rounded-xl` and `rounded-full` with architectural cards and subtle icon framing.

---

## 4. Verification & Testing Strategy

1. **Type & Linter Verification:**
   - Execute `npm run lint` and verify 0 errors, 0 warnings.
   - Run Next.js Turbopack build (`npm run build`) to ensure all SSR and SSG static routes build cleanly.
2. **Mobile Viewport Inspections (DevTools / Headless):**
   - Test viewport 375x812 (iPhone), 390x844, and 768x1024 (iPad).
   - Verify zero horizontal scrolling, no sticky bar collisions, and smooth floating action button tap targets (minimum 44x44px).
3. **Accessibility & Motion Compliance:**
   - Verify `prefers-reduced-motion` suppresses hero autoplay and instant transitions without UI degradation.
   - Ensure all buttons have descriptive `aria-label`s and proper focus ring states.

---

## 5. Security Threat Model (ASVS L1)

| Threat ID | Description | Impact | Mitigation |
|-----------|-------------|--------|------------|
| T-14-01 | XSS injection via user input in WhatsApp pre-fill URL | Low | Sanitize and encode parameters using `encodeURIComponent()` |
| T-14-02 | Unvalidated external link redirection | Medium | Hardcode WhatsApp domain `https://wa.me/` and official showroom phone numbers |
| T-14-03 | Missing CSRF / validation on consultation API submission | Low/Medium | Validate payload schema using Zod; sanitize phone number formatting |

---

## RESEARCH COMPLETE
