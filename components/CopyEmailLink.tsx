"use client";

import { useRef, useState } from "react";

const STAY_MS = 1080;

function fallbackCopy(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
}

export default function CopyEmailLink({
  email,
  className,
  toastOffsetVw = 3.4,
}: {
  email: string;
  className?: string;
  /** Distance (in vw, at the 1920 design width) from the button's top edge
   *  up to the toast — tuned per usage to land near that layout's divider
   *  bar above the email. */
  toastOffsetVw?: number;
}) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const showCopiedToast = () => {
    setCopied(true);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopied(false), STAY_MS);
  };

  const handleClick = () => {
    // Copy via the fallback textarea immediately — synchronous, no
    // permission prompt, works everywhere. If the async Clipboard API also
    // resolves, that's fine too (it just overwrites with the same value).
    fallbackCopy(email);
    showCopiedToast();
    navigator.clipboard?.writeText?.(email).catch(() => {});
  };

  return (
    <span className="relative inline-flex">
      <button type="button" onClick={handleClick} className={className}>
        {email}
      </button>
      <span
        className={`pointer-events-none absolute left-1/2 origin-center -translate-x-1/2 translate-y-1/2 whitespace-nowrap bg-white px-[0.83333vw] py-[0.3125vw] text-[0.72917vw] font-medium text-black transition-all duration-[400ms] ease-[cubic-bezier(0.19,1,0.22,1)] ${
          copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
        style={{ bottom: `calc(100% + ${toastOffsetVw}vw)` }}
      >
        이메일 주소가 복사되었습니다
      </span>
    </span>
  );
}
