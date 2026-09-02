#!/usr/bin/env node
// Generates grid-thumbnail-sized copies of each work's cover image next to
// the original (media/thumb/<filename>), so the Works grid never has to
// decode/serve the full-resolution original just to show a small card.
//
// Target: shorter side >= 720px, ~2.5x the desktop grid card's rendered
// short side (284px at the 1920px design baseline). Never upscales.
//
// Usage: node scripts/generate-thumbnails.mjs

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const WORKS_DIR = path.join(process.cwd(), "content", "works");
const TARGET_MIN_SIDE = 720;

function getDims(file) {
  const out = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", file], {
    encoding: "utf-8",
  });
  const w = Number(out.match(/pixelWidth: (\d+)/)[1]);
  const h = Number(out.match(/pixelHeight: (\d+)/)[1]);
  return { w, h };
}

function toThumbRelPath(coverRel) {
  const idx = coverRel.lastIndexOf("/");
  const dir = idx === -1 ? "" : coverRel.slice(0, idx + 1);
  const base = idx === -1 ? coverRel : coverRel.slice(idx + 1);
  return `${dir}thumb/${base}`;
}

let generated = 0;
let skipped = 0;

for (const slug of fs.readdirSync(WORKS_DIR)) {
  const workDir = path.join(WORKS_DIR, slug);
  if (slug.startsWith("_") || slug.startsWith(".") || !fs.statSync(workDir).isDirectory()) continue;

  const metaPath = path.join(workDir, "meta.json");
  if (!fs.existsSync(metaPath)) continue;
  const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
  if (!meta.cover) continue;

  const srcPath = path.join(workDir, meta.cover);
  if (!fs.existsSync(srcPath)) {
    console.warn(`! missing cover for ${slug}: ${meta.cover}`);
    continue;
  }

  const thumbRel = toThumbRelPath(meta.cover);
  const thumbPath = path.join(workDir, thumbRel);
  if (fs.existsSync(thumbPath)) {
    skipped++;
    continue;
  }

  const { w, h } = getDims(srcPath);
  const minSide = Math.min(w, h);
  if (minSide <= TARGET_MIN_SIDE) {
    skipped++;
    continue;
  }

  const scale = TARGET_MIN_SIDE / minSide;
  const newW = Math.round(w * scale);
  const newH = Math.round(h * scale);

  fs.mkdirSync(path.dirname(thumbPath), { recursive: true });
  execFileSync("sips", ["-z", String(newH), String(newW), srcPath, "--out", thumbPath], {
    stdio: "ignore",
  });
  generated++;
  console.log(`${slug}/${meta.cover}  ${w}x${h} -> ${newW}x${newH}`);
}

console.log(`\nDone. generated=${generated} skipped=${skipped}`);
