import { chromium } from "playwright";

const PAGES = [
  "/", "/about", "/mentors", "/programs", "/programs/apexmed-research-card",
  "/programs/blue-card", "/germany", "/germany/fsp", "/masters", "/masters/fields",
  "/masters/fields/public-health", "/contact", "/research", "/research/fcps-pmdc-support",
  "/services", "/blog", "/webinars", "/testimonials", "/login", "/signup",
  "/forgot-password", "/admin/login",
];

const WIDTHS = [320, 375, 400, 768, 1024, 1280];

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage();
page.on("pageerror", () => {});

const issues = [];

for (const path of PAGES) {
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    try {
      await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle", timeout: 20000 });
    } catch (e) {
      console.log(`FAILED TO LOAD: ${path} @ ${width} — ${e.message}`);
      continue;
    }
    await page.waitForTimeout(150);

    const result = await page.evaluate(() => {
      const doc = document.documentElement;
      return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth };
    });

    if (result.scrollWidth > result.clientWidth + 2) {
      const overflowAmount = result.scrollWidth - result.clientWidth;
      const widest = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        let best = null;
        for (const el of document.querySelectorAll("body *")) {
          const rect = el.getBoundingClientRect();
          if (rect.width === 0) continue;
          const overshoot = Math.max(0, rect.right - vw);
          if (overshoot > 1 && (!best || overshoot > best.overshoot)) {
            best = {
              tag: el.tagName,
              cls: el.className?.toString?.().slice(0, 100) ?? "",
              overshoot: Math.round(overshoot),
            };
          }
        }
        return best;
      });
      issues.push({ path, width, overflowAmount, widest });
      console.log(`OVERFLOW: ${path} @ ${width}px — +${overflowAmount}px — culprit: ${JSON.stringify(widest)}`);
    }
  }
}

console.log("\n=== SUMMARY ===");
console.log(`${issues.length} overflow instances found across ${PAGES.length} pages x ${WIDTHS.length} widths`);

await browser.close();
