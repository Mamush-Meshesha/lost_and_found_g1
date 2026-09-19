import React from 'react';
import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
import { LayersIcon, CpuIcon, ShieldCheckIcon, ZapIcon } from '../common/Icons';

export const AboutSection: React.FC = () => {
  const principles = [
    {
      icon: <LayersIcon size={24} />,
      title: 'Clean Architecture',
      description: 'Modular separation of concerns across components, layout shells, hooks, and Redux state management.',
    },
    {
      icon: <ZapIcon size={24} />,
      title: 'Responsive Experience',
      description: 'Fluid layout design tokens ensuring flawless usability across desktop, tablet, and mobile breakpoints.',
    },
    {
      icon: <CpuIcon size={24} />,
      title: 'Real-World Focus',
      description: 'Addressing authentic full-stack engineering challenges with data persistence, real-time sync, and RBAC rules.',
    },
    {
      icon: <ShieldCheckIcon size={24} />,
      title: 'Scalable Foundation',
      description: 'Extensible UI component architecture ready for seamless API integration and state persistence.',
    },
  ];

  return (
    <section id="about" className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Container>
        <SectionHeading
          eyebrow="ABOUT THE PLATFORM"
          badgeVariant="emerald"
          title="Designed for Senior Engineering Evaluation"
          description="Built to demonstrate production-quality full-stack engineering principles, scalable architecture, and modern UX."
          align="center"
        />

        <div className="grid-4">
          {principles.map((p, idx) => (
            <div
              key={idx}
              className="card-base card-hover"
              style={{
                backgroundColor: 'var(--color-surface)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                {p.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem', color: 'var(--color-text)' }}>
                {p.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default AboutSection;
