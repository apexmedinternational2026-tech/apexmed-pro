import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules", ".next"],
  },
  resolve: {
    alias: {
      // Mirrors tsconfig.json's "@/*" -> "./*" path mapping — tsc resolves
      // that fine for typechecking, but Vite (which vitest runs on)
      // doesn't read tsconfig paths on its own, so any file under test
      // that imports via "@/..." needs this to actually run rather than
      // just typecheck.
      "@": path.resolve(__dirname, "."),
      // The real server-only package throws unconditionally unless
      // Next's own bundler substitutes it — that substitution doesn't
      // exist under plain Vitest, so any module under test that imports
      // it (lib/turnstile.ts, lib/supabase/admin.ts) would otherwise
      // throw on import regardless of what it's actually testing. This
      // no-ops it for tests only; production builds still get the real
      // package and the real guarantee.
      "server-only": path.resolve(__dirname, "test/server-only-mock.ts"),
    },
  },
});
