'use client';

import { useEffect } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { FocusSprintSummary } from '@/types/focus-sprint';
import { cn } from '@/lib/utils';

interface FocusExitSummaryProps {
  summary: FocusSprintSummary | null;
  onDismiss: () => void;
}

export function FocusExitSummary({ summary, onDismiss }: FocusExitSummaryProps) {
  // Auto-dismiss after 4 seconds
  useEffect(() => {
    if (summary) {
      const timer = setTimeout(onDismiss, 4000);
      return () => clearTimeout(timer);
    }
  }, [summary, onDismiss]);

  if (!summary) return null;

  const message = summary.wasCompleted
    ? `Session complete. ${summary.completedTasks} ${summary.completedTasks === 1 ? 'task' : 'tasks'} done.`
    : `Sprint ended. ${summary.completedTasks} of ${summary.totalTasks} tasks completed.`;

  return (
    <div 
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        'bg-bg-main/95 backdrop-blur-sm',
        'animate-in fade-in duration-300'
      )}
      onClick={onDismiss}
    >
      <div className="flex flex-col items-center gap-6 text-center">
        {/* Icon */}
        {summary.wasCompleted ? (
          <CheckCircle2 
            className="h-16 w-16 text-capella-success animate-in zoom-in duration-500" 
            strokeWidth={1.5}
          />
        ) : (
          <Circle 
            className="h-16 w-16 text-text-muted animate-in zoom-in duration-500" 
            strokeWidth={1.5}
          />
        )}

        {/* Message */}
        <p className="text-xl font-light text-text-primary tracking-wide">
          {message}
        </p>

        {/* Dismiss hint */}
        <p className="text-[13px] text-text-muted mt-4">
          Click anywhere to continue
        </p>
      </div>
    </div>
  );
}
