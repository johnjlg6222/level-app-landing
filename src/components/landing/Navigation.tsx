'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface NavigationProps {
  currentSection?: string;
}

const navItems = [
  { id: 'home', label: 'Accueil', href: '/' },
  { id: 'calculator', label: 'Calculateur', href: '/calculateur' },
  { id: 'process', label: 'Process', href: '/#process' },
  { id: 'projects', label: 'Projets', href: '/#projects' },
];

export const Navigation: React.FC<NavigationProps> = ({ currentSection = 'home' }) => {
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
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-[10px] sm:text-xs">
              L
            </div>
            <span className="font-bold text-white text-sm hidden md:inline">Level App</span>
          </Link>
        </motion.div>

        {/* Nav Items (Center) */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="pointer-events-auto absolute left-1/2 -translate-x-1/2 bg-[#0F1115]/80 backdrop-blur-xl border border-white/10 rounded-full px-1 sm:px-2 py-1 sm:py-2 shadow-lg"
        >
          <div className="flex items-center">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`px-1.5 sm:px-2 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
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

        {/* Contact Button (Right) */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="pointer-events-auto"
        >
          <Link
            href="/#contact"
            className="px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full bg-blue-600 text-white text-[10px] sm:text-xs md:text-sm font-bold hover:bg-blue-500 transition-all shadow-lg"
          >
            Contact
          </Link>
        </motion.div>
      </div>
    </nav>
  );
};

export default Navigation;
