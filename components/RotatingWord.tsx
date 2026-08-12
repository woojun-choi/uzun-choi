"use client";

import { useEffect, useState, type ReactNode } from "react";

const HOLD_MS = 1800;
const TRANSITION_MS = 500;

export default function RotatingWord({
  words,
  className,
}: {
  words: ReactNode[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let holdId: number;
    let fadeId: number;

    const scheduleNext = () => {
      holdId = window.setTimeout(() => {
        setVisible(false);
        fadeId = window.setTimeout(() => {
          setIndex((i) => (i + 1) % words.length);
          setVisible(true);
          scheduleNext();
        }, TRANSITION_MS);
      }, HOLD_MS);
    };

    scheduleNext();
    return () => {
      window.clearTimeout(holdId);
      window.clearTimeout(fadeId);
    };
  }, [words.length]);

  return (
    <span
      className={`inline-block transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
        visible ? "translate-y-0 opacity-100" : "translate-y-[0.5vw] opacity-0"
      } ${className ?? ""}`}
    >
      {words[index]}
    </span>
  );
}
