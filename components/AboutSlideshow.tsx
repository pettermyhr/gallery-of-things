'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';

interface SlideshowImage {
  asset: any;
  alt?: string;
}

interface AboutSlideshowProps {
  images: SlideshowImage[];
}

export default function AboutSlideshow({ images }: AboutSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (!images?.length) return null;

  return (
    <div className="about__image">
      {images.map((image, index) => (
        <Image
          key={index}
          src={urlFor(image.asset).width(1800).height(1800).quality(90).url()}
          alt={image.alt || `Slideshow image ${index + 1}`}
          fill
          style={{
            objectFit: 'cover',
            opacity: index === currentIndex ? 1 : 0,
            transition: 'opacity 2s ease',
          }}
          priority={index === 0}
        />
      ))}
    </div>
  );
}
