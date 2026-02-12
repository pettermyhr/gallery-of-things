'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity';

interface GalleryItem {
  _id: string;
  title: string;
  slug: { current: string };
  thumbnail: any;
  thumbnailAlt?: string;
}

interface GalleryProps {
  items: GalleryItem[];
  clickable?: boolean;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function Gallery({ items, clickable = true }: GalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [shuffledItems, setShuffledItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    setShuffledItems(shuffleArray(items));
  }, [items]);

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
  }, [shuffledItems]);

  if (!shuffledItems.length) return null;

  return (
    <div className={`gallery ${!clickable ? 'highlights-page' : ''}`} ref={galleryRef}>
      {shuffledItems.map((item) => {
        const content = (
          <>
            <Image
              src={urlFor(item.thumbnail).width(800).height(1200).url()}
              alt={item.thumbnailAlt || item.title}
              width={800}
              height={1200}
              loading="lazy"
            />
            <span className="gallery__item-title type type-h2">{item.title}</span>
          </>
        );

        if (clickable) {
          return (
            <Link
              key={item._id}
              href={`/project/${item.slug.current}`}
              className="gallery__item"
            >
              {content}
            </Link>
          );
        }

        return (
          <div key={item._id} className="gallery__item">
            {content}
          </div>
        );
      })}
    </div>
  );
}
