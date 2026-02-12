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
        <button
          key={index}
          className="collapse-btn"
          aria-expanded={openIndex === index}
          onClick={() => handleClick(index)}
        >
          <div className="collapse-btn__header">
            <span className="collapse-btn__label type type-h1">{section.title}</span>
            <span className="collapse-btn__icon"></span>
          </div>
          <div className="collapse-btn__content">
            <p className="type type-h2">{section.content}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
