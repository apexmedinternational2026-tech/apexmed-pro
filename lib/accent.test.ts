import { describe, expect, it } from "vitest";
import { resolveAccentToken, ACCENT_TOKENS } from "./accent";
import { contrastRatio } from "./contrast";
import { COLOR_TOKENS } from "./tokens";

describe("resolveAccentToken", () => {
  it("maps every seeded programs.accent_token value to the right family", () => {
    expect(resolveAccentToken("navy-gold")).toBe("research");
    expect(resolveAccentToken("sky-blue")).toBe("blue");
    expect(resolveAccentToken("deep-green")).toBe("green");
    expect(resolveAccentToken("amber-black")).toBe("gold");
    expect(resolveAccentToken("violet")).toBe("master");
  });

  it("falls back to research for null, undefined, or an unrecognized value", () => {
    expect(resolveAccentToken(null)).toBe("research");
    expect(resolveAccentToken(undefined)).toBe("research");
    expect(resolveAccentToken("not-a-real-token")).toBe("research");
  });
});

describe("ACCENT_TOKENS roles stay AA-safe", () => {
  const hexByVar = Object.fromEntries(Object.entries(COLOR_TOKENS).map(([name, hex]) => [`var(--color-${name})`, hex]));

  function hexOf(cssVar: string): string {
    const hex = hexByVar[cssVar];
    if (!hex) throw new Error(`No COLOR_TOKENS entry for ${cssVar} — keep lib/tokens.ts in sync with lib/accent.ts`);
    return hex;
  }

  it("every family's foreground clears AA (>= 4.5:1) against its own surface", () => {
    for (const [name, roles] of Object.entries(ACCENT_TOKENS)) {
      const ratio = contrastRatio(hexOf(roles.foreground), hexOf(roles.surface));
      expect(ratio, `${name}: foreground on surface`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("every family's `text` role clears AA specifically on paper-50 — the only background it's used against", () => {
    // Deliberately strict (paper-50 only, not "whichever background is more
    // flattering"): an earlier version of this test took the max of
    // paper-50 and navy-950, which let research/gold's `text` ship as their
    // own vivid hue — safe on navy-950, but ~2.1:1 on paper-50, where
    // Badge's accent variant and the ProgramGrid link actually render it.
    for (const [name, roles] of Object.entries(ACCENT_TOKENS)) {
      const ratio = contrastRatio(hexOf(roles.text), COLOR_TOKENS["paper-50"]);
      expect(ratio, `${name}: text role on paper-50`).toBeGreaterThanOrEqual(4.5);
    }
  });
});
