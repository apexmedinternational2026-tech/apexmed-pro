"use client";

import * as React from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { getStoredConsent, storeConsent, type ConsentChoice } from "@/lib/consent";

export interface AnalyticsProps {
  /** Per-request CSP nonce from middleware.ts's x-nonce header, read by the
   *  root layout (a Server Component) and passed down — this Client
   *  Component has no way to read request headers itself. Required on the
   *  inline ga4-init script below or the CSP blocks it outright; the
   *  external gtag.js `src=` tag doesn't strictly need it (host-allowlisted
   *  in middleware's CSP) but carries it anyway since it's free. */
  nonce: string | null;
}

/**
 * Owns both the consent banner and the analytics script load in one place
 * so the two can never drift out of sync — GA4 only ever loads after
 * `consent === "granted"`, never speculatively before the banner is
 * answered. Renders nothing at all (no banner, no script) when
 * NEXT_PUBLIC_GA_MEASUREMENT_ID isn't set, which is the normal state for
 * local development and this sandbox.
 */
export function Analytics({ nonce }: AnalyticsProps) {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const [consent, setConsent] = React.useState<ConsentChoice | null>(null);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setConsent(getStoredConsent());
    setHydrated(true);
  }, []);

  if (!measurementId) return null;

  function handleChoice(choice: ConsentChoice) {
    storeConsent(choice);
    setConsent(choice);
  }

  return (
    <>
      {consent === "granted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
            nonce={nonce ?? undefined}
          />
          <Script id="ga4-init" strategy="afterInteractive" nonce={nonce ?? undefined}>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${measurementId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {/* Only rendered once localStorage has actually been read — before
          that, showing the banner would be a guess that could flash and
          disappear on every page load for a visitor who already chose. */}
      {hydrated && consent === null && (
        <div
          role="region"
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-start gap-3 border-t border-navy-800/15 bg-white p-5 shadow-[0_-8px_24px_-12px_rgba(10,26,60,0.16)] sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="max-w-2xl text-body-sm text-ink-900">
            We use analytics cookies to understand how visitors use this site. No tracking happens until you accept.
          </p>
          <div className="flex flex-none gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => handleChoice("denied")}>
              Decline
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={() => handleChoice("granted")}>
              Accept
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
