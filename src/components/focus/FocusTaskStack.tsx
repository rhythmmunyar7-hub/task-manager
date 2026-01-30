'use client';

import { Check } from 'lucide-react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { classifyEnergyType } from '@/lib/task-intelligence';
import { EnergyIcon } from '@/components/tasks/EnergyIcon';

interface FocusTaskStackProps {
  currentTask: Task;
  remainingTasks: Task[];
  onComplete: () => void;
}

export function FocusTaskStack({ 
  currentTask, 
  remainingTasks, 
  onComplete 
}: FocusTaskStackProps) {
  const energyType = currentTask.energyType || classifyEnergyType(currentTask.title);

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-xl mx-auto">
      {/* Current Task - Dominant */}
      <div className="w-full">
        <div 
          className={cn(
            'group flex items-center gap-4 p-6 rounded-xl',
            'bg-white/[0.03] border border-white/[0.06]',
            'transition-all duration-300'
          )}
        >
          {/* Large Checkbox */}
          <button
            onClick={onComplete}
            className={cn(
              'relative flex shrink-0 items-center justify-center rounded-full',
              'h-8 w-8 border-2 transition-all duration-200',
              'border-text-muted/40 bg-transparent',
              'hover:border-capella-success hover:bg-capella-success/10',
              'focus:outline-none focus:ring-2 focus:ring-capella-primary/30 focus:ring-offset-4 focus:ring-offset-bg-main'
            )}
            aria-label={`Complete "${currentTask.title}"`}
          >
            <Check 
              className="h-4 w-4 text-text-muted/40 group-hover:text-capella-success transition-colors"
              strokeWidth={2.5}
            />
          </button>

          {/* Energy Icon */}
          <span className="shrink-0">
            <EnergyIcon type={energyType} size="lg" />
          </span>

          {/* Task Title - Large, readable */}
          <span className="flex-1 text-xl font-medium text-text-primary leading-relaxed">
            {currentTask.title}
          </span>
        </div>

        {/* Keyboard hint */}
        <p className="text-center mt-4 text-[13px] text-text-muted">
          Press <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-text-secondary font-mono text-[11px]">X</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-text-secondary font-mono text-[11px]">Space</kbd> to complete
        </p>
      </div>

      {/* Remaining Tasks - Muted, reassuring */}
      {remainingTasks.length > 0 && (
        <div className="w-full space-y-2">
          <p className="text-[12px] text-text-muted uppercase tracking-wide mb-3">
            Up next
          </p>
          {remainingTasks.map((task, index) => {
            const taskEnergy = task.energyType || classifyEnergyType(task.title);
            return (
              <div
                key={task.id}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg',
                  'bg-white/[0.01]',
                  'opacity-50 transition-opacity duration-200',
                  index === 0 && 'opacity-60'
                )}
              >
                {/* Placeholder checkbox */}
                <div className="h-5 w-5 rounded-full border border-text-muted/20 shrink-0" />
                
                {/* Energy icon */}
                <span className="shrink-0 opacity-50">
                  <EnergyIcon type={taskEnergy} />
                </span>

                {/* Title */}
                <span className="flex-1 text-[15px] text-text-muted truncate">
                  {task.title}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
