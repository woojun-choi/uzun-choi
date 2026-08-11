import fs from "node:fs";
import path from "node:path";

const WORKS_DIR = path.join(process.cwd(), "content", "works");

export type WorkCategory = "photo" | "film" | "design" | "dev";

export type WorkMeta = {
  slug: string;
  title: { ko: string; en: string };
  year: number;
  category: WorkCategory[];
  cover: string;
  order: number;
};

export function getAllWorks(): WorkMeta[] {
  if (!fs.existsSync(WORKS_DIR)) return [];
  const entries = fs.readdirSync(WORKS_DIR, { withFileTypes: true });
  const works: WorkMeta[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
    const metaPath = path.join(WORKS_DIR, entry.name, "meta.json");
    if (!fs.existsSync(metaPath)) continue;
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    works.push({ ...meta, slug: entry.name });
  }

  return works.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function workCoverUrl(work: WorkMeta) {
  return `/works-media/${work.slug}/${work.cover}`;
}
