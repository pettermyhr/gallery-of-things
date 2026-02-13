'use client';

import { useState } from 'react';

interface Section {
  title: string;
  content: string;
}

interface CollapseButtonsProps {
  sections: Section[];
}

export default function CollapseButtons({ sections }: CollapseButtonsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!sections?.length) return null;

  return (
    <div className={`collapse-group ${openIndex !== null ? 'has-open' : ''}`}>
      {sections.map((section, index) => (
        <div
          key={index}
          className="collapse-btn"
          aria-expanded={openIndex === index}
        >
          <button 
            className="collapse-btn__header"
            onClick={() => handleClick(index)}
          >
            <span className="collapse-btn__label type type-h1">{section.title}</span>
            <span className="collapse-btn__icon"></span>
          </button>
          <div className="collapse-btn__content">
            <p className="type type-h2">{section.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
