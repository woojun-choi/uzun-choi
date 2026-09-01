"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { WorkCategory, WorkMeta } from "@/lib/works";
import { useSwipe } from "@/lib/useSwipe";

const FULL_SIZE_THUMBNAIL_SLUGS = new Set([
  "2026-15-10-pure-freestyle",
  "2026-09-movie-land",
  "2026-01-noknok",
  "2025-01-dakdari",
  "2025-03-waffle",
  "2026-16-uzun-bi",
  "2026-14-jeju",
]);

const TAGS: { label: string; value: WorkCategory | "ALL" }[] = [
  { label: "ALL", value: "ALL" },
  { label: "PHOTO", value: "photo" },
  { label: "FILM", value: "film" },
  { label: "DESIGN", value: "design" },
  { label: "EDITORIAL", value: "editorial" },
  { label: "DEV", value: "dev" },
];

export default function WorksGrid({
  works,
}: {
  works: (WorkMeta & { coverUrl: string })[];
}) {
  const [active, setActive] = useState<WorkCategory | "ALL">("ALL");
  const [tagSlide, setTagSlide] = useState(0);
  const tagRailRef = useRef<HTMLDivElement>(null);

  useSwipe(
    tagRailRef,
    (direction) => {
      setTagSlide((i) => Math.min(TAGS.length - 1, Math.max(0, i + direction)));
    },
    { axis: "x" }
  );

  const filtered =
    active === "ALL" ? works : works.filter((w) => w.category.includes(active));

  return (
    <main className="relative flex min-h-screen flex-col bg-[#0c0c0c] pt-[28.20513vw] text-white md:pt-[8.85417vw]">
      {/* Mobile: full-viewport-width tag pager, swipe to bring the next tag into
          view and tap to select (Figma "M 3. Works" — each label is its own
          screen-width slide, not a compact chip). Positioned absolutely at its
          exact Figma top (measured from the page top, not from the header
          spacer) so the grid below doesn't depend on estimating this row's
          rendered text height. Left inset matches the grid's own left padding
          below (not Figma's literal value) so the tag text lines up with the
          grid's left edge. */}
      <div
        ref={tagRailRef}
        className="absolute inset-x-0 top-[25.641vw] h-[16.6667vw] touch-pan-y overflow-hidden text-[10.7692vw] font-black opacity-90 md:hidden"
      >
        <div
          className="flex ease-[cubic-bezier(0.65,0,0.35,1)] transition-transform duration-300"
          style={{ transform: `translateX(-${tagSlide * 100}vw)` }}
        >
          {TAGS.map((tag) => (
            <button
              key={tag.value}
              type="button"
              onClick={() => setActive(tag.value)}
              className={`w-screen shrink-0 pl-[6.92308vw] text-left transition-opacity ${
                active === tag.value ? "opacity-100" : "opacity-30"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-[14.1026vw] flex w-full flex-col px-[6.92308vw] pb-[6.92308vw] md:mt-0 md:ml-[4.42708vw] md:w-[94.01042vw] md:flex-row md:px-0 md:pb-[3.125vw]">
        <nav className="hidden md:sticky md:top-[8.85417vw] md:z-10 md:mr-[-2.447917vw] md:flex md:h-fit md:w-[19.27083vw] md:shrink-0 md:flex-col md:gap-[1.04167vw] md:text-[5.20833vw] md:leading-none md:font-black">
          {TAGS.map((tag) => (
            <button
              key={tag.value}
              type="button"
              onClick={() => setActive(tag.value)}
              className={`text-left whitespace-nowrap transition-opacity hover:opacity-100 ${
                active === tag.value ? "opacity-100" : "opacity-30"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </nav>

        <div className="grid grid-cols-2 gap-[2.21362vw] content-start md:flex-1 md:grid-cols-5 md:gap-[0.78125vw]">
          {filtered.map((work) => (
            <Link
              key={work.slug}
              href={`/works/${work.slug}`}
              className="group relative aspect-[284.4/457.5] w-full overflow-hidden bg-white/5 transition-transform duration-300 ease-out md:hover:scale-[0.94]"
            >
              <Image
                src={work.coverUrl}
                alt={work.title.ko}
                fill
                sizes={
                  FULL_SIZE_THUMBNAIL_SLUGS.has(work.slug)
                    ? undefined
                    : "(min-width: 768px) 20vw, 50vw"
                }
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/45 opacity-0 transition-opacity duration-300 md:group-hover:opacity-100">
                <p className="absolute top-[1.04167vw] right-[1.04167vw] text-[1.041667vw] text-white/60">
                  {work.year}
                </p>
                <p className="absolute bottom-[0.625vw] left-[1.04167vw] text-[1.770833vw] font-[850] text-white">
                  {work.title.ko}
                </p>
              </div>
            </Link>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-2 text-white/40 md:col-span-5">
              해당 분류의 작업물이 아직 없습니다.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
