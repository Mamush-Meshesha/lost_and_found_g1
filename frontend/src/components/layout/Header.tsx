import React, { useState, useEffect } from 'react';
import Container from '../common/Container';
import Button from '../common/Button'; // wait, let's import from '../common/Button'
import { NAV_ITEMS } from '../../config/navigation';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';
import { useActiveSection } from '../../hooks/useActiveSection';
import { MenuIcon, XIcon, CodeIcon, ArrowRightIcon } from '../common/Icons';
import ButtonComponent from '../common/Button';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const sectionIds = ['home', 'problems', 'about', 'technology'];
  const activeSection = useActiveSection(sectionIds, 90);
  const scrollToSection = useSmoothScroll();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className="glass-header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
        boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
        transition: 'all var(--transition-fast)',
      }}
    >
      <Container>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {/* Brand Identity */}
          <a
            href="#home"
            onClick={(e) => handleNavClick('home', e)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
            }}
            aria-label="Swenetix DevHub Home"
          >
            <div
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                padding: '0.45rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <CodeIcon size={20} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  letterSpacing: '-0.02em',
                  color: 'var(--color-text)',
                  lineHeight: 1.1,
                }}
              >
                SWENETIX
              </span>
              <span
                style={{
                  fontSize: '0.725rem',
                  fontWeight: 600,
                  color: 'var(--color-secondary)',
                  letterSpacing: '0.12em',
                  lineHeight: 1.1,
                }}
              >
                // DevHub
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main Navigation"
            className="desktop-nav"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
            }}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(item.id, e)}
                  style={{
                    fontSize: '0.925rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    position: 'relative',
                    padding: '0.5rem 0',
                    transition: 'color var(--transition-fast)',
                  }}
                >
                  {item.label}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        backgroundColor: 'var(--color-primary)',
                        borderRadius: 'var(--radius-full)',
                      }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Header Action CTA */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center' }}>
            <ButtonComponent
              variant="primary"
              size="sm"
              icon={<ArrowRightIcon size={16} />}
              onClick={() => navigate("/login")}
            >
              login
            </ButtonComponent>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text)',
              padding: '0.4rem',
              cursor: 'pointer',
              display: 'none', // styled via media query below or responsive inline toggle
            }}
          >
            {mobileMenuOpen ? <XIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </Container>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          style={{
            position: 'absolute',
            top: 'var(--header-height)',
            left: 0,
            right: 0,
            backgroundColor: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            zIndex: 49,
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(item.id, e)}
                style={{
                  fontSize: '1.05rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-primary)',
                    }}
                  />
                )}
              </a>
            );
          })}
          <div style={{ paddingTop: '0.5rem' }}>
            <ButtonComponent
              variant="primary"
              size="md"
              fullWidth
              icon={<ArrowRightIcon size={16} />}
              onClick={() => {
                navigate("/login")
              }}
            >
              login
            </ButtonComponent>
          </div>
        </div>
      )}

      {/* CSS Rules for Desktop vs Mobile Toggle */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
