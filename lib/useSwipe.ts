"use client";

import { useEffect, type RefObject } from "react";

export function useSwipe(
  ref: RefObject<HTMLElement | null>,
  onSwipe: (direction: 1 | -1) => void,
  { axis = "y", threshold = 50 }: { axis?: "x" | "y"; threshold?: number } = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let start = 0;

    const onTouchStart = (e: TouchEvent) => {
      start = axis === "y" ? e.touches[0].clientY : e.touches[0].clientX;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const end = axis === "y" ? e.changedTouches[0].clientY : e.changedTouches[0].clientX;
      const delta = start - end;
      if (Math.abs(delta) < threshold) return;
      onSwipe(delta > 0 ? 1 : -1);
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, axis, threshold]);
}
