import Image from "next/image";
import { Fragment, type ReactNode } from "react";
import CopyEmailLink from "./CopyEmailLink";
import RotatingWord from "./RotatingWord";

const HERO_WORDS: ReactNode[] = [
  <Fragment key="uzun">
    <span className="tracking-[0.9375vw]">U</span>
    <span className="tracking-[-0.390625vw]">Z</span>
    <span>U</span>
    <span>N</span>
  </Fragment>,
  "CREATOR",
  "PHOTOGRAPHER",
  "FILMMAKER",
  "DESIGNER",
  "DEVELOPER",
  "STORYTELLER",
  "VISIONARY",
  "ALWAYS",
  "REFINE",
  "STILL",
];

const CATEGORIES = [
  { label: "PHOTO", items: ["Portrait", "Brand & Editorial", "Space"], widthVw: 15.364583 },
  { label: "FILM", items: ["Short Film", "AI Video", "Music Video"], widthVw: 11.40625 },
  {
    label: "DESIGN",
    items: ["Brand Identity", "Editorial Design", "Graphic & Poster"],
    widthVw: 15.625,
  },
  {
    label: "DEVELOPMENT",
    items: ["Web Design & Build", "Landing Page", "Portfolio Site"],
    widthVw: 18.541667,
  },
];

const CV_ENTRIES = [
  {
    year: "2021 -",
    yearWidthVw: 4.21875,
    gapVw: 0.677083,
    title: "Chung-Ang University, School of Arts & Technology",
    subtitle: "중앙대학교, 예술공학부 재학",
  },
  {
    year: "2024 -",
    yearWidthVw: 4.47917,
    gapVw: 0.416667,
    title: "Chung-Ang University, Photography (Double Major)",
    subtitle: "중앙대학교, 사진학과 복수전공",
  },
  {
    year: "2025",
    yearWidthVw: 3.48958,
    gapVw: 1.40625,
    title: "Design Agency Internship",
    subtitle: "디자인 에이전시 인턴십",
  },
];

function Divider() {
  return <div className="h-px w-full bg-white/15" />;
}

export default function AboutSection() {
  return (
    <main className="bg-[#0c0c0c] text-white">
      <div
        className="flex h-screen items-center justify-center text-center text-[6.51042vw] leading-none whitespace-nowrap"
        style={{ fontFamily: '"itc-bradley-hand-std", sans-serif', fontWeight: 600, fontStyle: "normal" }}
      >
        <RotatingWord words={HERO_WORDS} />
      </div>

      <div className="relative aspect-[1920/1080] w-full">
        <Image
          src="/assets/images/profile.jpg"
          alt="UZUN, 2024"
          fill
          className="object-cover"
        />
        <p className="absolute right-[3.645833vw] bottom-[4.010417vw] text-[1.25vw] font-bold text-[#292929]">
          UZUN, 2024
        </p>
      </div>

      <div className="mx-auto flex max-w-[93.90625vw] flex-col gap-[3.125vw] pt-[10.41667vw] pb-[3.125vw]">
        <Divider />

        {/* Name + intro */}
        <div className="flex items-start justify-between">
          <div className="flex w-[11.40625vw] flex-col pl-[0.520833vw] text-[1.25vw] leading-[2.1875vw] font-bold">
            <p>UZUN CHOI</p>
            <p>최우준</p>
          </div>
          <div className="flex w-[48.48958vw] flex-col gap-[1.041667vw] text-[1.25vw] leading-[2.1875vw] font-bold">
            <p>
              UZUN is a creator working across photography, film, design, and
              development. Based in Korea - Seoul, Anseong, and Daejeon, UZUN
              focuses on essence over medium. Rather than a fixed style, UZUN
              seeks the right expression for each project.
            </p>
            <p>
              UZUN은 촬영, 영상, 디자인, 개발을 넘나드는 크리에이터입니다.
              서울, 안성, 대전을 기반으로 활동하며, 매체보다 본질에
              집중합니다. 정해진 스타일보다 매 프로젝트에 맞는 표현을
              찾습니다.
            </p>
          </div>
        </div>

        <Divider />

        {/* CV */}
        <div className="flex items-start justify-between">
          <p className="pl-[0.520833vw] text-[1.25vw] font-bold whitespace-nowrap">CV</p>
          <div className="flex w-[48.64583vw] flex-col gap-[0.989583vw]">
            {CV_ENTRIES.map((entry) => (
              <div key={entry.title} className="flex items-start" style={{ gap: `${entry.gapVw}vw` }}>
                <p
                  className="shrink-0 text-[1.25vw] leading-[2.86458vw] whitespace-nowrap"
                  style={{ width: `${entry.yearWidthVw}vw` }}
                >
                  {entry.year}
                </p>
                <div className="flex flex-1 flex-col">
                  <p className="-mb-[0.78125vw] text-[1.25vw] leading-[2.86458vw] font-bold">
                    {entry.title}
                  </p>
                  <p className="text-[1.25vw] leading-[2.86458vw] opacity-80">
                    {entry.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* Category grid */}
        <div className="flex items-start text-[1.25vw]" style={{ gap: "9.244792vw" }}>
          {CATEGORIES.map((cat, i) => (
            <div
              key={cat.label}
              className={`flex flex-col gap-[0.833333vw] ${i === 0 ? "pl-[0.520833vw]" : ""}`}
              style={{ width: `${cat.widthVw}vw` }}
            >
              <p className="font-bold whitespace-nowrap">{cat.label}</p>
              <div className="flex flex-col gap-[0.260417vw] opacity-80">
                {cat.items.map((item) => (
                  <p key={item} className="whitespace-nowrap">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* Contact */}
        <div className="flex items-start justify-between">
          <p className="pl-[0.520833vw] text-[1.25vw] font-bold whitespace-nowrap">CONTACT</p>
          <div className="flex w-[48.64583vw] flex-col gap-[1.5625vw]">
            <div className="flex flex-col gap-[0.3125vw] text-[1.25vw] font-bold">
              <p>새로운 프로젝트를 함께한 준비가 되어있습니다.</p>
              <p>Ready for the next project.</p>
            </div>
            <div className="h-px w-[2.604167vw] bg-white/40" />
            <div className="flex items-center gap-[0.78125vw]">
              <CopyEmailLink
                email="uzunchoi@gmail.com"
                className="text-[1.25vw] font-bold text-white/90 transition-colors hover:text-white"
                toastOffsetVw={1.5625}
              />
              <a
                href="https://www.instagram.com/uzunchoi/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex size-[1.822917vw] items-center justify-center opacity-80 transition-opacity hover:opacity-100"
              >
                <Image
                  src="/assets/icons/ig.svg"
                  alt=""
                  width={22}
                  height={22}
                  className="size-[1.139323vw]"
                />
              </a>
            </div>
          </div>
        </div>

        <Divider />
      </div>

      <p className="pb-[3.125vw] text-center text-[1.041667vw] text-white">
        © 2026 UZUN. All rights reserved.
      </p>
    </main>
  );
}
