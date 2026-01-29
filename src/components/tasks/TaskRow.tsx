'use client';

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { useTaskContext } from '@/context/TaskContext';

interface TaskRowProps {
  task: Task;
  onClick: () => void;
  onComplete: (id: string) => void;
  isSelected?: boolean;
  isKeyboardSelected?: boolean;
  isFocus?: boolean;
}

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

  return (
    <div
      onClick={onClick}
      className={cn(
        // Base styles - clean, calm
        'group relative flex cursor-pointer items-center gap-4 rounded-lg transition-all duration-200',
        
        // Height based on focus state
        isFocus ? 'h-[72px] px-5' : 'h-14 px-4',
        
        // Focus task gets subtle emphasis
        isFocus && 'bg-white/[0.02] border-l-2 border-l-capella-primary/60',
        
        // Standard hover
        !isFocus && 'hover:bg-white/[0.03]',
        
        // Selected state (click)
        isSelected && 'bg-white/[0.05]',
        
        // Keyboard navigation selection - subtle ring
        isKeyboardSelected && !isSelected && 'ring-1 ring-capella-primary/40 bg-white/[0.02]',
        
        // Completed tasks visually compress
        isCompleted && !isFocus && 'h-11 opacity-50',
        
        // Exit animation
        shouldExit && 'task-row-exit',
        
        // New task animation
        isNewTask && 'task-row-enter'
      )}
    >
      {/* Premium Checkbox - 22x22px for focus, 18x18px standard */}
      <button
        onClick={handleCheckboxClick}
        aria-label={isCompleted ? `Mark "${task.title}" as incomplete` : `Mark "${task.title}" as complete`}
        className={cn(
          'relative flex shrink-0 items-center justify-center rounded-full',
          'border-[1.5px] transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-capella-primary/30 focus:ring-offset-2 focus:ring-offset-bg-main',
          
          // Size
          isFocus ? 'h-6 w-6' : 'h-5 w-5',
          
          // States
          isCompleted
            ? 'border-capella-success bg-capella-success'
            : 'border-text-muted/40 bg-transparent hover:border-text-muted/60'
        )}
      >
        {isCompleted && (
          <Check 
            className={cn(
              'text-black animate-check-fill',
              isFocus ? 'h-3.5 w-3.5' : 'h-3 w-3'
            )} 
            strokeWidth={3}
          />
        )}
      </button>

      {/* Task Title - Hero element */}
      <span
        className={cn(
          'flex-1 truncate transition-all duration-200',
          
          // Typography based on focus state
          isFocus 
            ? 'text-[17px] font-medium text-text-primary leading-relaxed'
            : 'text-[15px] text-text-primary/90',
          
          // Completed styling
          isCompleted && 'text-text-muted line-through'
        )}
      >
        {task.title}
      </span>
    </div>
  );
}
