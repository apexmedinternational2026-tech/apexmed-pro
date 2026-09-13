// Test-only stand-in for the "server-only" package — see vitest.config.ts
// for why this alias exists. Deliberately empty: importing it should do
// nothing, exactly like the real package does once Next's bundler has
// substituted it into a server bundle.
export {};
