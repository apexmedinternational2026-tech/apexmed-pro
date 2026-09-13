import { describe, it, expect } from "vitest";
import { blogPostSchema } from "./blog-post";

const BASE_INPUT = {
  slug: "how-to-prepare-for-fsp",
  title: "How to Prepare for the FSP",
  body_mdx: "## Intro\n\nSome content.",
  cover_image_alt: "A doctor reviewing notes before an exam.",
  tag_ids: [],
  status: "draft" as const,
};

describe("blogPostSchema", () => {
  it("accepts a valid draft post", () => {
    expect(blogPostSchema.safeParse(BASE_INPUT).success).toBe(true);
  });

  it("rejects an empty cover_image_alt — required so submission is blocked without it", () => {
    const result = blogPostSchema.safeParse({ ...BASE_INPUT, cover_image_alt: "" });
    expect(result.success).toBe(false);
  });

  it('rejects status "scheduled" with no published_at', () => {
    const result = blogPostSchema.safeParse({ ...BASE_INPUT, status: "scheduled" });
    expect(result.success).toBe(false);
  });

  it('accepts status "scheduled" when published_at is set', () => {
    const result = blogPostSchema.safeParse({ ...BASE_INPUT, status: "scheduled", published_at: "2026-01-01T10:00" });
    expect(result.success).toBe(true);
  });

  it("rejects an empty body_mdx", () => {
    const result = blogPostSchema.safeParse({ ...BASE_INPUT, body_mdx: "" });
    expect(result.success).toBe(false);
  });
});
