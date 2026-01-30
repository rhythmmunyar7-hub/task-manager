'use client';

import { useState } from 'react';
import { Play, Zap, X } from 'lucide-react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { FOCUS_SPRINT_MAX_TASKS, FOCUS_SPRINT_TIMER_OPTIONS } from '@/types/focus-sprint';
import { classifyEnergyType } from '@/lib/task-intelligence';
import { EnergyIcon } from '@/components/tasks/EnergyIcon';

interface FocusSprintEntryProps {
  selectedTasks: Task[];
  onRemoveTask: (taskId: string) => void;
  onStart: (timerDuration: 25 | 50 | null) => void;
  onCancel: () => void;
  validationError?: string;
}

export function FocusSprintEntry({
  selectedTasks,
  onRemoveTask,
  onStart,
  onCancel,
  validationError,
}: FocusSprintEntryProps) {
  const [selectedTimer, setSelectedTimer] = useState<25 | 50 | null>(null);

  const canStart = selectedTasks.length > 0 && selectedTasks.length <= FOCUS_SPRINT_MAX_TASKS;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onCancel}
    >
      <div 
        className={cn(
          'bg-bg-elevated border border-white/[0.06] rounded-xl p-8 max-w-lg w-full mx-4',
          'animate-in zoom-in-95 fade-in duration-200'
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-capella-primary/10">
            <Zap className="h-5 w-5 text-capella-primary" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-lg font-medium text-text-primary">
              Start Focus Sprint
            </h2>
            <p className="text-[13px] text-text-muted">
              Complete these tasks without distraction
            </p>
          </div>
        </div>

        {/* Selected Tasks */}
        <div className="mb-6">
          <p className="text-[12px] text-text-muted uppercase tracking-wide mb-3">
            Selected tasks ({selectedTasks.length}/{FOCUS_SPRINT_MAX_TASKS})
          </p>
          
          {selectedTasks.length === 0 ? (
            <p className="text-[14px] text-text-muted py-4 text-center">
              No tasks selected. Select 1-3 tasks to start.
            </p>
          ) : (
            <div className="space-y-2">
              {selectedTasks.map((task, index) => {
                const energyType = task.energyType || classifyEnergyType(task.title);
                return (
                  <div
                    key={task.id}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg',
                      'bg-white/[0.03] border border-white/[0.04]'
                    )}
                  >
                    {/* Order number */}
                    <span className="text-[12px] text-text-muted font-mono">
                      {index + 1}
                    </span>
                    
                    {/* Energy icon */}
                    <EnergyIcon type={energyType} />

                    {/* Title */}
                    <span className="flex-1 text-[14px] text-text-primary truncate">
                      {task.title}
                    </span>

                    {/* Remove button */}
                    <button
                      onClick={() => onRemoveTask(task.id)}
                      className={cn(
                        'p-1 rounded hover:bg-white/[0.06]',
                        'text-text-muted hover:text-text-secondary',
                        'transition-colors duration-150'
                      )}
                      aria-label={`Remove ${task.title}`}
                    >
                      <X className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Validation error */}
          {validationError && (
            <p className="text-[13px] text-capella-danger mt-3">
              {validationError}
            </p>
          )}
        </div>

        {/* Timer Options (Optional) */}
        <div className="mb-8">
          <p className="text-[12px] text-text-muted uppercase tracking-wide mb-3">
            Timer (optional)
          </p>
          <div className="flex gap-2">
            {FOCUS_SPRINT_TIMER_OPTIONS.map(duration => (
              <button
                key={duration}
                onClick={() => setSelectedTimer(prev => prev === duration ? null : duration)}
                className={cn(
                  'px-4 py-2 rounded-lg text-[14px] transition-all duration-150',
                  selectedTimer === duration
                    ? 'bg-capella-primary/20 text-capella-primary border border-capella-primary/30'
                    : 'bg-white/[0.04] text-text-muted hover:bg-white/[0.06] hover:text-text-secondary'
                )}
              >
                {duration} min
              </button>
            ))}
            <button
              onClick={() => setSelectedTimer(null)}
              className={cn(
                'px-4 py-2 rounded-lg text-[14px] transition-all duration-150',
                selectedTimer === null
                  ? 'bg-white/[0.08] text-text-primary'
                  : 'text-text-muted hover:text-text-secondary'
              )}
            >
              No timer
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className={cn(
              'flex-1 px-4 py-3 rounded-lg',
              'bg-white/[0.04] text-text-secondary',
              'hover:bg-white/[0.06] hover:text-text-primary',
              'transition-colors duration-150'
            )}
          >
            Cancel
          </button>
          <button
            onClick={() => onStart(selectedTimer)}
            disabled={!canStart}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg',
              'font-medium transition-all duration-150',
              canStart
                ? 'bg-capella-primary text-black hover:bg-capella-primary/90'
                : 'bg-white/[0.04] text-text-muted cursor-not-allowed'
            )}
          >
            <Play className="h-4 w-4" strokeWidth={2.5} />
            Start Sprint
          </button>
        </div>
      </div>
    </div>
  );
}
