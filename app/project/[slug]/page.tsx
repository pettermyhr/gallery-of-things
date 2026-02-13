import { client, urlFor } from '@/lib/sanity';
import { projectQuery } from '@/lib/queries';
import DetailsPanel from '@/components/DetailsPanel';
import { notFound } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';
import ItemGallery from '@/components/ItemGallery';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProject(slug: string) {
  noStore();
  try {
    return await client.fetch(projectQuery, { slug }, { cache: 'no-store' });
  } catch {
    return null;
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="item-page-wrapper">
      <ItemGallery images={project.images || []} />
      <DetailsPanel
        title={project.title}
        description={project.description}
        technicalInfo={project.technicalInfo}
      />
    </div>
  );
}
