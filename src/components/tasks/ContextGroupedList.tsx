'use client';

import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { Task, WorkContext } from '@/types/task';
import { TaskRow } from './TaskRow';
import { cn } from '@/lib/utils';
import { groupTasksByContext, getContextLabel, sortTasksForExecution } from '@/lib/task-intelligence';

interface ContextGroupedListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskComplete: (id: string) => void;
  selectedTaskId?: string;
  keyboardSelectedId?: string | null;
  focusTaskId?: string | null;
}

/**
 * Context-grouped task list with AI-driven sections
 * - Groups by work context (Client, Product, Admin, Personal)
 * - Only top group expanded by default
 * - Max 5 groups
 * - Calm, minimal headers
 */
export function ContextGroupedList({
  tasks,
  onTaskClick,
  onTaskComplete,
  selectedTaskId,
  keyboardSelectedId,
  focusTaskId,
}: ContextGroupedListProps) {
  // Sort tasks for execution first
  const sortedTasks = useMemo(() => sortTasksForExecution(tasks), [tasks]);
  
  // Group by context
  const groups = useMemo(() => groupTasksByContext(sortedTasks), [sortedTasks]);
  
  // Track which groups are expanded (first group expanded by default)
  const [expandedGroups, setExpandedGroups] = useState<Set<WorkContext>>(() => {
    const firstContext = Array.from(groups.keys())[0];
    return firstContext ? new Set([firstContext]) : new Set();
  });

  // Update expanded state when groups change
  useMemo(() => {
    const firstContext = Array.from(groups.keys())[0];
    if (firstContext && expandedGroups.size === 0) {
      setExpandedGroups(new Set([firstContext]));
    }
  }, [groups, expandedGroups.size]);

  const toggleGroup = (context: WorkContext) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(context)) {
        next.delete(context);
      } else {
        next.add(context);
      }
      return next;
    });
  };

  if (tasks.length === 0) return null;

  // If only one group or few tasks, don't show grouping
  if (groups.size <= 1 || tasks.length <= 5) {
    return (
      <div className="space-y-1">
        {sortedTasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
            onComplete={onTaskComplete}
            isSelected={selectedTaskId === task.id}
            isKeyboardSelected={keyboardSelectedId === task.id}
            isFocus={focusTaskId === task.id}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Array.from(groups.entries()).map(([context, contextTasks], groupIndex) => {
        const isExpanded = expandedGroups.has(context);
        const isFirstGroup = groupIndex === 0;
        
        return (
          <div key={context} className="space-y-1">
            {/* Context Header - Soft, collapsible */}
            <button
              onClick={() => toggleGroup(context)}
              className={cn(
                'flex w-full items-center gap-2 py-1.5 px-1',
                'text-left group cursor-pointer',
                'transition-colors duration-150'
              )}
            >
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 text-text-muted/40 transition-transform duration-150',
                  !isExpanded && '-rotate-90'
                )}
              />
              <span className={cn(
                'text-[12px] font-medium tracking-wide uppercase',
                isFirstGroup ? 'text-text-muted/70' : 'text-text-muted/50'
              )}>
                {getContextLabel(context)}
              </span>
              <span className="text-[11px] text-text-muted/30">
                {contextTasks.length}
              </span>
            </button>

            {/* Task List */}
            {isExpanded && (
              <div className="space-y-0.5 animate-fade-in">
                {contextTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onClick={() => onTaskClick(task)}
                    onComplete={onTaskComplete}
                    isSelected={selectedTaskId === task.id}
                    isKeyboardSelected={keyboardSelectedId === task.id}
                    isFocus={focusTaskId === task.id}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
