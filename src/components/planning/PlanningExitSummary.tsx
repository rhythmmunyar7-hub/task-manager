'use client';

import { useEffect } from 'react';
import { Check, Calendar, Clock, Archive } from 'lucide-react';
import { PlanningExitSummary as ExitSummaryType } from '@/types/planning';
import { cn } from '@/lib/utils';

interface PlanningExitSummaryProps {
  summary: ExitSummaryType;
  onDismiss: () => void;
}

/**
 * Brief summary shown when exiting Planning Mode
 * Shows what was planned, then auto-dismisses
 */
export function PlanningExitSummary({ summary, onDismiss }: PlanningExitSummaryProps) {
  // Auto-dismiss after 4 seconds
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div 
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
        'flex items-center gap-4 px-5 py-3 rounded-xl',
        'bg-bg-elevated border border-white/[0.08] shadow-xl',
        'animate-fade-in'
      )}
      onClick={onDismiss}
    >
      {/* Success Icon */}
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-capella-success/20">
        <Check className="h-4 w-4 text-capella-success" />
      </div>

      {/* Summary Stats */}
      <div className="flex items-center gap-4 text-[13px]">
        <div className="flex items-center gap-1.5 text-text-primary">
          <Clock className="h-3.5 w-3.5 text-capella-warning" />
          <span className="font-medium">{summary.todayCount}</span>
          <span className="text-text-muted">today</span>
        </div>

        <div className="w-px h-4 bg-white/[0.08]" />

        <div className="flex items-center gap-1.5 text-text-primary">
          <Calendar className="h-3.5 w-3.5 text-capella-primary" />
          <span className="font-medium">{summary.thisWeekCount}</span>
          <span className="text-text-muted">this week</span>
        </div>

        {summary.deferredCount > 0 && (
          <>
            <div className="w-px h-4 bg-white/[0.08]" />
            <div className="flex items-center gap-1.5 text-text-muted">
              <Archive className="h-3.5 w-3.5" />
              <span>{summary.deferredCount} deferred</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
