import React from 'react';
import Badge from './Badge';
import Button from './Button';
import { ArrowRightIcon } from './Icons';

export interface ProblemCardProps {
  number: string;
  title: string;
  description: string;
  tags: string[];
  icon?: React.ReactNode;
  targetSection: string;
  onAction?: (targetSection: string) => void;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({
  number,
  title,
  description,
  tags,
  icon,
  targetSection,
  onAction,
}) => {
  const handleClick = () => {
    if (onAction) {
      onAction(targetSection);
    }
  };

  return (
    <div className="card-base card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header row with Number & Icon */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
        }}
      >
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: 'var(--color-primary)',
            backgroundColor: 'var(--color-primary-light)',
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}
        >
          PROBLEM {number}
        </span>
        {icon && (
          <div
            style={{
              color: 'var(--color-secondary)',
              backgroundColor: 'var(--color-secondary-light)',
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Title & Description */}
      <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: 'var(--color-text)' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.95rem', flexGrow: 1, marginBottom: '1.5rem', lineHeight: 1.6 }}>
        {description}
      </p>

      {/* Tags */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1.75rem',
        }}
      >
        {tags.map((tag, idx) => (
          <Badge key={idx} variant={idx % 2 === 0 ? 'indigo' : 'cyan'}>
            {tag}
          </Badge>
        ))}
      </div>

      {/* Action CTA */}
      <div style={{ marginTop: 'auto' }}>
        <Button
          variant="secondary"
          size="md"
          fullWidth
          icon={<ArrowRightIcon size={16} />}
          onClick={handleClick}
          aria-label={`View Problem ${number}: ${title}`}
        >
          View Problem {number}
        </Button>
      </div>
    </div>
  );
};

export default ProblemCard;
