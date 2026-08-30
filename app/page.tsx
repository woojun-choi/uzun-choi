import HeroSection, { type HeroSlide } from "@/components/HeroSection";
import { getFeaturedWorks, getFeaturedMobileWorks, workHeroCoverUrl, type WorkMeta } from "@/lib/works";

const HERO_SLOT_COUNT = 5;

function buildSlides(works: WorkMeta[]): HeroSlide[] {
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

  return [...realSlides, ...dummySlides];
}

export default function Home() {
  return (
    <HeroSection
      items={buildSlides(getFeaturedWorks())}
      mobileItems={buildSlides(getFeaturedMobileWorks())}
    />
  );
}
