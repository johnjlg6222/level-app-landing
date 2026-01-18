'use client';

import React from 'react';
import Link from 'next/link';
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
    style={{ willChange: 'transform, opacity' }}
  >
    {children}
  </motion.div>
);

export const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-12 overflow-hidden z-10 px-4">
      <div className="relative max-w-5xl mx-auto text-center z-10">
        <Reveal>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-8 cursor-default"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            Agence Mobile & Studio Product
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
            Nous créons des apps mobiles qui <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-blue-500">
              boostent votre business.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-400 font-light leading-relaxed">
            Studio & agence de développement d&apos;applications mobiles.
            <br />
            Nous transformons des idées en applications prêtes à scaler.
          </p>

          {/* Credibility Badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              50+ applications livrées
            </span>
            <span className="text-gray-700">|</span>
            <span>Livraison en 30 jours</span>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/calculateur"
                className="px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-gray-200 transition-colors shadow-lg shadow-white/10 flex items-center gap-2"
              >
                Estimer mon projet
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/#contact"
                className="px-8 py-4 rounded-full border border-white/20 bg-transparent text-white font-medium text-lg hover:bg-white/5 transition-colors flex items-center gap-2"
              >
                Réserver un appel
              </Link>
            </motion.div>
          </div>
        </Reveal>

        {/* 3D Dynamic Floating Interface */}
        <Reveal delay={0.2} className="w-full mt-24 overflow-hidden">
          <div
            className="relative w-full mx-auto h-[400px] md:h-[500px] overflow-hidden"
            style={{ perspective: '1200px' }}
          >
            <motion.div
              initial={{ rotateX: 25, y: 100, opacity: 0 }}
              animate={{ rotateX: 10, y: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative w-full h-full max-w-4xl mx-auto"
            >
              {/* GLOW BEHIND */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/20 blur-[100px] -z-10 rounded-full" />

              {/* Main Interface Layer - CSS animation for better scroll perf */}
              <div
                className="absolute inset-x-4 md:inset-x-12 top-0 bottom-12 bg-[#0F1115]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 animate-hero-float-1"
                style={{ willChange: 'transform' }}
              >
                {/* Fake Browser Header */}
                <div className="h-10 border-b border-white/5 bg-white/5 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30" />
                  <div className="ml-4 h-5 w-64 bg-white/5 rounded-full" />
                </div>

                {/* Dashboard Content */}
                <div className="p-6 grid grid-cols-12 gap-6 h-full">
                  {/* Sidebar */}
                  <div className="hidden md:block col-span-3 space-y-4 border-r border-white/5 pr-4 h-full">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                        L
                      </div>
                      <div className="h-2 w-20 bg-white/20 rounded-full" />
                    </div>
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <div className="w-4 h-4 bg-white/10 rounded" />
                        <div className="h-2 w-16 bg-white/10 rounded-full" />
                      </div>
                    ))}
                  </div>

                  {/* Main Content Area */}
                  <div className="col-span-12 md:col-span-9 space-y-6">
                    {/* Top Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="bg-white/5 rounded-xl p-4 border border-white/5"
                        >
                          <div className="h-2 w-12 bg-white/20 rounded-full mb-2" />
                          <div className="h-6 w-20 bg-blue-500/20 rounded-lg" />
                        </div>
                      ))}
                    </div>

                    {/* Main Graph Area */}
                    <div className="h-48 bg-gradient-to-br from-blue-500/5 to-transparent rounded-xl border border-blue-500/10 relative overflow-hidden">
                      <svg
                        className="absolute bottom-0 left-0 right-0 h-32 w-full text-blue-500"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, delay: 0.5 }}
                          d="M0,80 C100,70 200,100 300,50 C400,0 500,40 600,20 L600,130 L0,130 Z"
                          fill="url(#chartGradient)"
                        />
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, delay: 0.5 }}
                          d="M0,80 C100,70 200,100 300,50 C400,0 500,40 600,20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Mobile Preview - CSS animation for better scroll perf */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 1.5, ease: 'easeOut' }}
                className="absolute -left-6 md:-left-16 bottom-10 w-40 md:w-56 h-72 md:h-96 bg-[#050507] border border-white/20 rounded-[2.5rem] p-3 shadow-2xl z-0 hidden sm:block animate-hero-float-2"
                style={{ willChange: 'transform' }}
              >
                <div className="w-full h-full bg-[#151820] rounded-[2rem] overflow-hidden relative border border-white/5">
                  <div className="absolute top-0 inset-x-0 h-6 bg-black z-10 mx-auto w-24 rounded-b-xl" />
                  <div className="p-4 mt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="w-8 h-8 rounded-full bg-white/10" />
                      <div className="w-8 h-8 rounded-full bg-blue-500/20" />
                    </div>
                    <div className="h-32 bg-blue-600 rounded-2xl relative overflow-hidden">
                      <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/20 rounded-full blur-xl" />
                    </div>
                    <div className="space-y-2">
                      <div className="w-3/4 h-2 bg-white/20 rounded-full" />
                      <div className="w-1/2 h-2 bg-white/10 rounded-full" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Revenue Card - CSS animation for better scroll perf */}
              <div
                className="absolute -right-4 md:-right-8 top-16 md:top-24 w-64 bg-[#1A1D24]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl z-50 animate-hero-float-3"
                style={{ willChange: 'transform' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 border border-green-500/20">
                      <Check size={18} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-medium">Revenu Mensuel</div>
                      <div className="text-lg font-bold text-white tracking-tight">42,500 €</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Objectif</span>
                    <span className="text-green-400 font-bold">85%</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '85%' }}
                      transition={{ duration: 1.5, delay: 1.5, ease: 'easeOut' }}
                      className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Hero;
