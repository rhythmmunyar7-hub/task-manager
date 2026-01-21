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
  showCount?: boolean;
  emptyMessage?: string;
  selectedTaskId?: string;
}

export function TaskSection({
  title,
  tasks,
  onTaskClick,
  onTaskComplete,
  collapsible = false,
  defaultCollapsed = false,
  showCount = false,
  emptyMessage,
  selectedTaskId,
}: TaskSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const handleHeaderClick = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <section className="mb-6">
      {/* Section Header - Uppercase, muted, clickable */}
      <button
        onClick={handleHeaderClick}
        disabled={!collapsible}
        className={cn(
          'flex w-full items-center gap-2 py-3',
          collapsible && 'cursor-pointer hover:text-text-secondary',
          'text-left'
        )}
      >
        {/* Collapse Chevron */}
        {collapsible && (
          <ChevronDown 
            className={cn(
              'h-3.5 w-3.5 text-text-muted transition-transform duration-150',
              isCollapsed && '-rotate-90'
            )} 
          />
        )}

        {/* Title - Small uppercase */}
        <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
          {title}
        </span>

        {/* Count */}
        {showCount && (
          <span className="text-xs text-text-muted">
            ({tasks.length})
          </span>
        )}
      </button>

      {/* Task List */}
      {!isCollapsed && (
        <div className="space-y-1">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task)}
                onComplete={onTaskComplete}
                isSelected={selectedTaskId === task.id}
              />
            ))
          ) : emptyMessage ? (
            <p className="py-4 text-center text-sm text-text-muted">
              {emptyMessage}
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
}
