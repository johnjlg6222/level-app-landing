'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Check, Clock } from 'lucide-react';

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

export const ContactSection: React.FC = () => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setTimeout(() => {
      setFormState('success');
      (e.target as HTMLFormElement).reset();
    }, 2000);
  };

  return (
    <section className="py-24 px-4 bg-[#050507] border-t border-white/5" id="contact">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Reveal>
            <h2 className="text-4xl font-bold mb-4 text-white">Parlons de votre projet</h2>
            <p className="text-gray-400 mb-8">
              Remplissez le formulaire ou réservez un créneau directement.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Nom</label>
                  <input
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Votre nom"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Email</label>
                  <input
                    required
                    type="email"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="hello@..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Projet</label>
                <textarea
                  required
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Décrivez votre idée..."
                />
              </div>

              <button
                disabled={formState === 'submitting'}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-white transition-all shadow-lg shadow-blue-900/40 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {formState === 'submitting' ? (
                  <Clock className="animate-spin" size={20} />
                ) : formState === 'success' ? (
                  <>
                    Envoyé ! <Check size={20} />
                  </>
                ) : (
                  'Discuter de mon projet'
                )}
              </button>
              <p className="text-center text-xs text-gray-500">
                Aucun engagement. Réponse sous 24h.
              </p>
            </form>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="h-full min-h-[500px] bg-[#0F1115]/60 backdrop-blur-md rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay group-hover:bg-blue-500/10 transition-colors" />
              <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-500 mb-6">
                <Calendar size={40} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Agenda Level App</h3>
              <p className="text-gray-400 mb-8 max-w-xs">
                Sélectionnez un créneau pour un appel de découverte de 15 min.
              </p>

              <a
                href="#"
                className="px-8 py-3 border border-white/20 rounded-full text-white hover:bg-white/10 transition-colors"
              >
                Ouvrir le calendrier
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
