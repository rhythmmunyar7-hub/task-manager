'use client';

import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
}

interface ShortcutSection {
  title: string;
  shortcuts: ShortcutItem[];
}

const shortcutSections: ShortcutSection[] = [
  {
    title: 'Task Management',
    shortcuts: [
      { keys: ['⌘', 'N'], description: 'Add new task' },
      { keys: ['Enter'], description: 'Open selected task' },
      { keys: ['X'], description: 'Toggle task complete' },
      { keys: ['⌘', '⌫'], description: 'Delete selected task' },
      { keys: ['Esc'], description: 'Close panel / Cancel' },
    ],
  },
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['J'], description: 'Select next task' },
      { keys: ['K'], description: 'Select previous task' },
      { keys: ['G', 'T'], description: 'Go to Today' },
      { keys: ['G', 'I'], description: 'Go to Inbox' },
      { keys: ['G', 'A'], description: 'Go to All Tasks' },
    ],
  },
  {
    title: 'Focus & Planning',
    shortcuts: [
      { keys: ['⌘', '⇧', 'F'], description: 'Start Focus Sprint' },
      { keys: ['⌘', '⇧', 'T'], description: 'Start Backlog Triage' },
      { keys: ['⌘', 'P'], description: 'Open Planning Mode' },
      { keys: ['Esc'], description: 'Exit mode' },
    ],
  },
  {
    title: 'General',
    shortcuts: [
      { keys: ['?'], description: 'Show keyboard shortcuts' },
      { keys: ['⌘', 'K'], description: 'Quick search (coming soon)' },
    ],
  },
];

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-[600px] max-h-[80vh] overflow-y-auto rounded-xl border border-capella-border bg-bg-elevated p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text-primary">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-text-secondary transition-colors hover:bg-bg-subtle hover:text-text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {shortcutSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-3 text-sm font-medium text-text-muted uppercase tracking-wide">
                {section.title}
              </h3>
              <div className="space-y-2">
                {section.shortcuts.map((shortcut, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-sm text-text-secondary">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <kbd
                          key={keyIndex}
                          className={cn(
                            'inline-flex h-6 min-w-[24px] items-center justify-center rounded px-2',
                            'bg-capella-primary/20 text-xs font-mono text-capella-primary'
                          )}
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <p className="mt-8 text-center text-xs text-text-muted">
          Press <kbd className="px-1.5 py-0.5 rounded bg-capella-primary/20 text-capella-primary font-mono">?</kbd> anywhere to toggle this panel
        </p>
      </div>
    </div>
  );
}
