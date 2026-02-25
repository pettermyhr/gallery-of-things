'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';

interface HighlightImage {
  asset: any;
  alt?: string;
  width?: number;
  height?: number;
}

interface DisplayImage extends HighlightImage {
  uniqueId: string;
}

interface HighlightsGalleryProps {
  images: HighlightImage[];
}

function isLandscape(image: HighlightImage): boolean {
  return !!(image.width && image.height && image.width > image.height);
}

export default function HighlightsGallery({ images }: HighlightsGalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<any>(null);
  const isLoadingTop = useRef(false);
  const isLoadingBottom = useRef(false);
  const [displayImages, setDisplayImages] = useState<DisplayImage[]>([]);
  const originalImages = useRef<HighlightImage[]>([]);

  // Initialize with shuffled images and clones
  useEffect(() => {
    if (!images.length) return;
    
    originalImages.current = images;
    
    // Create initial display: 3 sets above + original + 3 sets below
    const initialImages: DisplayImage[] = [];
    for (let i = 0; i < 3; i++) {
      initialImages.push(...images.map((img, idx) => ({ ...img, uniqueId: `top-${i}-${idx}` })));
    }
    initialImages.push(...images.map((img, idx) => ({ ...img, uniqueId: `orig-${idx}` })));
    for (let i = 0; i < 3; i++) {
      initialImages.push(...images.map((img, idx) => ({ ...img, uniqueId: `bottom-${i}-${idx}` })));
    }
    
    setDisplayImages(initialImages);
  }, [images]);

  // Lenis smooth scroll and infinite scroll
  useEffect(() => {
    if (!displayImages.length || !galleryRef.current) return;

    import('lenis').then(({ default: Lenis }) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const gallery = galleryRef.current;
          if (!gallery) return;

          const galleryItems = gallery.querySelectorAll('.gallery__item');
          const columns = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--gallery-columns')) || 5;
          const targetIndex = (3 * originalImages.current.length) + columns;
          const targetItem = galleryItems[targetIndex] as HTMLElement;

          if (targetItem) {
            const rect = targetItem.getBoundingClientRect();
            const scrollTarget = targetItem.offsetTop - (window.innerHeight / 2) + (rect.height / 2);
            window.scrollTo(0, scrollTarget);
          }

          lenisRef.current = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2
          });

          function raf(time: number) {
            lenisRef.current?.raf(time);
            requestAnimationFrame(raf);
          }
          requestAnimationFrame(raf);

          lenisRef.current.on('scroll', checkScroll);
        });
      });
    });

    return () => {
      lenisRef.current?.destroy();
    };
  }, [displayImages.length > 0]);

  const checkScroll = useCallback(() => {
    const scrollTop = lenisRef.current?.scroll || window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight - 1000 && !isLoadingBottom.current) {
      appendImages();
    }

    if (scrollTop < 1000 && !isLoadingTop.current) {
      prependImages();
    }
  }, []);

  const appendImages = () => {
    if (isLoadingBottom.current) return;
    isLoadingBottom.current = true;

    setDisplayImages(prev => {
      const newImages = originalImages.current.map((img, idx) => ({
        ...img,
        uniqueId: `append-${Date.now()}-${idx}`
      }));
      return [...prev, ...newImages];
    });

    requestAnimationFrame(() => {
      lenisRef.current?.resize();
      isLoadingBottom.current = false;
    });
  };

  const prependImages = () => {
    if (isLoadingTop.current || !galleryRef.current) return;
    isLoadingTop.current = true;

    lenisRef.current?.stop();

    const scrollY = window.scrollY;
    const firstItem = galleryRef.current.firstElementChild as HTMLElement;
    const offsetBefore = firstItem?.offsetTop || 0;

    setDisplayImages(prev => {
      const newImages = originalImages.current.map((img, idx) => ({
        ...img,
        uniqueId: `prepend-${Date.now()}-${idx}`
      }));
      return [...newImages, ...prev];
    });

    requestAnimationFrame(() => {
      const offsetAfter = firstItem?.offsetTop || 0;
      const diff = offsetAfter - offsetBefore;
      window.scrollTo(0, scrollY + diff);

      lenisRef.current?.start();
      lenisRef.current?.resize();
      isLoadingTop.current = false;
    });
  };

  // Visibility observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    const galleryItems = galleryRef.current?.querySelectorAll('.gallery__item:not(.is-visible)');
    galleryItems?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [displayImages]);

  if (!displayImages.length) return null;

  return (
    <div className="gallery highlights-page" ref={galleryRef}>
      {displayImages.map((image) => {
        const landscape = isLandscape(image);
        return (
          <div key={image.uniqueId} className={`gallery__item${landscape ? ' gallery__item--landscape' : ''}`}>
            <Image
              src={urlFor(image.asset).quality(100).auto('format').url()}
              alt={image.alt || 'Highlight image'}
              width={image.width || 1200}
              height={image.height || 1800}
              loading="lazy"
            />
          </div>
        );
      })}
    </div>
  );
}
