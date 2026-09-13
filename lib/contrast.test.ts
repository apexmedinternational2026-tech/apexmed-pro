import { describe, expect, it } from "vitest";
import { contrastRatio } from "./contrast";

describe("contrastRatio", () => {
  it("returns 21:1 for pure black on pure white", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 1);
  });

  it("returns 1:1 for identical colors", () => {
    expect(contrastRatio("#D4AF37", "#D4AF37")).toBeCloseTo(1, 5);
  });

  it("is symmetric regardless of argument order", () => {
    const a = contrastRatio("#0A1A3C", "#D4AF37");
    const b = contrastRatio("#D4AF37", "#0A1A3C");
    expect(a).toBeCloseTo(b, 10);
  });

  it("confirms gold-500 on navy-950 clears WCAG AA for normal text (>= 4.5:1)", () => {
    const ratio = contrastRatio("#D4AF37", "#0A1A3C");
    expect(ratio).toBeGreaterThanOrEqual(4.5);
    expect(ratio).toBeCloseTo(8.15, 1);
  });

  it("confirms ink-900 on paper-50 clears WCAG AA comfortably", () => {
    const ratio = contrastRatio("#111827", "#F8FAFC");
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("confirms slate-500 on paper-50 clears WCAG AA, even if narrowly", () => {
    const ratio = contrastRatio("#64748B", "#F8FAFC");
    expect(ratio).toBeGreaterThanOrEqual(4.5);
    expect(ratio).toBeLessThan(5); // documents the thin margin — see app/styleguide
  });

  it("confirms raw product-blue fails AA as a text color on paper-50 (why -ink exists)", () => {
    const ratio = contrastRatio("#1D7DD4", "#F8FAFC");
    expect(ratio).toBeLessThan(4.5);
  });

  it("confirms product-blue-ink fixes that failure on paper-50", () => {
    const ratio = contrastRatio("#0F5FA0", "#F8FAFC");
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("confirms product-gold on its near-black surface clears WCAG AA", () => {
    const ratio = contrastRatio("#E0A80D", "#0B0B0B");
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});
