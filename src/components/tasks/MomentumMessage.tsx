'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface MomentumMessageProps {
  show: boolean;
  onDismiss: () => void;
}

/**
 * Inline momentum message: "Keep going?"
 * - Shows after task completion (600ms delay)
 * - Auto-dismisses after 3 seconds
 * - Never blocks interaction
 */
export function MomentumMessage({ show, onDismiss }: MomentumMessageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (show) {
      // Delay appearance to allow completion animation to finish
      timerRef.current = setTimeout(() => {
        setIsVisible(true);
        setIsExiting(false);
      }, 300);

      // Auto-dismiss after 3 seconds from show
      const dismissTimer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setIsVisible(false);
          onDismiss();
        }, 200);
      }, 3300); // 300ms delay + 3000ms visible

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        clearTimeout(dismissTimer);
      };
    } else {
      setIsExiting(true);
      timerRef.current = setTimeout(() => setIsVisible(false), 200);
    }
  }, [show, onDismiss]);

  if (!isVisible) return null;

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
        'flex items-center justify-center py-4 px-4 mb-4',
        'transition-all duration-300 ease-out',
        isExiting ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
      )}
    >
      <span className="text-[14px] text-text-secondary/70 font-medium">
        Keep going?
      </span>
      <button
        onClick={handleDismiss}
        className={cn(
          'ml-4 text-[12px] text-text-muted/50 px-2 py-1 rounded',
          'hover:text-text-muted/70 hover:bg-white/[0.03] transition-colors',
          'focus:outline-none focus:ring-1 focus:ring-capella-primary/30'
        )}
      >
        Dismiss
      </button>
    </div>
  );
}
