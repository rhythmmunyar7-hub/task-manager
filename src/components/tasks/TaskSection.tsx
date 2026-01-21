'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Task } from '@/types/task';
import { TaskList } from './TaskList';
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
  selectedTaskId?: string | null;
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

  if (!collapsible && tasks.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      {/* Section Header - 32px height */}
      <button
        onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
        disabled={!collapsible}
        className={cn(
          'mb-4 flex h-8 items-center gap-2',
          'text-sm font-semibold text-text-muted',
          collapsible && 'cursor-pointer hover:text-text-secondary transition-colors duration-200'
        )}
      >
        {collapsible && (
          <span className="transition-transform duration-200">
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </span>
        )}
        <span className="uppercase tracking-wide">{title}</span>
        {showCount && (
          <span className="text-xs font-normal">
            ({tasks.length})
          </span>
        )}
      </button>

      {/* Task List with 16px spacing */}
      {!isCollapsed && (
        <div className="space-y-4">
          <TaskList
            tasks={tasks}
            onTaskClick={onTaskClick}
            onTaskComplete={onTaskComplete}
            emptyMessage={emptyMessage}
            selectedTaskId={selectedTaskId}
          />
        </div>
      )}
    </section>
  );
}
