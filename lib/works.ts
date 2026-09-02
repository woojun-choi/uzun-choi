import fs from "node:fs";
import path from "node:path";

const WORKS_DIR = path.join(process.cwd(), "content", "works");

export type WorkCategory = "photo" | "film" | "design" | "editorial" | "dev";

export type WorkCredit = { role: string; name: string };

export type WorkMeta = {
  slug: string;
  title: { ko: string; en: string };
  year: number;
  category: WorkCategory[];
  cover: string;
  heroCover?: string;
  order: number;
  credit?: WorkCredit[];
  videoUrl?: string;
  featured?: boolean;
  featuredMobile?: boolean;
  mobileOrder?: number;
  heroMedia?: string[];
  stackedMedia?: string[];
  stackedPinned?: string[];
  stackedRandomPool?: string[];
  stackedRandomCount?: number;
  heroPortrait?: boolean;
};

const MEDIA_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp"]);

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

export function getFeaturedWorks(): WorkMeta[] {
  return getAllWorks().filter((work) => work.featured);
}

export function getFeaturedMobileWorks(): WorkMeta[] {
  return getAllWorks()
    .filter((work) => work.featuredMobile)
    .sort((a, b) => (a.mobileOrder ?? 0) - (b.mobileOrder ?? 0));
}

export function getWork(slug: string): WorkMeta | undefined {
  return getAllWorks().find((work) => work.slug === slug);
}

export function workCoverUrl(work: WorkMeta) {
  return `/works-media/${work.slug}/${work.cover}`;
}

function toThumbRelPath(coverRel: string): string {
  const idx = coverRel.lastIndexOf("/");
  const dir = idx === -1 ? "" : coverRel.slice(0, idx + 1);
  const base = idx === -1 ? coverRel : coverRel.slice(idx + 1);
  return `${dir}thumb/${base}`;
}

export function workCoverThumbUrl(work: WorkMeta) {
  const thumbRel = toThumbRelPath(work.cover);
  const thumbPath = path.join(WORKS_DIR, work.slug, thumbRel);
  return fs.existsSync(thumbPath)
    ? `/works-media/${work.slug}/${thumbRel}`
    : workCoverUrl(work);
}

export function workHeroCoverUrl(work: WorkMeta) {
  return `/works-media/${work.slug}/${work.heroCover ?? work.cover}`;
}

export function getWorkMedia(slug: string): string[] {
  const mediaDir = path.join(WORKS_DIR, slug, "media");
  if (!fs.existsSync(mediaDir)) return [];

  return fs
    .readdirSync(mediaDir)
    .filter((file) => MEDIA_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort()
    .map((file) => `/works-media/${slug}/media/${file}`);
}

export function getWorkDescription(slug: string): { ko: string; en: string } {
  const read = (locale: "ko" | "en") => {
    const filePath = path.join(WORKS_DIR, slug, `content.${locale}.md`);
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf-8").trim() : "";
  };
  return { ko: read("ko"), en: read("en") };
}
