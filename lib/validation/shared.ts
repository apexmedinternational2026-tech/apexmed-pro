import { z } from "zod";

// E.164-ish: optional leading "+", 8-15 digits total, no leading zero.
// Deliberately permissive (no per-country length table) — the goal is to
// reject obvious junk, not to fully validate a phone number.
export const PHONE_REGEX = /^\+?[1-9]\d{7,14}$/;

export const phoneSchema = z
  .string()
  .trim()
  .regex(PHONE_REGEX, "Enter a valid international phone number, e.g. +923001234567.")
  .optional()
  .or(z.literal(""));

// Every public form carries a field named "website" that stays empty for a
// human filling in the visible fields and gets auto-filled by most spam
// bots that blindly complete every input on a page. Any non-empty value is
// treated as a spam signal, never surfaced to the visitor as a "real"
// validation error.
export const honeypotSchema = z.string().max(0, "Spam check failed.").default("");
