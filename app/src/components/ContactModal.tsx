import React, { useState } from 'react';
import { Mail, Check, Copy, Send, CheckCircle2, X } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    area: 'Neural SOV Syntax & Gloss Parsing',
    message: ''
  });

  if (!isOpen) return null;

  const email = 'hello.theoriongd@gmail.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/75 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#1a1d24] border border-neutral-300 dark:border-neutral-700 shadow-2xl p-6 sm:p-10 my-8 animate-in fade-in zoom-in-95 duration-200 text-[#212121] dark:text-[#f3f4f6]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          aria-label="Close Contact Modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest text-[#FF6F61] font-semibold block mb-2 font-mono">
            Direct Research Collaboration
          </span>
          <h2 className="font-felix text-3xl sm:text-4xl text-[#212121] dark:text-white uppercase tracking-tight">
            CONNECT WITH HASTIVO
          </h2>
          <p className="font-exo text-sm sm:text-base text-neutral-500 dark:text-neutral-400 mt-2">
            Reach out to our linguistics and engineering researchers across Bengaluru, Edinburgh, and Portland.
          </p>
        </div>

        {/* Quick Email Copy Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-neutral-50 dark:bg-[#20232B] border border-neutral-200 dark:border-neutral-800 mb-8 gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
              Official Contact Endpoint
            </span>
            <span className="font-mono text-sm font-semibold text-[#212121] dark:text-white">
              {email}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 border border-neutral-300 dark:border-neutral-700 text-xs font-mono uppercase tracking-widest hover:border-[#FF6F61] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Submission Feedback or Contact Form */}
        {formSubmitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-felix text-2xl uppercase text-[#212121] dark:text-white">
              Message Transmitted
            </h3>
            <p className="font-exo text-sm text-neutral-500">
              Thank you. Our linguistics team will respond within 24 business hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs text-[#212121] dark:text-white focus:outline-none focus:border-[#FF6F61]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@organization.org"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs text-[#212121] dark:text-white focus:outline-none focus:border-[#FF6F61]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400 mb-1">
                  Institution / Organization
                </label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="University, Deaf Org, or Company"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs text-[#212121] dark:text-white focus:outline-none focus:border-[#FF6F61]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400 mb-1">
                  Area of Interest
                </label>
                <select
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs text-[#212121] dark:text-white focus:outline-none focus:border-[#FF6F61]"
                >
                  <option>Neural SOV Syntax & Gloss Parsing</option>
                  <option>60 FPS Vision Landmark AI</option>
                  <option>3D WebGL Avatar Kinematics</option>
                  <option>Bilateral Duplex Conversation Engine</option>
                  <option>7-Language Matrix & RTL Localization</option>
                  <option>Institutional Partnership / Grant Research</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400 mb-1">
                Message / Collaboration Goals *
              </label>
              <textarea
                required
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your research project, accessibility needs, or technical questions..."
                className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs text-[#212121] dark:text-white focus:outline-none focus:border-[#FF6F61]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-[#FF6F61] text-white font-mono text-xs uppercase tracking-widest hover:bg-[#e85b4d] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Send Collaboration Message</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
