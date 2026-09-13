import { describe, it, expect } from "vitest";
import { programEditSchema, reorderSchema } from "./program";

const VALID_UUID = "123e4567-e89b-12d3-a456-426614174000";

const BASE_INPUT = {
  id: VALID_UUID,
  name: "Gold Card",
  headline: "The full FSP/KP/Approbation pathway",
  summary: "A structured, mentor-led path through German medical licensing.",
  disclaimer_key: "germany_licensing",
  is_published: true,
};

describe("programEditSchema", () => {
  it("accepts a valid program with a disclaimer_key set", () => {
    expect(programEditSchema.safeParse(BASE_INPUT).success).toBe(true);
  });

  it("rejects an empty disclaimer_key — CLAUDE.md rule 9 requires one on every program", () => {
    const result = programEditSchema.safeParse({ ...BASE_INPUT, disclaimer_key: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a missing disclaimer_key entirely", () => {
    const { disclaimer_key, ...withoutDisclaimer } = BASE_INPUT;
    void disclaimer_key;
    const result = programEditSchema.safeParse(withoutDisclaimer);
    expect(result.success).toBe(false);
  });
});

describe("reorderSchema", () => {
  it("accepts a non-empty list of ordered ids", () => {
    const result = reorderSchema.safeParse({ parentId: VALID_UUID, orderedIds: [VALID_UUID] });
    expect(result.success).toBe(true);
  });

  it("rejects an empty orderedIds list", () => {
    const result = reorderSchema.safeParse({ parentId: VALID_UUID, orderedIds: [] });
    expect(result.success).toBe(false);
  });
});
