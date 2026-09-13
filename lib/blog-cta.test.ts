import { describe, it, expect } from "vitest";
import { resolveBlogCta } from "./blog-cta";

describe("resolveBlogCta", () => {
  it("prefers a tag match over the category default", () => {
    const cta = resolveBlogCta(["fsp"], "germany-pathway");
    expect(cta.href).toBe("/programs/gold-card");
  });

  it("falls back to the category mapping when no tag matches", () => {
    const cta = resolveBlogCta(["some-unmapped-tag"], "research-publication");
    expect(cta.href).toBe("/programs/apexmed-research-card");
  });

  it("falls back to the generic profile-assessment CTA when nothing matches", () => {
    const cta = resolveBlogCta([], null);
    expect(cta.href).toBe("/contact");
  });
});
