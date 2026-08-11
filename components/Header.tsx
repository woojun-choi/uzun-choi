"use client";

import { useState } from "react";
import Image from "next/image";
import MenuToggle from "./MenuToggle";
import MenuOverlay from "./MenuOverlay";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex h-[9.89583vw] w-full items-center justify-center overflow-clip">
        <Image
          src="/assets/images/header-bg.png"
          alt=""
          fill
          priority
          className={`pointer-events-none object-cover transition-opacity duration-300 ${
            open ? "opacity-0" : "opacity-100"
          }`}
        />
        <div className="relative flex h-[4.6875vw] w-full items-center justify-between px-[4.42708vw] py-[1.40625vw]">
          <Image
            src="/assets/icons/logo.svg"
            alt="UZUN"
            width={68.75}
            height={55}
            className="h-[2.86458vw] w-[3.58073vw]"
          />
          <MenuToggle open={open} onToggle={() => setOpen((v) => !v)} />
        </div>
      </header>
      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
