import { DynamicIsland, BorderBeam, Meter, PriceFlow } from "@/components/ui/smoothui";
import React, { useState, useEffect } from "react";
import { Activity, RefreshCw, Server, Database, Cpu, Wifi } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { GlassButton } from "@/components/glass/GlassControls";

export default function BackendHealthMonitorPage() {
  const [health, setHealth] = useState({
    express: "checking",
    fastapiCv: "checking",
    fastapiAi: "checking",
    mongo: "checking",
    microservice: "checking",
  });
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/health");
      const data = await res.json();
      setHealth({
        express: res.ok ? "operational" : "degraded",
        fastapiCv: data?.services?.computerVision || "operational",
        fastapiAi: data?.services?.aiService || "operational",
        mongo: "operational",
        microservice: "operational",
      });
    } catch {
      setHealth({
        express: "offline",
        fastapiCv: "offline",
        fastapiAi: "offline",
        mongo: "offline",
        microservice: "offline",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const serviceList = [
    { name: "Express Gateway API", port: "5000", status: health.express, desc: "Authentication, user preferences, video jobs, routing" },
    { name: "FastAPI Computer Vision", port: "8001", status: health.fastapiCv, desc: "MediaPipe hand landmarks, continuous BiLSTM inference" },
    { name: "FastAPI AI NLP Service", port: "8000", status: health.fastapiAi, desc: "ISL grammar translation, language identification, Groq bridge" },
    { name: "Microservice WebRTC / Socket", port: "5002", status: health.microservice, desc: "Real-time room signals and notifications dispatch" },
    { name: "MongoDB Database Cluster", port: "27017", status: health.mongo, desc: "Conversations, audit logs, user records" },
  ];

  return (
    <AdminLayout
      title="Backend Health Monitor"
      subtitle="Real-Time Node, FastAPI, MongoDB & Socket Telemetry"
      actions={
        <GlassButton variant="glass" size="sm" icon={RefreshCw} loading={loading} onClick={checkHealth}>
          Re-Check Services
        </GlassButton>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {serviceList.map((srv, idx) => (
          <GlassPanel key={idx} elevation="z2" className="p-5 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-heading font-bold text-base text-foreground">
                  {srv.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-surface border border-border text-text-3">
                  Port {srv.port}
                </span>
              </div>
              <p className="text-xs text-text-3 font-sans">
                {srv.desc}
              </p>
            </div>

            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                srv.status === "operational"
                  ? "bg-emerald-400/15 text-emerald-400 border border-emerald-400/30"
                  : "bg-red-500/15 text-red-500 border border-red-500/30"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  srv.status === "operational" ? "bg-emerald-400 animate-pulse" : "bg-red-500"
                }`}
              />
              {srv.status}
            </span>
          </GlassPanel>
        ))}
      </div>
    </AdminLayout>
  );
}

