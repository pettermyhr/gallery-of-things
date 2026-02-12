import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

console.log('Sanity config:', { projectId, dataset });

if (!projectId || !dataset) {
  console.error('Missing Sanity environment variables:', { projectId, dataset });
}

export const client = createClient({
  projectId: projectId || 'n2p9wnnu',
  dataset: dataset || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
