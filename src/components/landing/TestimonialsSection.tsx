'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

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

const testimonials = [
  {
    id: 1,
    quote:
      "Level App a transformé notre idée en application en moins de 30 jours. Le résultat dépasse nos attentes et nos utilisateurs adorent l'expérience.",
    name: 'Marie D.',
    role: 'CEO',
    company: 'FinancePlus',
    initials: 'MD',
  },
  {
    id: 2,
    quote:
      "Une équipe réactive et professionnelle qui comprend les enjeux business. Ils ont su traduire notre vision en une app performante et intuitive.",
    name: 'Thomas L.',
    role: 'CTO',
    company: 'HealthTech',
    initials: 'TL',
  },
  {
    id: 3,
    quote:
      "Le calculateur de prix nous a rassurés sur le budget avant de démarrer. Aucune mauvaise surprise, livraison dans les temps. Je recommande !",
    name: 'Sophie M.',
    role: 'Fondatrice',
    company: 'FoodStartup',
    initials: 'SM',
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-[#050507]" id="testimonials">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Ce que disent nos clients</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Des entrepreneurs et entreprises qui nous ont fait confiance pour leurs projets.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <Reveal key={testimonial.id} delay={idx * 0.1}>
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-[#0F1115]/60 backdrop-blur-sm p-6 rounded-2xl border border-white/10 relative group h-full flex flex-col"
              >
                {/* Quote Icon */}
                <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                  <Quote className="w-4 h-4 text-blue-400" />
                </div>

                {/* Quote Text */}
                <p className="text-gray-300 leading-relaxed mt-4 mb-6 flex-1">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  {/* Avatar Placeholder */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {testimonial.initials}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">
                      {testimonial.role}, {testimonial.company}
                    </p>
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

export default TestimonialsSection;
