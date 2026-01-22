'use client';

import dynamic from 'next/dynamic';
import { useActiveSection } from '@/hooks';

// Dynamic import for Footer as well to ensure full client-side rendering
const Footer = dynamic(() => import('@/components/landing/Footer').then(mod => mod.Footer), {
  ssr: false,
});

// Dynamic imports with ssr: false to avoid hydration issues on iOS Safari
const Navigation = dynamic(() => import('@/components/landing/Navigation').then(mod => mod.Navigation), {
  ssr: false,
});

const Hero = dynamic(() => import('@/components/landing/Hero').then(mod => mod.Hero), {
  ssr: false,
});

const AmbientBackground = dynamic(() => import('@/components/landing/AmbientBackground').then(mod => mod.AmbientBackground), {
  ssr: false,
});

const MouseSpotlight = dynamic(() => import('@/components/landing/AmbientBackground').then(mod => mod.MouseSpotlight), {
  ssr: false,
});

const ProcessSection = dynamic(() => import('@/components/landing/ProcessSection').then(mod => mod.ProcessSection), {
  ssr: false,
});

const ProjectsSection = dynamic(() => import('@/components/landing/ProjectsSection').then(mod => mod.ProjectsSection), {
  ssr: false,
});

const FAQSection = dynamic(() => import('@/components/landing/FAQSection').then(mod => mod.FAQSection), {
  ssr: false,
});

const ContactSection = dynamic(() => import('@/components/landing/ContactSection').then(mod => mod.ContactSection), {
  ssr: false,
});

const LogosBanner = dynamic(() => import('@/components/landing/LogosBanner').then(mod => mod.LogosBanner), {
  ssr: false,
});

const StatsSection = dynamic(() => import('@/components/landing/StatsSection').then(mod => mod.StatsSection), {
  ssr: false,
});

const TestimonialsSection = dynamic(() => import('@/components/landing/TestimonialsSection').then(mod => mod.TestimonialsSection), {
  ssr: false,
});

const AboutSection = dynamic(() => import('@/components/landing/AboutSection').then(mod => mod.AboutSection), {
  ssr: false,
});

export default function HomePage() {
  const activeSection = useActiveSection();

  return (
    <div className="font-sans antialiased bg-[#050507] min-h-screen text-white selection:bg-blue-500 selection:text-white relative">
      <MouseSpotlight />
      <AmbientBackground />

      <Navigation currentSection={activeSection} />

      <main className="relative z-10 pb-20">
        <Hero />
        <LogosBanner />
        <ProcessSection />
        <StatsSection />
        <ProjectsSection />
        <TestimonialsSection />
        <AboutSection />
        <FAQSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
