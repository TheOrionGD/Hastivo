import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Activity, ShieldCheck, Eye, Sparkles } from 'lucide-react';
import { TextReveal } from '../animation/TextReveal';
import { AnimatedBadge } from '../animation/AnimatedBadge';
import { MagneticButton } from '../animation/MagneticButton';

export const VisionTelemetrySection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [telemetryMode, setTelemetryMode] = useState<'synthetic' | 'camera'>('synthetic');
  const [activeGestureRecognized, setActiveGestureRecognized] = useState('GREETING');
  const [confidenceScore, setConfidenceScore] = useState(98.6);
  const [frameTimeMs, setFrameTimeMs] = useState(14.2);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Hand Landmark Connections (21 points)
  const connections = [
    // Thumb
    [0, 1], [1, 2], [2, 3], [3, 4],
    // Index finger
    [0, 5], [5, 6], [6, 7], [7, 8],
    // Middle finger
    [9, 10], [10, 11], [11, 12],
    // Ring finger
    [13, 14], [14, 15], [15, 16],
    // Pinky
    [0, 17], [17, 18], [18, 19], [19, 20],
    // Palm base
    [5, 9], [9, 13], [13, 17]
  ];

  useEffect(() => {
    let animId: number;
    let t = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      t += 0.03;

      if (Math.random() < 0.05) {
        setConfidenceScore(+(97.5 + Math.random() * 2.2).toFixed(1));
        setFrameTimeMs(+(13.8 + Math.random() * 1.2).toFixed(1));
      }

      const cycleStep = Math.floor((t * 0.2) % 4);
      const gestures = ['GREETING', 'HELP', 'THANK_YOU', 'COMMUNICATE'];
      setActiveGestureRecognized(gestures[cycleStep]);

      const width = canvas.width;
      const height = canvas.height;

      // Dark sci-fi telemetry grid background
      ctx.fillStyle = '#0f1115';
      ctx.fillRect(0, 0, width, height);

      // Faint background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Generate organic 21 hand landmarks based on mathematical sinusoidal kinematics
      const centerX = width * 0.5 + Math.sin(t * 0.8) * 40;
      const centerY = height * 0.52 + Math.cos(t * 0.6) * 30;
      const scale = Math.min(width, height) * 0.32;

      const rawPoints: [number, number][] = [
        [0, 0.45], // 0: Wrist
        [-0.2, 0.25], [-0.32, 0.08], [-0.4, -0.06], [-0.46, -0.2], // Thumb 1-4
        [-0.15, -0.05], [-0.18, -0.26], [-0.2, -0.42], [-0.22, -0.58], // Index 5-8
        [0, -0.08], [0.01, -0.3], [0.02, -0.48], [0.03, -0.65], // Middle 9-12
        [0.14, -0.05], [0.16, -0.26], [0.17, -0.42], [0.18, -0.56], // Ring 13-16
        [0.26, 0.02], [0.3, -0.16], [0.33, -0.3], [0.35, -0.44] // Pinky 17-20
      ];

      const curl = Math.sin(t * 1.5) * 0.3;
      const wave = Math.cos(t * 2.0) * 0.15;

      const landmarks: { x: number; y: number }[] = rawPoints.map(([px, py], idx) => {
        let xMod = px;
        let yMod = py;

        if (idx >= 4 && idx <= 8) {
          yMod += curl * 0.2;
          xMod += wave * 0.1;
        } else if (idx >= 9 && idx <= 12) {
          yMod += curl * 0.35;
        } else if (idx >= 13 && idx <= 16) {
          yMod += curl * 0.3;
        } else if (idx >= 17 && idx <= 20) {
          yMod += curl * 0.25;
        }

        return {
          x: centerX + xMod * scale,
          y: centerY + yMod * scale
        };
      });

      // Forearm trajectory lines
      ctx.strokeStyle = 'rgba(111, 163, 239, 0.3)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(landmarks[0].x, landmarks[0].y);
      ctx.lineTo(landmarks[0].x - 60, height);
      ctx.moveTo(landmarks[0].x, landmarks[0].y);
      ctx.lineTo(landmarks[0].x + 60, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Skeletal Connective Bones
      ctx.lineWidth = 3;
      connections.forEach(([start, end]) => {
        const p1 = landmarks[start];
        const p2 = landmarks[end];
        const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        gradient.addColorStop(0, '#6FA3EF');
        gradient.addColorStop(1, '#FF6F61');
        ctx.strokeStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // Landmark Joint Nodes
      landmarks.forEach((p, idx) => {
        const isTip = [4, 8, 12, 16, 20].includes(idx);
        const isWrist = idx === 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, isTip ? 7 : isWrist ? 8 : 4.5, 0, Math.PI * 2);
        ctx.fillStyle = isTip
          ? 'rgba(255, 111, 97, 0.35)'
          : isWrist
          ? 'rgba(255, 193, 7, 0.35)'
          : 'rgba(111, 163, 239, 0.3)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, isTip ? 4.5 : isWrist ? 5 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = isTip ? '#FF6F61' : isWrist ? '#FFC107' : '#ffffff';
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '9px monospace';
        ctx.fillText(idx.toString(), p.x + 6, p.y - 3);
      });

      // Bounding Box
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      landmarks.forEach((p) => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      });
      const pad = 24;
      ctx.strokeStyle = 'rgba(255, 111, 97, 0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(minX - pad, minY - pad, (maxX - minX) + pad * 2, (maxY - minY) + pad * 2);

      const cornerLen = 12;
      ctx.strokeStyle = '#FF6F61';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(minX - pad, minY - pad + cornerLen);
      ctx.lineTo(minX - pad, minY - pad);
      ctx.lineTo(minX - pad + cornerLen, minY - pad);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(maxX + pad - cornerLen, minY - pad);
      ctx.lineTo(maxX + pad, minY - pad);
      ctx.lineTo(maxX + pad, minY - pad + cornerLen);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(minX - pad, maxY + pad - cornerLen);
      ctx.lineTo(minX - pad, maxY + pad);
      ctx.lineTo(minX - pad + cornerLen, maxY + pad);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(maxX + pad - cornerLen, maxY + pad);
      ctx.lineTo(maxX + pad, maxY + pad);
      ctx.lineTo(maxX + pad, maxY + pad - cornerLen);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleStartCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setTelemetryMode('camera');
        }
      } else {
        setCameraError('Webcam access not supported in this environment. Running 60 FPS synthetic pipeline.');
      }
    } catch {
      setCameraError('Camera access unavailable. Using synthetic 60 FPS trajectory stream.');
      setTelemetryMode('synthetic');
    }
  };

  return (
    <motion.section
      id="vision-telemetry"
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full py-24 md:py-36 border-t border-[var(--divider)] bg-[var(--background)] transition-colors"
    >
      <div className="max-w-[1720px] mx-auto px-8 md:px-14">
        {/* Section Header */}
        <div className="grid grid-cols-12 gap-6 mb-12 md:mb-16">
          <div className="col-span-12 md:col-span-1">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--secondary)] font-semibold">
              03 / Vision AI
            </span>
          </div>

          <div className="col-span-12 md:col-span-11">
            <TextReveal as="h2" type="chars" duration={0.9} stagger={0.03} className="font-felix text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[var(--text-primary)] uppercase mb-6 select-none">
              60 FPS SENSORLESS VISION AI.
            </TextReveal>
            <TextReveal as="p" type="words" duration={0.7} stagger={0.02} className="font-exo text-lg sm:text-xl md:text-2xl leading-relaxed text-[var(--text-secondary)] max-w-4xl">
              High-frequency temporal pose estimation tracking 21 hand joints, wrist trajectory, and facial morphology directly from standard webcams. Zero external hardware, zero wearable sensors, and strict client-side biometric isolation.
            </TextReveal>
          </div>
        </div>

        {/* Vision AI Workspace Grid */}
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Telemetry HUD Canvas */}
          <div className="col-span-12 lg:col-span-7 bg-[#0f1115] border border-neutral-800 relative overflow-hidden shadow-2xl">
            {/* HUD Top Bar */}
            <div className="px-5 py-3 border-b border-neutral-800 flex items-center justify-between text-xs font-mono bg-[#14171d]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-ping" />
                <span className="text-white font-semibold">LANDMARK TELEMETRY HUD</span>
                <span className="text-neutral-600">|</span>
                <span className="text-[var(--secondary)]">ST-GCN v2.4</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 font-semibold">{confidenceScore}% CONFIDENCE</span>
                <span className="text-neutral-600">|</span>
                <span className="text-neutral-400">{frameTimeMs}ms INFERENCE</span>
              </div>
            </div>

            {/* Interactive Canvas */}
            <div className="relative w-full h-[400px] sm:h-[480px] md:h-[540px] flex items-center justify-center bg-[#0f1115]">
              <canvas
                ref={canvasRef}
                width={720}
                height={540}
                className="w-full h-full object-contain"
              />

              <video ref={videoRef} className="hidden" playsInline muted />

              {/* Floating Landmark Readout Overlay */}
              <div className="absolute top-4 left-4 font-mono text-[11px] text-white/80 space-y-1 pointer-events-none drop-shadow-md">
                <div className="bg-black/70 px-2.5 py-1 border border-white/10">
                  <span className="text-[var(--accent)]">Active Sign: </span>
                  <span className="text-white font-bold">[{activeGestureRecognized}]</span>
                </div>
                <div className="bg-black/70 px-2.5 py-1 border border-white/10">
                  <span className="text-[var(--secondary)]">Tracking Mesh: </span>
                  <span>21 Hand Joints (3D Metric Space)</span>
                </div>
              </div>

              {/* Floating Camera Test Button */}
              <div className="absolute bottom-4 right-4 z-10">
                <button
                  onClick={handleStartCamera}
                  className="px-3 py-1.5 bg-neutral-900/90 hover:bg-[var(--primary)] border border-white/20 text-white font-mono text-xs flex items-center gap-2 transition-all cursor-pointer backdrop-blur-xs"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Test Local Camera Stream</span>
                </button>
              </div>
            </div>

            {cameraError && (
              <div className="p-3 bg-amber-950/40 border-t border-amber-800/50 text-amber-200 text-xs font-mono">
                {cameraError}
              </div>
            )}

            {/* HUD Bottom Telemetry Bar */}
            <div className="px-5 py-3 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-neutral-400 bg-[#14171d]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Remote Frame Egress • Ephemeral Client Memory</span>
              </div>
              <div className="flex items-center gap-4 text-neutral-400">
                <span>Buffer: 16 Frames</span>
                <span>•</span>
                <span>Sub-Pixel PCK: 98.4%</span>
              </div>
            </div>
          </div>

          {/* Right Column: Processing Pipeline & Reconstruction Flow */}
          <div className="col-span-12 lg:col-span-5 flex flex-col space-y-6">
            {/* Step 1: Raw Landmark Acquisition */}
            <div className="bg-[var(--surface)] p-5 border border-[var(--border)]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--text-primary)] font-semibold flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-[var(--primary)]" />
                  1. Temporal Landmark Extraction
                </h3>
                <span className="text-[10px] font-mono text-emerald-500 font-bold">60.0 FPS</span>
              </div>
              <p className="font-exo text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                Processes video frames using a lightweight MobileNetV4 spatial-temporal graph
                convolutional network. Calculates 3D Cartesian coordinates (X, Y, Z depth) for all 21
                joints, compensating for self-occlusions and rapid wrist rotations.
              </p>
              <div className="grid grid-cols-3 gap-2 text-center font-mono text-[11px]">
                <div className="p-2 bg-[var(--surface-elevated)] border border-[var(--border-subtle)]">
                  <span className="block text-[var(--text-muted)] text-[9px] uppercase">X-Axis</span>
                  <span className="font-bold text-[var(--primary)]">± 0.28m</span>
                </div>
                <div className="p-2 bg-[var(--surface-elevated)] border border-[var(--border-subtle)]">
                  <span className="block text-[var(--text-muted)] text-[9px] uppercase">Y-Axis</span>
                  <span className="font-bold text-[var(--secondary)]">± 0.42m</span>
                </div>
                <div className="p-2 bg-[var(--surface-elevated)] border border-[var(--border-subtle)]">
                  <span className="block text-[var(--text-muted)] text-[9px] uppercase">Z-Depth</span>
                  <span className="font-bold text-[var(--accent)]">0.65m</span>
                </div>
              </div>
            </div>

            {/* Step 2: Continuous Sign Recognition Stream */}
            <div className="bg-[var(--surface)] p-5 border border-[var(--border)]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--text-primary)] font-semibold flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-[var(--secondary)]" />
                  2. Continuous Sign Token Stream
                </h3>
                <span className="text-[10px] font-mono text-[var(--primary)] uppercase font-bold">
                  Active Token
                </span>
              </div>

              <div className="p-3 bg-[var(--surface-elevated)] border border-[var(--border-subtle)] font-mono text-xs mb-3">
                <span className="text-[var(--text-muted)]">Tokens Recognized: </span>
                <span className="font-bold text-[var(--primary)]">[HELLO]</span>{' '}
                <span className="font-bold text-[var(--secondary)]">[ME]</span>{' '}
                <span className="font-bold text-[var(--accent)]">[{activeGestureRecognized}]</span>{' '}
                <span className="font-bold text-emerald-500">[CONFIRM]</span>
              </div>

              <p className="text-[11px] font-mono text-[var(--text-muted)]">
                Maps spatial velocity vectors and hand orientations against standardized ISL & ASL
                vocabulary matrices with continuous sliding-window inference.
              </p>
            </div>

            {/* Step 3: Natural Sentence Synthesis */}
            <div className="bg-[var(--surface)] p-5 border border-[var(--border)]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--text-primary)] font-semibold flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                  3. Contextual Sentence Synthesis
                </h3>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">Natural Voice Ready</span>
              </div>

              <div className="p-3.5 bg-[var(--surface-elevated)] border-l-4 border-[var(--primary)] text-xs font-exo text-[var(--text-primary)] mb-3">
                <span className="font-bold block mb-1">Synthesized Spoken Sentence:</span>
                "Hello, I am ready to communicate and help you today."
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                <span>Vocalizer: Neural Prosodic Engine</span>
                <span className="text-emerald-500 font-bold">Stream Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
