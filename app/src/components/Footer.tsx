import React from 'react';
import { ArrowUpRight, Heart, Sparkles, Mail, MapPin } from 'lucide-react';
import { CircularTagline } from './CircularTagline';
import {
  PerCharacterRise,
  PerWordCrossfade,
  ShineText,
  ScrambleHover,
  RevealText,
} from './ui/smoothui';

interface FooterProps {
  onOpenEmailModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenEmailModal }) => {
  return (
    <footer className="relative w-full border-t border-[var(--border)] bg-[var(--background)] overflow-hidden transition-colors">
      {/* Huge Reverse Rotating Decorative System Tagline Stamp */}
      <div
        className="footer-circle absolute -bottom-[900px] -right-[500px] w-[1800px] h-[1800px] pointer-events-none opacity-20 dark:opacity-10"
        aria-hidden="true"
      >
        <CircularTagline
          reverse
          text="• EVERY GESTURE DESERVES TO BE HEARD • HASTIVO AI SPATIAL LINGUISTICS • 7 LANGUAGES • 60 FPS PROCEDURAL KINEMATICS "
          className="w-full h-full text-[var(--primary)]"
        />
      </div>

      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 md:px-14 py-16 sm:py-24 md:py-32 relative z-10">
        {/* Top Editorial Row */}
        <div className="grid grid-cols-12 gap-8 mb-16 md:mb-28">
          <div className="col-span-12 lg:col-span-6">
            <a
              href="#top"
              className="font-felix text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[var(--text-primary)] uppercase block mb-6 select-none"
            >
              HASTIVO<span className="text-[var(--primary)]">.</span>
            </a>

            <div className="max-w-xl">
              <p className="font-felix text-lg sm:text-xl md:text-2xl text-[var(--primary)] uppercase tracking-wide mb-4">
                <ShineText baseColor="var(--primary)" shineColor="var(--text-primary)">
                  “Every Gesture Deserves to Be Heard”
                </ShineText>
              </p>
              <div className="font-exo text-sm sm:text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
                <PerWordCrossfade delay={150} stagger={25}>
                  An AI-assisted spatial linguistics platform advancing communication equity across spoken and sign languages. Built with cardless Swiss grid architecture, WebGL 3D avatar kinematics, and 60 FPS sensorless landmark vision AI.
                </PerWordCrossfade>
              </div>
            </div>
          </div>

          {/* Right Contact Card & Lab Locations */}
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-between">
            {/* Clickable Email Box Trigger */}
            <button
              onClick={onOpenEmailModal}
              className="p-6 sm:p-8 md:p-10 border border-[var(--border)] bg-[var(--surface-elevated)] hover:border-[var(--primary)] transition-all text-left group cursor-pointer shadow-xs mb-8 sm:mb-10"
            >
              <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest mb-3">
                <span className="text-[var(--primary)] font-semibold flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" />
                  Direct Research Inquiry
                </span>
                <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
              <div className="font-felix text-xl sm:text-2xl md:text-4xl text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors break-all sm:break-normal">
                hello.theoriongd@gmail.com
              </div>
              <div className="text-xs font-mono text-[var(--text-muted)] mt-2">
                Click to compose an encrypted message to our linguistics & engineering team
              </div>
            </button>

            {/* Physical Lab Locations */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[var(--border-subtle)] font-mono text-xs">
              <div>
                <div className="text-[var(--text-primary)] font-bold uppercase mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--primary)]" />
                  Bengaluru Lab
                </div>
                <div className="text-[var(--text-secondary)]">Karnataka, India</div>
                <div className="text-[11px] text-[var(--text-muted)] mt-1">HQ & Vision Research</div>
              </div>

              <div>
                <div className="text-[var(--text-primary)] font-bold uppercase mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--secondary)]" />
                  Edinburgh Lab
                </div>
                <div className="text-[var(--text-secondary)]">Scotland, UK</div>
                <div className="text-[11px] text-[var(--text-muted)] mt-1">Inclusive UX Design</div>
              </div>

              <div>
                <div className="text-[var(--text-primary)] font-bold uppercase mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
                  Portland Lab
                </div>
                <div className="text-[var(--text-secondary)]">Oregon, USA</div>
                <div className="text-[11px] text-[var(--text-muted)] mt-1">Spatial 3D Kinematics</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Accessibility Row */}
        <div className="pt-8 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--text-muted)]">
          <div>
            © {new Date().getFullYear()} HASTIVO Platform. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <span className="hover:text-[var(--primary)] transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span>•</span>
            <span className="hover:text-[var(--primary)] transition-colors cursor-pointer">
              Terms of Service
            </span>
            <span>•</span>
            <span className="hover:text-[var(--primary)] transition-colors cursor-pointer text-center">
              Accessibility Statement (W3C WAI AA)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
