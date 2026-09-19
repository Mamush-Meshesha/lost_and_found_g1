import React from 'react';
import Container from '../common/Container';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { ArrowRightIcon, CodeIcon, SparklesIcon, LayersIcon, ServerIcon } from '../common/Icons';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';

export const HeroSection: React.FC = () => {
  const scrollToSection = useSmoothScroll();

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        paddingTop: '5.5rem',
        paddingBottom: '5rem',
        overflow: 'hidden',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      {/* Background Decorator Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-150px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.05) 50%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Container>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>
          {/* Eyebrow Badge */}
          <div style={{ display: 'inline-flex', marginBottom: '1.5rem' }}>
            <Badge variant="indigo" icon={<SparklesIcon size={14} />}>
              SWENETIX DEVELOPER HIRING HACKATHON
            </Badge>
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.25rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '1.5rem',
              color: 'var(--color-text)',
            }}
          >
            Build. Collaborate.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #818cf8 0%, #22d3ee 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Solve Real Problems.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--color-text-muted)',
              lineHeight: 1.6,
              marginBottom: '2.5rem',
              maxWidth: '720px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            A high-performance developer platform shell built for practical full-stack software engineering challenges. Architected with React, Node.js, Express, and MongoDB.
          </p>

          {/* Dual CTAs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '3.5rem',
            }}
          >
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRightIcon size={18} />}
              onClick={() => scrollToSection('problems')}
            >
              Explore Problems
            </Button>
            <Button
              variant="outline"
              size="lg"
              icon={<CodeIcon size={18} />}
              onClick={() => scrollToSection('technology')}
            >
              View Technology
            </Button>
          </div>

          {/* Stat / Feature Cards */}
          <div
            className="grid-3"
            style={{
              gap: '1.25rem',
              textAlign: 'left',
            }}
          >
            <div
              className="card-base"
              style={{
                padding: '1.25rem 1.5rem',
                backgroundColor: 'rgba(21, 29, 42, 0.7)',
                borderColor: 'var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
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
                <CodeIcon size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1 }}>
                  03
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                  Engineering Challenges
                </div>
              </div>
            </div>

            <div
              className="card-base"
              style={{
                padding: '1.25rem 1.5rem',
                backgroundColor: 'rgba(21, 29, 42, 0.7)',
                borderColor: 'var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  backgroundColor: 'var(--color-secondary-light)',
                  color: 'var(--color-secondary)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LayersIcon size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1 }}>
                  MERN
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                  Full-Stack Platform
                </div>
              </div>
            </div>

            <div
              className="card-base"
              style={{
                padding: '1.25rem 1.5rem',
                backgroundColor: 'rgba(21, 29, 42, 0.7)',
                borderColor: 'var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  backgroundColor: 'var(--color-success-light)',
                  color: 'var(--color-success)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ServerIcon size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1 }}>
                  2026
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                  Developer Hackathon
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
