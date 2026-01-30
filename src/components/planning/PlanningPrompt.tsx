'use client';

import { useMemo } from 'react';
import { LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlanningPromptProps {
  reason: 'empty-today' | 'overwhelm' | 'end-of-day';
  onEnterPlanning: () => void;
}

const reasonMessages = {
  'empty-today': "Your Today is empty — want to plan?",
  'overwhelm': "Feeling overwhelmed? Take a moment to plan.",
  'end-of-day': "End of day — plan for tomorrow?",
};

/**
 * Contextual prompt to enter Planning Mode
 * - Shows when conditions suggest planning would help
 * - Calm, not pushy
 */
export function PlanningPrompt({ reason, onEnterPlanning }: PlanningPromptProps) {
  const message = reasonMessages[reason];

  return (
    <div 
      className={cn(
        'flex items-center justify-between gap-4 px-4 py-3 rounded-lg',
        'bg-bg-elevated border border-white/[0.04]',
        'animate-fade-in'
      )}
    >
      <span className="text-[13px] text-text-secondary">
        {message}
      </span>

      <button
        onClick={onEnterPlanning}
        className={cn(
          'flex items-center gap-2 h-8 px-3 rounded-md',
          'bg-white/[0.06] text-text-primary text-[13px] font-medium',
          'hover:bg-white/[0.08] transition-colors'
        )}
      >
        <LayoutGrid className="h-4 w-4" />
        <span>Plan</span>
      </button>
    </div>
  );
}
