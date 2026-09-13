"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

// Only catches errors thrown by the root layout itself (app/layout.tsx) —
// anything below it is already caught by app/error.tsx. Next requires
// this file to render its own <html>/<body>, since the layout that would
// normally provide them is exactly what failed. Deliberately has no
// dependency on globals.css, the design system, or any component that
// could itself be the thing that broke — this has to render literally
// no matter what.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "3rem 1.5rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Something went wrong.</h1>
        <p style={{ marginTop: "0.5rem", color: "#64748b" }}>Our team has been notified.</p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            marginTop: "1.5rem",
            padding: "0.625rem 1.5rem",
            borderRadius: "0.375rem",
            backgroundColor: "#0a1a3c",
            color: "#f8fafc",
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
