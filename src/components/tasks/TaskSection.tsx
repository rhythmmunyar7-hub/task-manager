'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Task } from '@/types/task';
import { TaskRow } from './TaskRow';
import { cn } from '@/lib/utils';

type SectionType = 'overdue' | 'today' | 'upcoming' | 'inbox' | 'completed';

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
  sectionType?: SectionType;
}

// Section header styling based on type
const getSectionHeaderStyle = (sectionType?: SectionType) => {
  switch (sectionType) {
    case 'overdue':
      return 'text-capella-danger/80';
    case 'today':
      return 'text-text-muted';
    case 'upcoming':
    case 'inbox':
      return 'text-text-muted/70';
    case 'completed':
      return 'text-text-muted/60';
    default:
      return 'text-text-muted';
  }
};

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
  sectionType,
}: TaskSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const handleHeaderClick = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const headerStyle = getSectionHeaderStyle(sectionType);

  return (
    <section className={cn(
      'mb-6',
      // Today section gets subtle containment
      sectionType === 'today' && 'bg-white/[0.015] rounded-lg -mx-2 px-2 py-1'
    )}>
      {/* Section Header - Uppercase, authority-based styling */}
      <button
        onClick={handleHeaderClick}
        disabled={!collapsible}
        className={cn(
          'flex w-full items-center gap-2 py-3',
          collapsible && 'cursor-pointer hover:opacity-80',
          'text-left'
        )}
      >
        {/* Collapse Chevron */}
        {collapsible && (
          <ChevronDown 
            className={cn(
              'h-3.5 w-3.5 transition-transform duration-150',
              headerStyle,
              isCollapsed && '-rotate-90'
            )} 
          />
        )}

        {/* Title - Small uppercase with section-based color */}
        <span className={cn(
          'text-xs font-medium uppercase tracking-wider',
          headerStyle
        )}>
          {title}
        </span>

        {/* Count - more muted */}
        {showCount && (
          <span className="text-[11px] text-text-muted/60">
            {tasks.length}
          </span>
        )}
      </button>

      {/* Task List */}
      {!isCollapsed && (
        <div className="space-y-0.5">
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <TaskRow
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task)}
                onComplete={onTaskComplete}
                isSelected={selectedTaskId === task.id}
                isFirstTask={index === 0}
                sectionType={sectionType}
              />
            ))
          ) : emptyMessage ? (
            <p className="py-4 text-center text-sm text-text-muted/70">
              {emptyMessage}
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
}
