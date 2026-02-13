import { client } from '@/lib/sanity';
import { projectsQuery } from '@/lib/queries';
import Gallery from '@/components/Gallery';
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getProjects() {
  noStore();
  try {
    const projects = await client.fetch(projectsQuery, {}, { cache: 'no-store' });
    return projects || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export default async function HomePage() {
  const projects = await getProjects();

  return (
    <main>
      {projects.length > 0 ? (
        <Gallery items={projects} clickable={true} />
      ) : (
        <div style={{ padding: '100px 40px', textAlign: 'center' }}>
          <p className="type type-h2">No projects yet. Add content in Sanity.</p>
        </div>
      )}
    </main>
  );
}
