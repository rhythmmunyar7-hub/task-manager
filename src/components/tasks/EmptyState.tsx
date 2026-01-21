'use client';

import { Calendar, Inbox, List, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  type: 'today' | 'inbox' | 'all' | 'project';
  onAddTask?: () => void;
}

const emptyStateConfig = {
  today: {
    icon: Calendar,
    message: "You're clear for today.",
    showAction: true,
  },
  inbox: {
    icon: Inbox,
    message: "Inbox is empty.",
    showAction: false,
  },
  all: {
    icon: List,
    message: "No tasks yet.",
    showAction: true,
  },
  project: {
    icon: List,
    message: "No tasks in this project yet.",
    showAction: true,
  },
};

export function EmptyState({ type, onAddTask }: EmptyStateProps) {
  const config = emptyStateConfig[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      {/* Icon */}
      <div className="mb-4 text-capella-border-subtle">
        <Icon className="h-12 w-12" strokeWidth={1} />
      </div>

      {/* Message */}
      <p className="text-sm text-text-muted mb-6">
        {config.message}
      </p>

      {/* Action Button - Green primary */}
      {config.showAction && onAddTask && (
        <button
          onClick={onAddTask}
          className={cn(
            'flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium',
            'bg-capella-success text-black',
            'transition-colors duration-150 hover:bg-capella-success/90'
          )}
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Add Task
        </button>
      )}
    </div>
  );
}
