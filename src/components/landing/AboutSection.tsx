'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

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

const differentiators = [
  'Livraison garantie en 30 jours maximum',
  'Code propre, maintenable et documenté',
  'Communication transparente tout au long du projet',
  'Support post-lancement inclus',
  'Prix fixe défini avant le démarrage',
  'Expertise React Native & technologies modernes',
];

export const AboutSection: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-[#050507]" id="about">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Heading + Value Proposition */}
          <Reveal>
            <div>
              <h2 className="text-4xl font-bold mb-6 text-white">
                Pourquoi choisir{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                  Level App
                </span>{' '}
                ?
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                Nous sommes une équipe passionnée de développeurs et designers spécialisés dans la
                création d&apos;applications mobiles performantes. Notre mission : transformer vos
                idées en produits digitaux qui génèrent de la valeur.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                Avec une approche centrée sur l&apos;utilisateur et une méthodologie agile, nous
                livrons des MVPs fonctionnels rapidement pour vous permettre de valider votre marché
                et d&apos;itérer efficacement.
              </p>
            </div>
          </Reveal>

          {/* Right: Key Differentiators */}
          <Reveal delay={0.2}>
            <div className="bg-[#0F1115]/60 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6">Nos engagements</h3>
              <ul className="space-y-4">
                {differentiators.map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-green-400" />
                    </div>
                    <span className="text-gray-300">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
