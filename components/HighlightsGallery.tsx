'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';

interface HighlightImage {
  asset: any;
  alt?: string;
}

interface HighlightsGalleryProps {
  images: HighlightImage[];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function HighlightsGallery({ images }: HighlightsGalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [shuffledImages, setShuffledImages] = useState<HighlightImage[]>([]);

  useEffect(() => {
    setShuffledImages(shuffleArray(images));
  }, [images]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const galleryItems = galleryRef.current?.querySelectorAll('.gallery__item');
    galleryItems?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [shuffledImages]);

  if (!shuffledImages.length) return null;

  return (
    <div className="gallery highlights-page" ref={galleryRef}>
      {shuffledImages.map((image, index) => (
        <div key={index} className="gallery__item">
          <Image
            src={urlFor(image.asset).width(800).height(1200).url()}
            alt={image.alt || 'Highlight image'}
            width={800}
            height={1200}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
