export type ConsentChoice = "granted" | "denied";

const STORAGE_KEY = "apexmed-analytics-consent";

/**
 * Wrapped in try/catch throughout: localStorage can throw (private
 * browsing, blocked site data) and must never break the page for a
 * feature this unimportant — see the artifact/browser-storage guidance
 * this project follows elsewhere for the same reasoning.
 */
export function getStoredConsent(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function storeConsent(choice: ConsentChoice): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // Nothing to fall back to — the banner will just reappear next visit.
  }
}
