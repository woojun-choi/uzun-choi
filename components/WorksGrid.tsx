"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { WorkCategory, WorkMeta } from "@/lib/works";

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

  const filtered =
    active === "ALL" ? works : works.filter((w) => w.category.includes(active));

  return (
    <main className="flex min-h-screen bg-[#0c0c0c] pt-[8.85417vw] text-white">
      <div className="ml-[4.42708vw] flex w-[94.01042vw] pb-[3.125vw]">
        <nav className="sticky top-[8.85417vw] z-10 mr-[-2.447917vw] flex h-fit w-[19.27083vw] shrink-0 flex-col gap-[1.04167vw] text-[5.20833vw] leading-none font-black">
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

        <div className="grid flex-1 grid-cols-5 gap-[0.78125vw] content-start">
          {filtered.map((work) => (
            <Link
              key={work.slug}
              href={`/works/${work.slug}`}
              className="group relative aspect-[284.4/457.5] w-full overflow-hidden bg-white/5 transition-transform duration-300 ease-out hover:scale-[0.94]"
            >
              <Image
                src={work.coverUrl}
                alt={work.title.ko}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="absolute top-[1.04167vw] right-[1.04167vw] text-[0.885417vw] text-white/60">
                  {work.year}
                </p>
                <p className="absolute bottom-[0.625vw] left-[1.04167vw] text-[1.458333vw] font-[850] text-white">
                  {work.title.ko}
                </p>
              </div>
            </Link>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-5 text-white/40">
              해당 분류의 작업물이 아직 없습니다.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
