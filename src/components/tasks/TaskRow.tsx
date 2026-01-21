'use client';

import { useState, useEffect } from 'react';
import { Check, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Task, TaskPriority } from '@/types/task';
import { cn } from '@/lib/utils';
import { useTaskContext } from '@/context/TaskContext';

interface TaskRowProps {
  task: Task;
  onClick: () => void;
  onComplete: (id: string) => void;
  isSelected?: boolean;
}

// Priority border colors
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
  const [showHoverActions, setShowHoverActions] = useState(false);
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
    }, 400);

    setTimeout(() => {
      onComplete(task.id);
    }, 600);
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
      onMouseEnter={() => setShowHoverActions(true)}
      onMouseLeave={() => setShowHoverActions(false)}
      className={cn(
        // Base styles - 48px height
        'group relative flex h-12 cursor-pointer items-center gap-4 rounded-md px-4',
        // Priority border (only P1 and P2)
        priorityStyle,
        // Hover state - calm gray
        'transition-colors duration-200 hover:bg-bg-elevated',
        // Selected state
        isSelected && 'bg-bg-elevated border-l-[3px] border-l-capella-primary',
        // Completed state
        task.completed && 'opacity-50',
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
          'border-2 transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-capella-primary focus:ring-offset-1 focus:ring-offset-bg-main',
          task.completed || isCompleting
            ? 'border-capella-success bg-capella-success'
            : 'border-text-muted bg-transparent hover:border-text-secondary'
        )}
      >
        {(task.completed || isCompleting) && (
          <Check className="h-3 w-3 text-white animate-check-fill" />
        )}
      </button>

      {/* Task Title */}
      <span
        className={cn(
          'flex-1 truncate text-[15px]',
          'transition-all duration-200',
          task.completed || isCompleting
            ? 'text-text-muted line-through'
            : 'text-text-primary'
        )}
      >
        {task.title}
      </span>

      {/* Overdue Indicator (small red dot) */}
      {hasOverdue && !task.completed && (
        <div className="h-2 w-2 rounded-full bg-capella-danger" />
      )}

      {/* Hover Actions (visible only on hover) */}
      <div 
        className={cn(
          'flex items-center gap-2 transition-opacity duration-150',
          showHoverActions ? 'opacity-100' : 'opacity-0'
        )}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="p-1 text-text-muted transition-colors hover:text-text-secondary"
          aria-label="Edit task"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            // Could trigger delete confirmation
          }}
          className="p-1 text-text-muted transition-colors hover:text-capella-danger"
          aria-label="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-1 text-text-muted transition-colors hover:text-text-secondary"
          aria-label="More options"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
