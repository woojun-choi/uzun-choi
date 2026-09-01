import Image from "next/image";
import { Fragment, type CSSProperties, type ReactNode } from "react";
import CopyEmailLink from "./CopyEmailLink";
import RotatingWord from "./RotatingWord";

const HERO_WORDS: ReactNode[] = [
  <Fragment key="uzun">
    <span className="tracking-[1.23077vw] md:tracking-[0.9375vw]">U</span>
    <span className="tracking-[-0.51282vw] md:tracking-[-0.390625vw]">Z</span>
    <span>U</span>
    <span>N</span>
  </Fragment>,
  "ABOUT",
  "CREATIVE",
  "REFINE",
  "SYSTEM",
  "ALWAYS",
];

const CATEGORIES = [
  { label: "PHOTO", items: ["Portrait", "Brand & Editorial", "Architectural"], widthVw: 15.364583, mobileOrder: 1 },
  { label: "FILM", items: ["Short Film", "AI Video", "Music Video"], widthVw: 11.40625, mobileOrder: 3 },
  {
    label: "DESIGN",
    items: ["Brand Identity", "Editorial Design", "Graphic & Poster"],
    widthVw: 15.625,
    mobileOrder: 2,
  },
  {
    label: "DEVELOPMENT",
    items: ["Web Design & Build", "Landing Page", "Portfolio Site"],
    widthVw: 18.541667,
    mobileOrder: 4,
  },
];

const CV_ENTRIES = [
  {
    year: "2021 -",
    yearWidthVw: 4.21875,
    gapVw: 0.677083,
    mobileGapVw: 3.84615,
    title: "Chung-Ang University, School of Arts & Technology",
    subtitle: "중앙대학교, 예술공학부 재학",
  },
  {
    year: "2024 -",
    yearWidthVw: 4.47917,
    gapVw: 0.416667,
    mobileGapVw: 3.33333,
    title: "Chung-Ang University, Photography (Double Major)",
    subtitle: "중앙대학교, 사진학과 복수전공",
  },
  {
    year: "2025",
    yearWidthVw: 3.48958,
    gapVw: 1.40625,
    mobileGapVw: 5.12821,
    title: "Design Agency Internship",
    subtitle: "디자인 에이전시 인턴십",
  },
];

function Divider() {
  return <div className="h-[2px] w-full bg-white/60 md:h-px" />;
}

function Section({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[5.12821vw] md:gap-[2.604167vw]">
      <Divider />
      {children}
    </div>
  );
}

