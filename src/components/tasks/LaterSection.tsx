'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Task } from '@/types/task';
import { TaskRow } from './TaskRow';
import { cn } from '@/lib/utils';

interface LaterSectionProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskComplete: (id: string) => void;
  selectedTaskId?: string;
  keyboardSelectedId?: string | null;
}

/**
 * Collapsed "Later" section for hidden tasks
 * - Shows count of hidden tasks
 * - Expands on click to reveal all
 * - Calm, minimal appearance
 */
export function LaterSection({
  tasks,
  onTaskClick,
  onTaskComplete,
  selectedTaskId,
  keyboardSelectedId,
}: LaterSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (tasks.length === 0) return null;

  return (
    <section className="mt-6">
      {/* Collapsed header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'flex w-full items-center gap-2 py-2 px-1',
          'text-left group cursor-pointer',
          'transition-colors'
        )}
      >
        <ChevronDown
          className={cn(
            'h-4 w-4 text-text-muted/50 transition-transform duration-150',
            isExpanded && 'rotate-180'
          )}
        />
        <span className="text-[13px] text-text-muted/60 font-medium">
          Later
        </span>
        <span className="text-[12px] text-text-muted/40">
          ({tasks.length} more)
        </span>
      </button>

      {/* Expanded task list */}
      {isExpanded && (
        <div className="mt-2 space-y-1 animate-fade-in">
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
              onComplete={onTaskComplete}
              isSelected={selectedTaskId === task.id}
              isKeyboardSelected={keyboardSelectedId === task.id}
              isFocus={false}
            />
          ))}
        </div>
      )}
    </section>
  );
}
