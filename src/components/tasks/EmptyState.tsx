'use client';

import { Calendar, Inbox, FolderOpen, ListTodo, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  type: 'today' | 'inbox' | 'project' | 'all';
  onAddTask?: () => void;
}

interface EmptyStateConfig {
  icon: LucideIcon;
  message: string;
  showButton: boolean;
}

const emptyStateConfigs: Record<string, EmptyStateConfig> = {
  today: {
    icon: Calendar,
    message: 'No tasks scheduled for today',
    showButton: true,
  },
  inbox: {
    icon: Inbox,
    message: 'Your inbox is clear',
    showButton: false,
  },
  project: {
    icon: FolderOpen,
    message: 'No tasks in this project yet',
    showButton: true,
  },
  all: {
    icon: ListTodo,
    message: 'No tasks created yet',
    showButton: true,
  },
};

export function EmptyState({ type, onAddTask }: EmptyStateProps) {
  const config = emptyStateConfigs[type];
  const Icon = config.icon;

  return (
    <div className="flex h-[400px] flex-col items-center justify-center text-center">
      {/* Icon */}
      <div className="mb-4 text-capella-border-subtle">
        <Icon className="h-16 w-16" strokeWidth={1} />
      </div>

      {/* Message */}
      <p className="mb-6 text-[15px] text-text-muted">
        {config.message}
      </p>

      {/* Action Button */}
      {config.showButton && onAddTask && (
        <button
          onClick={onAddTask}
          className={cn(
            'flex h-10 items-center gap-2 rounded-md px-4',
            'bg-bg-elevated border border-capella-border-subtle',
            'text-text-primary text-sm font-medium',
            'transition-colors duration-200 hover:bg-bg-subtle'
          )}
        >
          + Add Task
        </button>
      )}
    </div>
  );
}
