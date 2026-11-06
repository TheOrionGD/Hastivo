import React, { useState } from 'react';
import { Mail, Check, Copy, ExternalLink, X } from 'lucide-react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const email = 'hello.theoriongd@gmail.com';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1a1d24] border border-neutral-300 dark:border-neutral-700 shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200 text-[#212121] dark:text-[#f3f4f6]">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#FF6F61]" />
            <h3 className="font-felix text-2xl uppercase">Direct Research Inquiry</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close email box"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Address & Copy Button */}
        <div className="py-8 text-center">
          <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2">
            HASTIVO Engineering & Linguistics Hub
          </div>
          <div className="font-felix text-2xl md:text-3xl text-[#212121] dark:text-white mb-6 select-all font-medium">
            {email}
          </div>

          <button
            onClick={handleCopy}
            className={`w-full py-3.5 px-6 font-mono text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-[#FF6F61] hover:bg-[#e85b4d] text-white shadow-sm'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Email Address</span>
              </>
            )}
          </button>
        </div>

        {/* Mail Client Direct Links */}
        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <p className="text-xs font-mono text-neutral-500 mb-4 text-center">
            Or open directly in your mail application:
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`mailto:${email}?subject=HASTIVO%20Research%20Inquiry`}
              className="flex-1 py-2.5 px-4 text-center border border-neutral-300 dark:border-neutral-700 text-xs font-mono uppercase tracking-wider hover:border-[#FF6F61] transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Default Client</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=HASTIVO%20Research%20Inquiry`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-4 text-center border border-neutral-300 dark:border-neutral-700 text-xs font-mono uppercase tracking-wider hover:border-[#FF6F61] transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Gmail Web</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
