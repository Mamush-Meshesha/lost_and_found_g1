import { useCallback } from 'react';

export function useSmoothScroll() {
  const scrollToSection = useCallback((sectionId: string) => {
    // Clean id format (strip leading # if present)
    const cleanId = sectionId.replace(/^#/, '');
    const element = document.getElementById(cleanId);

    if (!element) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Calculate header height dynamically if header element exists
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 72;
    const offset = headerHeight + 16;

    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, []);

  return scrollToSection;
}
