import React from 'react';
import Badge, { BadgeVariant } from './Badge';

export interface SectionHeadingProps {
  eyebrow?: string;
  badgeVariant?: BadgeVariant;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  badgeVariant = 'indigo',
  title,
  description,
  align = 'center',
  className = '',
}) => {
  const isCenter = align === 'center';

  return (
    <div
      className={className}
      style={{
        textAlign: isCenter ? 'center' : 'left',
        maxWidth: isCenter ? '720px' : '100%',
        margin: isCenter ? '0 auto 3.5rem auto' : '0 0 2.5rem 0',
      }}
    >
      {eyebrow && (
        <div style={{ marginBottom: '0.85rem' }}>
          <Badge variant={badgeVariant}>{eyebrow}</Badge>
        </div>
      )}
      <h2 style={{ color: 'var(--color-text)', marginBottom: description ? '1rem' : '0' }}>
        {title}
      </h2>
      {description && (
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
