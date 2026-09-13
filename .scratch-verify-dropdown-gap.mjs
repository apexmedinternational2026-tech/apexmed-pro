import { chromium } from "playwright";
import path from "node:path";

const SCRATCH = "C:\\Users\\ua\\AppData\\Local\\Temp\\claude\\d--Apexmid-Project-Dacumentaion-Side-Apexmed-Project\\8239855f-2884-423c-af7a-2a87669f3f03\\scratchpad";

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (err) => console.log("pageerror:", err.message));

await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 30000 });

const trigger = page.getByRole("button", { name: /research/i }).first();
const triggerBox = await trigger.boundingBox();
console.log("trigger box:", triggerBox);

// Move mouse onto the trigger first (real hover), confirm menu opens.
await page.mouse.move(triggerBox.x + triggerBox.width / 2, triggerBox.y + triggerBox.height / 2);
await page.waitForTimeout(200);
const menu = page.getByRole("menu", { name: /research/i });
console.log("menu visible after hovering trigger:", await menu.isVisible().catch(() => false));

const menuBox = await menu.boundingBox();
console.log("menu box:", menuBox);

// Trace a real straight-line path from the trigger's bottom edge, through
// the gap, down into the first menu item — many small steps, exactly the
// slow/careful mouse movement a real user makes, and check menu state
// after EVERY step to catch a flicker-closed even if it reopens later.
const startX = triggerBox.x + triggerBox.width / 2;
const startY = triggerBox.y + triggerBox.height - 2;
const endX = menuBox.x + 20;
const endY = menuBox.y + 20;

let everClosed = false;
const steps = 25;
for (let i = 1; i <= steps; i++) {
  const x = startX + ((endX - startX) * i) / steps;
  const y = startY + ((endY - startY) * i) / steps;
  await page.mouse.move(x, y);
  await page.waitForTimeout(20);
  const visible = await menu.isVisible().catch(() => false);
  if (!visible) {
    everClosed = true;
    console.log(`menu CLOSED at step ${i}/${steps} (x=${Math.round(x)}, y=${Math.round(y)})`);
  }
}

console.log("menu ever closed during the transit:", everClosed);
console.log("menu visible at final position:", await menu.isVisible().catch(() => false));

// Now actually click the first real menu item and confirm real navigation.
const firstItem = menu.getByRole("menuitem").first();
const itemText = await firstItem.textContent().catch(() => null);
if (await firstItem.isVisible().catch(() => false)) {
  await firstItem.click();
  await page.waitForLoadState("networkidle", { timeout: 15000 });
  console.log("clicked menu item:", itemText, "-> navigated to:", page.url());
} else {
  console.log("menu item not visible/clickable at end of transit — bug still present");
}

await page.screenshot({ path: path.join(SCRATCH, "dropdown-gap-result.png") });
await browser.close();
