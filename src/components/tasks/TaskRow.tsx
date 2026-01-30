'use client';

import { useState, useEffect } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { useTaskContext } from '@/context/TaskContext';
import { getDateStatus, getDateDisplayText, DateStatus } from '@/lib/date-utils';

interface TaskRowProps {
  task: Task;
  onClick: () => void;
  onComplete: (id: string) => void;
  isSelected?: boolean;
  isKeyboardSelected?: boolean;
  isFocus?: boolean;
}

// Date status to color mapping - using design system tokens
const dateStatusStyles: Record<DateStatus, string> = {
  overdue: 'text-capella-danger',
  today: 'text-capella-warning',
  tomorrow: 'text-text-secondary',
  upcoming: 'text-text-muted',
  future: 'text-text-muted',
  none: 'text-text-muted',
};

export function TaskRow({ 
  task, 
  onClick, 
  onComplete, 
  isSelected = false,
  isKeyboardSelected = false,
  isFocus = false 
}: TaskRowProps) {
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
  const isCompleted = task.completed || isCompleting;
  
  // Date display logic
  const dateStatus = getDateStatus(task.dueDate);
  const dateDisplay = getDateDisplayText(task.dueDate);
  const showUrgencyIcon = dateStatus === 'overdue';

  return (
    <div
      onClick={onClick}
      className={cn(
        // Base styles - FIXED HEIGHT for stability (no layout shift)
        'group relative flex cursor-pointer items-center gap-4 rounded-lg transition-all duration-200',
        'h-14 px-4', // Consistent 56px height always
        
        // Focus task gets subtle emphasis (NO height change)
        isFocus && 'bg-white/[0.03] border-l-2 border-l-capella-primary/60 shadow-sm',
        
        // Standard hover
        !isFocus && 'hover:bg-white/[0.03]',
        
        // Selected state (click)
        isSelected && 'bg-white/[0.05]',
        
        // Keyboard navigation selection
        isKeyboardSelected && 'ring-1 ring-capella-primary/50 ring-offset-1 ring-offset-bg-main bg-white/[0.03]',
        
        // Completed tasks visually recede but keep height stable
        isCompleted && 'opacity-50',
        
        // Exit animation
        shouldExit && 'task-row-exit',
        
        // New task animation
        isNewTask && 'task-row-enter'
      )}
    >
      {/* Checkbox - 20x20px consistent */}
      <button
        onClick={handleCheckboxClick}
        aria-label={isCompleted ? `Mark "${task.title}" as incomplete` : `Mark "${task.title}" as complete`}
        className={cn(
          'relative flex shrink-0 items-center justify-center rounded-full',
          'h-5 w-5 border-[1.5px] transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-capella-primary/30 focus:ring-offset-2 focus:ring-offset-bg-main',
          
          isCompleted
            ? 'border-capella-success bg-capella-success'
            : 'border-text-muted/40 bg-transparent hover:border-text-muted/60'
        )}
      >
        {isCompleted && (
          <Check 
            className="h-3 w-3 text-black animate-check-fill"
            strokeWidth={3}
          />
        )}
      </button>

      {/* Task Title - Primary element with flex-1 */}
      <span
        className={cn(
          'flex-1 truncate transition-all duration-200',
          'text-[15px]',
          
          // Focus task gets subtle weight boost
          isFocus ? 'font-medium text-text-primary' : 'text-text-primary/90',
          
          // Completed styling
          isCompleted && 'text-text-muted line-through'
        )}
      >
        {task.title}
      </span>

      {/* Due Date Signal - Always visible when set, scannable */}
      {dateDisplay && !isCompleted && (
        <div 
          className={cn(
            'flex items-center gap-1.5 shrink-0',
            'text-[13px] font-medium',
            dateStatusStyles[dateStatus]
          )}
        >
          {showUrgencyIcon && (
            <AlertCircle className="h-3.5 w-3.5" strokeWidth={2} />
          )}
          <span>{dateDisplay}</span>
        </div>
      )}
    </div>
  );
}
