'use client';

import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TriageExitMessageProps {
  show: boolean;
  reviewedCount: number;
  onDismiss: () => void;
}

export function TriageExitMessage({ show, reviewedCount, onDismiss }: TriageExitMessageProps) {
  // Auto-dismiss
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onDismiss, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onDismiss]);

  if (!show) return null;

  const message = reviewedCount === 0
    ? 'Triage complete.'
    : reviewedCount === 1
      ? '1 task reviewed.'
      : `${reviewedCount} tasks reviewed.`;

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
        <CheckCircle2 
          className="h-14 w-14 text-capella-success/80 animate-in zoom-in duration-500" 
          strokeWidth={1.5}
        />

        {/* Message - Single line only */}
        <p className="text-xl font-light text-text-primary tracking-wide">
          {message}
        </p>
      </div>
    </div>
  );
}
