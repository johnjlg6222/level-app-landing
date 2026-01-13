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

const projects = [
  {
    name: 'Patrimonia',
    type: 'Fintech',
    tags: ['React Native', 'Node.js'],
    desc: 'App de gestion de patrimoine. Dashboard financier et projections.',
    icon: '🏦',
    gradient: 'from-gray-800 to-gray-900',
  },
  {
    name: 'Interior AI',
    type: 'AI / Real Estate',
    tags: ['Gen AI', 'Firebase'],
    desc: "Génération de déco intérieure par IA pour agents immobiliers.",
    icon: '🏠',
    gradient: 'from-indigo-900 to-gray-900',
  },
  {
    name: 'Neurocase',
    type: 'Medtech',
    tags: ['Secured', 'Encrypted'],
    desc: 'Suivi de cas cliniques sécurisé pour chirurgiens.',
    icon: '🧠',
    gradient: 'from-cyan-900 to-gray-900',
  },
  {
    name: 'ScanEat',
    type: 'FoodTech',
    tags: ['Image Rec', 'Analytics'],
    desc: 'Analyse calorique instantanée par photo de repas.',
    icon: '🥗',
    gradient: 'from-green-900 to-gray-900',
  },
];

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
              <motion.div
                whileHover={{ scale: 0.98 }}
                className="bg-[#0F1115]/60 backdrop-blur-md rounded-3xl overflow-hidden group border border-white/5"
              >
                <div className="h-64 relative overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${p.gradient} flex items-center justify-center`}
                  >
                    <span className="text-6xl">{p.icon}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-bold border border-white/30 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full">
                      Voir détails
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-white">{p.name}</h3>
                    <span className="px-3 py-1 bg-white/5 text-gray-300 text-xs rounded-full border border-white/10">
                      {p.type}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{p.desc}</p>
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
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
