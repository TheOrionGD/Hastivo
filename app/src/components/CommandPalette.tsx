import React, { useState, useEffect } from 'react';
import { useTheme, SupportedLanguage, LANGUAGE_METADATA } from '../context/ThemeContext';
import { Search, Globe, Sun, Moon, Sparkles, ArrowRight, X, Cpu, Eye, BookOpen, Mail } from 'lucide-react';
import { GestureType } from '../three/SignAvatarScene';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGesture?: (gesture: GestureType) => void;
  onOpenContact?: () => void;
  onOpenDiscoveryCall?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectGesture,
  onOpenContact,
  onOpenDiscoveryCall,
}) => {
  const [query, setQuery] = useState('');
  const { theme, toggleTheme, language, setLanguage } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Can be toggled externally or opened
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navigateTo = (anchor: string) => {
    onClose();
    const el = document.querySelector(anchor);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const commands = [
    {
      category: 'Navigation',
      items: [
        { label: 'Go to Hero Overview', action: () => navigateTo('#top'), icon: <Search className="w-4 h-4" /> },
        { label: 'Explore Architecture (WHAT WE DO.)', action: () => navigateTo('#architecture'), icon: <Cpu className="w-4 h-4 text-[#FF6F61]" /> },
        { label: 'Open 3D Avatar Simulator', action: () => navigateTo('#simulator'), icon: <Sparkles className="w-4 h-4 text-[#FF6F61]" /> },
        { label: 'View 60 FPS Vision Landmark AI', action: () => navigateTo('#vision-telemetry'), icon: <Eye className="w-4 h-4 text-[#6FA3EF]" /> },
        { label: 'Inspect Research Breakthroughs (01-06)', action: () => navigateTo('#breakthroughs'), icon: <BookOpen className="w-4 h-4 text-[#FFC107]" /> },
        { label: 'Explore 7-Language Matrix & RTL', action: () => navigateTo('#languages'), icon: <Globe className="w-4 h-4 text-[#20B2AA]" /> },
        { label: 'View Institutional Partners', action: () => navigateTo('#partners'), icon: <Search className="w-4 h-4" /> },
        { label: 'Join Research Sandbox Waitlist', action: () => navigateTo('#waitlist'), icon: <Search className="w-4 h-4" /> },
      ],
    },
    {
      category: '3D Kinematics Gestures',
      items: [
        { label: 'Avatar: Sign GREETING (Hello/Welcome)', action: () => { onSelectGesture?.('GREETING'); navigateTo('#simulator'); }, icon: <Sparkles className="w-4 h-4 text-[#FF6F61]" /> },
        { label: 'Avatar: Sign THANK YOU (Gratitude)', action: () => { onSelectGesture?.('THANK_YOU'); navigateTo('#simulator'); }, icon: <Sparkles className="w-4 h-4 text-[#FF6F61]" /> },
        { label: 'Avatar: Sign HELP (Assistance)', action: () => { onSelectGesture?.('HELP'); navigateTo('#simulator'); }, icon: <Sparkles className="w-4 h-4 text-[#6FA3EF]" /> },
        { label: 'Avatar: Sign COMMUNICATE (Inclusion)', action: () => { onSelectGesture?.('COMMUNICATE'); navigateTo('#simulator'); }, icon: <Sparkles className="w-4 h-4 text-[#FFC107]" /> },
        { label: 'Avatar: Sign NAME (Identity)', action: () => { onSelectGesture?.('NAME'); navigateTo('#simulator'); }, icon: <Sparkles className="w-4 h-4" /> },
        { label: 'Avatar: Sign TIME (Schedule)', action: () => { onSelectGesture?.('TIME'); navigateTo('#simulator'); }, icon: <Sparkles className="w-4 h-4" /> },
      ],
    },
    {
      category: 'Preferences & Actions',
      items: [
        { label: `Toggle Theme (Currently: ${theme})`, action: () => { toggleTheme(); onClose(); }, icon: theme === 'dark' ? <Sun className="w-4 h-4 text-[#FFC107]" /> : <Moon className="w-4 h-4" /> },
        { label: 'Book Lab Demo & Consultation', action: () => { onClose(); onOpenDiscoveryCall?.(); }, icon: <Sparkles className="w-4 h-4 text-[#FF6F61]" /> },
        { label: 'Compose Research Email to hello.theoriongd@gmail.com', action: () => { onClose(); onOpenContact?.(); }, icon: <Mail className="w-4 h-4" /> },
      ],
    },
  ];

  const filteredCommands = commands
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#1a1d24] border border-neutral-300 dark:border-neutral-700 shadow-2xl overflow-hidden text-[#212121] dark:text-[#f3f4f6]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-neutral-200 dark:border-neutral-800">
          <Search className="w-5 h-5 text-neutral-400 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search sections (e.g. 'simulator', 'urdu', 'vision')..."
            className="w-full bg-transparent text-sm focus:outline-none placeholder:text-neutral-400 font-mono"
          />
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-[420px] overflow-y-auto p-3 space-y-4 font-mono text-xs">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-neutral-400">
              No matching commands or sections found for "{query}".
            </div>
          ) : (
            filteredCommands.map((group, idx) => (
              <div key={idx}>
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                  {group.category}
                </div>
                <div className="space-y-1 mt-1">
                  {group.items.map((item, itemIdx) => (
                    <button
                      key={itemIdx}
                      onClick={item.action}
                      className="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-[#FF6F61]/10 hover:text-[#FF6F61] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-neutral-400 group-hover:text-[#FF6F61]">
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2 bg-neutral-50 dark:bg-[#14171d] border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-400">
          <span>HASTIVO Command Navigator</span>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-800 rounded-none text-[10px]">
              ESC
            </kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
