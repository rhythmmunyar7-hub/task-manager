'use client';

import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  type: 'today' | 'inbox' | 'all';
}

const emptyStateConfig = {
  today: {
    message: "You're all clear.",
    subtext: "No tasks scheduled for today.",
    showIcon: true,
  },
  inbox: {
    message: "Inbox zero.",
    subtext: "Everything is organized.",
    showIcon: true,
  },
  all: {
    message: "No tasks yet.",
    subtext: "Add your first task to get started.",
    showIcon: false,
  },
};

export function EmptyState({ type }: EmptyStateProps) {
  const config = emptyStateConfig[type];

  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-24 text-center',
      'animate-fade-in'
    )}>
      {/* Success indicator for earned empty states */}
      {config.showIcon && (
        <div className="mb-5">
          <CheckCircle2 
            className="h-10 w-10 text-capella-success/40" 
            strokeWidth={1.5}
          />
        </div>
      )}

      {/* Primary Message */}
      <p className="text-[16px] text-text-secondary font-medium mb-2">
        {config.message}
      </p>

      {/* Subtext */}
      {config.subtext && (
        <p className="text-[14px] text-text-muted/60">
          {config.subtext}
        </p>
      )}
    </div>
  );
}
