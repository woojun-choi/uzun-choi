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
      <div className="flex h-full max-h-screen flex-col overflow-y-auto pt-[9.89583vw]">
        <nav className="flex flex-1 flex-col items-end justify-center gap-[0.78125vw] px-[4.42708vw] py-[2.08333vw]">
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
              className={`group relative text-right font-bold text-[clamp(3rem,7vw,6.875rem)] leading-none text-white transition-all duration-500 ease-out ${
                open ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
              }`}
            >
              <span className="inline-block transition-transform duration-300 group-hover:-translate-x-2">
                {item.label}
              </span>
              <span className="pointer-events-none absolute right-0 -bottom-1 h-[2px] w-0 bg-white transition-all duration-300 ease-out group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 flex-col items-end gap-[3.64583vw] px-[4.42708vw] pb-[4.01042vw]">
          <div className="flex items-center gap-[0.52083vw] text-[1.5625vw] font-bold">
            <button type="button" className="text-white">EN</button>
            <button type="button" className="text-[#7c7c7c]">KR</button>
          </div>

          <div className="flex w-[15.20833vw] flex-col items-end gap-[0.625vw]">
            <div className="flex w-full flex-col items-end">
              <div className="flex items-center gap-[0.26042vw]">
                <p className="text-[0.83333vw] font-bold uppercase text-white whitespace-nowrap">
                  Always, refine, still
                </p>
                <a
                  href="https://www.instagram.com/uzunchoi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex size-[1.30208vw] items-center justify-center"
                >
                  <Image src="/assets/icons/ig.svg" alt="" width={16} height={16} />
                </a>
              </div>
              <div className="flex items-center gap-[0.625vw] px-[0.20833vw]">
                {WORK_TAGS.map((tag, i) => (
                  <span key={tag} className="flex items-center gap-[0.625vw]">
                    {i > 0 && (
                      <Image
                        src="/assets/icons/divider-line.svg"
                        alt=""
                        width={12}
                        height={1}
                        className="h-px w-[0.625vw] rotate-90"
                      />
                    )}
                    <span className="text-[0.83333vw] font-bold text-white whitespace-nowrap">{tag}</span>
                  </span>
                ))}
              </div>
            </div>
            <p className="w-full text-right text-[0.625vw] text-white">
              © 2026 UZUN. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
