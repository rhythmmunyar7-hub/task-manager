'use client';

import { useEffect, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { Task } from '@/types/task';
import { TriageDestination, TriageHelperText } from '@/types/triage';
import { cn } from '@/lib/utils';
import { TriageTaskCard } from './TriageTaskCard';
import { TriageDecisions } from './TriageDecisions';

interface TriageModeProps {
  currentTask: Task | null;
  helperText: TriageHelperText | null;
  suggestedDestination: TriageDestination;
  reviewedCount: number;
  totalTasks: number;
  onKeep: (destination: TriageDestination) => void;
  onLater: () => void;
  onArchive: () => void;
  onEnd: () => void;
}

export function TriageMode({
  currentTask,
  helperText,
  suggestedDestination,
  reviewedCount,
  totalTasks,
  onKeep,
  onLater,
  onArchive,
  onEnd,
}: TriageModeProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | 'down'>('right');
  const [taskKey, setTaskKey] = useState(currentTask?.id || 'initial');

  // Animate task exit and update key for new task
  const handleDecision = useCallback((
    action: () => void,
    direction: 'left' | 'right' | 'down'
  ) => {
    setExitDirection(direction);
    setIsExiting(true);
    
    setTimeout(() => {
      action();
      setIsExiting(false);
    }, 250);
  }, []);

  const handleKeep = useCallback((destination: TriageDestination) => {
    handleDecision(() => onKeep(destination), 'right');
  }, [handleDecision, onKeep]);

  const handleLater = useCallback(() => {
    handleDecision(onLater, 'down');
  }, [handleDecision, onLater]);

  const handleArchive = useCallback(() => {
    handleDecision(onArchive, 'left');
  }, [handleDecision, onArchive]);

  // Update task key when task changes
  useEffect(() => {
    if (currentTask?.id && currentTask.id !== taskKey) {
      setTaskKey(currentTask.id);
    }
  }, [currentTask?.id, taskKey]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentTask) return;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          handleKeep(suggestedDestination);
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleLater();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleArchive();
          break;
        case 'Escape':
          e.preventDefault();
          onEnd();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTask, suggestedDestination, handleKeep, handleLater, handleArchive, onEnd]);

  if (!currentTask || !helperText) {
    return null;
  }

  return (
    <div 
      className={cn(
        'fixed inset-0 z-50 flex flex-col',
        'bg-bg-main',
        'animate-in fade-in duration-300'
      )}
    >
      {/* Minimal header */}
      <header className="flex items-center justify-between px-8 py-4">
        {/* Progress - Subtle */}
        <p className="text-[13px] text-text-muted">
          {reviewedCount + 1} of {totalTasks}
        </p>

        {/* End button */}
        <button
          onClick={onEnd}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-md',
            'text-[13px] text-text-muted',
            'hover:text-text-secondary hover:bg-white/[0.04]',
            'transition-colors duration-150'
          )}
          aria-label="End triage"
        >
          <X className="h-4 w-4" strokeWidth={2} />
          <span>End Triage</span>
        </button>
      </header>

      {/* Main content - Centered */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 pb-16">
        {/* Task Card */}
        <TriageTaskCard
          key={taskKey}
          task={currentTask}
          helperText={helperText}
          isExiting={isExiting}
          exitDirection={exitDirection}
        />

        {/* Decision Buttons */}
        {!isExiting && (
          <TriageDecisions
            suggestedDestination={suggestedDestination}
            onKeep={handleKeep}
            onLater={handleLater}
            onArchive={handleArchive}
          />
        )}
      </main>
    </div>
  );
}
