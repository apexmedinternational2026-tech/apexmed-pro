import { describe, expect, it } from "vitest";
import { leadSchema } from "./lead";

const validLead = {
  full_name: "Dr. Jane Doe",
  email: "jane.doe@example.com",
  phone: "+923001234567",
  country: "Pakistan",
  current_status: "doctor",
  interest_type: "gold_card",
  message: "Interested in the FSP/KP pathway.",
  website: "",
} as const;

describe("leadSchema", () => {
  it("passes with valid input", () => {
    const result = leadSchema.safeParse(validLead);
    expect(result.success).toBe(true);
  });

  it("passes with only the required fields", () => {
    const result = leadSchema.safeParse({
      full_name: "Jo",
      email: "jo@example.com",
      country: "Germany",
      current_status: "medical_student",
      interest_type: "general_inquiry",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a full_name shorter than 2 characters", () => {
    const result = leadSchema.safeParse({ ...validLead, full_name: "J" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Full name must be at least 2 characters.");
    }
  });

  it("rejects a full_name longer than 100 characters", () => {
    const result = leadSchema.safeParse({ ...validLead, full_name: "A".repeat(101) });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Full name must be at most 100 characters.");
    }
  });

  it("rejects an invalid email", () => {
    const result = leadSchema.safeParse({ ...validLead, email: "not-an-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Enter a valid email address.");
    }
  });

  it("rejects a phone number that isn't international format", () => {
    const result = leadSchema.safeParse({ ...validLead, phone: "0300abc4567" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Enter a valid international phone number, e.g. +923001234567.");
    }
  });

  it("accepts an empty string for phone (optional)", () => {
    const result = leadSchema.safeParse({ ...validLead, phone: "" });
    expect(result.success).toBe(true);
  });

  it("rejects an unknown current_status", () => {
    const result = leadSchema.safeParse({ ...validLead, current_status: "astronaut" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Select your current status.");
    }
  });

  it("rejects an unknown interest_type", () => {
    const result = leadSchema.safeParse({ ...validLead, interest_type: "platinum_card" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Select what you're interested in.");
    }
  });

  it("rejects a non-uuid program_id", () => {
    const result = leadSchema.safeParse({ ...validLead, program_id: "not-a-uuid" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("program_id must be a valid UUID.");
    }
  });

  it("rejects a message longer than 2000 characters", () => {
    const result = leadSchema.safeParse({ ...validLead, message: "x".repeat(2001) });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Message must be at most 2000 characters.");
    }
  });

  it("rejects a filled-in honeypot field as a bot submission", () => {
    const result = leadSchema.safeParse({ ...validLead, website: "https://spam.example" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Spam check failed.");
    }
  });

  it("defaults the honeypot field to empty when omitted", () => {
    const { website: _website, ...withoutWebsite } = validLead;
    const result = leadSchema.safeParse(withoutWebsite);
    expect(result.success).toBe(true);
  });
});
