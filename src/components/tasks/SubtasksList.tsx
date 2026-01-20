'use client';

import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { Subtask } from '@/types/task';
import { cn } from '@/lib/utils';

interface SubtasksListProps {
  subtasks: Subtask[];
  onToggle: (id: string) => void;
  onAdd: (title: string) => void;
}

export function SubtasksList({ subtasks, onToggle, onAdd }: SubtasksListProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    onAdd(newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mb-2 flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-muted-foreground focus:ring-offset-1 focus:ring-offset-card rounded"
      >
        <span>Subtasks</span>
        {subtasks.length > 0 && (
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px]">
            {subtasks.filter((s) => s.completed).length}/{subtasks.length}
          </span>
        )}
      </button>

      {isExpanded && (
        <div className="space-y-2">
          {subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="flex items-center gap-3 rounded-md bg-secondary px-3 py-2"
            >
              <button
                onClick={() => onToggle(subtask.id)}
                aria-label={subtask.completed ? `Mark "${subtask.title}" as incomplete` : `Mark "${subtask.title}" as complete`}
                className={cn(
                  'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-[background-color,border-color] duration-150',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-secondary',
                  subtask.completed
                    ? 'border-success bg-success'
                    : 'border-muted-foreground hover:border-primary'
                )}
              >
                {subtask.completed && (
                  <Check className="h-3 w-3 text-success-foreground" />
                )}
              </button>
              <span
                className={cn(
                  'text-sm',
                  subtask.completed
                    ? 'text-muted-foreground line-through'
                    : 'text-foreground'
                )}
              >
                {subtask.title}
              </span>
            </div>
          ))}

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
              placeholder="Add subtask..."
              className="flex-1 rounded-md border border-surface-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-text-tertiary focus:border-primary focus:outline-none"
            />
            <button
              onClick={handleAddSubtask}
              disabled={!newSubtaskTitle.trim()}
              aria-label="Add subtask"
              className="rounded-md bg-secondary p-2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-muted-foreground focus:ring-offset-1 focus:ring-offset-card"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
