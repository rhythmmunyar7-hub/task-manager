'use client';

import { Task } from '@/types/task';
import { TriageHelperText } from '@/types/triage';
import { cn } from '@/lib/utils';
import { classifyEnergyType } from '@/lib/task-intelligence';
import { EnergyIcon } from '@/components/tasks/EnergyIcon';

interface TriageTaskCardProps {
  task: Task;
  helperText: TriageHelperText;
  isExiting?: boolean;
  exitDirection?: 'left' | 'right' | 'down';
}

export function TriageTaskCard({ 
  task, 
  helperText, 
  isExiting = false,
  exitDirection = 'right'
}: TriageTaskCardProps) {
  const energyType = task.energyType || classifyEnergyType(task.title);

  const exitAnimationClass = isExiting 
    ? exitDirection === 'left' 
      ? 'triage-exit-left'
      : exitDirection === 'down'
        ? 'triage-exit-down'
        : 'triage-exit-right'
    : '';

  return (
    <div 
      className={cn(
        'w-full max-w-md mx-auto',
        'animate-in fade-in slide-in-from-bottom-4 duration-300',
        exitAnimationClass
      )}
    >
      {/* Main Card */}
      <div 
        className={cn(
          'p-8 rounded-2xl',
          'bg-white/[0.03] border border-white/[0.06]',
          'transition-all duration-300'
        )}
      >
        {/* Energy indicator */}
        <div className="flex items-center gap-2 mb-4">
          <EnergyIcon type={energyType} size="lg" />
          {task.project && (
            <span className="text-[13px] text-text-muted">
              {task.project.name}
            </span>
          )}
        </div>

        {/* Task Title - Large, calm */}
        <h2 className="text-2xl font-medium text-text-primary leading-relaxed mb-6">
          {task.title}
        </h2>

        {/* Helper Text - Neutral, informational */}
        <p className="text-[14px] text-text-muted">
          {helperText.primary}
          {helperText.secondary && (
            <span className="ml-2 opacity-60">· {helperText.secondary}</span>
          )}
        </p>
      </div>
    </div>
  );
}
