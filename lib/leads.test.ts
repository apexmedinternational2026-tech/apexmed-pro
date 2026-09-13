import { describe, it, expect } from "vitest";
import { describeLeadInterest } from "./leads";

describe("describeLeadInterest", () => {
  it("prefers the linked program's name when one exists", () => {
    expect(describeLeadInterest("gold_card", "Gold Card")).toBe("Gold Card");
  });

  it("falls back to the interest type label when there's no linked program", () => {
    expect(describeLeadInterest("gold_card", null)).toBe("Gold Card");
  });

  it("falls back to the raw interest_type value if it isn't a known label", () => {
    expect(describeLeadInterest("some_new_type", null)).toBe("some_new_type");
  });

  it("falls back to General Inquiry when neither is present", () => {
    expect(describeLeadInterest(null, null)).toBe("General Inquiry");
  });
});
