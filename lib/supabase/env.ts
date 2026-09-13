// Centralizes "fail loudly with a useful message" for required environment
// variables, so the three client constructors never need a non-null
// assertion to satisfy TypeScript.
export function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}. Check .env.local against .env.example.`);
  }

  return value;
}
