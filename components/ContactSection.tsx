"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import CopyEmailLink from "./CopyEmailLink";

const MOBILE_INFO_STAY_MS = 3500;
const OFFSET_Y_DESIGN = 50; // px at 1920 design width
const SENSITIVITY_X = 1.8; // how much further the box swings left/right vs. the raw cursor range
const SENSITIVITY_Y = 1.4; // how much further the box swings down vs. the raw cursor range
const REACH_X_DESIGN = 70; // px at 1920 design width — extra push outward at the far left/right extremes
const EASE = 0.15;
const SWING_EASE = 0.05; // slower, separate ease for the left/right swing so it trails gently instead of snapping

export default function ContactSection() {
  const [hovering, setHovering] = useState(false);
  const [mobileInfoShown, setMobileInfoShown] = useState(false);
  const mobileInfoTimeoutRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const showMobileInfoBriefly = () => {
    setMobileInfoShown(true);
    if (mobileInfoTimeoutRef.current) window.clearTimeout(mobileInfoTimeoutRef.current);
    mobileInfoTimeoutRef.current = window.setTimeout(() => setMobileInfoShown(false), MOBILE_INFO_STAY_MS);
  };

  useEffect(() => {
    return () => {
      if (mobileInfoTimeoutRef.current) window.clearTimeout(mobileInfoTimeoutRef.current);
    };
  }, []);

  const mouseRef = useRef({ x: 0, y: 0 });
  const easedRef = useRef({ x: 0, y: 0 });
  const swingRef = useRef(0.5);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!hovering) return;

    const tick = () => {
      const scale = window.innerWidth / 1920;
      const offsetY = OFFSET_Y_DESIGN * scale;

      const eased = easedRef.current;
      const mouse = mouseRef.current;
      eased.x += (mouse.x - eased.x) * EASE;
      eased.y += (mouse.y - eased.y) * EASE;

      const containerRect = containerRef.current?.getBoundingClientRect();
      const box = boxRef.current;
      const line = lineRef.current;

      if (containerRect && box && line) {
        // Amplify horizontal movement around the trigger's own center so a
        // small cursor move produces a bigger, more visible swing than the
        // raw trigger width would allow.
        const centerX = containerRect.width / 2;
        const amplifiedX = centerX + (eased.x - centerX) * SENSITIVITY_X;

        // 0 = cursor at the left edge, 1 = cursor at the right edge.
        const targetT = Math.min(1, Math.max(0, amplifiedX / containerRect.width));

        // Ease the swing itself, separately and more slowly than the cursor
        // follow, so crossing the center glides gradually instead of
        // snapping straight to wherever the cursor currently is.
        swingRef.current += (targetT - swingRef.current) * SWING_EASE;
        const t = swingRef.current;

        // Cursor on the right → box extends further right, anchored (line
        // attaches) at its top-LEFT corner. Cursor on the left → box extends
        // further left, anchored at its top-RIGHT corner. Interpolating the
        // translateX percentage continuously with t (instead of snapping
        // between the two extremes at a threshold) means the box slides
        // smoothly through center rather than jumping a full box-width.
        const translatePercent = (t - 1) * 100;

        // Push the anchor itself further outward the closer the cursor gets
        // to either extreme (0 at center, growing toward ±REACH_X at the
        // edges), so the whole box — not just which corner it hangs from —
        // sits further right at the far right and further left at the far
        // left, instead of always anchoring at the raw cursor position.
        const reachX = (t - 0.5) * 2 * REACH_X_DESIGN * scale;

        // Amplify downward movement from the trigger's top edge (always
        // positive, so it only ever adds extra drop, never cancels the gap).
        const boxAnchorX = eased.x + reachX;
        const boxAnchorY = Math.max(0, eased.y) * SENSITIVITY_Y + offsetY;

        box.style.left = `${boxAnchorX}px`;
        box.style.top = `${boxAnchorY}px`;
        box.style.transform = `translateX(${translatePercent}%)`;

        const lineAnchorX = boxAnchorX;
        const lineAnchorY = boxAnchorY;
        const dx = mouse.x - lineAnchorX;
        const dy = mouse.y - lineAnchorY;
        const length = Math.hypot(dx, dy);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        line.style.width = `${length}px`;
        line.style.left = `${lineAnchorX}px`;
        line.style.top = `${lineAnchorY}px`;
        line.style.transform = `rotate(${angle}deg)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [hovering]);

  const handleMouseMove = (e: MouseEvent) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    mouseRef.current = {
      x: e.clientX - containerRect.left,
      y: e.clientY - containerRect.top,
    };
    if (!hovering) {
      easedRef.current = { ...mouseRef.current };
      const containerWidth = containerRect.width;
      const centerX = containerWidth / 2;
      const amplifiedX = centerX + (mouseRef.current.x - centerX) * SENSITIVITY_X;
      swingRef.current = Math.min(1, Math.max(0, amplifiedX / containerWidth));
      setHovering(true);
    }
  };

  return (
    <main className="relative flex h-[100dvh] flex-col items-center overflow-hidden bg-[#0c0c0c] text-white md:h-screen md:justify-center">
      {/* Mobile: static layout, no cursor-follow (Figma "M 5. Contact" has no hover
          interaction — there's no cursor on touch, so the info text is always shown).
          Each block is pinned to its exact Figma top offset (measured from the
          content area right below the header) instead of stacked via estimated
          gaps — text line-height guesses were drifting the whole layout down. */}
      <div className="relative w-full flex-1 md:hidden">
        <div className="absolute inset-x-0 top-[55.8974vw] flex flex-col items-center gap-[2.05128vw] px-[5.12821vw] text-center">
          <p className="text-[4.61538vw] font-bold text-white">
            새로운 프로젝트를 함께할 준비가 되어 있습니다.
          </p>
          <p className="text-[4.10256vw] font-medium text-white/70">
            Ready for the next project.
          </p>
        </div>
        <div className="absolute top-[74.8308vw] left-1/2 h-px w-[3.67846vw] -translate-x-1/2 bg-white/40" />
        <div className="absolute top-[80.2564vw] left-1/2 flex w-[40.8618vw] -translate-x-1/2 flex-col items-center gap-[3.58974vw]">
          <CopyEmailLink
            email="uzunchoi@gmail.com"
            className="text-[4.61538vw] font-bold text-white/90"
            toastOffsetVw={8}
            onClick={showMobileInfoBriefly}
          />
          <a
            href="https://www.instagram.com/uzunchoi/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex size-[4.61538vw] items-center justify-center opacity-80"
          >
            <Image src="/assets/icons/ig.svg" alt="" width={30} height={30} className="size-[4.61538vw]" />
          </a>
        </div>
        <div
          className={`absolute top-[105vw] left-1/2 flex -translate-x-1/2 flex-col items-center gap-[1.53846vw] whitespace-nowrap text-center transition-opacity duration-300 ${
            mobileInfoShown ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <p className="text-[2.82051vw] leading-[3.99408vw] font-bold text-white">
            프로젝트 및 기타 문의는 메일 주소로 연락주시면 검토 후 회신 드리겠습니다.
          </p>
          <p className="text-[2.5641vw] leading-[3.97436vw] font-medium text-white/70">
            For project or other inquiries, please contact me at the email address.
            <br />
            I&apos;ll get back to you.
          </p>
        </div>
      </div>
      <p className="absolute inset-x-0 bottom-[6.41026vw] text-center text-[2.30769vw] text-white md:hidden">
        © 2026 UZUN. All rights reserved.
      </p>

      {/* Desktop: mouse-follow interactive layout (unchanged). */}
      <div className="hidden h-full w-full items-center justify-center md:flex">
      <div className="flex flex-col items-center gap-[2.34375vw]">
        <div className="flex flex-col items-center gap-[0.78125vw] text-center">
          <p className="text-[2.08333vw] font-bold text-white">
            새로운 프로젝트를 함께할 준비가 되어 있습니다.
          </p>
          <p className="text-[1.66667vw] font-medium text-white/70">
            Ready for the next project.
          </p>
        </div>

        <div className="h-px w-[1.82292vw] bg-white/40" />

        <div
          ref={containerRef}
          className="relative flex w-[20vw] flex-col items-center gap-[0.78125vw] pb-[1.30208vw]"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHovering(false)}
        >
          <CopyEmailLink
            email="uzunchoi@gmail.com"
            className="text-center text-[1.66667vw] font-bold text-white/90 transition-colors hover:text-white"
            toastOffsetVw={2.34375}
          />
          <a
            href="https://www.instagram.com/uzunchoi/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex size-[2.5vw] items-center justify-center p-[0.41667vw] opacity-80 transition-opacity hover:opacity-100"
          >
            <Image
              src="/assets/icons/ig.svg"
              alt=""
              width={30}
              height={30}
              className="size-[1.5625vw]"
            />
          </a>

          <div
            ref={lineRef}
            className="pointer-events-none absolute top-0 left-0 z-0 h-px origin-left bg-white/40 transition-opacity duration-300"
            style={{ opacity: hovering ? 1 : 0 }}
          />
          <div
            ref={boxRef}
            className="pointer-events-none absolute z-10 flex w-[22vw] flex-col items-center gap-[0.41667vw] whitespace-nowrap text-center transition-opacity duration-300"
            style={{ opacity: hovering ? 1 : 0 }}
          >
            <p className="text-[1.25vw] leading-[1.4] font-bold text-white">
              프로젝트 및 기타 문의는 메일 주소로
              <br />
              연락주시면 검토 후 회신 드리겠습니다.
            </p>
            <p className="text-[1.09375vw] leading-[1.3] font-medium text-white/70">
              For project or other inquiries,
              <br />
              please contact me at the email address.
              <br />
              I&apos;ll get back to you.
            </p>
          </div>
        </div>
      </div>
      </div>
    </main>
  );
}
