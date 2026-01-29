'use client';

import { Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  type: 'today' | 'inbox' | 'all';
}

const emptyStateConfig = {
  today: {
    message: "You're all clear.",
    subtext: "No tasks scheduled for today.",
  },
  inbox: {
    message: "Inbox zero.",
    subtext: null,
  },
  all: {
    message: "No tasks yet.",
    subtext: "Add your first task to get started.",
  },
};

export function EmptyState({ type }: EmptyStateProps) {
  const config = emptyStateConfig[type];

  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-32 text-center',
      'animate-fade-in'
    )}>
      {/* Minimal Circle - Calm, intentional */}
      <div className="mb-6">
        <Circle 
          className="h-8 w-8 text-text-muted/20" 
          strokeWidth={1}
        />
      </div>

      {/* Primary Message */}
      <p className="text-[15px] text-text-secondary mb-1">
        {config.message}
      </p>

      {/* Subtext - Optional */}
      {config.subtext && (
        <p className="text-[13px] text-text-muted/60">
          {config.subtext}
        </p>
      )}
    </div>
  );
}
