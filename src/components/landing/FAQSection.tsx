'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    style={{ willChange: 'transform, opacity' }}
  >
    {children}
  </motion.div>
);

const faqs = [
  {
    q: "💰 Combien coûte le développement d'une application ?",
    a: "Le budget démarre à partir de 2 000 € pour un MVP avec un périmètre défini. Le coût final dépend des fonctionnalités, du design et de la complexité du projet. Une estimation claire est fournie avant tout engagement.",
  },
  {
    q: "⏱️ En combien de temps mon application est-elle développée ?",
    a: "La majorité des projets sont livrés en 30 jours, une fois le périmètre validé. Les applications plus complexes peuvent évoluer par itérations successives.",
  },
  {
    q: "📱 L'application sera-t-elle disponible sur l'App Store et Google Play ?",
    a: "Oui, si vous le souhaitez. Nous développons aussi des applications privées, non listées sur les stores, pour des projets internes, confidentiels ou en phase de test.",
  },
  {
    q: "🤔 Je n'ai pas de connaissances techniques, est-ce un problème ?",
    a: "Absolument pas. Level App vous accompagne de la définition du projet jusqu'à la livraison. Vous n'avez pas besoin d'être développeur pour lancer une application.",
  },
  {
    q: "🧩 Puis-je commencer avec un MVP et faire évoluer l'app ensuite ?",
    a: "Oui, c'est même notre approche recommandée. Nous construisons une première version utile et fonctionnelle, puis faisons évoluer l'application selon vos retours et objectifs.",
  },
  {
    q: "🔒 Mon projet est-il confidentiel ?",
    a: "Oui. Tous les projets sont traités avec confidentialité, et peuvent être couverts par un accord de confidentialité si nécessaire.",
  },
  {
    q: "🧠 Travaillez-vous uniquement sur des apps grand public ?",
    a: "Non. Nous développons aussi bien des applications B2B, des apps métiers, que des applications grand public avec abonnement.",
  },
  {
    q: "🚀 Que se passe-t-il après la livraison ?",
    a: "Vous êtes libre : d'utiliser l'application telle quelle, de la faire évoluer avec Level App, ou de poursuivre le développement à votre rythme. Aucune dépendance imposée.",
  },
  {
    q: "📞 Comment démarrer un projet ?",
    a: "Il suffit de réserver un appel gratuit. Nous échangeons sur votre idée, votre besoin et votre budget, puis vous recevez une proposition claire.",
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
                {/* Grid-based accordion for GPU-accelerated animation */}
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: openIndex === idx ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                      {faq.a}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
