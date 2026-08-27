import { notFound } from "next/navigation";
import WorkDetail from "@/components/WorkDetail";
import { getWork, getWorkDescription, getWorkMedia } from "@/lib/works";

export default async function WorkDetailPage(props: PageProps<"/works/[slug]">) {
  const { slug } = await props.params;
  const work = getWork(slug);
  if (!work) notFound();

  return (
    <WorkDetail
      work={work}
      media={getWorkMedia(slug)}
      description={getWorkDescription(slug)}
    />
  );
}
