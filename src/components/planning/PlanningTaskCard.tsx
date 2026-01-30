'use client';

import { useMemo } from 'react';
import { GripVertical, GitBranch, ListTodo } from 'lucide-react';
import { PlanningTask } from '@/types/planning';
import { cn } from '@/lib/utils';
import { getDateStatus, getDateDisplayText } from '@/lib/date-utils';
import { classifyEnergyType } from '@/lib/task-intelligence';
import { EnergyIcon } from '@/components/tasks/EnergyIcon';

interface PlanningTaskCardProps {
  task: PlanningTask;
  onClick: () => void;
  isDragging?: boolean;
  isOver?: boolean;
}

/**
 * Task card for Planning Mode
 * Denser than execution mode, shows:
 * - Title (primary)
 * - Energy icon
 * - Due date indicator (if relevant)
 * - Subtask progress (if exists)
 * - Dependency badge (if exists)
 */
export function PlanningTaskCard({ 
  task, 
  onClick, 
  isDragging = false,
  isOver = false,
}: PlanningTaskCardProps) {
  const energyType = task.energyType || classifyEnergyType(task.title);
  const dateStatus = getDateStatus(task.dueDate);
  const dateDisplay = getDateDisplayText(task.dueDate);
  
  // Subtask progress
  const subtaskProgress = useMemo(() => {
    if (!task.subtasks || task.subtasks.length === 0) return null;
    const completed = task.subtasks.filter(s => s.completed).length;
    return { completed, total: task.subtasks.length };
  }, [task.subtasks]);

  // Show date only if it's relevant (overdue or has specific date)
  const showDate = dateStatus === 'overdue' || (task.dueDate && dateStatus !== 'none');

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative flex items-start gap-2 p-3 rounded-lg cursor-pointer',
        'bg-bg-elevated border border-white/[0.04]',
        'transition-all duration-150',
        'hover:bg-white/[0.04] hover:border-white/[0.08]',
        isDragging && 'opacity-50 scale-[1.02] shadow-lg rotate-1',
        isOver && 'ring-2 ring-capella-primary/40'
      )}
    >
      {/* Drag Handle */}
      <div className="shrink-0 mt-0.5 opacity-0 group-hover:opacity-60 transition-opacity cursor-grab active:cursor-grabbing">
        <GripVertical className="h-4 w-4 text-text-muted" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        {/* Title Row */}
        <div className="flex items-start gap-2">
          <EnergyIcon type={energyType} />
          <span className="flex-1 text-[14px] text-text-primary leading-tight line-clamp-2">
            {task.title}
          </span>
        </div>

        {/* Metadata Row */}
        <div className="flex items-center gap-3 text-[12px] text-text-muted">
          {/* Subtask Progress */}
          {subtaskProgress && (
            <div className="flex items-center gap-1">
              <ListTodo className="h-3 w-3" />
              <span>{subtaskProgress.completed}/{subtaskProgress.total}</span>
            </div>
          )}

          {/* Dependency Badge */}
          {task.project && (
            <div className="flex items-center gap-1">
              <GitBranch className="h-3 w-3" />
              <span className="truncate max-w-[80px]">{task.project.name}</span>
            </div>
          )}

          {/* Due Date */}
          {showDate && (
            <span className={cn(
              'ml-auto',
              dateStatus === 'overdue' && 'text-capella-danger',
              dateStatus === 'today' && 'text-capella-warning'
            )}>
              {dateDisplay}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
