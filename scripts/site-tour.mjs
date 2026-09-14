// One-off Playwright script: records a full-site walkthrough (desktop + mobile
// viewports) as video, plus screenshots at each stop, for social/portfolio use.
// Run with the dev server already up: `node scripts/site-tour.mjs`
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = process.env.BASE_URL || "http://localhost:3200";
const OUT_DIR = path.join(process.cwd(), "tour-output");
const SHOTS_DIR = path.join(OUT_DIR, "screenshots");
const VIDEOS_DIR = path.join(OUT_DIR, "videos");

// Video/screenshot output is always the *logical* viewport in CSS pixels times
// deviceScaleFactor (recordVideo.size must be set explicitly to that DPR-scaled
// value, or it silently downscales to the logical size). So true 4K comes from
// a *realistic* logical viewport — matching what the site's clamp()-based fluid
// type actually targets — rendered at deviceScaleFactor 2, NOT from blowing the
// logical viewport itself up to 3840 (that under-fills clamped text like the
// menu overlay, since its vw-based size caps out well before 3840px width).
const VIEWPORTS = {
  desktop: {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 2,
    isMobile: false,
    hasTouch: false,
    videoWidth: 3840,
    videoHeight: 2160,
  },
  mobile: {
    width: 405,
    height: 720,
    deviceScaleFactor: 16 / 3,
    isMobile: true,
    hasTouch: true,
    videoWidth: 2160,
    videoHeight: 3840,
  },
};

const TOUR_SLUGS = [
  "2026-09-movie-land",
  "2026-14-jeju",
  "2026-01-noknok",
  "2026-16-uzun-bi",
  "2025-01-dakdari",
  "2026-11-magazine-a-uzun",
];

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function shoot(page, dir, n, label) {
  const name = `${String(n).padStart(2, "0")}-${label}.jpg`;
  await page.screenshot({ path: path.join(dir, name), type: "jpeg", quality: 92 });
  return name;
}

async function clickIfVisible(locator, timeout = 1500) {
  try {
    await locator.waitFor({ state: "visible", timeout });
    await locator.click();
    return true;
  } catch {
    return false;
  }
}

async function runTour(browser, deviceName) {
  const viewport = VIEWPORTS[deviceName];
  const shotDir = path.join(SHOTS_DIR, deviceName);
  fs.mkdirSync(shotDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: viewport.deviceScaleFactor,
    isMobile: viewport.isMobile,
    hasTouch: viewport.hasTouch,
    recordVideo: {
      dir: path.join(VIDEOS_DIR, deviceName),
      size: { width: viewport.videoWidth, height: viewport.videoHeight },
    },
  });
  const page = await context.newPage();
  let n = 0;
  const next = (label) => shoot(page, shotDir, ++n, label);

  console.log(`[${deviceName}] home`);
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await wait(1200);
  await next("home");

  const nextSlideBtn = page.getByRole("button", { name: "Next" }).first();
  for (let i = 0; i < 4; i++) {
    if (await clickIfVisible(nextSlideBtn)) {
      await wait(1100);
      await next("home-slide");
    }
  }

  console.log(`[${deviceName}] menu`);
  await clickIfVisible(page.getByRole("button", { name: "Open menu" }));
  await wait(700);
  await next("menu-open");

  console.log(`[${deviceName}] works`);
  await page.getByRole("link", { name: "Works" }).click();
  await page.waitForURL("**/works");
  await wait(1000);
  await next("works");

  if (!viewport.isMobile) {
    const firstCard = page.locator("a[href^='/works/']").first();
    await firstCard.hover().catch(() => {});
    await wait(400);
    await next("works-hover");
  }

  await page.mouse.wheel(0, viewport.height * 0.8);
  await wait(600);
  await next("works-scroll");

  for (const tag of ["PHOTO", "FILM", "DESIGN", "EDITORIAL"]) {
    const tagBtn = page.getByRole("button", { name: tag }).first();
    if (await clickIfVisible(tagBtn)) {
      await wait(500);
      await next(`works-filter-${tag.toLowerCase()}`);
    }
  }
  await clickIfVisible(page.getByRole("button", { name: "ALL" }).first());
  await wait(400);

  await page.keyboard.press("End");
  await wait(600);
  await next("works-bottom");

  for (const slug of TOUR_SLUGS) {
    console.log(`[${deviceName}] work detail: ${slug}`);
    await page.goto(`${BASE_URL}/works/${slug}`, { waitUntil: "networkidle" });
    await wait(1000);
    await next(`work-${slug}`);

    const heroImg = page.locator("img.cursor-zoom-in").first();
    if (await clickIfVisible(heroImg)) {
      await wait(700);
      await next(`work-${slug}-lightbox`);
      if (await clickIfVisible(page.getByRole("button", { name: "다음" }))) {
        await wait(600);
        await next(`work-${slug}-lightbox-2`);
      }
      await clickIfVisible(page.getByRole("button", { name: "닫기" }));
      await wait(400);
    }

    await page.mouse.wheel(0, viewport.height * 0.9);
    await wait(600);
    await next(`work-${slug}-description`);

    await page.mouse.wheel(0, viewport.height * 1.5);
    await wait(600);
    await next(`work-${slug}-gallery`);

    await page.keyboard.press("End");
    await wait(600);
    await next(`work-${slug}-bottom`);
  }

  console.log(`[${deviceName}] about`);
  await page.goto(`${BASE_URL}/about`, { waitUntil: "networkidle" });
  await wait(1000);
  await next("about");

  const aboutScrollHeight = await page.evaluate(() => document.body.scrollHeight);
  for (const fraction of [0.25, 0.5, 0.75, 1]) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(aboutScrollHeight * fraction));
    await wait(500);
    await next(`about-scroll-${Math.round(fraction * 100)}`);
  }

  console.log(`[${deviceName}] contact`);
  await page.goto(`${BASE_URL}/contact`, { waitUntil: "networkidle" });
  await wait(1000);
  await next("contact");

  if (!viewport.isMobile) {
    await page.getByRole("button", { name: "uzunchoi@gmail.com" }).hover().catch(() => {});
    await wait(1200);
    await next("contact-hover");
  } else {
    await clickIfVisible(page.getByRole("button", { name: "uzunchoi@gmail.com" }));
    await wait(500);
    await next("contact-tapped");
  }

  await context.close();
  console.log(`[${deviceName}] done, video saved under ${path.join(VIDEOS_DIR, deviceName)}`);
}

async function main() {
  fs.mkdirSync(SHOTS_DIR, { recursive: true });
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });

  const browser = await chromium.launch();
  for (const deviceName of Object.keys(VIEWPORTS)) {
    await runTour(browser, deviceName);
  }
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
