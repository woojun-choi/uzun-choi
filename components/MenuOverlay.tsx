"use client";

import Image from "next/image";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "About", href: "/about" },
  { label: "Works", href: "/works" },
  { label: "Contact", href: "/contact" },
];

const WORK_TAGS = ["Photography", "Film", "Design", "Dev"];

export default function MenuOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-40 bg-[rgba(12,12,12,0.6)] backdrop-blur-sm transition-opacity duration-300 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <div className="flex h-full max-h-screen flex-col gap-[7.87846vw] overflow-y-auto pt-[22.82051vw] md:gap-0 md:pt-[6.770833vw]">
        <nav className="flex flex-col items-end gap-[3.07692vw] px-[8.97436vw] md:flex-1 md:gap-[0.78125vw] md:px-[4.42708vw] md:pt-0 md:pb-[2.08333vw]">
          {NAV_ITEMS.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              style={{
                transitionDelay: open
                  ? `${i * 80}ms`
                  : `${(NAV_ITEMS.length - 1 - i) * 60}ms`,
              }}
              className={`group relative text-right font-bold text-[17.94872vw] leading-none text-white transition-all duration-500 ease-out md:text-[clamp(3rem,7vw,6.875rem)] ${
                open ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
              }`}
            >
              <span className="inline-block transition-transform duration-300 group-hover:-translate-x-2">
                {item.label}
              </span>
              <span className="pointer-events-none absolute right-0 -bottom-1 h-[2px] w-0 bg-white transition-all duration-300 ease-out group-hover:w-full group-hover:-translate-x-2" />
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 flex-col items-end px-[8.97436vw] opacity-80 md:opacity-100 md:gap-[3.64583vw] md:px-[4.42708vw] md:pb-[4.01042vw]">
          <div className="flex w-[61.46853vw] flex-col items-end gap-[2.52608vw] md:w-[15.20833vw] md:gap-[0.833333vw]">
            <div className="flex w-full flex-col items-end gap-[0.30519vw] md:gap-[0.520833vw]">
              <div className="flex w-full items-center justify-end gap-[1.0526vw] md:gap-[0.520833vw]">
                <a
                  href="https://www.instagram.com/uzunchoi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="-ml-[1.52596vw] flex size-[3.05193vw] items-center justify-center md:ml-0 md:size-[1.30208vw]"
                >
                  <Image
                    src="/assets/icons/ig.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="size-[3.05193vw] md:size-4"
                  />
                </a>
                <p className="text-[3.3681vw] font-bold uppercase text-white whitespace-nowrap md:text-[0.83333vw]">
                  Always, refine, still
                </p>
              </div>
              <div className="flex w-full items-center justify-end gap-[1.22077vw] md:gap-[0.625vw]">
                {WORK_TAGS.map((tag, i) => (
                  <span key={tag} className="flex shrink-0 items-center gap-[1.22077vw] md:gap-[0.625vw]">
                    {i > 0 && (
                      <Image
                        src="/assets/icons/divider-line.svg"
                        alt=""
                        width={12}
                        height={1}
                        className="h-px w-[2.52608vw] shrink-0 rotate-90 md:w-[0.625vw]"
                      />
                    )}
                    <span className="shrink-0 text-[3.3681vw] font-bold text-white whitespace-nowrap md:text-[0.83333vw]">{tag}</span>
                  </span>
                ))}
              </div>
            </div>
            <p className="w-full text-right text-[2.52608vw] text-white md:text-[0.703125vw]">
              © 2026 UZUN. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
