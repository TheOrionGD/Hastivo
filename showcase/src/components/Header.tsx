import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  onOpenContact: () => void;
  onOpenProjects: () => void;
  onOpenDiscoveryCall: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenContact,
  onOpenProjects,
  onOpenDiscoveryCall,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="page-header"
      className={`fixed top-0 right-0 left-[90px] max-md:left-[50px] max-sm:left-0 z-30 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--surface-overlay)] backdrop-blur-md py-4 shadow-[0_1px_0_0_var(--divider)]'
          : 'bg-transparent py-7'
      }`}
    >
      <div className="max-w-[1720px] mx-auto px-8 md:px-14 flex items-center justify-between">
        {/* Brand Wordmark */}
        <a
          href="#top"
          className="font-felix text-2xl md:text-3xl tracking-tight text-[var(--text-primary)] flex items-center gap-1.5 group select-none"
        >
          <span className="tracking-widest font-normal">HASTIVO</span>
          <span className="w-2 h-2 rounded-full bg-[var(--primary)] inline-block transition-transform group-hover:scale-150 shadow-[0_0_10px_var(--primary)]" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-7 text-[13px] font-medium tracking-tight text-[var(--text-primary)]">
          <a
            href="#top"
            className="hover:text-[var(--primary)] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[var(--primary)] hover:after:w-full after:transition-all uppercase text-xs tracking-wider"
          >
            Overview
          </a>
          <a
            href="#architecture"
            className="hover:text-[var(--primary)] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[var(--primary)] hover:after:w-full after:transition-all uppercase text-xs tracking-wider"
          >
            Architecture
          </a>
          <a
            href="#simulator"
            className="hover:text-[var(--primary)] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[var(--primary)] hover:after:w-full after:transition-all uppercase text-xs tracking-wider flex items-center gap-1 text-[var(--primary)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-ping" />
            3D Simulator
          </a>
          <a
            href="#vision-telemetry"
            className="hover:text-[var(--primary)] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[var(--primary)] hover:after:w-full after:transition-all uppercase text-xs tracking-wider"
          >
            Vision AI
          </a>
          <a
            href="#breakthroughs"
            onClick={(e) => {
              if (window.location.hash === '#breakthroughs') {
                onOpenProjects();
              }
            }}
            className="hover:text-[var(--primary)] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[var(--primary)] hover:after:w-full after:transition-all uppercase text-xs tracking-wider"
          >
            Breakthroughs
          </a>
          <a
            href="#languages"
            className="hover:text-[var(--primary)] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[var(--primary)] hover:after:w-full after:transition-all uppercase text-xs tracking-wider"
          >
            7 Languages
          </a>
          <a
            href="#partners"
            className="hover:text-[var(--primary)] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[var(--primary)] hover:after:w-full after:transition-all uppercase text-xs tracking-wider"
          >
            Authorities
          </a>
          <a
            href="#waitlist"
            className="hover:text-[var(--primary)] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[var(--primary)] hover:after:w-full after:transition-all uppercase text-xs tracking-wider text-[var(--accent)] font-semibold"
          >
            Waitlist
          </a>
        </nav>

        {/* Right Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenDiscoveryCall}
            className="px-4 py-2 border border-[var(--border)] text-[var(--text-primary)] text-xs font-mono uppercase tracking-widest hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all cursor-pointer bg-[var(--surface)]"
          >
            Book Lab Demo
          </button>
          <a
            href="#waitlist"
            className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-mono uppercase tracking-widest hover:bg-[var(--primary-hover)] transition-all shadow-sm rounded-full"
          >
            Join Waitlist
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors cursor-pointer z-50 flex flex-col justify-center gap-1.5 w-8 h-8"
          aria-label="Toggle navigation menu"
        >
          <span
            className={`block h-0.5 w-6 bg-current transition-transform duration-300 ${
              mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-current transition-opacity duration-300 ${
              mobileMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-current transition-transform duration-300 ${
              mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 bg-[var(--background)] text-[var(--text-primary)] z-40 flex flex-col justify-center px-10 transition-transform duration-500 ease-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col space-y-6 text-2xl font-felix">
          <a
            href="#top"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-[var(--primary)] transition-colors"
          >
            Overview
          </a>
          <a
            href="#architecture"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-[var(--primary)] transition-colors"
          >
            Architecture
          </a>
          <a
            href="#simulator"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-[var(--primary)] transition-colors text-[var(--primary)]"
          >
            3D Avatar Simulator
          </a>
          <a
            href="#vision-telemetry"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-[var(--primary)] transition-colors"
          >
            Vision Landmark AI
          </a>
          <a
            href="#breakthroughs"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenProjects();
            }}
            className="hover:text-[var(--primary)] transition-colors"
          >
            Breakthroughs (01-06)
          </a>
          <a
            href="#languages"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-[var(--primary)] transition-colors"
          >
            7 Regional Languages
          </a>
          <a
            href="#partners"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-[var(--primary)] transition-colors"
          >
            Authorities & Sources
          </a>
          <a
            href="#waitlist"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-[var(--primary)] transition-colors text-[var(--accent)]"
          >
            Join Waitlist
          </a>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--divider)] flex flex-col gap-4 font-mono text-xs">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenDiscoveryCall();
            }}
            className="w-full py-3 bg-[var(--primary)] text-white uppercase tracking-widest text-center cursor-pointer"
          >
            Book Lab Consultation
          </button>
          <div className="text-[var(--text-muted)] text-center">
            HASTIVO • Sign-Language Communication Platform
          </div>
        </div>
      </div>
    </header>
  );
};
