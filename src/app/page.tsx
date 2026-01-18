'use client';

import {
  Navigation,
  Hero,
  AmbientBackground,
  MouseSpotlight,
  ProcessSection,
  ProjectsSection,
  FAQSection,
  ContactSection,
  Footer,
  LogosBanner,
  StatsSection,
  TestimonialsSection,
  AboutSection,
} from '@/components/landing';
import { useActiveSection } from '@/hooks';

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
