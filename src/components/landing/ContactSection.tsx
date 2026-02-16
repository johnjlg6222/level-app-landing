'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { submitNetlifyForm } from '@/lib/netlify-forms';

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

export const ContactSection: React.FC = () => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [project, setProject] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const scriptLoaded = useRef(false);

  // Load iClosed script
  useEffect(() => {
    if (scriptLoaded.current) return;

    const existingScript = document.querySelector(
      'script[src="https://app.iclosed.io/assets/widget.js"]'
    );
    if (existingScript) {
      scriptLoaded.current = true;
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://app.iclosed.io/assets/widget.js';
    script.async = true;
    script.onload = () => {
      scriptLoaded.current = true;
    };
    document.body.appendChild(script);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setErrorMsg('');

    const result = await submitNetlifyForm('contact', { name, email, project });

    if (result.ok) {
      setFormState('success');
      setName('');
      setEmail('');
      setProject('');
    } else {
      setFormState('error');
      setErrorMsg(result.error || 'Une erreur est survenue');
    }
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
                    name="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Votre nom"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Email</label>
                  <input
                    name="email"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="hello@..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Projet</label>
                <textarea
                  name="project"
                  required
                  rows={4}
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Décrivez votre idée..."
                />
              </div>

              {formState === 'error' && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={16} />
                  {errorMsg}
                </div>
              )}

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
            <div className="h-full min-h-[400px] bg-[#0F1115]/60 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden">
              <div
                className="iclosed-widget w-full h-full"
                data-url="https://app.iclosed.io/e/levelapp/meeting-estimation"
                title="Meeting estimation"
                style={{ width: '100%', height: '100%', minHeight: '400px' }}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
