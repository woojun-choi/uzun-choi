#!/usr/bin/env node
// Generates detail-page-sized copies of every work's media images next to
// the originals (media/detail/<filename>), so work detail pages (hero +
// stacked gallery) never have to serve the full-resolution original just to
// fill a fluid-width layout. Some originals in this project run 40-70MB —
// this is what made detail pages slow to load, especially on bad wifi.
//
// Target: longer side <= 2400px (comfortable headroom over the ~1800px
// CSS-pixel wide stacked images and the hero box at the 1920px desktop
// baseline). Never upscales. JPEG re-encoded at quality 82; PNG just
// resized (sips has no PNG quality knob). The lightbox's zoom mode still
// serves the true original — see app/works-media/[...path]/route.ts.
//
// Usage: node scripts/generate-detail-images.mjs

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const WORKS_DIR = path.join(process.cwd(), "content", "works");
const TARGET_MAX_SIDE = 2400;
const JPEG_QUALITY = 82;
const MEDIA_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);

function getDims(file) {
  const out = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", file], {
    encoding: "utf-8",
  });
  const w = Number(out.match(/pixelWidth: (\d+)/)[1]);
  const h = Number(out.match(/pixelHeight: (\d+)/)[1]);
  return { w, h };
}

let generated = 0;
let skipped = 0;

for (const slug of fs.readdirSync(WORKS_DIR)) {
  const workDir = path.join(WORKS_DIR, slug);
  if (slug.startsWith("_") || slug.startsWith(".") || !fs.statSync(workDir).isDirectory()) continue;

  const mediaDir = path.join(workDir, "media");
  if (!fs.existsSync(mediaDir)) continue;

  for (const file of fs.readdirSync(mediaDir)) {
    const ext = path.extname(file).toLowerCase();
    if (!MEDIA_EXTENSIONS.has(ext)) continue;
    const srcPath = path.join(mediaDir, file);
    if (!fs.statSync(srcPath).isFile()) continue;

    const detailPath = path.join(mediaDir, "detail", file);
    if (fs.existsSync(detailPath)) {
      skipped++;
      continue;
    }

    const { w, h } = getDims(srcPath);
    const maxSide = Math.max(w, h);
    if (maxSide <= TARGET_MAX_SIDE) {
      skipped++;
      continue;
    }

    const scale = TARGET_MAX_SIDE / maxSide;
    const newW = Math.round(w * scale);
    const newH = Math.round(h * scale);

    fs.mkdirSync(path.dirname(detailPath), { recursive: true });
    const args = ["-z", String(newH), String(newW)];
    if (ext === ".jpg" || ext === ".jpeg") {
      args.push("-s", "formatOptions", String(JPEG_QUALITY));
    }
    args.push(srcPath, "--out", detailPath);
    execFileSync("sips", args, { stdio: "ignore" });
    generated++;
    console.log(`${slug}/media/${file}  ${w}x${h} -> ${newW}x${newH}`);
  }
}

console.log(`\nDone. generated=${generated} skipped=${skipped}`);
