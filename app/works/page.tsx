import WorksGrid from "@/components/WorksGrid";
import { getAllWorks, workCoverThumbUrl } from "@/lib/works";

export default function WorksPage() {
  const works = getAllWorks().map((work) => ({
    ...work,
    coverUrl: workCoverThumbUrl(work),
  }));

  return <WorksGrid works={works} />;
}
