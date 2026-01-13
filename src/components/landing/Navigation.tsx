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
    <nav className="fixed top-6 left-0 right-0 z-50 px-6 flex justify-between items-start pointer-events-none">
      {/* Logo Bubble (Left) */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="pointer-events-auto"
      >
        <Link
          href="/"
          className="bg-[#0F1115]/80 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 flex items-center shadow-lg gap-2 hover:border-white/20 transition-colors"
        >
          <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-xs">
            L
          </div>
          <span className="font-bold text-white hidden md:inline">Level App</span>
        </Link>
      </motion.div>

      {/* Menu Bubble (Center) */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pointer-events-auto bg-[#0F1115]/80 backdrop-blur-xl border border-white/10 rounded-full px-2 py-2 flex items-center shadow-lg"
      >
        <div className="flex items-center">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
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

      {/* Contact Bubble (Right) */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="pointer-events-auto"
      >
        <Link
          href="/#contact"
          className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)]"
        >
          Contact
        </Link>
      </motion.div>
    </nav>
  );
};

export default Navigation;
