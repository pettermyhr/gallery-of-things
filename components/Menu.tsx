'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuProps {
  siteTitle: string;
  contactEmail?: string;
}

export default function Menu({ siteTitle, contactEmail }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const titleChars = siteTitle.split('').map((char, i) => (
    <span 
      key={i} 
      className="char" 
      style={{ animationDelay: `${i * 0.03}s` }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));

  return (
    <nav className={`menu ${isOpen ? 'is-open' : ''}`} ref={menuRef}>
      <div className="menu__header">
        <Link href="/" className="menu__title type type-h2 type--uppercase">
          {titleChars}
        </Link>
        <button
          className="menu__toggle"
          aria-expanded={isOpen}
          aria-label="Toggle menu"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          <span className="menu__toggle-icon"></span>
        </button>
      </div>
      <div className="menu__content">
        <div className="menu__nav">
          <div className="menu__group">
            <span className="menu__group-label type type-h4 type--muted">Work</span>
            <div className="menu__group-items">
              <Link
                href="/"
                className={`menu__link type type-h2 type--uppercase ${pathname === '/' ? 'menu__link--active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                Projects
              </Link>
              <Link
                href="/highlights"
                className={`menu__link type type-h2 type--uppercase ${pathname === '/highlights' ? 'menu__link--active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                Highlights
              </Link>
            </div>
          </div>
          <div className="menu__group">
            <span className="menu__group-label type type-h4 type--muted">Info</span>
            <div className="menu__group-items">
              <Link
                href="/about"
                className={`menu__link type type-h2 type--uppercase ${pathname === '/about' ? 'menu__link--active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <a
                href={contactEmail ? `mailto:${contactEmail}` : '#'}
                className="menu__link type type-h2 type--uppercase"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
