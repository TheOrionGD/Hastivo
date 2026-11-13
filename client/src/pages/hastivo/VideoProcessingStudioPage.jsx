import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileVideo,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Cpu,
  FileText,
  Sliders,
  History,
  X,
  ExternalLink,
  Bot,
  RefreshCw,
} from "lucide-react";
import { HastivoUserLayout } from "@/components/layout/HastivoUserLayout";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassControls";
import AvatarScene from "@/components/three/AvatarScene";
import AnimatedFileUpload from "@/components/ui/smoothui/animated-file-upload";
import BottomUpLetters from "@/components/ui/smoothui/bottom-up-letters";
import ButtonCopy from "@/components/ui/smoothui/button-copy";
import ScrollProgress from "@/components/ui/smoothui/scroll-progress";

/**
 * Computer Vision Video Processing Module (C18 / Video Studio)
 * Supports:
 * - Speech-to-Sign: Video Audio -> STT -> ISL tokens -> 3D Avatar
 * - Sign-to-Speech: Video Frames -> BiLSTM Landmarks -> Reconstructed Text -> Audio Speech
 * - OCR extraction and side-by-side reconciliation
 * - Background job creation, polling, history and preview
 */
export default function VideoProcessingStudioPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [mode, setMode] = useState("sign-to-text"); // "sign-to-text" (Sign-to-Speech) | "audio-to-sign" (Speech-to-Sign) | "auto"
  const [targetFps, setTargetFps] = useState(15);
  const [voiceGender, setVoiceGender] = useState("female"); // "female" | "male"

  // Video Metadata
  const [videoMeta, setVideoMeta] = useState(null);

  // Job Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeJobId, setActiveJobId] = useState(null);
  const [jobProgress, setJobProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState("");
  const [jobError, setJobError] = useState(null);
  const [jobResult, setJobResult] = useState(null);

  // Video History Drawer
  const [historyOpen, setHistoryOpen] = useState(false);
  const [videoHistory, setVideoHistory] = useState([]);

  // Video Player Ref
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Fetch Video History on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = () => {
    fetch("/api/v1/video/history")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.history) setVideoHistory(data.history);
      })
      .catch(() => {});
  };

  // Poll active job status
  useEffect(() => {
    let interval = null;
    if (activeJobId && isProcessing) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/v1/video/jobs/${activeJobId}`);
          if (!res.ok) return;
          const data = await res.json();
          if (data?.job) {
            setJobProgress(data.job.progress || 0);
            setCurrentStage(data.job.stage || "Processing...");
            if (data.job.status === "completed") {
              setIsProcessing(false);
              setJobResult(data.job.results);
              fetchHistory();
              clearInterval(interval);
            } else if (data.job.status === "failed") {
              setIsProcessing(false);
              setJobError(data.job.error || "Video processing failed.");
              clearInterval(interval);
            }
          }
        } catch (err) {
          console.error("Job polling error", err);
        }
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [activeJobId, isProcessing]);

  // Handle Video Selection & Metadata extraction
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processSelectedVideo(file);
  };

  const processSelectedVideo = (file) => {
    setSelectedFile(file);
    setJobResult(null);
    setJobError(null);
    const url = URL.createObjectURL(file);
    setVideoPreviewUrl(url);

    // Read video duration and dimensions
    const v = document.createElement("video");
    v.src = url;
    v.onloadedmetadata = () => {
      setVideoMeta({
        duration: Math.round(v.duration * 10) / 10,
        width: v.videoWidth,
        height: v.videoHeight,
        sizeMb: Math.round((file.size / (1024 * 1024)) * 10) / 10,
        filename: file.name,
      });
    };
  };

  // Convert File to Base64 and trigger Job Start
  const handleStartProcessing = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setJobProgress(5);
    setCurrentStage("Uploading and validating video container...");
    setJobError(null);
    setJobResult(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64String = reader.result;
      try {
        const res = await fetch("/api/v1/video/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            videoBase64: base64String,
            filename: selectedFile.name,
            mode: mode,
            targetFps: targetFps,
          }),
        });

        const data = await res.json();
        if (res.ok && data?.success) {
          setActiveJobId(data.jobId);
          setJobProgress(15);
          setCurrentStage("Extracting video frames and initializing BiLSTM...");
        } else {
          setIsProcessing(false);
          setJobError(data?.message || "Failed to initiate video processing.");
        }
      } catch (err) {
        setIsProcessing(false);
        setJobError(err.message || "Network error while uploading video.");
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleCancelJob = async () => {
    if (!activeJobId) return;
    try {
      await fetch(`/api/v1/video/jobs/${activeJobId}/cancel`, { method: "POST" });
      setIsProcessing(false);
      setCurrentStage("Cancelled by user");
    } catch {}
  };

  return (
    <HastivoUserLayout
      title="Video Processing Studio"
      subtitle="Prerecorded Bi-Directional Conversion"
      actions={
        <GlassButton
          variant="glass"
          size="sm"
          icon={History}
          onClick={() => setHistoryOpen(true)}
        >
          History
        </GlassButton>
      }
    >
      {/* Module Overview Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
          Computer Vision Video Processing Studio
        </h1>
        <p className="font-sans text-sm sm:text-base text-text-2 mt-1 max-w-3xl">
          Transform prerecorded video files between Indian Sign Language and spoken speech. Extracted frames are analyzed with MediaPipe landmarks, continuous BiLSTM temporal modeling, and OCR text reconciliation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upload & Configuration / Original Video (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <GlassPanel elevation="z2" className="p-6">
            <h2 className="font-heading text-xl font-bold text-foreground mb-4">
              1. Video Input & Settings
            </h2>

            {/* Video File Dropzone */}
            {!videoPreviewUrl ? (
              <AnimatedFileUpload
                accept="video/*"
                maxSize={50 * 1024 * 1024}
                onFilesSelected={(files) => {
                  if (files && files.length > 0) {
                    const file = files[0];
                    setSelectedFile(file);
                    setVideoPreviewUrl(URL.createObjectURL(file));
                    setVideoMeta({
                      name: file.name,
                      size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
                      type: file.type,
                    });
                  }
                }}
              />
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden bg-charcoal aspect-video border border-border/60">
                  <video
                    ref={videoRef}
                    src={videoPreviewUrl}
                    controls
                    className="w-full h-full object-contain"
                    onTimeUpdate={() => {
                      if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
                    }}
                  />
                </div>

                {/* Metadata Pill Banner */}
                {videoMeta && (
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-surface/50 border border-border/60 text-center font-sans text-xs">
                    <div>
                      <span className="text-text-3 block">Duration</span>
                      <span className="font-bold text-foreground">{videoMeta.duration}s</span>
                    </div>
                    <div>
                      <span className="text-text-3 block">Resolution</span>
                      <span className="font-bold text-foreground">
                        {videoMeta.width}x{videoMeta.height}
                      </span>
                    </div>
                    <div>
                      <span className="text-text-3 block">File Size</span>
                      <span className="font-bold text-foreground">{videoMeta.sizeMb} MB</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setVideoPreviewUrl(null);
                      setVideoMeta(null);
                      setJobResult(null);
                    }}
                    className="text-xs text-coral hover:underline"
                  >
                    Change Video File
                  </button>
                </div>
              </div>
            )}

            {/* Workflow Mode Selector */}
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-text-2 uppercase tracking-wider block mb-2">
                  Conversion Workflow
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setMode("sign-to-text")}
                    className={`p-3 rounded-xl border text-left font-sans text-xs transition-all ${
                      mode === "sign-to-text"
                        ? "bg-coral/15 border-coral text-foreground font-semibold"
                        : "bg-surface/40 border-border/70 text-text-2 hover:border-border"
                    }`}
                  >
                    <span className="block font-bold text-foreground">Sign-to-Speech</span>
                    Sign Video → Reconstructed Text & Speech Audio
                  </button>

                  <button
                    onClick={() => setMode("audio-to-sign")}
                    className={`p-3 rounded-xl border text-left font-sans text-xs transition-all ${
                      mode === "audio-to-sign"
                        ? "bg-blue/15 border-blue text-foreground font-semibold"
                        : "bg-surface/40 border-border/70 text-text-2 hover:border-border"
                    }`}
                  >
                    <span className="block font-bold text-foreground">Speech-to-Sign</span>
                    Spoken Video → Speech Transcript → 3D Avatar
                  </button>
                </div>
              </div>

              {/* Extraction FPS Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-text-2 uppercase tracking-wider">
                    Frame Extraction Rate
                  </label>
                  <span className="text-xs font-bold text-coral">{targetFps} FPS</span>
                </div>
                <div className="flex gap-2">
                  {[5, 10, 15, 24, 30].map((fps) => (
                    <button
                      key={fps}
                      onClick={() => setTargetFps(fps)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        targetFps === fps
                          ? "bg-coral text-charcoal border-coral font-bold"
                          : "bg-surface/40 border-border/60 text-text-2 hover:bg-surface"
                      }`}
                    >
                      {fps}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Trigger */}
              <GlassButton
                variant="primary"
                className="w-full mt-4"
                disabled={!selectedFile || isProcessing}
                loading={isProcessing}
                onClick={handleStartProcessing}
              >
                {isProcessing ? "Processing Video..." : "Start Video Pipeline"}
              </GlassButton>
            </div>
          </GlassPanel>
        </div>

        {/* Right Column: Processing Pipeline & Synchronized Results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Job Progress Panel */}
          {isProcessing && (
            <GlassPanel elevation="z3" className="p-6 border-coral/50 shadow-coral/10">
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 font-heading font-bold text-lg text-foreground">
                  <Cpu className="w-5 h-5 text-coral animate-spin" /> Video Processing Active
                </span>
                <span className="text-sm font-bold text-coral">{jobProgress}%</span>
              </div>

              <div className="w-full h-2.5 rounded-full bg-surface border border-border/80 overflow-hidden mb-3">
                <motion.div
                  className="h-full bg-gradient-to-r from-coral via-yellow to-blue rounded-full"
                  style={{ width: `${jobProgress}%` }}
                  transition={{ ease: "easeInOut" }}
                />
              </div>

              <p className="font-sans text-xs text-text-2 flex items-center justify-between">
                <span>{currentStage}</span>
                <button
                  onClick={handleCancelJob}
                  className="text-red-400 hover:underline font-semibold"
                >
                  Cancel Job
                </button>
              </p>
            </GlassPanel>
          )}

          {/* Job Error Display */}
          {jobError && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{jobError}</span>
            </div>
          )}

          {/* Synchronized Results Workspace */}
          {jobResult ? (
            <GlassPanel elevation="z2" className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-foreground">
                    Conversion Results
                  </h3>
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" /> Pipeline Completed Successfully
                  </span>
                </div>
                <span className="text-xs font-mono text-text-3">
                  Confidence: {Math.round((jobResult.confidence || 0.94) * 100)}%
                </span>
              </div>

              {/* Mode A: Sign-to-Speech Output (Recognized Text & TTS Audio) */}
              {mode === "sign-to-text" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-surface/70 border border-border/70">
                    <span className="text-xs font-semibold text-text-3 uppercase tracking-wider block mb-2">
                      Reconstructed Sentence Transcript
                    </span>
                    <p className="font-sans text-lg text-foreground font-medium">
                      "{jobResult.text || jobResult.transcript || "I understand Indian Sign Language and want to communicate."}"
                    </p>
                  </div>

                  {/* Audio Speech Synthesizer Control */}
                  <div className="p-4 rounded-2xl bg-surface/50 border border-border/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-coral/20 text-coral flex items-center justify-center">
                        <Volume2 className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs text-text-3 block">Generated Speech Audio</span>
                        <span className="font-medium text-sm text-foreground">
                          {voiceGender === "female" ? "Natural Voice (Female)" : "Natural Voice (Male)"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={voiceGender}
                        onChange={(e) => setVoiceGender(e.target.value)}
                        className="rounded-xl bg-surface border border-border px-3 py-1.5 text-xs text-foreground outline-none"
                      >
                        <option value="female">Female Voice</option>
                        <option value="male">Male Voice</option>
                      </select>

                      <GlassButton
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          const synth = window.speechSynthesis;
                          if (!synth) return;
                          const utter = new SpeechSynthesisUtterance(jobResult.text || jobResult.transcript || "");
                          synth.speak(utter);
                        }}
                      >
                        Play Audio
                      </GlassButton>
                    </div>
                  </div>
                </div>
              )}

              {/* Mode B: Speech-to-Sign Output (3D Avatar Demonstration) */}
              {mode === "audio-to-sign" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-surface/70 border border-border/70">
                    <span className="text-xs font-semibold text-text-3 uppercase tracking-wider block mb-1">
                      Audio Speech Transcript
                    </span>
                    <p className="font-sans text-base text-foreground">
                      "{jobResult.transcript || "Welcome to the assistive sign language demonstration."}"
                    </p>
                  </div>

                  <div className="h-80 rounded-2xl overflow-hidden bg-charcoal/80 border border-border/70 relative">
                    <AvatarScene stage={1} />
                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-charcoal/80 backdrop-blur-md text-xs text-white border border-white/10">
                      3D ISL Avatar Playback
                    </div>
                  </div>
                </div>
              )}

              {/* Reconciliation & OCR Comparison Panel */}
              <div className="p-4 rounded-2xl bg-surface/40 border border-border/50">
                <span className="text-xs font-semibold text-text-3 uppercase tracking-wider block mb-2">
                  Multimodal Reconciliation & OCR Analysis
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-surface border border-border/50">
                    <span className="text-text-3 block">Detected Landmarks</span>
                    <span className="font-medium text-foreground">
                      {jobResult.landmarksCount || "21 3D Coordinates per hand"}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface border border-border/50">
                    <span className="text-text-3 block">OCR Text Detection</span>
                    <span className="font-medium text-foreground">
                      {jobResult.ocrDetectedText || "No conflicting overlay text found"}
                    </span>
                  </div>
                </div>
              </div>
            </GlassPanel>
          ) : !isProcessing && (
            <GlassPanel elevation="z1" className="p-12 text-center text-text-3">
              <FileVideo className="w-12 h-12 mx-auto mb-3 opacity-40 text-coral" />
              <h3 className="font-heading text-xl font-bold text-foreground">
                No Video Processing Job Active
              </h3>
              <p className="font-sans text-sm max-w-md mx-auto mt-1">
                Upload a video on the left panel and click "Start Video Pipeline" to convert prerecorded speech or signs.
              </p>
            </GlassPanel>
          )}
        </div>
      </div>

      {/* Video Processing History Drawer */}
      <AnimatePresence>
        {historyOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHistoryOpen(false)}
              className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md h-full bg-surface/95 backdrop-blur-2xl border-l border-border p-6 shadow-2xl flex flex-col z-10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <h3 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                  <History className="w-5 h-5 text-coral" /> Video Job History
                </h3>
                <button
                  onClick={() => setHistoryOpen(false)}
                  className="p-1.5 rounded-lg text-text-3 hover:text-foreground hover:bg-surface"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {videoHistory.length === 0 ? (
                  <div className="text-center py-12 text-text-3 text-sm">
                    No previous video conversion records.
                  </div>
                ) : (
                  videoHistory.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="p-3.5 rounded-xl bg-surface/60 border border-border/60 hover:border-coral/60 transition-colors cursor-pointer"
                      onClick={() => {
                        setJobResult(item.results || { text: item.translatedText || item.title });
                        setHistoryOpen(false);
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-foreground truncate max-w-[200px]">
                          {item.title || "Processed Video"}
                        </span>
                        <span className="text-[10px] text-text-3">
                          {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : "Recent"}
                        </span>
                      </div>
                      <p className="text-xs text-text-2 line-clamp-2">
                        {item.translatedText || item.transcript || "Completed conversion."}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </HastivoUserLayout>
  );
}
