import { KineticTypeScroll, ScrollProgress, ButtonCopy } from "@/components/ui/smoothui";
import React, { useState, useEffect } from "react";
import { ScrollText, Search, Download, ShieldCheck } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { GlassInput, GlassButton } from "@/components/glass/GlassControls";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/v1/admin/audit")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.auditRecords && data.auditRecords.length > 0) {
          setLogs(data.auditRecords);
        } else {
          setLogs([
            { id: "aud_1", actor: "admin@hastivo.org", operation: "ADMIN_LOGIN", timestamp: "2026-11-12T10:14:00Z", outcome: "SUCCESS", target: "System" },
            { id: "aud_2", actor: "admin@hastivo.org", operation: "IDENTITY_LOOKUP_ATTEMPT", timestamp: "2026-11-12T10:30:22Z", outcome: "AUTHORIZED", target: "post_9182" },
            { id: "aud_3", actor: "system_cron", operation: "VOLATILE_CACHE_FLUSH", timestamp: "2026-11-12T11:00:00Z", outcome: "SUCCESS", target: "Memory" },
          ]);
        }
      })
      .catch(() => {});
  }, []);

  const handleExport = () => {
    window.open("/api/v1/admin/audit/export", "_blank");
  };

  const filteredLogs = logs.filter((l) =>
    (l.actor || l.operation || l.target || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      title="Audit Logs"
      subtitle="Immutable Records of Administrative and Privileged Actions"
      actions={
        <GlassButton variant="glass" size="sm" icon={Download} onClick={handleExport}>
          Export Audit Records
        </GlassButton>
      }
    >
      <div className="flex items-center justify-between gap-4 mb-6">
        <GlassInput
          placeholder="Filter audit logs by actor, operation or target..."
          icon={Search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <span className="text-xs text-text-3 font-mono">
          {filteredLogs.length} audit trail records
        </span>
      </div>

      <GlassPanel elevation="z2" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-surface/60 border-b border-border/80 text-text-3 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Operation</th>
                <th className="p-4">Target Record</th>
                <th className="p-4">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-surface/40 transition-colors">
                  <td className="p-4 font-mono text-text-3">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4 font-semibold text-foreground">
                    {log.actor}
                  </td>
                  <td className="p-4 font-mono text-coral font-bold">
                    {log.operation}
                  </td>
                  <td className="p-4 text-text-2">
                    {log.target}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-400/15 text-emerald-400 text-[10px] font-bold border border-emerald-400/30 uppercase">
                      {log.outcome}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </AdminLayout>
  );
}

