import React, { useRef, useState, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { SignAvatarScene, GestureType } from '../three/SignAvatarScene';
import { useTheme } from '../context/ThemeContext';
import {
  Sparkles,
  Eye,
  Activity,
  Compass,
  RotateCcw,
  Zap,
  Sliders,
  Play,
  Pause
} from 'lucide-react';

interface SpatialAvatarContainerProps {
  currentGesture?: GestureType | string;
  activeToken?: string;
  spatialLocus?: string;
  syntacticRole?: string;
  className?: string;
}

export const SpatialAvatarContainer: React.FC<SpatialAvatarContainerProps> = ({
  currentGesture = 'WELCOME',
  activeToken = 'HASTIVO',
  spatialLocus = 'Chest Neutral',
  syntacticRole = 'Topic-Comment Discourse',
  className = '',
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedGesture, setSelectedGesture] = useState<GestureType>(
    (currentGesture as GestureType) || 'WELCOME'
  );
  const [isInteractiveDemo, setIsInteractiveDemo] = useState(true);

  // Sync external gesture changes
  React.useEffect(() => {
    if (currentGesture) {
      setSelectedGesture(currentGesture as GestureType);
    }
  }, [currentGesture]);

  // Framer Motion mouse coordinate tracking for subtle spatial parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring configuration for silky, organic Apple-tuned movement
  const springConfig = { damping: 28, stiffness: 210, mass: 0.22 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // 1. 3D Card Perspective Tilt
  const cardRotateX = useTransform(smoothMouseY, [-0.5, 0.5], [8.5, -8.5]);
  const cardRotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-10.5, 10.5]);

  // 2. Spatial Translation
  const cardTranslateX = useTransform(smoothMouseX, [-0.5, 0.5], [-14, 14]);
  const cardTranslateY = useTransform(smoothMouseY, [-0.5, 0.5], [-10, 10]);

  // 3. Floating Foreground Badges (Layer with amplified parallax)
  const fgBadgeTopX = useTransform(smoothMouseX, [-0.5, 0.5], [26, -26]);
  const fgBadgeTopY = useTransform(smoothMouseY, [-0.5, 0.5], [18, -18]);

  const fgBadgeBottomX = useTransform(smoothMouseX, [-0.5, 0.5], [-22, 22]);
  const fgBadgeBottomY = useTransform(smoothMouseY, [-0.5, 0.5], [-16, 16]);

  const fgControlsX = useTransform(smoothMouseX, [-0.5, 0.5], [32, -32]);
  const fgControlsY = useTransform(smoothMouseY, [-0.5, 0.5], [14, -14]);

  // 4. Deep Background Ambient Aura (Moves inversely to amplify depth)
  const bgAuraX = useTransform(smoothMouseX, [-0.5, 0.5], [-45, 45]);
  const bgAuraY = useTransform(smoothMouseY, [-0.5, 0.5], [-35, 35]);

  // 5. Specular Sheen Highlight Position
  const sheenLeft = useTransform(smoothMouseX, [-0.5, 0.5], ['15%', '85%']);
  const sheenTop = useTransform(smoothMouseY, [-0.5, 0.5], ['15%', '85%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Normalize coordinates from -0.5 to 0.5 relative to the container center
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    // Return smoothly to rest position on cursor exit
    mouseX.set(0);
    mouseY.set(0);
  };

  // Supported Quick Gestures for Live Avatar Interaction
  const QUICK_GESTURES: { id: GestureType; label: string }[] = [
    { id: 'GREETING', label: 'GREETING' },
    { id: 'THANK_YOU', label: 'THANK YOU' },
    { id: 'WELCOME', label: 'WELCOME' },
    { id: 'QUESTION', label: 'QUESTION' },
    { id: 'COMMUNICATE', label: 'COMMUNICATE' },
    { id: 'LOVE', label: 'LOVE' },
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full select-none ${className}`}
      style={{ perspective: 1200 }}
    >
      {/* Deep Background Parallax Glow Aura */}
      <motion.div
        style={{
          x: bgAuraX,
          y: bgAuraY,
        }}
        className="absolute -inset-4 rounded-[40px] bg-gradient-to-tr from-[#D4AF37]/20 via-[#00E5FF]/15 to-transparent blur-3xl pointer-events-none -z-10"
      />

      {/* Main 3D Frosted Glass Avatar Container with Mouse Parallax */}
      <motion.div
        style={{
          rotateX: cardRotateX,
          rotateY: cardRotateY,
          x: cardTranslateX,
          y: cardTranslateY,
          transformStyle: 'preserve-3d',
        }}
        className={`relative w-full rounded-3xl border backdrop-blur-3xl overflow-hidden shadow-2xl transition-colors duration-300 ${
          isDark
            ? 'bg-[#0B0E17]/80 border-white/20 text-white shadow-[0_25px_70px_rgba(0,0,0,0.8)] glow-border-amber'
            : 'bg-white/90 border-slate-300 text-slate-950 shadow-[0_25px_60px_rgba(15,23,42,0.14)]'
        }`}
      >
        {/* Dynamic Specular Sheen Highlight following cursor */}
        <motion.div
          style={{
            left: sheenLeft,
            top: sheenTop,
          }}
          className="absolute w-72 h-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial from-white/20 to-transparent pointer-events-none blur-2xl z-20"
        />

        {/* Chassis Top Bar: Telemetry & Spatial Header */}
        <div className="relative z-30 flex items-center justify-between p-4 sm:px-6 border-b border-slate-300 dark:border-white/10 backdrop-blur-xl font-mono text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="font-sans font-bold uppercase tracking-wider text-xs">
              3D HUMANOID SPATIAL AVATAR
            </span>
          </div>

          <motion.div
            style={{
              x: fgBadgeTopX,
              y: fgBadgeTopY,
            }}
            className="flex items-center gap-2"
          >
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              60 FPS PBR
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]">
              SPATIAL 3D
            </span>
          </motion.div>
        </div>

        {/* Three.js Avatar Viewport */}
        <div className="relative w-full h-[380px] sm:h-[440px] overflow-hidden bg-black/10 dark:bg-black/40">
          <SignAvatarScene
            currentGesture={selectedGesture}
            speed={1.0}
            interactive={isInteractiveDemo}
            subtitle={`DISCOURSE: [${activeToken}] // ${spatialLocus}`}
            className="w-full h-full"
          />

          {/* Floating Parallax Spatial Locus HUD Badge (Left) */}
          <motion.div
            style={{
              x: fgBadgeBottomX,
              y: fgBadgeBottomY,
            }}
            className={`absolute top-4 left-4 z-20 p-2.5 rounded-xl border backdrop-blur-xl shadow-lg pointer-events-none ${
              isDark ? 'bg-black/60 border-white/20 text-white' : 'bg-white/90 border-slate-300 text-slate-900'
            }`}
          >
            <div className="text-[9px] font-mono text-slate-400 uppercase font-bold">SPATIAL ANCHOR</div>
            <div className="text-xs font-mono font-bold text-[#D4AF37]">{spatialLocus}</div>
            <div className="text-[9px] font-mono text-slate-500 mt-0.5">{syntacticRole}</div>
          </motion.div>

          {/* Floating Parallax Mouse-Response Indicator (Right) */}
          <motion.div
            style={{
              x: fgBadgeTopX,
              y: fgBadgeTopY,
            }}
            className={`absolute top-4 right-4 z-20 px-2.5 py-1 rounded-full border backdrop-blur-xl shadow-md pointer-events-none flex items-center gap-1.5 ${
              isDark ? 'bg-black/60 border-white/20 text-neutral-300' : 'bg-white/90 border-slate-300 text-slate-800'
            }`}
          >
            <Compass className="w-3 h-3 text-[#00E5FF] animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-[10px] font-mono font-bold">SPATIAL PARALLAX ACTIVE</span>
          </motion.div>
        </div>

        {/* Chassis Bottom Controls: Gesture Selector Pills & Kinematic Telemetry */}
        <div className="relative z-30 p-4 sm:px-6 border-t border-slate-300 dark:border-white/10 space-y-3 font-mono text-xs">
          {/* Quick Gesture Trigger Buttons (floating with parallax) */}
          <motion.div
            style={{
              x: fgControlsX,
              y: fgControlsY,
            }}
            className="flex flex-wrap items-center gap-1.5"
          >
            <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">
              GESTURE:
            </span>
            {QUICK_GESTURES.map(g => (
              <button
                key={g.id}
                onClick={() => setSelectedGesture(g.id)}
                className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedGesture === g.id
                    ? 'bg-[#D4AF37] text-black font-extrabold border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.5)] scale-105'
                    : isDark
                      ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/15 hover:text-white'
                      : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {g.label}
              </button>
            ))}
          </motion.div>

          {/* Bottom Telemetry Metrics Strip */}
          <div className="flex flex-wrap items-center justify-between text-[10px] pt-1 text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-3">
              <span>LATENCY: <strong className="text-emerald-500 font-bold">8.4ms</strong></span>
              <span>&bull;</span>
              <span>PARSER: <strong className="text-[#00E5FF] font-bold">99.4% SOV</strong></span>
              <span>&bull;</span>
              <span>WEBGL: <strong className="text-amber-500 font-bold">ACCELERATED</strong></span>
            </div>
            <div className="hidden sm:block text-[9px]">
              HOVER &amp; MOVE MOUSE FOR SPATIAL DEPTH
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
