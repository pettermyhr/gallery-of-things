import { client } from '@/lib/sanity';
import { highlightsQuery } from '@/lib/queries';
import HighlightsGallery from '@/components/HighlightsGallery';
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getHighlights() {
  noStore();
  try {
    return await client.fetch(highlightsQuery, {}, { cache: 'no-store' });
  } catch {
    return null;
  }
}

export default async function HighlightsPage() {
  const data = await getHighlights();
  const images = data?.images || [];

  return (
    <main>
      {images.length > 0 ? (
        <HighlightsGallery images={images} />
      ) : (
        <div style={{ padding: '100px 40px', textAlign: 'center' }}>
          <p className="type type-h2">No highlights yet. Add content in Sanity.</p>
        </div>
      )}
    </main>
  );
}
