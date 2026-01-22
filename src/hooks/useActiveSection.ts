'use client';

import { useState, useEffect } from 'react';

const SECTION_IDS = ['home', 'process', 'projects', 'contact'];

export function useActiveSection(): string {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    // Ensure we're on the client
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      try {
        const scrollPosition = window.scrollY + 200; // Offset for better detection

        // Find which section we're currently in
        let currentSection = 'home';

        for (const sectionId of SECTION_IDS) {
          const element = document.getElementById(sectionId);
          if (!element) continue;

          const { offsetTop, offsetHeight } = element;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            currentSection = sectionId;
            break;
          }
        }

        setActiveSection(currentSection);
      } catch {
        // Silently handle any errors
      }
    };

    // Run on mount
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return activeSection;
}

export default useActiveSection;
