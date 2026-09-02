"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ScrollNav from "./ScrollNav";
import type { WorkMeta } from "@/lib/works";
import { useSwipe } from "@/lib/useSwipe";

function Divider() {
  return <div className="h-[2px] w-full bg-white/60 md:h-px" />;
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

function shuffle<T>(arr: T[]) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Randomly pick `count` items but keep their original relative order.
function pickRandomInOrder<T>(arr: T[], count: number) {
  const indices = shuffle(arr.map((_, i) => i))
    .slice(0, count)
    .sort((a, b) => a - b);
  return indices.map((i) => arr[i]);
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
  const router = useRouter();
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroPortrait, setHeroPortrait] = useState(work.heroPortrait ?? false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [titleWraps, setTitleWraps] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const checkWrap = () => {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      setTitleWraps(el.scrollHeight > lineHeight * 1.5);
    };
    checkWrap();
    window.addEventListener("resize", checkWrap);
    return () => window.removeEventListener("resize", checkWrap);
  }, [work.slug]);

  const resolveMedia = (files: string[]) =>
    files.map((f) => `/works-media/${work.slug}/${f}`);

  const heroMedia = work.heroMedia?.length ? resolveMedia(work.heroMedia) : media;
  const heroTotal = heroMedia.length;
  const heroArrowsDisabled = heroTotal <= 1;

  const stackedPinned = work.stackedPinned?.length ? resolveMedia(work.stackedPinned) : [];
  const stackedPool = work.stackedRandomPool?.length ? resolveMedia(work.stackedRandomPool) : [];
  const stackedRandomCount = work.stackedRandomCount ?? stackedPool.length;

  const [stackedPicks, setStackedPicks] = useState(() => stackedPool.slice(0, stackedRandomCount));
  useEffect(() => {
    if (!stackedPool.length) return;
    setStackedPicks(pickRandomInOrder(stackedPool, stackedRandomCount));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [work.slug]);

  const total = media.length;
  const pad = (zeroBased: number) => String(zeroBased + 1).padStart(2, "0");
  const showStacked = total > 8;
  const stackedMedia = showStacked
    ? stackedPinned.length || stackedPool.length
      ? [...stackedPinned, ...stackedPicks]
      : work.stackedMedia?.length
        ? resolveMedia(work.stackedMedia)
        : pickStacked(media, work.slug)
    : [];

  const heroPrev = () => setHeroIndex((i) => (i - 1 + heroTotal) % heroTotal);
  const heroNext = () => setHeroIndex((i) => (i + 1) % heroTotal);
  const heroCarouselRef = useRef<HTMLDivElement>(null);
  useSwipe(heroCarouselRef, (direction) => setHeroIndex((i) => (i + direction + heroTotal) % heroTotal), {
    axis: "x",
  });
  const openLightbox = (i: number) => {
    setLightbox(i);
    setIsZoomed(false);
  };
  const closeLightbox = () => {
    setLightbox(null);
    setIsZoomed(false);
  };

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (lightbox !== null) {
        closeLightbox();
      } else {
        router.push("/works");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightbox, router]);
  const lightboxPrev = () => {
    setLightbox((i) => (i === null ? i : (i - 1 + total) % total));
    setIsZoomed(false);
  };
  const lightboxNext = () => {
    setLightbox((i) => (i === null ? i : (i + 1) % total));
    setIsZoomed(false);
  };

  return (
    <main className="bg-[#0c0c0c] pt-[21.79487vw] text-white md:pt-[7.291667vw]">
      {/* Carousel — fixed-size box (1520x855.66 @1920 baseline; 342x520 @390
          mobile). Landscape images object-cover (crop, fills box, per Figma).
          Portrait images object-contain (fit to box height, no crop,
          pillarboxed on the same dark background). */}
      <div
        ref={heroCarouselRef}
        className="relative mx-auto h-[147.6923vw] w-[92.8205vw] md:h-[46.354167vw] md:w-[93.385417vw]"
      >
        {heroTotal > 0 && (
          // eslint-disable-next-line @next/next/no-img-element -- fixed box, orientation-aware fit
          <img
            src={heroMedia[heroIndex]}
            alt={work.title.ko}
            onClick={() => openLightbox(media.indexOf(heroMedia[heroIndex]))}
            onLoad={(e) => {
              if (work.heroPortrait === undefined) {
                setHeroPortrait(e.currentTarget.naturalHeight > e.currentTarget.naturalWidth);
              }
            }}
            className={`absolute top-0 left-[2.5641vw] h-[133.3333vw] w-[87.6923vw] cursor-zoom-in md:left-[7.109375vw] md:h-[44.565679vw] md:w-[79.166667vw] ${heroPortrait ? "object-contain" : "object-cover"}`}
          />
        )}

        <div
          className={`absolute top-[141.0256vw] left-[3.33333vw] flex max-w-[65vw] flex-col items-end gap-[0.84vw] md:max-w-none md:flex-row md:items-start md:top-auto md:bottom-[4.010417vw] md:left-0 md:gap-[0.416667vw] ${titleWraps ? "translate-y-[5px] md:translate-y-0" : ""}`}
        >
          <h1
            ref={titleRef}
            className="order-2 text-right text-[10.25641vw] leading-[11.79487vw] font-bold md:order-1 md:text-left md:text-[5.208333vw] md:leading-none"
            style={{ textShadow: "1px 1px 0 rgba(0,0,0,0.1)" }}
          >
            {work.title.ko}
          </h1>
          <p
            className="order-1 hidden text-[3.58974vw] font-bold md:order-2 md:block md:text-[1.5625vw]"
            style={{ fontFamily: '"NEXON Lv2 Gothic"', textShadow: "1px 1px 0 rgba(0,0,0,0.1)" }}
          >
            {work.year}
          </p>
        </div>

        {heroTotal > 0 && (
          <ScrollNav
            current={heroIndex + 1}
            total={heroTotal}
            onUp={heroPrev}
            onDown={heroNext}
            disabled={heroArrowsDisabled}
            className="absolute top-[145.09151vw] right-[4.05897vw] md:top-auto md:right-0 md:bottom-[4.010417vw]"
          />
        )}
      </div>

      {/* Body */}
      <div className="mx-auto flex w-[93.90625vw] flex-col gap-[13.94231vw] pt-[42.0513vw] pb-[3.125vw] md:gap-[6.25vw] md:pt-[10.41667vw]">
        {/* Description */}
        <div className="flex flex-col gap-[5.12821vw] md:gap-[2.604167vw]">
          <Divider />
          <div className="flex flex-col gap-[7.17949vw] px-[1.02564vw] md:flex-row md:items-start md:justify-between md:gap-0 md:px-0">
            <p className="shrink-0 text-[4.87179vw] font-bold md:w-[11.40625vw] md:pl-[0.520833vw] md:text-[1.25vw]">
              Description
            </p>
            <div className="flex flex-col gap-[3.07692vw] font-medium text-white/80 md:w-[48.489583vw] md:gap-[1.2vw] md:font-[550]">
              {description.en && (
                <div className="flex flex-col gap-[0.4vw] text-[4.35897vw] leading-[6.15385vw] md:text-[1.145833vw] md:leading-[1.85vw]">
                  {description.en
                    .split(/\n{2,}/)
                    .map((p, i) => <p key={`en-${i}`}>{p}</p>)}
                </div>
              )}
              {description.ko && (
                <div className="flex flex-col gap-[0.4vw] text-[4.10256vw] leading-[6.66667vw] md:text-[1.145833vw] md:leading-[1.95vw]">
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
          <div className="flex flex-col gap-[5.12821vw] md:gap-[2.604167vw]">
            <Divider />
            <div className="flex flex-col gap-[7.17949vw] px-[1.02564vw] md:flex-row md:items-start md:justify-between md:gap-0 md:px-0 md:pl-[0.520833vw]">
              <p className="text-[4.87179vw] font-bold whitespace-nowrap md:text-[1.25vw]">
                Credit
              </p>
              <div className="flex flex-col gap-[2.05128vw] md:w-[48.645833vw] md:gap-[0.520833vw]">
                {work.credit.map((c, i) => (
                  <div
                    key={`${c.role}-${i}`}
                    className="flex items-center justify-between text-[4.10256vw] font-medium text-white/80 md:text-[1.25vw] md:leading-[2.864583vw] md:font-[550]"
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
            Uses work.stackedMedia if set (explicit curation), otherwise falls
            back to a slug-seeded shuffle capped at STACKED_LIMIT so the same
            subset (in original order) shows on every load. */}
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
          <p className="text-center text-[2.5641vw] text-white md:text-[1.041667vw]">
            © 2026 UZUN. All rights reserved.
          </p>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && total > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95">
          {/* Same vertical band + right padding as Header, so this X lines up exactly with the header's X */}
          <div className="absolute top-[1.28205vw] right-0 z-10 flex h-[20.51282vw] items-center pr-[6.41026vw] md:top-0 md:h-[8.85417vw] md:pr-[4.42708vw]">
            <button type="button" onClick={closeLightbox} aria-label="닫기">
              <Image
                src="/assets/icons/close-x.svg"
                alt=""
                width={35}
                height={35}
                className="w-[8.97436vw] rotate-45 md:w-[1.82292vw]"
              />
            </button>
          </div>
          <button
            type="button"
            onClick={lightboxPrev}
            aria-label="이전"
            className="absolute top-1/2 left-[7.69231vw] z-10 -translate-y-1/2 rotate-90 md:left-[4.42708vw]"
          >
            <Image
              src="/assets/icons/chevron-down.svg"
              alt=""
              width={26}
              height={14}
              className="w-[6.41026vw] md:w-[1.354167vw]"
            />
          </button>
          <button
            type="button"
            onClick={lightboxNext}
            aria-label="다음"
            className="absolute top-1/2 right-[7.69231vw] z-10 -translate-y-1/2 -rotate-90 md:right-[4.42708vw]"
          >
            <Image
              src="/assets/icons/chevron-down.svg"
              alt=""
              width={26}
              height={14}
              className="w-[6.41026vw] md:w-[1.354167vw]"
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

          <div className="absolute bottom-[7.46795vw] left-1/2 flex -translate-x-1/2 items-center gap-[1.86974vw] text-[2.4vw] font-bold md:bottom-[2.916667vw] md:gap-[0.729167vw] md:text-[0.9375vw]">
            <span>{pad(lightbox)}</span>
            <div className="h-[2.4vw] w-px bg-white/40 md:h-[0.9375vw]" />
            <span className="opacity-50">{pad(total - 1)}</span>
          </div>
        </div>
      )}
    </main>
  );
}
