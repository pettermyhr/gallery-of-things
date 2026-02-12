'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';

interface GalleryImage {
  asset: any;
  alt?: string;
}

interface ItemGalleryProps {
  images: GalleryImage[];
}

export default function ItemGallery({ images }: ItemGalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null);

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

    const items = galleryRef.current?.querySelectorAll('.item-gallery__item');
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  if (!images?.length) return null;

  return (
    <div className="item-gallery" ref={galleryRef}>
      {images.map((image, index) => (
        <div key={index} className="item-gallery__item">
          <Image
            src={urlFor(image.asset).height(1200).url()}
            alt={image.alt || `Image ${index + 1}`}
            width={800}
            height={1200}
            style={{ width: 'auto', height: '100%' }}
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
}
