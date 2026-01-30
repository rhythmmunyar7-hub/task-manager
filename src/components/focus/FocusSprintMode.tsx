'use client';

import { useEffect, useCallback, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FocusTaskStack } from './FocusTaskStack';
import { FocusTimer } from './FocusTimer';

interface FocusSprintModeProps {
  currentTask: any;
  remainingTasks: any[];
  completedCount: number;
  totalCount: number;
  timerEnabled: boolean;
  timerDuration: 25 | 50;
  timerRemaining: number | null;
  timerPaused: boolean;
  onComplete: () => void;
  onEnd: () => void;
  onToggleTimer: () => void;
  onSetTimerDuration: (duration: 25 | 50) => void;
  onPauseTimer: () => void;
  onResumeTimer: () => void;
  onHideTimer: () => void;
}

export function FocusSprintMode({
  currentTask,
  remainingTasks,
  completedCount,
  totalCount,
  timerEnabled,
  timerDuration,
  timerRemaining,
  timerPaused,
  onComplete,
  onEnd,
  onToggleTimer,
  onSetTimerDuration,
  onPauseTimer,
  onResumeTimer,
  onHideTimer,
}: FocusSprintModeProps) {
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture if in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'x':
        case ' ':
          e.preventDefault();
          onComplete();
          break;
        case 'escape':
          e.preventDefault();
          if (showExitConfirm) {
            setShowExitConfirm(false);
          } else {
            setShowExitConfirm(true);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onComplete, showExitConfirm]);

  const handleConfirmExit = useCallback(() => {
    setShowExitConfirm(false);
    onEnd();
  }, [onEnd]);

  const handleCancelExit = useCallback(() => {
    setShowExitConfirm(false);
  }, []);

  if (!currentTask) return null;

  return (
    <div 
      className={cn(
        'fixed inset-0 z-50 flex flex-col',
        'bg-bg-main',
        'animate-in fade-in duration-300'
      )}
    >
      {/* Minimal header - just exit button */}
      <header className="flex items-center justify-between px-8 py-4">
        {/* Progress indicator - subtle */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalCount }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 w-8 rounded-full transition-colors duration-300',
                i < completedCount 
                  ? 'bg-capella-success' 
                  : i === completedCount 
                    ? 'bg-capella-primary' 
                    : 'bg-white/[0.08]'
              )}
            />
          ))}
        </div>

        {/* Exit button */}
        <button
          onClick={() => setShowExitConfirm(true)}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-md',
            'text-[13px] text-text-muted',
            'hover:text-text-secondary hover:bg-white/[0.04]',
            'transition-colors duration-150'
          )}
          aria-label="End sprint"
        >
          <X className="h-4 w-4" strokeWidth={2} />
          <span>End Sprint</span>
        </button>
      </header>

      {/* Main content - centered, spacious */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 pb-16">
        {/* Timer (if enabled) - Secondary, above tasks */}
        <div className="mb-12">
          <FocusTimer
            enabled={timerEnabled}
            duration={timerDuration}
            remaining={timerRemaining}
            paused={timerPaused}
            onToggle={onToggleTimer}
            onSetDuration={onSetTimerDuration}
            onPause={onPauseTimer}
            onResume={onResumeTimer}
            onHide={onHideTimer}
          />
        </div>

        {/* Task Stack - Central focus */}
        <FocusTaskStack
          currentTask={currentTask}
          remainingTasks={remainingTasks}
          onComplete={onComplete}
        />
      </main>

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={handleCancelExit}
        >
          <div 
            className={cn(
              'bg-bg-elevated border border-white/[0.06] rounded-xl p-6 max-w-sm w-full mx-4',
              'animate-in zoom-in-95 duration-200'
            )}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium text-text-primary mb-2">
              End Focus Sprint?
            </h3>
            <p className="text-[14px] text-text-secondary mb-6">
              You have {totalCount - completedCount} {totalCount - completedCount === 1 ? 'task' : 'tasks'} remaining.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelExit}
                className={cn(
                  'flex-1 px-4 py-2.5 rounded-lg',
                  'bg-white/[0.04] text-text-secondary',
                  'hover:bg-white/[0.06] hover:text-text-primary',
                  'transition-colors duration-150'
                )}
              >
                Keep Going
              </button>
              <button
                onClick={handleConfirmExit}
                className={cn(
                  'flex-1 px-4 py-2.5 rounded-lg',
                  'bg-capella-danger/20 text-capella-danger',
                  'hover:bg-capella-danger/30',
                  'transition-colors duration-150'
                )}
              >
                End Sprint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
