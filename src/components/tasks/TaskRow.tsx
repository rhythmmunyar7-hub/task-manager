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
  isFirstTask?: boolean;
  sectionType?: 'overdue' | 'today' | 'upcoming' | 'inbox' | 'completed';
}

// Priority border colors - subtle left border only for P1/P2
const priorityBorderStyles: Record<TaskPriority, string> = {
  p1: 'border-l-[3px] border-l-capella-warning', // Amber
  p2: 'border-l-[3px] border-l-capella-primary', // Blue  
  p3: '',
  none: '',
};

// Section-based visual authority
const getSectionStyles = (sectionType?: string, isFirstTask?: boolean) => {
  if (sectionType === 'overdue') {
    return isFirstTask 
      ? 'border-l-[4px] border-l-capella-danger' 
      : 'border-l-[3px] border-l-capella-danger/70';
  }
  if (sectionType === 'upcoming' || sectionType === 'inbox') {
    return 'opacity-80';
  }
  if (sectionType === 'completed') {
    return 'opacity-50';
  }
  return '';
};

function isOverdue(task: Task): boolean {
  return task.dueDate === 'overdue';
}

export function TaskRow({ task, onClick, onComplete, isSelected = false, isFirstTask = false, sectionType }: TaskRowProps) {
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
    }, 350);

    setTimeout(() => {
      onComplete(task.id);
    }, 550);
  };

  useEffect(() => {
    setIsCompleting(false);
    setShouldExit(false);
  }, [task.id, task.completed]);

  const isNewTask = isRecentlyAdded(task.id);
  const hasOverdue = isOverdue(task);
  const priorityStyle = sectionType !== 'overdue' ? priorityBorderStyles[task.priority] : '';
  const sectionStyle = getSectionStyles(sectionType, isFirstTask);

  return (
    <div
      onClick={onClick}
      className={cn(
        // Base styles
        'group relative flex cursor-pointer items-center gap-4 rounded-md px-4',
        // First task emphasis in primary sections
        isFirstTask && (sectionType === 'overdue' || sectionType === 'today') 
          ? 'h-16' 
          : 'h-14',
        // Priority border (only P1 and P2, not for overdue)
        priorityStyle,
        // Section-based authority styling
        sectionStyle,
        // Hover state - very subtle
        'transition-all duration-200 hover:bg-bg-elevated/40',
        // Selected state
        isSelected && 'bg-bg-elevated',
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

      {/* Task Title - Visual hierarchy based on position */}
      <span
        className={cn(
          'flex-1 truncate transition-all duration-200',
          // First task in primary sections gets emphasis
          isFirstTask && (sectionType === 'overdue' || sectionType === 'today')
            ? 'text-base font-medium text-text-primary'
            : 'text-[15px] text-text-primary',
          // Completed styling
          (task.completed || isCompleting) && 'text-text-muted line-through'
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
