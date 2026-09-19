import React from 'react';

export type BadgeVariant = 'indigo' | 'cyan' | 'emerald' | 'amber';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'indigo',
  className = '',
  icon,
}) => {
  const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
    indigo: {
      backgroundColor: 'var(--color-primary-light)',
      color: '#818cf8',
      borderColor: 'rgba(99, 102, 241, 0.3)',
    },
    cyan: {
      backgroundColor: 'var(--color-secondary-light)',
      color: '#22d3ee',
      borderColor: 'rgba(6, 182, 212, 0.3)',
    },
    emerald: {
      backgroundColor: 'var(--color-success-light)',
      color: '#34d399',
      borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    amber: {
      backgroundColor: 'var(--color-warning-light)',
      color: '#fbbf24',
      borderColor: 'rgba(245, 158, 11, 0.3)',
    },
  };

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.25rem 0.75rem',
    fontSize: '0.785rem',
    fontWeight: 600,
    borderRadius: 'var(--radius-full)',
    border: '1px solid',
    letterSpacing: '0.02em',
    lineHeight: 1.2,
    ...variantStyles[variant],
  };

  return (
    <span style={baseStyle} className={className}>
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
