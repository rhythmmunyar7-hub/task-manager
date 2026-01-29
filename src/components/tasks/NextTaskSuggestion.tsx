'use client';

import { useEffect, useState } from 'react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { ArrowRight, X } from 'lucide-react';

interface NextTaskSuggestionProps {
  suggestedTask: Task | null;
  onAccept: (task: Task) => void;
  onDismiss: () => void;
  show: boolean;
}

/**
 * Calm next task suggestion
 * - Max ONE per session
 * - After Focus Task completion
 * - "Ready for [task title]?"
 * - Accept promotes to Focus Task
 * - Dismiss hides suggestion
 */
export function NextTaskSuggestion({
  suggestedTask,
  onAccept,
  onDismiss,
  show,
}: NextTaskSuggestionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (show && suggestedTask) {
      // Delay appearance to avoid competing with momentum message
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsExiting(false);
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setIsExiting(true);
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [show, suggestedTask]);

  if (!isVisible || !suggestedTask) return null;

  const handleAccept = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onAccept(suggestedTask);
    }, 200);
  };

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss();
    }, 200);
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg',
        'bg-white/[0.02] border border-white/[0.04]',
        'transition-all duration-200 ease-out',
        isExiting ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
      )}
    >
      {/* Suggestion text */}
      <span className="flex-1 text-[14px] text-text-secondary/80">
        Ready for{' '}
        <span className="text-text-primary font-medium">
          {suggestedTask.title.length > 40
            ? suggestedTask.title.slice(0, 40) + '...'
            : suggestedTask.title}
        </span>
        ?
      </span>

      {/* Accept button */}
      <button
        onClick={handleAccept}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-md',
          'bg-capella-primary/10 text-capella-primary',
          'text-[13px] font-medium',
          'hover:bg-capella-primary/20 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-capella-primary/30'
        )}
      >
        Start
        <ArrowRight className="h-3.5 w-3.5" />
      </button>

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className={cn(
          'p-1.5 rounded-md',
          'text-text-muted/40 hover:text-text-muted/60',
          'hover:bg-white/[0.03] transition-colors',
          'focus:outline-none focus:ring-1 focus:ring-white/10'
        )}
        aria-label="Dismiss suggestion"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
