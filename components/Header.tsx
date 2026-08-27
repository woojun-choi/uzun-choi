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
      <header className="fixed inset-x-0 top-0 z-50 flex h-[8.85417vw] w-full items-center justify-center overflow-clip">
        <div className="relative flex h-[4.6875vw] w-full items-center justify-between px-[4.42708vw] py-[1.40625vw]">
          <Link href="/" aria-label="UZUN home">
            <Image
              src="/assets/icons/logo.svg"
              alt="UZUN"
              width={68.75}
              height={55}
              className="h-[2.86458vw] w-[3.58073vw]"
            />
          </Link>
          {isWorkDetail ? (
            <Link
              href="/works"
              aria-label="Back to works"
              className="flex size-[2.5vw] items-center justify-center"
            >
              <Image
                src="/assets/icons/close-x.svg"
                alt=""
                width={35}
                height={35}
                className="w-[1.82292vw] rotate-45"
              />
            </Link>
          ) : (
            <MenuToggle open={open} onToggle={() => setOpen((v) => !v)} />
          )}
        </div>
      </header>
      {!isWorkDetail && <MenuOverlay open={open} onClose={() => setOpen(false)} />}
    </>
  );
}
