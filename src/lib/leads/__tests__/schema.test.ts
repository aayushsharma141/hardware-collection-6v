import { describe, it, expect } from "vitest";
import {
  CreateLeadSchema,
  ConsultationLeadSchema,
  EnquiryLeadSchema,
  CallbackLeadSchema,
} from "../schema";

describe("Lead Validation Schemas", () => {
  describe("ConsultationLeadSchema", () => {
    it("validates a valid consultation lead submission", () => {
      const validPayload = {
        name: "Rahul Sharma",
        phone: "+919876543210",
        email: "rahul@example.com",
        source: "home",
        intent: "consultation",
        projectType: "Residential Villa",
        interest: "Digital Locks & Architectural Handles",
        consultationMode: "showroom",
        consultationTime: "Morning (10:00 AM - 1:00 PM)",
        message: "Need specifications for 4 main doors.",
      };

      const result = ConsultationLeadSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("fails when name is too short or empty", () => {
      const invalidPayload = {
        name: "A",
        phone: "9876543210",
        source: "collections",
        intent: "consultation",
      };

      const result = ConsultationLeadSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("fails when phone number is too short", () => {
      const invalidPayload = {
        name: "Vikram Mehta",
        phone: "123",
        source: "collections",
        intent: "consultation",
      };

      const result = ConsultationLeadSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("allows empty optional email or validates valid email format", () => {
      const emptyEmail = {
        name: "Anita Roy",
        phone: "9876543210",
        email: "",
        source: "product_drawer",
        intent: "consultation",
      };
      expect(ConsultationLeadSchema.safeParse(emptyEmail).success).toBe(true);

      const invalidEmail = {
        name: "Anita Roy",
        phone: "9876543210",
        email: "not-an-email",
        source: "product_drawer",
        intent: "consultation",
      };
      expect(ConsultationLeadSchema.safeParse(invalidEmail).success).toBe(false);
    });
  });

  describe("EnquiryLeadSchema", () => {
    it("validates simplified enquiry payload with customerType and location", () => {
      const payload = {
        name: "Pooja Verma",
        phone: "9835190000",
        location: "Sakchi, Jamshedpur",
        customerType: "Architect / Interior Designer",
        projectType: "Modular Kitchen",
        source: "home",
        intent: "enquiry",
      };

      const result = EnquiryLeadSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("fails when customerType is not one of the allowed enum options", () => {
      const payload = {
        name: "Pooja Verma",
        phone: "9835190000",
        location: "Sakchi, Jamshedpur",
        customerType: "Invalid Type",
        projectType: "Modular Kitchen",
        source: "home",
        intent: "enquiry",
      };

      const result = EnquiryLeadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it("fails when location is missing or empty", () => {
      const payload = {
        name: "Pooja Verma",
        phone: "9835190000",
        location: "",
        customerType: "Home Owner",
        projectType: "Modular Kitchen",
        source: "home",
        intent: "enquiry",
      };

      const result = EnquiryLeadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe("CallbackLeadSchema", () => {
    it("validates callback request with preferred window", () => {
      const payload = {
        name: "Suresh Gupta",
        phone: "9835191111",
        source: "navbar",
        intent: "callback",
        consultationTime: "Evening (4:00 PM - 7:00 PM)",
      };

      const result = CallbackLeadSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("fails callback when consultationTime window is missing", () => {
      const payload = {
        name: "Suresh Gupta",
        phone: "9835191111",
        source: "navbar",
        intent: "callback",
        consultationTime: "",
      };

      const result = CallbackLeadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe("CreateLeadSchema discriminated union", () => {
    it("correctly routes to consultation schema by intent", () => {
      const result = CreateLeadSchema.safeParse({
        name: "Amit Patel",
        phone: "9876543210",
        source: "home",
        intent: "consultation",
      });
      expect(result.success).toBe(true);
    });

    it("rejects unknown intent discriminator", () => {
      const result = CreateLeadSchema.safeParse({
        name: "Amit Patel",
        phone: "9876543210",
        source: "home",
        intent: "unsupported_intent",
      });
      expect(result.success).toBe(false);
    });
  });
});
