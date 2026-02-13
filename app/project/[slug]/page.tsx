import { client } from '@/lib/sanity';
import { projectQuery } from '@/lib/queries';
import ItemGallery from '@/components/ItemGallery';
import DetailsPanel from '@/components/DetailsPanel';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProject(slug: string) {
  try {
    return await client.fetch(projectQuery, { slug });
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
    <>
      <main className="item-gallery">
        {project.images?.map((image: any, index: number) => (
          <div key={index} className="item-gallery__item">
            <img 
              src={`https://cdn.sanity.io/images/n2p9wnnu/production/${image.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}`}
              alt={image.alt || `Image ${index + 1}`}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </main>
      <DetailsPanel
        title={project.title}
        description={project.description}
        technicalInfo={project.technicalInfo}
      />
    </>
  );
}
