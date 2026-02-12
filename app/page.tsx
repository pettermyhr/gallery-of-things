import { client } from '@/lib/sanity';
import { projectsQuery } from '@/lib/queries';
import Gallery from '@/components/Gallery';

export const dynamic = 'force-dynamic';

async function getProjects() {
  try {
    return await client.fetch(projectsQuery) || [];
  } catch {
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
