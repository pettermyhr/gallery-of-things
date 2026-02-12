import { client } from '@/lib/sanity';
import { projectsQuery } from '@/lib/queries';
import Gallery from '@/components/Gallery';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

async function getProjects() {
  try {
    console.log('Fetching projects...');
    const projects = await client.fetch(projectsQuery);
    console.log('Projects fetched:', projects?.length || 0);
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
