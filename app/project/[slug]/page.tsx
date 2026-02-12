import { client } from '@/lib/sanity';
import { projectQuery } from '@/lib/queries';
import ItemGallery from '@/components/ItemGallery';
import DetailsPanel from '@/components/DetailsPanel';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProject(slug: string) {
  return client.fetch(projectQuery, { slug });
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="item-page">
      <ItemGallery images={project.images} />
      <DetailsPanel
        title={project.title}
        description={project.description}
        technicalInfo={project.technicalInfo}
      />
    </main>
  );
}
