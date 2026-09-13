import { describe, expect, it } from "vitest";
import { contactSchema } from "./contact";

const validContact = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  subject: "Question about the Blue Card",
  message: "Can you tell me more about the A1 to B1 timeline?",
  website: "",
} as const;

describe("contactSchema", () => {
  it("passes with valid input", () => {
    const result = contactSchema.safeParse(validContact);
    expect(result.success).toBe(true);
  });

  it("passes without an optional subject", () => {
    const { subject: _subject, ...withoutSubject } = validContact;
    const result = contactSchema.safeParse(withoutSubject);
    expect(result.success).toBe(true);
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = contactSchema.safeParse({ ...validContact, name: "J" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Name must be at least 2 characters.");
    }
  });

  it("rejects an invalid email", () => {
    const result = contactSchema.safeParse({ ...validContact, email: "nope" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Enter a valid email address.");
    }
  });

  it("rejects a subject longer than 150 characters", () => {
    const result = contactSchema.safeParse({ ...validContact, subject: "x".repeat(151) });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Subject must be at most 150 characters.");
    }
  });

  it("rejects a message shorter than 10 characters", () => {
    const result = contactSchema.safeParse({ ...validContact, message: "too short" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Message must be at least 10 characters.");
    }
  });

  it("rejects a message longer than 2000 characters", () => {
    const result = contactSchema.safeParse({ ...validContact, message: "x".repeat(2001) });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Message must be at most 2000 characters.");
    }
  });

  it("rejects a filled-in honeypot field as a bot submission", () => {
    const result = contactSchema.safeParse({ ...validContact, website: "https://spam.example" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Spam check failed.");
    }
  });
});
