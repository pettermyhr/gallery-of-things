import { client } from '@/lib/sanity';
import { highlightsQuery } from '@/lib/queries';
import HighlightsGallery from '@/components/HighlightsGallery';

async function getHighlights() {
  return client.fetch(highlightsQuery);
}

export default async function HighlightsPage() {
  const data = await getHighlights();

  return (
    <main>
      <HighlightsGallery images={data?.images || []} />
    </main>
  );
}
