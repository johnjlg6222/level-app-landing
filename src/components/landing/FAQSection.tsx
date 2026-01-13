'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

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

const faqs = [
  {
    q: '💰 Combien coûte le développement ?',
    a: 'Le budget démarre à partir de 2 000 € HT pour un MVP. Une estimation précise est fournie après le premier appel.',
  },
  {
    q: '⏱️ Quel est le délai de livraison ?',
    a: 'La majorité des projets sont livrés en 30 jours (4 semaines) pour une V1 fonctionnelle.',
  },
  {
    q: '🔒 Mon projet est-il confidentiel ?',
    a: "Absolument. Nous signons systématiquement un accord de confidentialité (NDA) avant de commencer.",
  },
  {
    q: '🧩 Puis-je commencer petit ?',
    a: "Oui, c'est notre philosophie. Commencer par un MVP (Minimum Viable Product) et itérer.",
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 px-4 border-t border-white/5 bg-[#050507]">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Questions Fréquentes</h2>
        </Reveal>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <div className="bg-[#0F1115]/60 backdrop-blur-md rounded-xl overflow-hidden border border-white/5">
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none hover:bg-white/5 transition-colors"
                >
                  <span className="font-medium text-white">{faq.q}</span>
                  <ChevronDown
                    size={20}
                    className={`text-gray-500 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {openIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
