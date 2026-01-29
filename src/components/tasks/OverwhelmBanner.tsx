'use client';

import { cn } from '@/lib/utils';

interface OverwhelmBannerProps {
  message: string;
  show: boolean;
}

/**
 * Calm overwhelm intervention banner
 * - Appears when user has too many tasks
 * - Gently encourages focus on top 3
 */
export function OverwhelmBanner({ message, show }: OverwhelmBannerProps) {
  if (!show) return null;

  return (
    <div
      className={cn(
        'flex items-center justify-center py-4 px-5 mb-6 rounded-lg',
        'bg-amber-500/5 border border-amber-500/10',
        'animate-fade-in'
      )}
    >
      <span className="text-[14px] text-amber-400/80 font-medium text-center">
        {message}
      </span>
    </div>
  );
}
