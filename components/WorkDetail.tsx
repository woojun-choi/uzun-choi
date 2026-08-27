"use client";

import { useState } from "react";
import Image from "next/image";
import ScrollNav from "./ScrollNav";
import type { WorkMeta } from "@/lib/works";

function Divider() {
  return <div className="h-px w-full bg-white/15" />;
}

const STACKED_LIMIT = 7;

// Deterministic per-slug shuffle so the same subset (and order) shows on every load.
function hashSeed(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(h, 31) + str.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickStacked(media: string[], seedKey: string, limit = STACKED_LIMIT) {
  if (media.length <= limit) return media;
  const rand = mulberry32(hashSeed(seedKey));
  const indices = media.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices
    .slice(0, limit)
    .sort((a, b) => a - b)
    .map((i) => media[i]);
}

function toYoutubeEmbedUrl(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    const id = u.searchParams.get("v");
    if (id) return `https://www.youtube.com/embed/${id}`;
  } catch {
    // fall through
  }
  return url;
}

export default function WorkDetail({
  work,
  media,
  description,
}: {
  work: WorkMeta;
  media: string[];
  description: { ko: string; en: string };
}) {
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroPortrait, setHeroPortrait] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const total = media.length;
  const pad = (zeroBased: number) => String(zeroBased + 1).padStart(2, "0");
  const arrowsDisabled = total <= 1;
  const showStacked = total > 8;
  const stackedMedia = showStacked ? pickStacked(media, work.slug) : [];

  const heroPrev = () => setHeroIndex((i) => (i - 1 + total) % total);
  const heroNext = () => setHeroIndex((i) => (i + 1) % total);
  const openLightbox = (i: number) => {
    setLightbox(i);
    setIsZoomed(false);
  };
  const closeLightbox = () => {
    setLightbox(null);
    setIsZoomed(false);
  };
  const lightboxPrev = () => {
    setLightbox((i) => (i === null ? i : (i - 1 + total) % total));
    setIsZoomed(false);
  };
  const lightboxNext = () => {
    setLightbox((i) => (i === null ? i : (i + 1) % total));
    setIsZoomed(false);
  };

  return (
    <main className="bg-[#0c0c0c] pt-[7.291667vw] text-white">
      {/* Carousel — fixed-size box (1520x855.66 @1920 baseline). Landscape images
          object-cover (crop, fills box, per Figma). Portrait images object-contain
          (fit to box height, no crop, pillarboxed on the same dark background). */}
      <div className="relative mx-auto h-[46.354167vw] w-[93.385417vw]">
        {total > 0 && (
          // eslint-disable-next-line @next/next/no-img-element -- fixed box, orientation-aware fit
          <img
            src={media[heroIndex]}
            alt={work.title.ko}
            onClick={() => openLightbox(heroIndex)}
            onLoad={(e) =>
              setHeroPortrait(e.currentTarget.naturalHeight > e.currentTarget.naturalWidth)
            }
            className={`absolute top-0 left-[7.109375vw] h-[44.565679vw] w-[79.166667vw] cursor-zoom-in ${heroPortrait ? "object-contain" : "object-cover"}`}
          />
        )}

        <div className="absolute bottom-[4.010417vw] left-0 flex items-start gap-[0.416667vw]">
          <h1
            className="text-[5.208333vw] leading-none font-bold"
            style={{ textShadow: "1px 1px 0 rgba(0,0,0,0.1)" }}
          >
            {work.title.ko}
          </h1>
          <p
            className="text-[1.5625vw] font-bold"
            style={{ fontFamily: '"NEXON Lv2 Gothic"', textShadow: "1px 1px 0 rgba(0,0,0,0.1)" }}
          >
            {work.year}
          </p>
        </div>

        {total > 0 && (
          <ScrollNav
            current={heroIndex + 1}
            total={total}
            onUp={heroPrev}
            onDown={heroNext}
            disabled={arrowsDisabled}
            className="absolute right-0 bottom-[4.010417vw]"
          />
        )}
      </div>

      {/* Body */}
      <div className="mx-auto flex w-[93.90625vw] flex-col gap-[6.25vw] pt-[10.41667vw] pb-[3.125vw]">
        {/* Description */}
        <div className="flex flex-col gap-[3.125vw]">
          <Divider />
          <div className="flex items-start justify-between">
            <p className="w-[11.40625vw] shrink-0 pl-[0.520833vw] text-[1.25vw] leading-[2.1875vw] font-bold">
              Description
            </p>
            <div className="flex w-[48.489583vw] flex-col gap-[1.2vw] text-[1.145833vw] leading-[2.1875vw] font-bold">
              {description.en && (
                <div className="flex flex-col gap-[0.4vw]">
                  {description.en
                    .split(/\n{2,}/)
                    .map((p, i) => <p key={`en-${i}`}>{p}</p>)}
                </div>
              )}
              {description.ko && (
                <div className="flex flex-col gap-[0.4vw]">
                  {description.ko
                    .split(/\n{2,}/)
                    .map((p, i) => <p key={`ko-${i}`}>{p}</p>)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Credit */}
        {work.credit && work.credit.length > 0 && (
          <div className="flex flex-col gap-[3.125vw]">
            <Divider />
            <div className="flex items-start justify-between pl-[0.520833vw]">
              <p className="text-[1.25vw] font-bold whitespace-nowrap">
                Credit
              </p>
              <div className="flex w-[48.645833vw] flex-col gap-[0.520833vw]">
                {work.credit.map((c, i) => (
                  <div
                    key={`${c.role}-${i}`}
                    className="flex items-center justify-between text-[1.25vw] leading-[2.864583vw] font-bold"
                  >
                    <p>{c.role}</p>
                    <p className="pr-[0.78125vw]">{c.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stacked detail images — only when the work has more than 8 images.
            Capped at STACKED_LIMIT via a slug-seeded shuffle so the same subset
            (in original order) shows on every load, rather than all of them. */}
        {showStacked && (
          <div className="flex flex-col gap-[6.25vw]">
            <Divider />
            {stackedMedia.map((src) => {
              const i = media.indexOf(src);
              return (
                <div
                  key={src}
                  className="relative w-full cursor-zoom-in"
                  onClick={() => openLightbox(i)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- full natural height, no crop */}
                  <img src={src} alt="" className="block w-full" />
                </div>
              );
            })}
            {work.videoUrl && (
              <div className="relative aspect-video w-full">
                <iframe
                  src={toYoutubeEmbedUrl(work.videoUrl)}
                  title={work.title.en}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            )}
          </div>
        )}

        {/* Copyright */}
        <div className="flex flex-col items-center gap-[13.75vw]">
          <Divider />
          <p className="text-center text-[1.041667vw] text-white">
            © 2026 UZUN. All rights reserved.
          </p>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && total > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95">
          {/* Same vertical band + right padding as Header, so this X lines up exactly with the header's X */}
          <div className="absolute top-0 right-0 z-10 flex h-[8.85417vw] items-center pr-[4.42708vw]">
            <button type="button" onClick={closeLightbox} aria-label="닫기">
              <Image
                src="/assets/icons/close-x.svg"
                alt=""
                width={35}
                height={35}
                className="w-[1.82292vw] rotate-45"
              />
            </button>
          </div>
          <button
            type="button"
            onClick={lightboxPrev}
            aria-label="이전"
            className="absolute top-1/2 left-[4.42708vw] z-10 -translate-y-1/2 rotate-90"
          >
            <Image
              src="/assets/icons/chevron-down.svg"
              alt=""
              width={26}
              height={14}
              className="w-[1.354167vw]"
            />
          </button>
          <button
            type="button"
            onClick={lightboxNext}
            aria-label="다음"
            className="absolute top-1/2 right-[4.42708vw] z-10 -translate-y-1/2 -rotate-90"
          >
            <Image
              src="/assets/icons/chevron-down.svg"
              alt=""
              width={26}
              height={14}
              className="w-[1.354167vw]"
            />
          </button>

          {isZoomed ? (
            <div className="max-h-[90vh] max-w-[90vw] overflow-auto">
              {/* eslint-disable-next-line @next/next/no-img-element -- native size, scrollable zoom */}
              <img
                src={media[lightbox]}
                alt=""
                onClick={() => setIsZoomed(false)}
                className="max-w-none cursor-zoom-out"
              />
            </div>
          ) : (
            <div className="flex h-[80vh] w-[80vw] items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element -- fit without cropping */}
              <img
                src={media[lightbox]}
                alt=""
                onClick={() => setIsZoomed(true)}
                className="max-h-full max-w-full cursor-zoom-in object-contain"
              />
            </div>
          )}

          <div className="absolute bottom-[2.916667vw] left-1/2 flex -translate-x-1/2 items-center gap-[0.729167vw] text-[0.9375vw] font-bold">
            <span>{pad(lightbox)}</span>
            <div className="h-[0.9375vw] w-px bg-white/40" />
            <span className="opacity-50">{pad(total - 1)}</span>
          </div>
        </div>
      )}
    </main>
  );
}
