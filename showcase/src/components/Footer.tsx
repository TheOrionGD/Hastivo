import React from 'react';
import { ArrowUpRight, Heart, Sparkles, Mail, MapPin } from 'lucide-react';
import { CircularTagline } from './CircularTagline';

interface FooterProps {
  onOpenEmailModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenEmailModal }) => {
  return (
    <footer className="relative w-full border-t border-[#e5e5e5] dark:border-[#2a2e39] bg-white dark:bg-[#17191E] overflow-hidden transition-colors">
      {/* Huge Reverse Rotating Decorative System Tagline Stamp */}
      <div
        className="footer-circle absolute -bottom-[900px] -right-[500px] w-[1800px] h-[1800px] pointer-events-none opacity-25 dark:opacity-15"
        aria-hidden="true"
      >
        <CircularTagline
          reverse
          text="• EVERY GESTURE DESERVES TO BE HEARD • HASTIVO AI SPATIAL LINGUISTICS • 7 LANGUAGES • 60 FPS PROCEDURAL KINEMATICS "
          className="w-full h-full text-[#FF6F61]"
        />
      </div>

      <div className="max-w-[1720px] mx-auto px-8 md:px-14 py-24 md:py-32 relative z-10">
        {/* Top Editorial Row */}
        <div className="grid grid-cols-12 gap-8 mb-20 md:mb-28">
          <div className="col-span-12 lg:col-span-6">
            <a
              href="#top"
              className="font-felix text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#212121] dark:text-white uppercase block mb-6 select-none"
            >
              HASTIVO<span className="text-[#FF6F61]">.</span>
            </a>

            <div className="max-w-xl">
              <p className="font-felix text-xl sm:text-2xl text-[#FF6F61] uppercase tracking-wide mb-4">
                “Every Gesture Deserves to Be Heard”
              </p>
              <p className="font-exo text-base md:text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed">
                An AI-assisted spatial linguistics platform advancing communication equity across
                spoken and sign languages. Built with cardless Swiss grid architecture, WebGL 3D avatar
                kinematics, and 60 FPS sensorless landmark vision AI.
              </p>
            </div>
          </div>

          {/* Right Contact Card & Lab Locations */}
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-between">
            {/* Clickable Email Box Trigger */}
            <button
              onClick={onOpenEmailModal}
              className="p-8 md:p-10 border border-[#e5e5e5] dark:border-[#2a2e39] bg-neutral-50 dark:bg-[#1f222a] hover:border-[#FF6F61] transition-all text-left group cursor-pointer shadow-xs mb-10"
            >
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400 uppercase tracking-widest mb-3">
                <span className="text-[#FF6F61] font-semibold flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" />
                  Direct Research Inquiry
                </span>
                <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-[#FF6F61] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
              <div className="font-felix text-2xl sm:text-3xl md:text-4xl text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                hello.theoriongd@gmail.com
              </div>
              <div className="text-xs font-mono text-neutral-500 mt-2">
                Click to compose an encrypted message to our linguistics & engineering team
              </div>
            </button>

            {/* Physical Lab Locations */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 font-mono text-xs">
              <div>
                <div className="text-[#212121] dark:text-white font-bold uppercase mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FF6F61]" />
                  Bengaluru Lab
                </div>
                <div className="text-neutral-500">Karnataka, India</div>
                <div className="text-[11px] text-neutral-400 mt-1">HQ & Vision Research</div>
              </div>

              <div>
                <div className="text-[#212121] dark:text-white font-bold uppercase mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#6FA3EF]" />
                  Edinburgh Lab
                </div>
                <div className="text-neutral-500">Scotland, UK</div>
                <div className="text-[11px] text-neutral-400 mt-1">Inclusive UX Design</div>
              </div>

              <div>
                <div className="text-[#212121] dark:text-white font-bold uppercase mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FFC107]" />
                  Portland Lab
                </div>
                <div className="text-neutral-500">Oregon, USA</div>
                <div className="text-[11px] text-neutral-400 mt-1">Spatial 3D Kinematics</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Accessibility Row */}
        <div className="pt-8 border-t border-[#e5e5e5] dark:border-[#2a2e39] flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500 dark:text-neutral-400">
          <div>
            © {new Date().getFullYear()} HASTIVO Platform. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-[#FF6F61] transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span>•</span>
            <span className="hover:text-[#FF6F61] transition-colors cursor-pointer">
              Terms of Service
            </span>
            <span>•</span>
            <span className="hover:text-[#FF6F61] transition-colors cursor-pointer">
              Accessibility Statement (W3C WAI AA)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
