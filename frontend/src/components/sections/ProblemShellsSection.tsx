import React from 'react';
import Container from '../common/Container';
import Badge from '../common/Badge';
import SectionHeading from '../common/SectionHeading';
import { PROBLEMS_DATA } from '../../config/navigation';
import { SearchIcon, CheckSquareIcon, BookOpenIcon, CodeIcon, ZapIcon, ShieldCheckIcon } from '../common/Icons';

export const ProblemShellsSection: React.FC = () => {
  const getProblemIcon = (id: string) => {
    switch (id) {
      case 'problem-1':
        return <SearchIcon size={24} />;
      case 'problem-2':
        return <CheckSquareIcon size={24} />;
      case 'problem-3':
        return <BookOpenIcon size={24} />;
      default:
        return <CodeIcon size={24} />;
    }
  };

  const getArchitectureHighlights = (id: string) => {
    switch (id) {
      case 'problem-1':
        return [
          { label: 'State Management', val: 'Redux Toolkit / Context' },
          { label: 'Search & Filter', val: 'Indexed Regex & Tags' },
          { label: 'Data Model', val: 'Lost/Found Item Schema' },
        ];
      case 'problem-2':
        return [
          { label: 'Real-time Transport', val: 'WebSocket / Socket.IO' },
          { label: 'Concurrency Control', val: 'Optimistic UI Updates' },
          { label: 'Board Structure', val: 'Kanban Column State' },
        ];
      case 'problem-3':
        return [
          { label: 'Access Control', val: 'Role-Based Auth (RBAC)' },
          { label: 'Borrowing Engine', val: 'Inventory Rules & Limits' },
          { label: 'Protection', val: 'Concurrent Borrow Guard' },
        ];
      default:
        return [];
    }
  };

  return (
    <section
      style={{
        paddingTop: '4rem',
        paddingBottom: '5rem',
        backgroundColor: 'var(--color-surface-card)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <Container>
        <SectionHeading
          eyebrow="APPLICATION SHELLS"
          badgeVariant="cyan"
          title="Problem Development Foundation"
          description="Each challenge is isolated within a dedicated architectural shell ready for business logic implementation."
          align="center"
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {PROBLEMS_DATA.map((prob) => {
            const highlights = getArchitectureHighlights(prob.id);
            return (
              <div
                key={prob.id}
                id={prob.targetSection}
                className="card-base"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  padding: '2.25rem',
                }}
              >
                {/* Header row */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                    paddingBottom: '1.25rem',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        backgroundColor: 'var(--color-primary-light)',
                        color: 'var(--color-primary)',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {getProblemIcon(prob.id)}
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: 'var(--color-primary)',
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                        }}
                      >
                        PROBLEM {prob.number} ARCHITECTURE
                      </span>
                      <h3 style={{ fontSize: '1.5rem', color: 'var(--color-text)', marginTop: '0.2rem' }}>
                        {prob.title}
                      </h3>
                    </div>
                  </div>

                  <Badge variant="cyan" icon={<ZapIcon size={14} />}>
                    Foundation Shell Ready
                  </Badge>
                </div>

                {/* Description */}
                <p style={{ fontSize: '1.025rem', lineHeight: 1.6, marginBottom: '1.75rem', color: 'var(--color-text-muted)' }}>
                  {prob.description}
                </p>

                {/* Technical Tags & Architecture Specs Grid */}
                <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
                  <div
                    style={{
                      backgroundColor: 'rgba(11, 15, 25, 0.6)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                    }}
                  >
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
                      Target Tech Stack
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {prob.tags.map((t, i) => (
                        <Badge key={i} variant="indigo">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: 'rgba(11, 15, 25, 0.6)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                    }}
                  >
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
                      Architectural Requirements
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {highlights.map((h, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                          <span style={{ color: 'var(--color-text-dim)' }}>{h.label}:</span>
                          <span style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>{h.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Placeholder Notice Box */}
                <div
                  style={{
                    backgroundColor: 'rgba(99, 102, 241, 0.05)',
                    border: '1px dashed rgba(99, 102, 241, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <ShieldCheckIcon size={24} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)' }}>
                      Module Container Established
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      UI layout and component contracts are prepared. Business logic and API endpoints will be integrated in subsequent implementation phases.
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default ProblemShellsSection;
