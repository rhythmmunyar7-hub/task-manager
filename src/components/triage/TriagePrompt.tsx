'use client';

import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TriagePromptProps {
  count: number;
  onStart: () => void;
  onDismiss: () => void;
}

export function TriagePrompt({ count, onStart, onDismiss }: TriagePromptProps) {
  if (count === 0) return null;

  return (
    <div 
      className={cn(
        'mb-4 p-4 rounded-lg',
        'bg-white/[0.02] border border-white/[0.04]',
        'animate-in fade-in slide-in-from-top-2 duration-300'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-white/[0.04] shrink-0">
          <Inbox className="h-4 w-4 text-text-muted" strokeWidth={1.5} />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-[14px] text-text-secondary mb-1">
            {count} {count === 1 ? 'task' : 'tasks'} waiting for a decision
          </p>
          <p className="text-[13px] text-text-muted">
            Quick triage to feel lighter
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={onDismiss}
            className={cn(
              'px-3 py-1.5 rounded-md text-[13px]',
              'text-text-muted hover:text-text-secondary',
              'transition-colors duration-150'
            )}
          >
            Later
          </button>
          <button
            onClick={onStart}
            className={cn(
              'px-3 py-1.5 rounded-md text-[13px] font-medium',
              'bg-white/[0.06] text-text-primary',
              'hover:bg-white/[0.08]',
              'transition-colors duration-150'
            )}
          >
            Triage Now
          </button>
        </div>
      </div>
    </div>
  );
}