export default function AboutSection() {
  return (
    <main className="bg-[#0c0c0c] text-white">
      <div
        className="flex h-screen items-center justify-center text-center text-[10.25641vw] leading-none whitespace-nowrap md:text-[5.98958vw]"
        style={{ fontFamily: '"itc-bradley-hand-std", sans-serif', fontWeight: 400, fontStyle: "normal" }}
      >
        <RotatingWord words={HERO_WORDS} />
      </div>

      <div className="relative aspect-[390/560] w-full md:aspect-[1920/1080]">
        <Image
          src="/assets/images/profile.jpg"
          alt="UZUN, 2024"
          fill
          unoptimized
          className="object-cover"
        />
        {/* Figma's mobile crop pushes this caption entirely off the visible (centered,
            overflow-cropped) area, so it's desktop-only. */}
        <p className="absolute right-[3.645833vw] bottom-[4.010417vw] hidden text-[1.25vw] font-bold text-[#292929] md:block">
          UZUN, 2024
        </p>
      </div>

      <div className="mx-auto flex max-w-[93.90625vw] flex-col gap-[13.94231vw] pt-[10.5128vw] pr-[2.5641vw] pb-[3.125vw] pl-[1.28205vw] md:gap-[6.25vw] md:pt-[10.41667vw] md:pr-0 md:pl-0">
        {/* Name + intro */}
        <Section>
          <div className="flex flex-col gap-[7.17949vw] px-[1.02564vw] md:flex-row md:items-start md:justify-between md:gap-0 md:px-0">
            <div className="flex flex-row gap-[2.5641vw] text-[4.61538vw] leading-none font-bold md:w-[11.40625vw] md:flex-col md:gap-0 md:pl-[0.520833vw] md:text-[1.25vw] md:leading-[2.1875vw]">
              <p>UZUN CHOI</p>
              <p>최우준</p>
            </div>
            <div className="flex flex-col gap-[3.07692vw] font-medium opacity-80 md:w-[48.48958vw] md:gap-[1.041667vw] md:text-[1.145833vw] md:font-bold md:opacity-100">
              <p className="text-[4.10256vw] leading-[5.89744vw] md:text-[1.145833vw] md:leading-[2.1875vw]">
                UZUN is a creator working across photography, film, design, and
                development. Based in Korea - Seoul, Anseong, and Daejeon, UZUN
                focuses on essence over medium. Rather than a fixed style, UZUN
                seeks the right expression for each project.
              </p>
              <p className="text-[3.84615vw] leading-[6.15385vw] md:text-[1.145833vw] md:leading-[2.1875vw]">
                UZUN은 촬영, 영상, 디자인, 개발을 넘나드는 크리에이터입니다.
                서울, 안성, 대전을 기반으로 활동하며, 매체보다 본질에
                집중합니다. 정해진 스타일보다 매 프로젝트에 맞는 표현을
                찾습니다.
              </p>
            </div>
          </div>
        </Section>

        {/* CV */}
        <Section>
          <div className="flex flex-col gap-[7.17949vw] px-[1.02564vw] md:flex-row md:items-start md:justify-between md:gap-0 md:px-0">
            <p className="text-[4.61538vw] font-bold whitespace-nowrap md:pl-[0.520833vw] md:text-[1.25vw]">CV</p>
            <div className="flex flex-col gap-[4.10256vw] opacity-80 md:w-[48.64583vw] md:gap-[0.989583vw] md:opacity-100">
              {CV_ENTRIES.map((entry) => (
                <div
                  key={entry.title}
                  className="flex items-start gap-[var(--mobile-gap)] md:gap-[var(--desktop-gap)]"
                  style={
                    {
                      "--mobile-gap": `${entry.mobileGapVw}vw`,
                      "--desktop-gap": `${entry.gapVw}vw`,
                    } as CSSProperties
                  }
                >
                  <p
                    className="shrink-0 text-[4.10256vw] leading-none whitespace-nowrap md:w-[var(--desktop-width)] md:text-[1.25vw] md:leading-[2.86458vw]"
                    style={{ "--desktop-width": `${entry.yearWidthVw}vw` } as CSSProperties}
                  >
                    {entry.year}
                  </p>
                  <div className="-mt-[0.76923vw] flex flex-1 flex-col gap-[2.05128vw] md:mt-0 md:gap-0">
                    <p className="text-[4.10256vw] leading-[5.64103vw] font-medium md:-mb-[0.78125vw] md:text-[1.145833vw] md:leading-[2.86458vw] md:font-bold">
                      {entry.title}
                    </p>
                    <p className="text-[3.84615vw] leading-none opacity-80 md:text-[1.145833vw] md:leading-[2.86458vw]">
                      {entry.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Category grid */}
        <Section>
          <div className="grid grid-cols-2 items-start gap-x-[6.5vw] gap-y-[6.15385vw] px-[1.02564vw] md:flex md:grid-cols-none md:gap-[9.24487vw] md:px-0">
            {CATEGORIES.map((cat, i) => (
              <div
                key={cat.label}
                className={`order-[var(--mobile-order)] flex flex-col gap-[1.53846vw] md:order-none md:w-[var(--desktop-width)] md:gap-[0.833333vw] ${i === 0 ? "md:pl-[0.520833vw]" : ""}`}
                style={
                  {
                    "--mobile-order": cat.mobileOrder,
                    "--desktop-width": `${cat.widthVw}vw`,
                  } as CSSProperties
                }
              >
                <p className="text-[4.61538vw] font-bold md:whitespace-nowrap md:text-[1.145833vw]">{cat.label}</p>
                <div className="flex flex-col gap-[0.25641vw] text-[4.10256vw] opacity-80 md:gap-[0.260417vw] md:text-[1.145833vw]">
                  {cat.items.map((item) => (
                    <p key={item} className="md:whitespace-nowrap">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Contact */}
        <Section>
          <div className="flex flex-col gap-[7.17949vw] px-[1.02564vw] md:flex-row md:items-start md:justify-between md:gap-0 md:px-0">
            <p className="text-[4.61538vw] font-bold whitespace-nowrap md:pl-[0.520833vw] md:text-[1.25vw]">CONTACT</p>
            <div className="flex flex-col gap-[2.05128vw] opacity-80 md:w-[48.64583vw] md:gap-[1.5625vw] md:opacity-100">
              <div className="flex flex-col gap-[0.51282vw] text-[3.84615vw] font-medium md:gap-[0.3125vw] md:text-[1.145833vw] md:font-bold">
                <p>새로운 프로젝트를 함께한 준비가 되어있습니다.</p>
                <p>Ready for the next project.</p>
              </div>
              <div className="h-px w-[2.604167vw] bg-white/40" />
              <div className="flex items-center gap-[2.05128vw] md:gap-[0.78125vw]">
                <CopyEmailLink
                  email="uzunchoi@gmail.com"
                  className="text-[3.84615vw] font-normal text-white/90 transition-colors hover:text-white md:text-[1.25vw] md:font-bold"
                  toastOffsetVw={1.5625}
                />
                <a
                  href="https://www.instagram.com/uzunchoi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex size-[3.33333vw] items-center justify-center opacity-80 transition-opacity hover:opacity-100 md:size-[1.822917vw]"
                >
                  <Image
                    src="/assets/icons/ig.svg"
                    alt=""
                    width={22}
                    height={22}
                    className="size-[3.33333vw] md:size-[1.139323vw]"
                  />
                </a>
              </div>
            </div>
          </div>
        </Section>

        {/* Copyright */}
        <div className="flex flex-col items-center gap-[13.75vw]">
          <Divider />
          <p className="text-center text-[2.5641vw] text-white md:text-[1.041667vw]">
            © 2026 UZUN. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
