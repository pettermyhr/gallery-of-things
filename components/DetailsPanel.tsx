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
    <div className={`details ${isOpen ? 'is-open' : ''}`}>
      <div
        className="details__header"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <span className="details__label type type-h1">{title}</span>
        <div className="details__icon"></div>
      </div>
      <div className="details__body">
        <div className="details__text">
          {description && (
            <p className="type type-h2" style={{ marginBottom: '16px' }}>{description}</p>
          )}
          {technicalInfo && technicalInfo.length > 0 && (
            <div className="details__info">
              {technicalInfo.map((info, index) => (
                <div key={index} className="details__info-row">
                  <span className="type type-h3 type--muted">{info.label}</span>
                  <span className="type type-h3">{info.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
