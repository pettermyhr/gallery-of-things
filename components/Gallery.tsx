'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity';

interface GalleryItem {
  _id: string;
  title: string;
  slug: { current: string };
  thumbnail: any;
  thumbnailAlt?: string;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
}

interface GalleryProps {
  items: GalleryItem[];
  clickable?: boolean;
}

function isLandscape(item: GalleryItem): boolean {
  return !!(item.thumbnailWidth && item.thumbnailHeight && item.thumbnailWidth > item.thumbnailHeight);
}

export default function Gallery({ items, clickable = true }: GalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<any>(null);
  const isLoadingTop = useRef(false);
  const isLoadingBottom = useRef(false);
  const [displayItems, setDisplayItems] = useState<GalleryItem[]>([]);
  const originalItems = useRef<GalleryItem[]>([]);

  // Initialize with shuffled items and clones
  useEffect(() => {
    if (!items.length) return;
    
    originalItems.current = items;
    
    // Create initial display: 3 sets above + original + 3 sets below
    const initialItems: GalleryItem[] = [];
    for (let i = 0; i < 3; i++) {
      initialItems.push(...items.map((item, idx) => ({ ...item, _id: `top-${i}-${idx}-${item._id}` })));
    }
    initialItems.push(...items);
    for (let i = 0; i < 3; i++) {
      initialItems.push(...items.map((item, idx) => ({ ...item, _id: `bottom-${i}-${idx}-${item._id}` })));
    }
    
    setDisplayItems(initialItems);
  }, [items]);

  // Lenis smooth scroll and infinite scroll
  useEffect(() => {
    if (!displayItems.length || !galleryRef.current) return;

    // Dynamic import Lenis
    import('lenis').then(({ default: Lenis }) => {
      // Scroll to center after layout
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const gallery = galleryRef.current;
          if (!gallery) return;

          const galleryItems = gallery.querySelectorAll('.gallery__item');
          const columns = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--gallery-columns')) || 5;
          const targetIndex = (3 * originalItems.current.length) + columns;
          const targetItem = galleryItems[targetIndex] as HTMLElement;

          if (targetItem) {
            const rect = targetItem.getBoundingClientRect();
            const scrollTarget = targetItem.offsetTop - (window.innerHeight / 2) + (rect.height / 2);
            window.scrollTo(0, scrollTarget);
          }

          // Initialize Lenis
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
  }, [displayItems.length > 0]);

  const checkScroll = useCallback(() => {
    const scrollTop = lenisRef.current?.scroll || window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight - 1000 && !isLoadingBottom.current) {
      appendItems();
    }

    if (scrollTop < 1000 && !isLoadingTop.current) {
      prependItems();
    }
  }, []);

  const appendItems = () => {
    if (isLoadingBottom.current) return;
    isLoadingBottom.current = true;

    setDisplayItems(prev => {
      const newItems = originalItems.current.map((item, idx) => ({
        ...item,
        _id: `append-${Date.now()}-${idx}-${item._id}`
      }));
      return [...prev, ...newItems];
    });

    requestAnimationFrame(() => {
      lenisRef.current?.resize();
      isLoadingBottom.current = false;
    });
  };

  const prependItems = () => {
    if (isLoadingTop.current || !galleryRef.current) return;
    isLoadingTop.current = true;

    lenisRef.current?.stop();

    const scrollY = window.scrollY;
    const firstItem = galleryRef.current.firstElementChild as HTMLElement;
    const offsetBefore = firstItem?.offsetTop || 0;

    setDisplayItems(prev => {
      const newItems = originalItems.current.map((item, idx) => ({
        ...item,
        _id: `prepend-${Date.now()}-${idx}-${item._id}`
      }));
      return [...newItems, ...prev];
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
  }, [displayItems]);

  if (!displayItems.length) return null;

  return (
    <div className={`gallery ${!clickable ? 'highlights-page' : ''}`} ref={galleryRef}>
      {displayItems.map((item) => {
        const landscape = isLandscape(item);
        const itemClass = `gallery__item${landscape ? ' gallery__item--landscape' : ''}`;
        const content = (
          <>
            <Image
              src={urlFor(item.thumbnail).quality(100).auto('format').url()}
              alt={item.thumbnailAlt || item.title}
              width={item.thumbnailWidth || 1200}
              height={item.thumbnailHeight || 1800}
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
              className={itemClass}
            >
              {content}
            </Link>
          );
        }

        return (
          <div key={item._id} className={itemClass}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
