import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (err) => console.log("pageerror:", err.message));

await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 30000 });

await page.getByRole("button", { name: /research/i }).first().hover();
const menu = page.getByRole("menu", { name: /research/i });
await menu.waitFor({ state: "visible", timeout: 5000 });

const link = menu.getByRole("menuitem", { name: "ApexMed Research Card" });
const href = await link.getAttribute("href");
console.log("target href:", href);

await Promise.all([
  page.waitForURL(/apexmed-research-card/, { timeout: 10000 }).catch((e) => console.log("waitForURL failed:", e.message)),
  link.click(),
]);

console.log("final URL:", page.url());
await browser.close();
