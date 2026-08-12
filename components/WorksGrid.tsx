"use client";

import { useState } from "react";
import Image from "next/image";
import type { WorkCategory, WorkMeta } from "@/lib/works";

const TAGS: { label: string; value: WorkCategory | "ALL" }[] = [
  { label: "ALL", value: "ALL" },
  { label: "PHOTO", value: "photo" },
  { label: "FILM", value: "film" },
  { label: "DESIGN", value: "design" },
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
    <main className="flex min-h-screen bg-[#0c0c0c] pt-[9.89583vw] text-white">
      <div className="ml-[4.42708vw] flex w-[94.01042vw] pb-[3.125vw]">
        <nav className="relative z-10 mr-[-2.447917vw] flex w-[19.27083vw] shrink-0 flex-col gap-[1.04167vw] text-[5.20833vw] leading-none font-black">
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
            <div
              key={work.slug}
              className="relative aspect-[284.4/457.5] w-full overflow-hidden bg-white/5"
            >
              <Image
                src={work.coverUrl}
                alt={work.title.ko}
                fill
                className="object-cover"
              />
            </div>
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
