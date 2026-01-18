'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Target, Lightbulb, CheckCircle, TrendingUp } from 'lucide-react';
import { getProjectBySlug, projects } from '@/data/projects';

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

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const project = getProjectBySlug(slug);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Projet non trouvé</h1>
          <Link href="/#projects" className="text-blue-400 hover:text-blue-300 transition-colors">
            Retour aux projets
          </Link>
        </div>
      </div>
    );
  }

  // Find next and previous projects
  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];
  const prevProject = projects[(currentIndex - 1 + projects.length) % projects.length];

  return (
    <main className="min-h-screen bg-[#050507]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050507]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/#projects"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">Retour aux projets</span>
          </Link>
          <Link href="/" className="text-white font-bold text-xl">
            Level App
          </Link>
          <Link
            href="#contact"
            className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Contact
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <span className="inline-block px-4 py-1.5 bg-blue-500/10 text-blue-400 text-sm font-medium rounded-full border border-blue-500/20 mb-8">
              CAS CLIENT
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 whitespace-pre-line leading-tight">
              {project.heroTagline}
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              {project.heroSubtitle}
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-200 transition-colors"
            >
              Réserver un appel
              <ArrowRight size={18} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Project Image */}
      <section className="px-4 pb-24">
        <Reveal>
          <div className="max-w-5xl mx-auto">
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden border border-white/10">
              <Image
                src={project.image}
                alt={project.name}
                fill
                className="object-cover"
                style={project.imagePosition ? { objectPosition: project.imagePosition } : undefined}
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Project Info */}
      <section className="px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <span className="px-4 py-2 bg-white/5 text-white text-sm rounded-full border border-white/10">
                {project.type}
              </span>
              {project.model && (
                <span className="px-4 py-2 bg-green-400/10 text-green-400 text-sm rounded-full border border-green-400/20">
                  {project.model}
                </span>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs border border-white/10 px-3 py-1.5 rounded-full text-gray-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Content Sections */}
      <section className="px-4 pb-24">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Problem Section */}
          <Reveal>
            <div className="bg-[#0F1115]/60 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Le contexte / Le défi</h2>
              </div>
              <p className="text-gray-400 leading-relaxed">{project.problem}</p>
            </div>
          </Reveal>

          {/* Objectives Section */}
          <Reveal>
            <div className="bg-[#0F1115]/60 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Les objectifs</h2>
              </div>
              <ul className="space-y-3">
                {project.objectives.map((objective, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-400">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Solution Section */}
          <Reveal>
            <div className="bg-[#0F1115]/60 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Notre solution</h2>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">{project.solution}</p>
              <div className="pt-6 border-t border-white/5">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Fonctionnalités clés</h3>
                <div className="flex flex-wrap gap-2">
                  {project.features.map((feature) => (
                    <span
                      key={feature}
                      className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-full border border-blue-500/20"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Results Section */}
          <Reveal>
            <div className="bg-[#0F1115]/60 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Les résultats</h2>
              </div>
              <ul className="space-y-3">
                {project.results.map((result, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-400">{result}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="px-4 py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Vous avez un projet similaire ?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Discutons de votre idée et voyons comment Level App peut vous aider à la concrétiser.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-200 transition-colors"
            >
              Réserver un appel gratuit
              <ArrowRight size={18} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Navigation to other projects */}
      <section className="px-4 py-16 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <Link
              href={`/projets/${prevProject.slug}`}
              className="flex items-center gap-4 p-6 bg-[#0F1115]/60 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group flex-1"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
              <div>
                <span className="text-xs text-gray-500">Projet précédent</span>
                <p className="text-white font-medium">{prevProject.name}</p>
              </div>
            </Link>
            <Link
              href={`/projets/${nextProject.slug}`}
              className="flex items-center justify-end gap-4 p-6 bg-[#0F1115]/60 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group flex-1 text-right"
            >
              <div>
                <span className="text-xs text-gray-500">Projet suivant</span>
                <p className="text-white font-medium">{nextProject.name}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <Link href="/" className="text-white font-bold text-xl">
            Level App
          </Link>
          <p className="text-gray-500 text-sm mt-2">
            © {new Date().getFullYear()} Level App. Tous droits réservés.
          </p>
        </div>
      </footer>
    </main>
  );
}
