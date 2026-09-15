import { describe, it, expect, vi, afterEach } from "vitest";
import { verifyTurnstileToken } from "./turnstile";

describe("verifyTurnstileToken", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("allows the request when unconfigured outside production", async () => {
    delete process.env.TURNSTILE_SECRET_KEY;
    vi.stubEnv("NODE_ENV", "test");

    const result = await verifyTurnstileToken("any-token");
    expect(result.success).toBe(true);
  });

  it("also allows the request when unconfigured in production — a missing secret must not silently take down lead capture (CLAUDE.md: leads must keep working)", async () => {
    delete process.env.TURNSTILE_SECRET_KEY;
    vi.stubEnv("NODE_ENV", "production");

    const result = await verifyTurnstileToken("any-token");
    expect(result.success).toBe(true);
  });

  it("rejects an empty token even when a secret is configured", async () => {
    process.env.TURNSTILE_SECRET_KEY = "test-secret";

    const result = await verifyTurnstileToken("");
    expect(result.success).toBe(false);
  });

  it("calls Cloudflare's siteverify endpoint and returns success on a positive response", async () => {
    process.env.TURNSTILE_SECRET_KEY = "test-secret";
    const fetchMock = vi.fn().mockResolvedValue({ json: () => Promise.resolve({ success: true }) });
    vi.stubGlobal("fetch", fetchMock);

    const result = await verifyTurnstileToken("real-token", "1.2.3.4");

    expect(result.success).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("fails closed when Cloudflare itself is unreachable", async () => {
    process.env.TURNSTILE_SECRET_KEY = "test-secret";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    const result = await verifyTurnstileToken("real-token");
    expect(result.success).toBe(false);
  });
});
