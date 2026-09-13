import { z } from "zod";

// Kept separate from lib/validation/admin/auth.ts even though signInSchema
// is identical in shape — the two forms serve different audiences (staff
// vs. public visitors) and admin's must never gain a dependency on
// anything under this public-facing file.
export const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export type SignInInput = z.infer<typeof signInSchema>;

// 8 chars, not Supabase Auth's bare minimum of 6 — matches common password
// guidance without requiring symbol/number complexity that just pushes
// people toward "Password1!"-style patterns.
const passwordField = z.string().min(8, "Password must be at least 8 characters.");

export const signUpSchema = z
  .object({
    full_name: z.string().trim().min(2, "Full name must be at least 2 characters.").max(100),
    email: z.string().trim().email("Enter a valid email address."),
    password: passwordField,
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match.",
    path: ["confirm_password"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: passwordField,
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match.",
    path: ["confirm_password"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
