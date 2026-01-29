'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface MomentumMessageProps {
  show: boolean;
  onDismiss: () => void;
}

/**
 * Inline momentum message: "Keep going?"
 * - Shows after task completion
 * - Auto-dismisses after 3 seconds
 * - Never blocks interaction
 */
export function MomentumMessage({ show, onDismiss }: MomentumMessageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsExiting(false);

      // Auto-dismiss after 3 seconds
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setIsVisible(false);
          onDismiss();
        }, 200);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setIsExiting(true);
      setTimeout(() => setIsVisible(false), 200);
    }
  }, [show, onDismiss]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'flex items-center justify-center py-3 px-4',
        'transition-all duration-200 ease-out',
        isExiting ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
      )}
    >
      <span className="text-[13px] text-text-muted/70 font-medium">
        Keep going?
      </span>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => {
            setIsVisible(false);
            onDismiss();
          }, 200);
        }}
        className={cn(
          'ml-3 text-[12px] text-text-muted/50',
          'hover:text-text-muted/70 transition-colors',
          'focus:outline-none focus:ring-1 focus:ring-capella-primary/30 rounded px-1'
        )}
      >
        Dismiss
      </button>
    </div>
  );
}
