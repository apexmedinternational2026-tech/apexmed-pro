import { describe, expect, it } from "vitest";
import { webinarRegistrationSchema } from "./webinar-registration";

const validRegistration = {
  webinar_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  full_name: "Jane Doe",
  email: "jane.doe@example.com",
  phone: "+923001234567",
  website: "",
} as const;

describe("webinarRegistrationSchema", () => {
  it("passes with valid input", () => {
    const result = webinarRegistrationSchema.safeParse(validRegistration);
    expect(result.success).toBe(true);
  });

  it("passes without an optional phone", () => {
    const { phone: _phone, ...withoutPhone } = validRegistration;
    const result = webinarRegistrationSchema.safeParse(withoutPhone);
    expect(result.success).toBe(true);
  });

  it("rejects a non-uuid webinar_id", () => {
    const result = webinarRegistrationSchema.safeParse({ ...validRegistration, webinar_id: "123" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("webinar_id must be a valid UUID.");
    }
  });

  it("rejects a full_name shorter than 2 characters", () => {
    const result = webinarRegistrationSchema.safeParse({ ...validRegistration, full_name: "J" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Full name must be at least 2 characters.");
    }
  });

  it("rejects an invalid email", () => {
    const result = webinarRegistrationSchema.safeParse({ ...validRegistration, email: "nope" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Enter a valid email address.");
    }
  });

  it("rejects a malformed phone number", () => {
    const result = webinarRegistrationSchema.safeParse({ ...validRegistration, phone: "not-a-phone" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Enter a valid international phone number, e.g. +923001234567.");
    }
  });

  it("rejects a filled-in honeypot field as a bot submission", () => {
    const result = webinarRegistrationSchema.safeParse({
      ...validRegistration,
      website: "https://spam.example",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Spam check failed.");
    }
  });
});
