import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--no-sandbox"] });

// Diagnose #1: masters table overflow at 375px
{
  const page = await browser.newPage({ viewport: { width: 375, height: 900 } });
  await page.goto("http://localhost:3000/masters", { waitUntil: "networkidle", timeout: 20000 });
  await page.waitForTimeout(200);
  const info = await page.evaluate(() => {
    const table = document.querySelector("table");
    const wrapper = table?.parentElement;
    const container = wrapper?.parentElement;
    const vw = document.documentElement.clientWidth;
    return {
      vw,
      table: table ? { width: table.getBoundingClientRect().width, right: table.getBoundingClientRect().right } : null,
      wrapper: wrapper
        ? {
            cls: wrapper.className,
            width: wrapper.getBoundingClientRect().width,
            right: wrapper.getBoundingClientRect().right,
            scrollWidth: wrapper.scrollWidth,
            clientWidth: wrapper.clientWidth,
            overflowX: getComputedStyle(wrapper).overflowX,
          }
        : null,
      container: container
        ? {
            cls: container.className,
            width: container.getBoundingClientRect().width,
            right: container.getBoundingClientRect().right,
            display: getComputedStyle(container).display,
          }
        : null,
    };
  });
  console.log("=== MASTERS TABLE DIAGNOSIS ===");
  console.log(JSON.stringify(info, null, 2));
  await page.close();
}

// Diagnose #2: mystery 1024px overflow on a minimal page
{
  const page = await browser.newPage({ viewport: { width: 1024, height: 900 } });
  await page.goto("http://localhost:3000/login", { waitUntil: "networkidle", timeout: 20000 });
  await page.waitForTimeout(200);
  const allOverflowing = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const results = [];
    for (const el of document.querySelectorAll("body *")) {
      const rect = el.getBoundingClientRect();
      const overshoot = rect.right - vw;
      if (overshoot > 1) {
        const style = getComputedStyle(el);
        results.push({
          tag: el.tagName,
          id: el.id,
          cls: el.className?.toString?.().slice(0, 120),
          right: Math.round(rect.right),
          overshoot: Math.round(overshoot),
          display: style.display,
          position: style.position,
        });
      }
    }
    return results;
  });
  console.log("\n=== 1024px OVERFLOW ON /login (ALL offending elements) ===");
  console.log(JSON.stringify(allOverflowing, null, 2));
  await page.close();
}

await browser.close();
