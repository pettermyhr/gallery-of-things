'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';

interface GalleryImage {
  asset: any;
  alt?: string;
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
  const isLoadingRef = useRef(false);
  const [displayImages, setDisplayImages] = useState<DisplayImage[]>([]);
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(false);
  const originalImages = useRef<GalleryImage[]>([]);

  // Add item-page class to body
  useEffect(() => {
    document.body.classList.add('item-page');
    setIsTabletOrMobile(window.innerWidth <= 1024);
    
    return () => {
      document.body.classList.remove('item-page');
    };
  }, []);

  // Initialize display images
  useEffect(() => {
    if (!images.length) return;
    originalImages.current = images;
    
    // Start with original + 2 clones
    const initial: DisplayImage[] = [];
    for (let i = 0; i < 3; i++) {
      initial.push(...images.map((img, idx) => ({ ...img, uniqueId: `set-${i}-${idx}` })));
    }
    setDisplayImages(initial);
  }, [images]);

  // Lenis horizontal scroll
  useEffect(() => {
    if (!displayImages.length || !galleryRef.current) return;

    import('lenis').then(({ default: Lenis }) => {
      const gallery = galleryRef.current;
      if (!gallery) return;

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
    if (!galleryRef.current || isLoadingRef.current) return;

    if (isTabletOrMobile) {
      const scrollTop = lenisRef.current?.scroll || window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      if (scrollTop + windowHeight >= documentHeight - 800) {
        loadMoreImages();
      }
    } else {
      const scrollLeft = lenisRef.current?.scroll || 0;
      const containerWidth = galleryRef.current.scrollWidth;
      const viewportWidth = galleryRef.current.clientWidth;
      
      if (scrollLeft + viewportWidth >= containerWidth - 800) {
        loadMoreImages();
      }
    }
  }, [isTabletOrMobile]);

  const loadMoreImages = () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    setDisplayImages(prev => {
      const newImages = originalImages.current.map((img, idx) => ({
        ...img,
        uniqueId: `append-${Date.now()}-${idx}`
      }));
      return [...prev, ...newImages];
    });

    requestAnimationFrame(() => {
      lenisRef.current?.resize();
      isLoadingRef.current = false;
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
      {displayImages.map((image) => (
        <div key={image.uniqueId} className="item-gallery__item">
          <Image
            src={urlFor(image.asset).auto('format').url()}
            alt={image.alt || 'Project image'}
            width={800}
            height={1200}
            style={{ width: 'auto', height: '100%' }}
          />
        </div>
      ))}
    </main>
  );
}
