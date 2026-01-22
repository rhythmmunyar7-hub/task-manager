'use client';

import { Calendar, Inbox, List, Plus, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  type: 'today' | 'inbox' | 'all' | 'project';
  onAddTask?: () => void;
}

const emptyStateConfig = {
  today: {
    icon: CheckCircle2,
    message: "You're clear for today.",
    showAction: true,
    iconSize: 'h-14 w-14',
    animate: true,
  },
  inbox: {
    icon: Inbox,
    message: "Inbox zero.",
    showAction: false,
    iconSize: 'h-10 w-10',
    animate: false,
  },
  all: {
    icon: List,
    message: "No tasks yet.",
    showAction: true,
    iconSize: 'h-12 w-12',
    animate: false,
  },
  project: {
    icon: List,
    message: "No tasks in this project.",
    showAction: true,
    iconSize: 'h-12 w-12',
    animate: false,
  },
};

export function EmptyState({ type, onAddTask }: EmptyStateProps) {
  const config = emptyStateConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-24 -mt-4 text-center',
      config.animate && 'animate-fade-in'
    )}>
      {/* Icon */}
      <div className={cn(
        'mb-4',
        type === 'today' ? 'text-capella-success/40' : 'text-capella-border-subtle/60'
      )}>
        <Icon className={config.iconSize} strokeWidth={1} />
      </div>

      {/* Message */}
      <p className={cn(
        'text-sm mb-6',
        type === 'today' ? 'text-text-secondary' : 'text-text-muted/80'
      )}>
        {config.message}
      </p>

      {/* Action Button - Softer default */}
      {config.showAction && onAddTask && (
        <button
          onClick={onAddTask}
          className={cn(
            'flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium',
            'bg-capella-success/60 text-black/70',
            'transition-all duration-200 hover:bg-capella-success hover:text-black'
          )}
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Add Task
        </button>
      )}
    </div>
  );
}
