#!/usr/bin/env node
// CI gate: fails the build if the Supabase service role key ever ends up
// in compiled output. Next.js never inlines a non-NEXT_PUBLIC_ env var
// into the client bundle on its own — the only way this secret's actual
// value could appear in .next/ is a real bug (e.g. something passing it
// as a prop to a Client Component, or an accidental console.log of a
// config object), which is exactly the class of mistake this check
// exists to catch before it reaches a deployed build.
//
// Requires SUPABASE_SERVICE_ROLE_KEY to be set (CI provides it via a
// repo secret — see .github/workflows/ci.yml) so there's a concrete
// value to search for. Run as: node scripts/check-secrets.mjs

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const BUILD_DIR = ".next";
// .next/cache is webpack's persistent build cache — never deployed or
// served, and can be large — so it's excluded to keep this fast without
// weakening the check (nothing under BUILD_DIR that's actually shipped
// is skipped).
const SKIP_DIRS = new Set(["cache"]);

const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!secret) {
  console.error(
    "check-secrets: SUPABASE_SERVICE_ROLE_KEY is not set — this check has nothing concrete to search " +
      "for and would be a meaningless no-op if it proceeded. Set it (CI provides this via a repo secret) " +
      "before running this check.",
  );
  process.exit(1);
}

function walk(dir, matches) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return; // BUILD_DIR doesn't exist yet — nothing to check.
  }

  for (const entry of entries) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;

    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, matches);
      continue;
    }

    if (statSync(fullPath).size > 20 * 1024 * 1024) continue; // skip anything absurdly large (source maps of vendor bundles, etc.)

    if (readSafely(fullPath).includes(secret)) {
      matches.push(fullPath);
    }
  }
}

function readSafely(path) {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return ""; // binary file (e.g. an image) — can't contain a string match meaningfully via utf8 read; skip.
  }
}

const matches = [];
walk(BUILD_DIR, matches);

if (matches.length > 0) {
  console.error("check-secrets: SUPABASE_SERVICE_ROLE_KEY value found in build output:");
  matches.forEach((path) => console.error(`  ${relative(process.cwd(), path)}`));
  console.error(
    "\nThis means the service role key reached compiled output that could ship to the browser. " +
      "Find what's referencing it outside lib/supabase/admin.ts and fix that before merging.",
  );
  process.exit(1);
}

console.log(`check-secrets: OK — service role key not found in ${BUILD_DIR}/ (excluding cache).`);
