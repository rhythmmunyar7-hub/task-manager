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
}: TaskSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  if (!collapsible && tasks.length === 0) {
    return null;
  }

  return (
    <section className="mb-6">
      <button
        onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
        disabled={!collapsible}
        className={cn(
          'mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground',
          collapsible && 'cursor-pointer hover:text-foreground transition-colors'
        )}
      >
        {collapsible && (
          isCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )
        )}
        <span>{title}</span>
        {showCount && tasks.length > 0 && (
          <span className="ml-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium">
            {tasks.length}
          </span>
        )}
      </button>

      {!isCollapsed && (
        <TaskList
          tasks={tasks}
          onTaskClick={onTaskClick}
          onTaskComplete={onTaskComplete}
          emptyMessage={emptyMessage}
        />
      )}
    </section>
  );
}
