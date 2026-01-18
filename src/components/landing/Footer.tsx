'use client';

import React from 'react';
import Link from 'next/link';

const navigationLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/calculateur', label: 'Calculateur' },
  { href: '/#projects', label: 'Projets' },
  { href: '/#process', label: 'Process' },
];

const serviceLinks = [
  { href: '/calculateur', label: 'MVP Mobile' },
  { href: '/calculateur', label: 'Application Mobile' },
  { href: '/calculateur', label: 'Application Web' },
  { href: '/calculateur', label: 'Design UI/UX' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="py-16 bg-[#050507] border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4">
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Logo + Tagline */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                L
              </div>
              <span className="text-white font-bold text-lg">LEVEL APP</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Studio & agence de développement d&apos;applications mobiles. Nous transformons vos
              idées en produits digitaux performants.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:contact@levelapp.fr"
                  className="text-gray-500 hover:text-white transition-colors text-sm"
                >
                  contact@levelapp.fr
                </a>
              </li>
              <li>
                <a
                  href="tel:+33123456789"
                  className="text-gray-500 hover:text-white transition-colors text-sm"
                >
                  +33 1 23 45 67 89
                </a>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium hover:bg-blue-600/30 transition-colors"
                >
                  Nous contacter
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom: Copyright + Legal */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} LEVEL APP. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <Link
              href="/mentions-legales"
              className="text-gray-600 hover:text-white transition-colors text-sm"
            >
              Mentions légales
            </Link>
            <Link
              href="/politique-confidentialite"
              className="text-gray-600 hover:text-white transition-colors text-sm"
            >
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
