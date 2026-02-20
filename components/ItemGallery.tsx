'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';

interface GalleryImage {
  asset: any;
  alt?: string;
  aspectRatio?: number;
}

interface DisplayImage extends GalleryImage {
  uniqueId: string;
}

interface ItemGalleryProps {
  images: GalleryImage[];
}

export default function ItemGallery({ images }: ItemGalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<any>(null);
  const isLoadingLeftRef = useRef(false);
  const isLoadingRightRef = useRef(false);
  const [displayImages, setDisplayImages] = useState<DisplayImage[]>([]);
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(false);
  const originalImages = useRef<GalleryImage[]>([]);
  const initialScrollDone = useRef(false);

  // Add item-page class to body
  useEffect(() => {
    document.body.classList.add('item-page');
    setIsTabletOrMobile(window.innerWidth <= 1024);
    
    return () => {
      document.body.classList.remove('item-page');
    };
  }, []);

  // Initialize display images with sets on both sides
  useEffect(() => {
    if (!images.length) return;
    originalImages.current = images;
    
    // Start with 3 sets left + original + 3 sets right
    const initial: DisplayImage[] = [];
    for (let i = 0; i < 3; i++) {
      initial.push(...images.map((img, idx) => ({ ...img, uniqueId: `left-${i}-${idx}` })));
    }
    initial.push(...images.map((img, idx) => ({ ...img, uniqueId: `center-${idx}` })));
    for (let i = 0; i < 3; i++) {
      initial.push(...images.map((img, idx) => ({ ...img, uniqueId: `right-${i}-${idx}` })));
    }
    setDisplayImages(initial);
  }, [images]);

  // Lenis horizontal scroll
  useEffect(() => {
    if (!displayImages.length || !galleryRef.current) return;

    import('lenis').then(({ default: Lenis }) => {
      const gallery = galleryRef.current;
      if (!gallery) return;

      // Scroll to center on init (to the middle set)
      if (!initialScrollDone.current && !isTabletOrMobile) {
        requestAnimationFrame(() => {
          const itemWidth = gallery.firstElementChild?.getBoundingClientRect().width || 0;
          const gap = 6;
          const centerOffset = (3 * originalImages.current.length) * (itemWidth + gap);
          gallery.scrollLeft = centerOffset;
          initialScrollDone.current = true;
        });
      }

      lenisRef.current = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: isTabletOrMobile ? 'vertical' : 'horizontal',
        wrapper: isTabletOrMobile ? window : gallery,
        content: isTabletOrMobile ? document.documentElement : gallery,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2
      });

      lenisRef.current.on('scroll', checkScroll);

      function raf(time: number) {
        lenisRef.current?.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    });

    return () => {
      lenisRef.current?.destroy();
    };
  }, [displayImages.length > 0, isTabletOrMobile]);

  const checkScroll = useCallback(() => {
    if (!galleryRef.current) return;

    if (isTabletOrMobile) {
      const scrollTop = lenisRef.current?.scroll || window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      if (scrollTop + windowHeight >= documentHeight - 800 && !isLoadingRightRef.current) {
        appendImages();
      }
    } else {
      const scrollLeft = lenisRef.current?.scroll || 0;
      const containerWidth = galleryRef.current.scrollWidth;
      const viewportWidth = galleryRef.current.clientWidth;
      
      // Append when near right edge
      if (scrollLeft + viewportWidth >= containerWidth - 800 && !isLoadingRightRef.current) {
        appendImages();
      }
      
      // Prepend when near left edge
      if (scrollLeft < 800 && !isLoadingLeftRef.current) {
        prependImages();
      }
    }
  }, [isTabletOrMobile]);

  const appendImages = () => {
    if (isLoadingRightRef.current) return;
    isLoadingRightRef.current = true;

    setDisplayImages(prev => {
      const newImages = originalImages.current.map((img, idx) => ({
        ...img,
        uniqueId: `append-${Date.now()}-${idx}`
      }));
      return [...prev, ...newImages];
    });

    requestAnimationFrame(() => {
      lenisRef.current?.resize();
      isLoadingRightRef.current = false;
    });
  };

  const prependImages = () => {
    if (isLoadingLeftRef.current || !galleryRef.current) return;
    isLoadingLeftRef.current = true;

    lenisRef.current?.stop();

    const gallery = galleryRef.current;
    const scrollLeft = gallery.scrollLeft;
    const firstItem = gallery.firstElementChild as HTMLElement;
    const itemWidth = firstItem?.getBoundingClientRect().width || 0;
    const gap = 6;

    setDisplayImages(prev => {
      const newImages = originalImages.current.map((img, idx) => ({
        ...img,
        uniqueId: `prepend-${Date.now()}-${idx}`
      }));
      return [...newImages, ...prev];
    });

    requestAnimationFrame(() => {
      // Adjust scroll to compensate for prepended items
      const addedWidth = originalImages.current.length * (itemWidth + gap);
      gallery.scrollLeft = scrollLeft + addedWidth;

      lenisRef.current?.start();
      lenisRef.current?.resize();
      isLoadingLeftRef.current = false;
    });
  };

  // Visibility observer
  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { 
        root: isTabletOrMobile ? null : gallery,
        rootMargin: '50px', 
        threshold: 0.1 
      }
    );

    const items = gallery.querySelectorAll('.item-gallery__item:not(.is-visible)');
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [displayImages, isTabletOrMobile]);

  // Handle resize
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const nowIsTabletOrMobile = window.innerWidth <= 1024;
        if (nowIsTabletOrMobile !== isTabletOrMobile) {
          setIsTabletOrMobile(nowIsTabletOrMobile);
          window.scrollTo(0, 0);
          if (galleryRef.current) {
            galleryRef.current.scrollLeft = 0;
          }
        }
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [isTabletOrMobile]);

  if (!displayImages.length) return null;

  return (
    <main className="item-gallery" ref={galleryRef}>
      {displayImages.map((image) => {
        const aspectRatio = image.asset?.metadata?.dimensions?.aspectRatio || 0.667;
        return (
          <div 
            key={image.uniqueId} 
            className="item-gallery__item is-visible"
            style={{ aspectRatio: aspectRatio }}
          >
            <Image
              src={urlFor(image.asset).quality(100).auto('format').url()}
              alt={image.alt || 'Project image'}
              fill
              sizes="(max-width: 1024px) 100vw, auto"
              style={{ objectFit: 'cover' }}
              placeholder="blur"
              blurDataURL={urlFor(image.asset).width(20).quality(20).blur(50).url()}
            />
          </div>
        );
      })}
    </main>
  );
}
