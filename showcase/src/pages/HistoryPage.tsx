import React, { useState, useEffect } from 'react';
import { SignAvatarScene, GestureType } from '../three/SignAvatarScene';
import {
  Search,
  Filter,
  Download,
  Trash2,
  Play,
  RotateCcw,
  X,
  Clock,
  Bookmark,
  FileText,
  CheckCircle,
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [replayModalOpen, setReplayModalOpen] = useState(false);

  // Load real user records from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('signa_conversation_records');
      if (stored) {
        setRecords(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveRecords = (updated: any[]) => {
    setRecords(updated);
    localStorage.setItem('signa_conversation_records', JSON.stringify(updated));
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm('Permanently remove this conversation record?')) {
      const filtered = records.filter(r => r.id !== id);
      saveRecords(filtered);
      if (selectedRecord?.id === id) {
        setSelectedRecord(null);
        setReplayModalOpen(false);
      }
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `signa_conversation_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportTXT = () => {
    let content = `SIGNA COMMUNICATION PLATFORM — CONVERSATION ARCHIVE\nExported: ${new Date().toISOString()}\n\n`;
    records.forEach((r, idx) => {
      content += `------------------------------------------------------------\n`;
      content += `[#${idx + 1}] Category: ${r.category} | Timestamp: ${r.timestamp}\n`;
      content += `Summary: ${r.summary || r.text || ''}\n`;
      if (r.messages) {
        r.messages.forEach((m: any) => {
          content += `  - ${m.sender} (${m.timestamp}): "${m.text}"\n`;
        });
      }
      content += `\n`;
    });

    const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `signa_transcript_${Date.now()}.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filter records
  const filteredRecords = records.filter(r => {
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      !query ||
      (r.summary && r.summary.toLowerCase().includes(query)) ||
      (r.text && r.text.toLowerCase().includes(query)) ||
      (r.category && r.category.toLowerCase().includes(query));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="relative min-h-[calc(100vh-4rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 z-10 space-y-8">
      {/* Top Header */}
      <div className="space-y-4 hairline-border-b pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--brand-coral)] font-bold">
              TRANSPARENCY &bull; USER-OWNED ARCHIVE
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              Conversation History
            </h1>
          </div>

          {/* Export Actions */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={handleExportJSON}
              disabled={records.length === 0}
              className="px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--brand-coral)] flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
            <button
              onClick={handleExportTXT}
              disabled={records.length === 0}
              className="px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--brand-blue)] flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>TXT</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-[var(--text-secondary)] max-w-xl leading-relaxed">
          Chronological record of verified Text-to-Sign, Sign-to-Text, and Real-Time dialogues. We enforce strict privacy—all records are strictly stored locally or under your authorized profile.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 font-mono text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search transcripts or sign tokens..."
            className="w-full bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[var(--brand-coral)]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[var(--text-tertiary)]">CATEGORY:</span>
          {['All', 'Text-to-Sign', 'Sign-to-Text', 'Real-Time'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1.5 cursor-pointer border transition-colors ${
                selectedCategory === cat
                  ? 'bg-[var(--text-primary)] text-[var(--background)] font-bold border-[var(--text-primary)]'
                  : 'bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-primary)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Editorial Timeline / List (Cardless with hairline dividers) */}
      {filteredRecords.length === 0 ? (
        <div className="p-12 text-center bg-[var(--surface)] hairline-border space-y-3">
          <Clock className="w-8 h-8 text-[var(--text-tertiary)] mx-auto" />
          <p className="text-sm text-[var(--text-secondary)]">
            No conversation records match your current filters.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[var(--border)] bg-[var(--surface)] hairline-border">
          {filteredRecords.map((r, i) => (
            <div
              key={r.id || i}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--surface-secondary)]/50 transition-colors"
            >
              <div className="space-y-1.5 flex-1 pr-4">
                <div className="flex items-center gap-3 font-mono text-xs">
                  <span
                    className={`font-bold uppercase ${
                      r.category === 'Text-to-Sign'
                        ? 'text-[var(--brand-coral)]'
                        : r.category === 'Sign-to-Text'
                        ? 'text-[var(--brand-blue)]'
                        : 'text-[var(--brand-yellow)]'
                    }`}
                  >
                    [{r.category}]
                  </span>
                  <span className="text-[var(--text-tertiary)]">{new Date(r.timestamp).toLocaleString()}</span>
                </div>

                <p className="text-sm font-sans text-[var(--text-primary)] leading-relaxed">
                  {r.summary || r.text || 'Dialogue session'}
                </p>

                {r.glosses && r.glosses.length > 0 && (
                  <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                    {r.glosses.slice(0, 6).map((g: any, gi: number) => (
                      <span key={gi} className="px-1.5 py-0.5 bg-[var(--background)] border border-[var(--border)]">
                        [{g.token || g}]
                      </span>
                    ))}
                    {r.glosses.length > 6 && (
                      <span className="text-[var(--text-tertiary)]">+{r.glosses.length - 6} more</span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 font-mono text-xs shrink-0">
                <button
                  onClick={() => {
                    setSelectedRecord(r);
                    setReplayModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-[var(--background)] border border-[var(--border)] hover:border-[var(--brand-coral)] text-[var(--text-primary)] cursor-pointer flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 text-[var(--brand-coral)]" />
                  <span>Inspect</span>
                </button>

                <button
                  onClick={() => handleDeleteRecord(r.id)}
                  className="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--brand-coral)] cursor-pointer border border-[var(--border)]"
                  title="Delete Record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Modal / 3D Replay Inspector */}
      {replayModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-[var(--surface)] hairline-border p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between hairline-border-b pb-4">
              <div className="space-y-1">
                <span className="font-mono text-xs text-[var(--brand-coral)] font-bold uppercase">
                  RECORD DETAIL &bull; [{selectedRecord.category}]
                </span>
                <div className="font-mono text-xs text-[var(--text-tertiary)]">
                  {new Date(selectedRecord.timestamp).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => setReplayModalOpen(false)}
                className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer border border-[var(--border)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 3D Avatar Replay if Glosses exist */}
            {selectedRecord.glosses && selectedRecord.glosses.length > 0 && (
              <div className="h-[300px] relative hairline-border bg-[var(--background)]">
                <SignAvatarScene
                  currentGesture={selectedRecord.glosses[0]?.gesture || 'GREETING'}
                  subtitle={`REPLAY: [${selectedRecord.glosses[0]?.token || 'TOKEN'}]`}
                  className="w-full h-full"
                />
              </div>
            )}

            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-tertiary)] block">
                Full Summary / Transcript:
              </span>
              <p className="text-sm font-sans text-[var(--text-primary)] leading-relaxed p-4 bg-[var(--background)] border border-[var(--border)]">
                {selectedRecord.summary || selectedRecord.text}
              </p>
            </div>

            {/* If Real-Time Messages */}
            {selectedRecord.messages && (
              <div className="space-y-2">
                <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-tertiary)] block">
                  Dialogue Turns ({selectedRecord.messages.length}):
                </span>
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2">
                  {selectedRecord.messages.map((m: any, idx: number) => (
                    <div key={idx} className="p-2.5 bg-[var(--background)] border border-[var(--border)] text-xs font-mono">
                      <span className="text-[var(--brand-coral)] font-bold">{m.sender}: </span>
                      <span className="text-[var(--text-primary)] font-sans">"{m.text}"</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setReplayModalOpen(false)}
                className="px-5 py-2 bg-[var(--text-primary)] text-[var(--background)] font-mono text-xs uppercase font-semibold cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
