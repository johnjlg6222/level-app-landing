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
} from '@/components/landing';

export default function HomePage() {
  return (
    <div className="font-sans antialiased bg-[#050507] min-h-screen text-white selection:bg-blue-500 selection:text-white relative">
      <MouseSpotlight />
      <AmbientBackground />

      <Navigation currentSection="home" />

      <main className="relative z-10 pb-20">
        <Hero />
        <ProcessSection />
        <ProjectsSection />
        <FAQSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
