'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

interface NavigationProps {
  currentSection?: string;
  progressIndicator?: React.ReactNode;
}

const navItems = [
  { id: 'home', label: 'Accueil', href: '/', hash: '' },
  { id: 'calculator', label: 'Calculateur', href: '/calculateur', hash: '' },
  { id: 'process', label: 'Process', href: '/#process', hash: 'process' },
  { id: 'projects', label: 'Projets', href: '/#projects', hash: 'projects' },
];

export const Navigation: React.FC<NavigationProps> = ({ currentSection = 'home', progressIndicator }) => {
  const pathname = usePathname();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof navItems[0]) => {
    // If we're on the home page and clicking a hash link, scroll manually
    if (pathname === '/' && item.hash) {
      e.preventDefault();
      const element = document.getElementById(item.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // If clicking "Accueil" while on home page, scroll to top
    if (pathname === '/' && item.id === 'home') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-4 md:top-6 left-0 right-0 z-50 px-4 md:px-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo (Left) */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="pointer-events-auto"
        >
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-2 bg-[#0F1115]/80 backdrop-blur-xl border border-white/10 rounded-full px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-[#0F1115] transition-colors shadow-lg"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-xs sm:text-sm">
              L
            </div>
            <span className="font-bold text-white text-base hidden md:inline">Level App</span>
          </Link>
        </motion.div>

        {/* Nav Items (Center) */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="pointer-events-auto absolute left-1/2 -translate-x-1/2 bg-[#0F1115]/80 backdrop-blur-xl border border-white/10 rounded-full px-1.5 sm:px-2.5 py-1.5 sm:py-2.5 shadow-lg"
        >
          <div className="flex items-center">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`px-2 sm:px-3 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-full text-[10px] sm:text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  currentSection === item.id
                    ? 'text-white bg-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Progress Indicator (Desktop only - positioned right of center nav) */}
        {progressIndicator && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.08 }}
            className="pointer-events-auto hidden md:block absolute left-1/2 ml-[220px]"
          >
            <div className="bg-[#0F1115]/80 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 shadow-lg min-w-[160px]">
              {progressIndicator}
            </div>
          </motion.div>
        )}

        {/* Contact Button (Right) */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="pointer-events-auto"
        >
          <Link
            href="/#contact"
            className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full bg-blue-600 text-white text-[10px] sm:text-xs md:text-sm font-bold hover:bg-blue-500 transition-all shadow-lg"
          >
            Contact
          </Link>
        </motion.div>
      </div>
    </nav>
  );
};

export default Navigation;
