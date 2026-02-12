import { client } from '@/lib/sanity';
import { aboutPageQuery } from '@/lib/queries';
import AboutSlideshow from '@/components/AboutSlideshow';
import CollapseButtons from '@/components/CollapseButtons';

export const dynamic = 'force-dynamic';

async function getAboutPage() {
  try {
    return await client.fetch(aboutPageQuery);
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
