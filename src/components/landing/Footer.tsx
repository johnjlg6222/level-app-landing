'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="py-8 text-center text-gray-600 text-sm border-t border-white/5 bg-[#050507]">
      <p>&copy; 2026 LEVEL APP. Tous droits réservés.</p>
      <div className="flex justify-center gap-4 mt-4">
        <Link href="/" className="hover:text-white transition-colors">
          Accueil
        </Link>
        <Link href="/#projects" className="hover:text-white transition-colors">
          Projets
        </Link>
        <Link href="/#contact" className="hover:text-white transition-colors">
          Contact
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
