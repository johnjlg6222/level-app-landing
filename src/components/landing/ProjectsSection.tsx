'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { projects } from '@/data/projects';

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
    style={{ willChange: 'transform, opacity' }}
  >
    {children}
  </motion.div>
);

export const ProjectsSection: React.FC = () => {
  return (
    <section
      className="py-24 px-4 bg-[#050507] border-t border-white/5 relative overflow-hidden"
      id="projects"
    >
      <div className="absolute right-0 top-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal>
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Nos Projets</h2>
            <p className="text-gray-400">Des réalisations concrètes qui inspirent confiance.</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((p, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <Link href={`/projets/${p.slug}`}>
                <motion.div
                  whileHover={{ scale: 0.98 }}
                  className="bg-[#0F1115]/60 backdrop-blur-md rounded-3xl overflow-hidden group border border-white/5 cursor-pointer"
                >
                  {/* Image area */}
                  <div className="h-64 relative overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      style={p.imagePosition ? { objectPosition: p.imagePosition } : undefined}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-bold border border-white/30 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full">
                        Voir détails
                      </span>
                    </div>
                  </div>

                  {/* Content area */}
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-white">{p.name}</h3>
                      <span className="px-3 py-1 bg-white/5 text-gray-300 text-xs rounded-full border border-white/10">
                        {p.type}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm mb-4">{p.shortDesc}</p>

                    {/* Features list */}
                    {p.features && (
                      <div className="mb-4">
                        <ul className="text-xs text-gray-500 space-y-1">
                          {p.features.slice(0, 3).map((feature, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1 h-1 bg-blue-500 rounded-full flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                          {p.features.length > 3 && (
                            <li className="text-gray-600">+{p.features.length - 3} more</li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Business model badge for ScanEat */}
                    {p.model && (
                      <div className="mb-4">
                        <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded border border-green-400/20">
                          {p.model}
                        </span>
                      </div>
                    )}

                    {/* Tech stack tags */}
                    <div className="flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="text-xs border border-white/10 px-2 py-1 rounded text-gray-500"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
