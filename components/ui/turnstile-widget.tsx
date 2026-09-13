"use client";

import * as React from "react";
import Script from "next/script";

// Minimal shape of the global Cloudflare injects — the real turnstile
// script defines far more, but this is everything this component calls.
interface TurnstileGlobal {
  render(container: HTMLElement, options: Record<string, unknown>): string;
  remove(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileGlobal;
  }
}

export interface TurnstileWidgetProps {
  onVerify: (token: string | null) => void;
}

/**
 * Renders nothing (and calls onVerify immediately with an empty string)
 * when no site key is configured — see lib/turnstile.ts for why the
 * server side treats that as "allow" outside production and "reject" in
 * production. This lets the form work in local dev / this sandbox
 * without real Cloudflare credentials, without ever pretending a widget
 * that isn't there was actually solved.
 */
export function TurnstileWidget({ onVerify }: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const widgetIdRef = React.useRef<string | null>(null);
  const onVerifyRef = React.useRef(onVerify);
  onVerifyRef.current = onVerify;

  React.useEffect(() => {
    if (!siteKey) {
      onVerifyRef.current("");
    }
  }, [siteKey]);

  function renderWidget() {
    if (!siteKey || !containerRef.current || !window.turnstile || widgetIdRef.current) return;

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token: string) => onVerifyRef.current(token),
      "expired-callback": () => onVerifyRef.current(null),
      "error-callback": () => onVerifyRef.current(null),
    });
  }

  React.useEffect(() => {
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, []);

  if (!siteKey) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onReady={renderWidget}
      />
      <div ref={containerRef} />
    </>
  );
}
