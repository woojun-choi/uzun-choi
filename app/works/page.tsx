import WorksGrid from "@/components/WorksGrid";
import { getAllWorks, workCoverUrl } from "@/lib/works";

export default function WorksPage() {
  const works = getAllWorks().map((work) => ({
    ...work,
    coverUrl: workCoverUrl(work),
  }));

  return <WorksGrid works={works} />;
}
