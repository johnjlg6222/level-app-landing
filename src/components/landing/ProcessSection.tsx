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

const steps = [
  {
    id: 1,
    title: 'Cadrage',
    week: 'Semaine 1',
    color: 'blue',
    desc: ['Analyse Business', 'Définition du MVP', 'Validation du Scope'],
  },
  {
    id: 2,
    title: 'Design',
    week: 'Semaine 2',
    color: 'purple',
    desc: ['Parcours Utilisateur', 'Maquettes UX/UI', 'Validation Visuelle'],
  },
  {
    id: 3,
    title: 'Dév',
    week: 'Semaine 3',
    color: 'cyan',
    desc: ['Code React Native', 'Intégration Features', 'Tests continus'],
  },
  {
    id: 4,
    title: 'Livraison',
    week: 'Semaine 4',
    color: 'green',
    desc: ['Optimisations', 'Lancement Store/Web', 'Champagne 🍾'],
  },
];

const getColorClass = (color: string) => {
  switch (color) {
    case 'blue':
      return 'border-blue-500/50 text-blue-400 bg-blue-600';
    case 'purple':
      return 'border-purple-500/50 text-purple-400 bg-purple-600';
    case 'cyan':
      return 'border-cyan-500/50 text-cyan-400 bg-cyan-600';
    case 'green':
      return 'border-green-500/50 text-green-400 bg-green-600';
    default:
      return 'border-gray-500/50 text-gray-400 bg-gray-600';
  }
};

export const ProcessSection: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-[#050507]" id="process">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              De l&apos;idée au MVP en 30 jours 🚀
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Notre mission : livrer une application fonctionnelle rapidement, avec un périmètre
              maîtrisé.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const colorClasses = getColorClass(step.color);
            return (
              <Reveal key={step.id} delay={idx * 0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className={`bg-[#0F1115]/40 backdrop-blur-sm p-6 rounded-2xl border-t-2 relative group h-full ${colorClasses.split(' ')[0]}`}
                >
                  <div
                    className={`absolute -top-4 -left-4 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg ${colorClasses.split(' ')[2]}`}
                  >
                    {step.id}
                  </div>
                  <h3 className="text-xl font-bold mb-2 mt-2 text-white">{step.title}</h3>
                  <p className={`text-sm mb-4 font-medium ${colorClasses.split(' ')[1]}`}>
                    {step.week}
                  </p>
                  <ul className="text-sm text-gray-400 space-y-2">
                    {step.desc.map((d, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-500" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.4}>
          <div className="text-center mt-12">
            <button className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors">
              Lancer mon application
            </button>
            <p className="text-xs text-gray-500 mt-3">
              Appel gratuit — cadrage offert — sans engagement
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default ProcessSection;
