"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ScrollNav from "./ScrollNav";
import { useSwipe } from "@/lib/useSwipe";

const TRANSITION_MS = 900;
const AUTO_ADVANCE_MS = 10000;

export type HeroSlide = {
  id: string;
  title: string;
  year: number;
  cover?: string;
};

function Slide({ item, index, priority }: { item: HeroSlide; index: number; priority: boolean }) {
  return (
    <section
      className="relative flex h-screen w-full items-center justify-center overflow-hidden"
      style={!item.cover ? { background: index % 2 === 0 ? "#141414" : "#1a1a1a" } : undefined}
    >
      {item.cover && (
        <Image
          src={item.cover}
          alt={item.title}
          fill
          priority={priority}
          unoptimized
          className="pointer-events-none object-cover"
        />
      )}
      <div className="absolute bottom-[9.5922vw] left-[9.23077vw] z-10 flex max-w-[62vw] flex-col items-start gap-[0.84vw] text-white md:max-w-none md:flex-row md:bottom-[4.01042vw] md:left-[4.42708vw] md:gap-[0.41667vw]">
        <p className="order-2 text-left text-[10.25641vw] leading-none font-bold md:order-1 md:text-[5.20833vw]">{item.title}</p>
        <p
          className="order-1 hidden text-[3.58974vw] leading-none md:order-2 md:block md:text-[1.5625vw]"
          style={{ fontFamily: '"NEXON Lv2 Gothic"', fontWeight: 400 }}
        >
          {item.year}
        </p>
      </div>
    </section>
  );
}

function Carousel({ items }: { items: HeroSlide[] }) {
  const total = items.length;
  // Clone the last item before the first, and the first item after the last,
  // so wrap-around transitions keep scrolling in the same direction instead
  // of snapping backwards.
  const extended = total > 1 ? [items[total - 1], ...items, items[0]] : items;

  const [visualIndex, setVisualIndex] = useState(1);
  const [current, setCurrent] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const visualIndexRef = useRef(visualIndex);
  const lockedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    visualIndexRef.current = visualIndex;
  }, [visualIndex]);

  const step = (direction: 1 | -1) => {
    if (lockedRef.current || total <= 1) return;
    lockedRef.current = true;
    setTransitionEnabled(true);
    const nextVisual = visualIndexRef.current + direction;
    setVisualIndex(nextVisual);

    window.setTimeout(() => {
      if (nextVisual === total + 1) {
        setTransitionEnabled(false);
        setVisualIndex(1);
        setCurrent(1);
      } else if (nextVisual === 0) {
        setTransitionEnabled(false);
        setVisualIndex(total);
        setCurrent(total);
      } else {
        setCurrent(nextVisual);
      }
      lockedRef.current = false;
    }, TRANSITION_MS);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (lockedRef.current || Math.abs(e.deltaY) < 4) return;
      step(e.deltaY > 0 ? 1 : -1);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  useSwipe(containerRef, (direction) => step(direction), { axis: "y" });

  useEffect(() => {
    const timer = window.setTimeout(() => step(1), AUTO_ADVANCE_MS);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, total]);

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden">
      <div
        className={
          transitionEnabled ? "ease-[cubic-bezier(0.65,0,0.35,1)] transition-transform" : ""
        }
        style={{
          transform: `translateY(-${visualIndex * 100}vh)`,
          transitionDuration: transitionEnabled ? `${TRANSITION_MS}ms` : "0ms",
        }}
      >
        {extended.map((item, i) => (
          <Slide
            key={`${item.id}-${i}`}
            item={item}
            index={i}
            priority={total > 1 ? i === 1 : i === 0}
          />
        ))}
      </div>
      <ScrollNav current={current} total={total} onUp={() => step(-1)} onDown={() => step(1)} />
    </div>
  );
}

export default function HeroSection({
  items,
  mobileItems,
}: {
  items: HeroSlide[];
  mobileItems: HeroSlide[];
}) {
  return (
    <>
      <div className="md:hidden">
        <Carousel items={mobileItems} />
      </div>
      <div className="hidden md:block">
        <Carousel items={items} />
      </div>
    </>
  );
}
