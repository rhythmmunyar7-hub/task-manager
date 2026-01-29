'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Task } from '@/types/task';
import { TaskRow } from './TaskRow';
import { cn } from '@/lib/utils';

interface TaskSectionProps {
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskComplete: (id: string) => void;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  selectedTaskId?: string;
  keyboardSelectedId?: string | null;
  variant?: 'primary' | 'secondary' | 'muted';
  focusTaskId?: string | null;
}

export function TaskSection({
  title,
  tasks,
  onTaskClick,
  onTaskComplete,
  collapsible = false,
  defaultCollapsed = false,
  selectedTaskId,
  keyboardSelectedId,
  variant = 'primary',
  focusTaskId,
}: TaskSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const handleHeaderClick = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  // Empty sections collapse silently
  if (tasks.length === 0) {
    return null;
  }

  // Single task: don't over-emphasize focus styling
  const isSingleTask = tasks.length === 1;

  return (
    <section className="mb-8">
      {/* Section Header - Calm, 14-15px, no uppercase shouting */}
      <button
        onClick={handleHeaderClick}
        disabled={!collapsible}
        className={cn(
          'flex w-full items-center gap-2 mb-3',
          collapsible && 'cursor-pointer group',
          'text-left'
        )}
      >
        {/* Collapse Chevron */}
        {collapsible && (
          <ChevronDown 
            className={cn(
              'h-4 w-4 transition-transform duration-150',
              'text-text-muted/60 group-hover:text-text-muted',
              isCollapsed && '-rotate-90'
            )} 
          />
        )}

        {/* Title - Subtle, medium weight */}
        <span className={cn(
          'text-[14px] font-medium tracking-wide',
          variant === 'primary' && 'text-text-secondary',
          variant === 'secondary' && 'text-text-muted/80',
          variant === 'muted' && 'text-text-muted/60'
        )}>
          {title}
        </span>

        {/* Count - Only for collapsible sections */}
        {collapsible && (
          <span className="text-[12px] text-text-muted/50">
            {tasks.length}
          </span>
        )}
      </button>

      {/* Task List - Increased vertical spacing */}
      {!isCollapsed && (
        <div className="space-y-1">
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
              onComplete={onTaskComplete}
              isSelected={selectedTaskId === task.id}
              isKeyboardSelected={keyboardSelectedId === task.id}
              isFocus={focusTaskId === task.id && !isSingleTask}
            />
          ))}
        </div>
      )}
    </section>
  );
}
