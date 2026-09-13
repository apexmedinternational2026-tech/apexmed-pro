import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("keeps a custom font-size token and a custom color token together (regression: tailwind-merge default config conflates the two)", () => {
    expect(cn("font-display text-display-sm text-ink-900", "text-paper-50")).toBe(
      "font-display text-display-sm text-paper-50",
    );
  });

  it("still resolves a real font-size conflict, keeping the last one", () => {
    expect(cn("text-display-sm", "text-body-md")).toBe("text-body-md");
  });

  it("still resolves a real color conflict, keeping the last one", () => {
    expect(cn("text-ink-900", "text-paper-50")).toBe("text-paper-50");
  });

  it("resolves stock Tailwind spacing conflicts as usual", () => {
    expect(cn("p-4", "p-6")).toBe("p-6");
  });

  it("passes through conditional falsy values", () => {
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });
});
