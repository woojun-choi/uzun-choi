import HeroSection, { type HeroSlide } from "@/components/HeroSection";
import { getAllWorks, workHeroCoverUrl } from "@/lib/works";

const HERO_SLOT_COUNT = 5;

export default function Home() {
  const works = getAllWorks();

  const realSlides: HeroSlide[] = works.map((work) => ({
    id: work.slug,
    title: work.title.ko,
    year: work.year,
    cover: workHeroCoverUrl(work),
  }));

  const dummySlides: HeroSlide[] = Array.from(
    { length: Math.max(0, HERO_SLOT_COUNT - realSlides.length) },
    (_, i) => ({
      id: `dummy-${i + 1}`,
      title: `Work ${String(realSlides.length + i + 1).padStart(2, "0")}`,
      year: 2026,
    })
  );

  return <HeroSection items={[...realSlides, ...dummySlides]} />;
}
