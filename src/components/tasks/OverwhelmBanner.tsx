'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OverwhelmBannerProps {
  message: string;
  show: boolean;
}

/**
 * Calm overwhelm intervention banner
 * - Appears when user has too many tasks
 * - Gently encourages focus on top 3
 * - Smooth entrance and exit transitions
 */
export function OverwhelmBanner({ message, show }: OverwhelmBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsExiting(false);
    } else if (isVisible) {
      // Smooth exit animation
      setIsExiting(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsExiting(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [show, isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'flex items-center justify-center py-4 px-5 mb-6 rounded-lg',
        'bg-amber-500/5 border border-amber-500/10',
        'transition-all duration-300 ease-out',
        isExiting 
          ? 'opacity-0 translate-y-[-8px]' 
          : 'opacity-100 translate-y-0 animate-fade-in'
      )}
    >
      <span className="text-[14px] text-amber-400/80 font-medium text-center">
        {message}
      </span>
    </div>
  );
}
