'use client';

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Task, TaskPriority } from '@/types/task';
import { cn } from '@/lib/utils';
import { useTaskContext } from '@/context/TaskContext';

interface TaskRowProps {
  task: Task;
  onClick: () => void;
  onComplete: (id: string) => void;
  isSelected?: boolean;
}

// Priority border colors - subtle left border only for P1/P2
const priorityBorderStyles: Record<TaskPriority, string> = {
  p1: 'border-l-[3px] border-l-capella-warning', // Amber
  p2: 'border-l-[3px] border-l-capella-primary', // Blue  
  p3: '',
  none: '',
};

function isOverdue(task: Task): boolean {
  return task.dueDate === 'overdue';
}

export function TaskRow({ task, onClick, onComplete, isSelected = false }: TaskRowProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [shouldExit, setShouldExit] = useState(false);
  const { isRecentlyAdded } = useTaskContext();

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (task.completed) {
      onComplete(task.id);
      return;
    }

    setIsCompleting(true);
    
    setTimeout(() => {
      setShouldExit(true);
    }, 300);

    setTimeout(() => {
      onComplete(task.id);
    }, 450);
  };

  useEffect(() => {
    setIsCompleting(false);
    setShouldExit(false);
  }, [task.id, task.completed]);

  const isNewTask = isRecentlyAdded(task.id);
  const hasOverdue = isOverdue(task);
  const priorityStyle = priorityBorderStyles[task.priority];

  return (
    <div
      onClick={onClick}
      className={cn(
        // Base styles - 56px height for comfortable clicking
        'group relative flex h-14 cursor-pointer items-center gap-4 rounded-md px-4',
        // Priority border (only P1 and P2)
        priorityStyle,
        // Hover state - very subtle (4-6% opacity)
        'transition-colors duration-150 hover:bg-bg-elevated/50',
        // Selected state
        isSelected && 'bg-bg-elevated',
        // Completed state - slightly muted
        task.completed && 'opacity-60',
        // Exit animation
        shouldExit && 'task-row-exit',
        // New task fade-in animation
        isNewTask && 'task-row-enter'
      )}
    >
      {/* Checkbox - 20x20px */}
      <button
        onClick={handleCheckboxClick}
        aria-label={task.completed || isCompleting ? `Mark "${task.title}" as incomplete` : `Mark "${task.title}" as complete`}
        className={cn(
          'relative flex h-5 w-5 shrink-0 items-center justify-center rounded',
          'border-2 transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-capella-primary focus:ring-offset-1 focus:ring-offset-bg-main',
          task.completed || isCompleting
            ? 'border-capella-success bg-capella-success'
            : 'border-text-muted/50 bg-transparent hover:border-text-muted'
        )}
      >
        {(task.completed || isCompleting) && (
          <Check className="h-3 w-3 text-black animate-check-fill" />
        )}
      </button>

      {/* Task Title - Clean, no metadata */}
      <span
        className={cn(
          'flex-1 truncate text-[15px]',
          'transition-all duration-150',
          task.completed || isCompleting
            ? 'text-text-muted line-through'
            : 'text-text-primary'
        )}
      >
        {task.title}
      </span>

      {/* Overdue Indicator (small red dot, only when overdue) */}
      {hasOverdue && !task.completed && (
        <div className="h-1.5 w-1.5 rounded-full bg-capella-danger" />
      )}
    </div>
  );
}
