import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { useSmoothScroll } from './animation/useSmoothScroll';
import { GlobalBackgroundVideo } from './components/GlobalBackgroundVideo';
import { FloatingThemeToggle } from './components/FloatingThemeToggle';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { LiveAvatarSimulatorSection } from './components/LiveAvatarSimulatorSection';
import { VisionTelemetrySection } from './components/VisionTelemetrySection';
import { ProjectsSection } from './components/ProjectsSection';
import { LanguageGridSection } from './components/LanguageGridSection';
import { BrandsSection } from './components/BrandsSection';
import { WaitlistSection } from './components/WaitlistSection';
import { Footer } from './components/Footer';
import { EmailModal } from './components/EmailModal';
import { ContactModal } from './components/ContactModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ProjectsModal } from './components/ProjectsModal';
import { DiscoveryCallModal } from './components/DiscoveryCallModal';
import { CommandPalette } from './components/CommandPalette';
import { BreakthroughProject } from './data/hastivoData';
import { GestureType } from './three/SignAvatarScene';

function AppContent() {
  useSmoothScroll();
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [projectsModalOpen, setProjectsModalOpen] = useState(false);
  const [discoveryModalOpen, setDiscoveryModalOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<BreakthroughProject | null>(null);

  const handleTriggerAvatarDemo = () => {
    const el = document.querySelector('#simulator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectGestureFromPalette = (gesture: GestureType) => {
    const el = document.querySelector('#simulator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--text-primary)] transition-colors">
      {/* Ambient Atmospheric Cloudinary Background Video Layer */}
      <GlobalBackgroundVideo />

      {/* Floating Theme Toggle (Light/Dark mode) with Header & Menubar removed */}
      <FloatingThemeToggle />

      {/* Main Content Area */}
      <div className="site-wrapper flex flex-col min-h-screen relative z-10">

        {/* 8-Section Showcase Structure with Scroll-Triggered Framer Motion Animations */}
        <main className="flex-1">
          {/* Section 1: Hero Section with Coral Circular Disc & Telemetry Ticker */}
          <HeroSection onOpenDiscoveryCall={() => setDiscoveryModalOpen(true)} />

          {/* Section 2: Architecture & Multi-Service Engine (WHAT WE DO.) */}
          <ServicesSection />

          {/* Section 3: Interactive 3D WebGL Avatar Kinematics Simulator */}
          <LiveAvatarSimulatorSection />

          {/* Section 4: 60 FPS Sensorless Vision Landmark Telemetry */}
          <VisionTelemetrySection />

          {/* Section 5: Foundational Research Breakthroughs (Horizontal Scrolling for Section 4) */}
          <ProjectsSection
            onSelectProject={(project) => setSelectedProject(project)}
            onOpenAllProjects={() => setProjectsModalOpen(true)}
          />

          {/* Section 6: Universal 7-Language Localization Matrix (with RTL) */}
          <LanguageGridSection />

          {/* Section 7: Resources Collected from Authorities (Logo matrix matching PACT.MEDIA UI design) */}
          <BrandsSection />

          {/* Section 8: Waitlist Section (Matching uploaded reference image image_b853596c.png) */}
          <WaitlistSection />
        </main>

        {/* Editorial Footer with Rotating Reverse Stamp & Lab Hubs */}
        <Footer onOpenEmailModal={() => setEmailModalOpen(true)} />
      </div>

      {/* Global Interactive Modals */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectGesture={handleSelectGestureFromPalette}
        onOpenContact={() => setContactModalOpen(true)}
        onOpenDiscoveryCall={() => setDiscoveryModalOpen(true)}
      />

      <EmailModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
      />

      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />

      <ProjectsModal
        isOpen={projectsModalOpen}
        onClose={() => setProjectsModalOpen(false)}
        onSelectProject={(project) => setSelectedProject(project)}
      />

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelectProject={(project) => setSelectedProject(project)}
      />

      <DiscoveryCallModal
        isOpen={discoveryModalOpen}
        onClose={() => setDiscoveryModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
