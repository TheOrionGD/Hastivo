import React, { useState } from 'react';
import { Calendar, Clock, Video, CheckCircle2, X } from 'lucide-react';

interface DiscoveryCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiscoveryCallModal: React.FC<DiscoveryCallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<string>('tomorrow_10am');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [booked, setBooked] = useState(false);

  if (!isOpen) return null;

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setBooked(true);
  };

  const slots = [
    { id: 'tomorrow_10am', label: 'Tomorrow, 10:00 AM IST (Bengaluru Lab)' },
    { id: 'tomorrow_3pm', label: 'Tomorrow, 3:00 PM IST / 9:30 AM GMT' },
    { id: 'thursday_11am', label: 'Thursday, 11:00 AM IST' },
    { id: 'friday_4pm', label: 'Friday, 4:00 PM IST / 6:30 AM EST' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl bg-white dark:bg-[#1a1d24] border border-neutral-300 dark:border-neutral-700 shadow-2xl p-6 sm:p-10 animate-in fade-in zoom-in-95 duration-200 text-[#212121] dark:text-[#f3f4f6]">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-200 dark:border-neutral-800 mb-6">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-[#FF6F61]" />
            <h3 className="font-felix text-2xl uppercase">Book Lab Consultation</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {booked ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="font-felix text-2xl uppercase text-[#212121] dark:text-white">
              Consultation Scheduled
            </h4>
            <p className="font-exo text-sm text-neutral-500 dark:text-neutral-400">
              A Google Meet link and technical briefing document have been sent to{' '}
              <span className="text-[#FF6F61] font-semibold">{email}</span>.
            </p>
            <button
              onClick={() => {
                setBooked(false);
                onClose();
              }}
              className="mt-4 px-6 py-2.5 bg-[#FF6F61] text-white text-xs font-mono uppercase tracking-widest cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleBook} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2">
                Select Available Lab Slot (30 Mins)
              </label>
              <div className="space-y-2">
                {slots.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setSelectedSlot(s.id)}
                    className={`w-full p-3 text-left border text-xs font-mono transition-all cursor-pointer flex items-center justify-between ${
                      selectedSlot === s.id
                        ? 'border-[#FF6F61] bg-[#FF6F61]/5 text-[#FF6F61] font-bold'
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
                    }`}
                  >
                    <span>{s.label}</span>
                    <Clock className="w-3.5 h-3.5 opacity-60" />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Anand Verma"
                  className="w-full px-3 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs text-[#212121] dark:text-white focus:outline-none focus:border-[#FF6F61]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400 mb-1">
                  Work Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anand@institution.org"
                  className="w-full px-3 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs text-[#212121] dark:text-white focus:outline-none focus:border-[#FF6F61]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400 mb-1">
                Linguistic or Accessibility Scope
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Briefly state your research or product integration goals..."
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs text-[#212121] dark:text-white focus:outline-none focus:border-[#FF6F61]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-[#FF6F61] text-white font-mono text-xs uppercase tracking-widest hover:bg-[#e85b4d] transition-all cursor-pointer shadow-md"
              >
                Confirm 30-Minute Lab Briefing
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
