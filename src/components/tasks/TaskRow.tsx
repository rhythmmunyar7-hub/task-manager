'use client';

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';

interface TaskRowProps {
  task: Task;
  onClick: () => void;
  onComplete: (id: string) => void;
}

const projectColors: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-300' },
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-300' },
  green: { bg: 'bg-green-500/20', text: 'text-green-300' },
  orange: { bg: 'bg-orange-500/20', text: 'text-orange-300' },
  pink: { bg: 'bg-pink-500/20', text: 'text-pink-300' },
  yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-300' },
};

function formatDueDate(dueDate: string): { text: string; isOverdue: boolean } {
  if (dueDate === 'today') {
    return { text: 'Today', isOverdue: false };
  }
  if (dueDate === 'overdue') {
    return { text: 'Overdue', isOverdue: true };
  }

  const date = new Date(dueDate);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === tomorrow.toDateString()) {
    return { text: 'Tomorrow', isOverdue: false };
  }

  return {
    text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    isOverdue: date < today,
  };
}

export function TaskRow({ task, onClick, onComplete }: TaskRowProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [shouldExit, setShouldExit] = useState(false);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (task.completed) {
      // Uncomplete immediately
      onComplete(task.id);
      return;
    }

    // Start completion animation
    setIsCompleting(true);
    
    // After animation, trigger exit
    setTimeout(() => {
      setShouldExit(true);
    }, 300);

    // Complete the task after exit animation
    setTimeout(() => {
      onComplete(task.id);
    }, 500);
  };

  // Reset state when task changes
  useEffect(() => {
    setIsCompleting(false);
    setShouldExit(false);
  }, [task.id, task.completed]);

  const projectColor = task.project?.color
    ? projectColors[task.project.color]
    : null;

  const dueDateInfo = task.dueDate ? formatDueDate(task.dueDate) : null;

  return (
    <div
      onClick={onClick}
      className={cn(
        'group flex h-12 cursor-pointer items-center gap-4 rounded-lg px-4 transition-all duration-100',
        'hover:bg-surface-hover',
        task.completed && 'opacity-50',
        shouldExit && 'task-row-exit'
      )}
    >
      {/* Checkbox */}
      <button
        onClick={handleCheckboxClick}
        className={cn(
          'relative flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200',
          task.completed || isCompleting
            ? 'border-success bg-success'
            : 'border-primary bg-transparent hover:bg-primary/10'
        )}
      >
        {(task.completed || isCompleting) && (
          <Check className="h-4 w-4 text-success-foreground animate-check-fill" />
        )}
      </button>

      {/* Task Title */}
      <span
        className={cn(
          'flex-1 truncate text-base font-medium transition-all duration-300',
          task.completed || isCompleting
            ? 'text-muted-foreground line-through'
            : 'text-foreground'
        )}
      >
        {task.title}
      </span>

      {/* Metadata */}
      <div className="flex items-center gap-3">
        {/* Project Tag */}
        {projectColor && task.project && (
          <span
            className={cn(
              'rounded-full px-2 py-1 text-xs',
              projectColor.bg,
              projectColor.text
            )}
          >
            {task.project.name}
          </span>
        )}

        {/* Due Date */}
        {dueDateInfo && !task.completed && (
          <span
            className={cn(
              'text-xs',
              dueDateInfo.isOverdue ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {dueDateInfo.text}
          </span>
        )}
      </div>
    </div>
  );
}
