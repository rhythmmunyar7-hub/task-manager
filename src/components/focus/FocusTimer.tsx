'use client';

import { Pause, Play, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FocusTimerProps {
  enabled: boolean;
  duration: 25 | 50;
  remaining: number | null;
  paused: boolean;
  onToggle: () => void;
  onSetDuration: (duration: 25 | 50) => void;
  onPause: () => void;
  onResume: () => void;
  onHide: () => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function FocusTimer({
  enabled,
  duration,
  remaining,
  paused,
  onToggle,
  onSetDuration,
  onPause,
  onResume,
  onHide,
}: FocusTimerProps) {
  if (!enabled) {
    // Collapsed state - show option to enable
    return (
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onToggle}
          className={cn(
            'text-[13px] text-text-muted hover:text-text-secondary',
            'transition-colors duration-150'
          )}
        >
          Add timer
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => {
              onSetDuration(25);
              onToggle();
            }}
            className={cn(
              'px-3 py-1.5 rounded-md text-[13px]',
              'bg-white/[0.04] text-text-muted',
              'hover:bg-white/[0.06] hover:text-text-secondary',
              'transition-all duration-150'
            )}
          >
            25 min
          </button>
          <button
            onClick={() => {
              onSetDuration(50);
              onToggle();
            }}
            className={cn(
              'px-3 py-1.5 rounded-md text-[13px]',
              'bg-white/[0.04] text-text-muted',
              'hover:bg-white/[0.06] hover:text-text-secondary',
              'transition-all duration-150'
            )}
          >
            50 min
          </button>
        </div>
      </div>
    );
  }

  const isLow = remaining !== null && remaining <= 300; // 5 minutes
  const isComplete = remaining === 0;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Timer Display */}
      <div 
        className={cn(
          'text-4xl font-light tracking-wider tabular-nums',
          'transition-colors duration-300',
          isComplete 
            ? 'text-capella-success' 
            : isLow 
              ? 'text-capella-warning' 
              : 'text-text-secondary'
        )}
      >
        {remaining !== null ? formatTime(remaining) : formatTime(duration * 60)}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Duration toggles */}
        <div className="flex gap-1 mr-4">
          <button
            onClick={() => onSetDuration(25)}
            className={cn(
              'px-2.5 py-1 rounded text-[12px] transition-all duration-150',
              duration === 25
                ? 'bg-white/[0.08] text-text-primary'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            25m
          </button>
          <button
            onClick={() => onSetDuration(50)}
            className={cn(
              'px-2.5 py-1 rounded text-[12px] transition-all duration-150',
              duration === 50
                ? 'bg-white/[0.08] text-text-primary'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            50m
          </button>
        </div>

        {/* Play/Pause */}
        <button
          onClick={paused ? onResume : onPause}
          className={cn(
            'p-2 rounded-full transition-all duration-150',
            'bg-white/[0.06] hover:bg-white/[0.10]',
            'text-text-secondary hover:text-text-primary'
          )}
          aria-label={paused ? 'Resume timer' : 'Pause timer'}
        >
          {paused ? (
            <Play className="h-4 w-4" strokeWidth={2} />
          ) : (
            <Pause className="h-4 w-4" strokeWidth={2} />
          )}
        </button>

        {/* Hide timer */}
        <button
          onClick={onHide}
          className={cn(
            'p-2 rounded-full transition-all duration-150',
            'hover:bg-white/[0.06]',
            'text-text-muted hover:text-text-secondary'
          )}
          aria-label="Hide timer"
        >
          <EyeOff className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
