import React from 'react';
import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
import {
  CodeIcon,
  LayersIcon,
  ServerIcon,
  DatabaseIcon,
  CpuIcon,
  ZapIcon,
  CheckSquareIcon,
  BookOpenIcon,
} from '../common/Icons';

export const TechnologySection: React.FC = () => {
  const techStack = [
    {
      name: 'React 18',
      category: 'Frontend Framework',
      description: 'Declarative component-based UI construction with modern hook patterns and fast rendering.',
      icon: <CodeIcon size={22} />,
    },
    {
      name: 'TypeScript',
      category: 'Type Safety',
      description: 'End-to-end static typing for robust application interfaces and error prevention.',
      icon: <CpuIcon size={22} />,
    },
    {
      name: 'Node.js',
      category: 'Runtime Environment',
      description: 'Event-driven asynchronous JavaScript runtime for high-throughput backend services.',
      icon: <ServerIcon size={22} />,
    },
    {
      name: 'Express.js',
      category: 'Backend Framework',
      description: 'Lightweight RESTful web server framework for routing, middleware, and API controllers.',
      icon: <LayersIcon size={22} />,
    },
    {
      name: 'MongoDB',
      category: 'NoSQL Database',
      description: 'Flexible document store for lost item reports, task board states, and library catalogs.',
      icon: <DatabaseIcon size={22} />,
    },
    {
      name: 'Redux Toolkit',
      category: 'State Management',
      description: 'Centralized predictable state store for managing complex client-side workflows.',
      icon: <CheckSquareIcon size={22} />,
    },
    {
      name: 'REST APIs',
      category: 'Network Protocol',
      description: 'Structured JSON endpoints following RESTful standards for clean CRUD operations.',
      icon: <BookOpenIcon size={22} />,
    },
    {
      name: 'WebSockets',
      category: 'Real-Time Transport',
      description: 'Bi-directional socket connections for live collaborative updates on task boards.',
      icon: <ZapIcon size={22} />,
    },
  ];

  return (
    <section
      id="technology"
      className="section-padding"
      style={{
        backgroundColor: 'var(--color-surface-card)',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <Container>
        <SectionHeading
          eyebrow="TECH STACK ARCHITECTURE"
          badgeVariant="amber"
          title="Technologies & Frameworks"
          description="The MERN stack foundation powering client interactions, state handling, and backend services."
          align="center"
        />

        <div className="grid-4">
          {techStack.map((tech, idx) => (
            <div
              key={idx}
              className="card-base card-hover"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                padding: '1.5rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'var(--color-secondary-light)',
                    color: 'var(--color-secondary)',
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {tech.icon}
                </div>
                <span
                  style={{
                    fontSize: '0.725rem',
                    fontWeight: 600,
                    color: 'var(--color-text-dim)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {tech.category}
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                {tech.name}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                {tech.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default TechnologySection;
