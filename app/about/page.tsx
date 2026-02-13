import { client } from '@/lib/sanity';
import { aboutPageQuery } from '@/lib/queries';
import AboutSlideshow from '@/components/AboutSlideshow';
import CollapseButtons from '@/components/CollapseButtons';
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getAboutPage() {
  noStore();
  try {
    return await client.fetch(aboutPageQuery, {}, { cache: 'no-store' });
  } catch {
    return null;
  }
}

export default async function AboutPage() {
  const data = await getAboutPage();

  return (
    <main className="about">
      <AboutSlideshow images={data?.slideshow || []} />
      <div className="about__content">
        <div className="about__top">
          <h1 className="type type-h1">{data?.title || 'About'}</h1>
          {data?.introText && (
            <p className="type type-h2">{data.introText}</p>
          )}
        </div>
        <div className="about__bottom">
          <CollapseButtons sections={data?.sections || []} />
        </div>
      </div>
    </main>
  );
}
