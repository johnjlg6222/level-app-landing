'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children,
  delay = 0,
  className = '',
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

// Placeholder companies with letter initials
const companies = [
  { name: 'TechFlow', initials: 'TF', color: 'from-blue-500 to-cyan-500' },
  { name: 'DataPrime', initials: 'DP', color: 'from-purple-500 to-pink-500' },
  { name: 'CloudNine', initials: 'C9', color: 'from-green-500 to-emerald-500' },
  { name: 'StartupX', initials: 'SX', color: 'from-orange-500 to-red-500' },
  { name: 'InnovateLab', initials: 'IL', color: 'from-cyan-500 to-blue-500' },
  { name: 'NextGen', initials: 'NG', color: 'from-pink-500 to-purple-500' },
  { name: 'ScaleUp', initials: 'SU', color: 'from-emerald-500 to-green-500' },
  { name: 'FutureTech', initials: 'FT', color: 'from-red-500 to-orange-500' },
];

const LogoItem: React.FC<{ company: (typeof companies)[0] }> = ({ company }) => (
  <div className="flex items-center gap-3 px-8 group cursor-default">
    <div
      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${company.color} opacity-30 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center`}
    >
      <span className="text-white font-bold text-sm">{company.initials}</span>
    </div>
    <span className="text-gray-500 group-hover:text-white font-medium transition-colors duration-300 whitespace-nowrap">
      {company.name}
    </span>
  </div>
);

export const LogosBanner: React.FC = () => {
  return (
    <section className="py-16 bg-[#050507] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <Reveal>
          <p className="text-center text-gray-500 text-sm font-medium uppercase tracking-wider">
            Ils nous font confiance
          </p>
        </Reveal>
      </div>

      {/* Infinite Scroll Marquee */}
      <Reveal delay={0.2}>
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050507] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050507] to-transparent z-10" />

          {/* Scrolling container */}
          <div className="flex overflow-hidden">
            <div className="flex animate-marquee">
              {companies.map((company, idx) => (
                <LogoItem key={`first-${idx}`} company={company} />
              ))}
            </div>
            <div className="flex animate-marquee" aria-hidden="true">
              {companies.map((company, idx) => (
                <LogoItem key={`second-${idx}`} company={company} />
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default LogosBanner;
