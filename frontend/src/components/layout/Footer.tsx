import React from 'react';
import Container from '../common/Container';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';
import { NAV_ITEMS, PROBLEMS_DATA } from '../../config/navigation';
import { CodeIcon, GithubIcon, ExternalLinkIcon } from '../common/Icons';

export const Footer: React.FC = () => {
  const scrollToSection = useSmoothScroll();

  const handleLinkClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection(id);
  };

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-surface-card)',
        borderTop: '1px solid var(--color-border)',
        paddingTop: '4rem',
        paddingBottom: '2.5rem',
        marginTop: '5rem',
      }}
    >
      <Container>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3.5rem',
          }}
        >
          {/* Brand Info Column */}
          <div style={{ gridColumn: 'span 1' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
                  padding: '0.4rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CodeIcon size={18} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-text)' }}>
                  SWENETIX
                </span>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-secondary)' }}>
                  // DevHub
                </span>
              </div>
            </div>
            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.6,
                marginBottom: '1.25rem',
              }}
            >
              Swenetix Developer Hiring Hackathon frontend platform. Providing production-grade architectural shells for practical engineering challenges.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--color-text-dim)' }}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Repository Placeholder"
                style={{
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <GithubIcon size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text)', marginBottom: '1.25rem' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={(e) => handleLinkClick(item.id, e)}
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--color-text-muted)',
                      transition: 'color var(--transition-fast)',
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Hackathon Problems */}
          <div>
            <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text)', marginBottom: '1.25rem' }}>
              Hackathon Problems
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {PROBLEMS_DATA.map((prob) => (
                <li key={prob.id}>
                  <a
                    href={`#${prob.targetSection}`}
                    onClick={(e) => handleLinkClick(prob.targetSection, e)}
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--color-text-muted)',
                      transition: 'color var(--transition-fast)',
                    }}
                  >
                    Problem {prob.number} - {prob.shortTitle}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Technology Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text)', marginBottom: '1.25rem' }}>
              Technologies
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'REST APIs', 'WebSockets'].map((tech) => (
                <a
                  key={tech}
                  href="#technology"
                  onClick={(e) => handleLinkClick('technology', e)}
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--color-text-muted)',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    padding: '0.25rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'border-color var(--transition-fast)',
                  }}
                >
                  {tech}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: '1.75rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.85rem',
            color: 'var(--color-text-dim)',
          }}
        >
          <span>© 2026 Swenetix Developer Hiring Hackathon. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#home" onClick={(e) => handleLinkClick('home', e)} style={{ color: 'var(--color-text-dim)' }}>
              Back to Top ↑
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
