'use client';

import { useState } from 'react';

interface TechnicalInfo {
  label: string;
  value: string;
}

interface DetailsPanelProps {
  title: string;
  description?: string;
  technicalInfo?: TechnicalInfo[];
}

export default function DetailsPanel({ title, description, technicalInfo }: DetailsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={`details ${isOpen ? 'is-open' : ''}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="details__content">
        <div className="details__text">
          <h1 className="type type-h1">{title}</h1>
          {description && (
            <h2 className="type type-h2">{description}</h2>
          )}
          {technicalInfo && technicalInfo.length > 0 && (
            <dl className="details__info">
              {technicalInfo.map((info, index) => (
                <div key={index} className="details__info-row">
                  <dt className="type type-h3 type--muted">{info.label}</dt>
                  <dd className="type type-h3">{info.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
      <div className="details__header">
        <span className="details__label type type-h2 type--uppercase">Details</span>
        <span className="details__icon"></span>
      </div>
    </div>
  );
}
