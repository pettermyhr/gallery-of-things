import { client } from '@/lib/sanity';
import { projectsQuery } from '@/lib/queries';
import Gallery from '@/components/Gallery';

async function getProjects() {
  return client.fetch(projectsQuery);
}

export default async function HomePage() {
  const projects = await getProjects();

  return (
    <main>
      <Gallery items={projects} clickable={true} />
    </main>
  );
}
