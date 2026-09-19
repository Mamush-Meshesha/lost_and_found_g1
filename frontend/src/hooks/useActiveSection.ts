import { useState, useEffect } from 'react';

export function useActiveSection(sectionIds: string[], offsetHeight = 100): string {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] || 'home');

  useEffect(() => {
    if (typeof window === 'undefined' || sectionIds.length === 0) return;

    const handleScroll = () => {
      // Check if user is at bottom of page
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
        setActiveSection(sectionIds[sectionIds.length - 1]);
        return;
      }

      // Find section currently in view range
      const scrollPosition = window.scrollY + offsetHeight;

      let currentSection = sectionIds[0];
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            currentSection = id;
          }
        }
      }

      setActiveSection(currentSection);
    };

    // Use IntersectionObserver as primary observer with fallback scroll listener
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: `-${offsetHeight}px 0px -40% 0px`,
      threshold: [0, 0.25, 0.5, 0.75],
    };

    const observedElements: HTMLElement[] = [];

    const observerCallback: IntersectionObserverCallback = (entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        // Sort by intersection ratio or proximity to top
        const mostVisible = visibleEntries.reduce((prev, curr) =>
          curr.intersectionRatio > prev.intersectionRatio ? curr : prev
        );
        if (mostVisible.target.id) {
          setActiveSection(mostVisible.target.id);
        }
      }
    };

    let observer: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(observerCallback, observerOptions);
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          observer?.observe(el);
          observedElements.push(el);
        }
      });
    }

    // Window scroll listener to handle quick scrolling and edge cases
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      if (observer) {
        observedElements.forEach((el) => observer?.unobserve(el));
        observer.disconnect();
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionIds, offsetHeight]);

  return activeSection;
}
