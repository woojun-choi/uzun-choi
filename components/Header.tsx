"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MenuToggle from "./MenuToggle";
import MenuOverlay from "./MenuOverlay";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isWorkDetail = /^\/works\/[^/]+$/.test(pathname ?? "");

  return (
    <>
      <header className="fixed inset-x-0 top-[1.28205vw] z-50 flex h-[20.51282vw] w-full items-center justify-center overflow-clip md:top-0 md:h-[8.85417vw]">
        <div className="relative flex h-[20.51282vw] w-full items-center justify-between px-[6.41026vw] md:h-[4.6875vw] md:px-[4.42708vw] md:py-[1.40625vw]">
          <Link href="/" aria-label="UZUN home">
            <Image
              src="/assets/icons/logo.svg"
              alt="UZUN"
              width={68.75}
              height={55}
              className="h-[9.31923vw] w-[11.53846vw] md:h-[2.86458vw] md:w-[3.58073vw]"
            />
          </Link>
          {isWorkDetail && (
            <Link
              href="/works"
              aria-label="Back to works"
              className="hidden size-[2.5vw] items-center justify-center md:flex"
            >
              <Image
                src="/assets/icons/close-x.svg"
                alt=""
                width={35}
                height={35}
                className="w-[1.82292vw] rotate-45"
              />
            </Link>
          )}
          {/* Mobile keeps the hamburger even on work-detail pages (Figma "M 4. Details"
              doesn't swap to an X like desktop does) — the menu overlay's Works link
              covers navigating back, so it's hidden at md instead of swapped out. */}
          <div className={isWorkDetail ? "md:hidden" : undefined}>
            <MenuToggle open={open} onToggle={() => setOpen((v) => !v)} />
          </div>
        </div>
      </header>
      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
