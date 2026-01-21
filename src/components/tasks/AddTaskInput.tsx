'use client';

import { useState, forwardRef, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { TaskPriority } from '@/types/task';
import { useTaskContext } from '@/context/TaskContext';

interface AddTaskInputProps {
  onAdd?: (title: string, priority?: TaskPriority, projectId?: string, dueDate?: string) => void;
  autoFocus?: boolean;
  onClose?: () => void;
}

export const AddTaskInput = forwardRef<HTMLInputElement, AddTaskInputProps>(
  function AddTaskInput({ onAdd, autoFocus = false, onClose }, ref) {
    const { addTask, isAddTaskOpen, closeAddTask } = useTaskContext();
    const [value, setValue] = useState('');
    const [showExtended, setShowExtended] = useState(false);
    const [priority, setPriority] = useState<TaskPriority>('none');
    const [projectId, setProjectId] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>('');
    const { projects } = useTaskContext();

    const handleSubmit = () => {
      if (value.trim()) {
        if (onAdd) {
          onAdd(value.trim(), priority, projectId || undefined, dueDate || undefined);
        } else {
          addTask(value.trim(), priority, projectId || undefined, dueDate || undefined);
        }
        // Reset form
        setValue('');
        setPriority('none');
        setProjectId('');
        setDueDate('');
        setShowExtended(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && value.trim()) {
        handleSubmit();
      } else if (e.key === 'Tab' && !showExtended) {
        e.preventDefault();
        setShowExtended(true);
      } else if (e.key === 'Escape') {
        setValue('');
        setShowExtended(false);
        closeAddTask();
        onClose?.();
      }
    };

    if (!isAddTaskOpen && !autoFocus) {
      return null;
    }

    return (
      <div className="mb-6">
        {/* Quick Add Input */}
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus={isAddTaskOpen || autoFocus}
          placeholder="What needs to be done?"
          className={cn(
            'h-12 w-full rounded-lg px-4 text-[15px]',
            'bg-bg-input border border-capella-border-subtle',
            'text-text-primary placeholder:text-text-muted',
            'transition-all duration-200',
            'focus:border-capella-primary focus:outline-none focus:ring-2 focus:ring-capella-primary/20'
          )}
        />

        {/* Extended Mode - Shows on Tab */}
        {showExtended && (
          <div className="mt-3 rounded-lg border border-capella-border bg-bg-elevated p-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              {/* Project */}
              <div>
                <label className="block text-xs text-text-muted mb-1.5">Project</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className={cn(
                    'h-9 w-full rounded-md px-3 text-sm',
                    'bg-bg-input border border-capella-border-subtle',
                    'text-text-primary',
                    'focus:border-capella-primary focus:outline-none'
                  )}
                >
                  <option value="">None</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-xs text-text-muted mb-1.5">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={cn(
                    'h-9 w-full rounded-md px-3 text-sm',
                    'bg-bg-input border border-capella-border-subtle',
                    'text-text-primary',
                    'focus:border-capella-primary focus:outline-none'
                  )}
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs text-text-muted mb-1.5">Priority</label>
                <div className="flex gap-1">
                  {(['p1', 'p2', 'p3', 'none'] as TaskPriority[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={cn(
                        'h-9 flex-1 rounded-md text-xs font-medium transition-colors',
                        priority === p
                          ? p === 'p1'
                            ? 'bg-capella-warning text-black'
                            : p === 'p2'
                            ? 'bg-capella-primary text-white'
                            : 'bg-bg-subtle text-text-primary'
                          : 'bg-bg-input text-text-secondary hover:bg-bg-subtle'
                      )}
                    >
                      {p === 'none' ? '—' : p.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setValue('');
                  setShowExtended(false);
                  closeAddTask();
                  onClose?.();
                }}
                className="h-8 px-3 rounded-md text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!value.trim()}
                className={cn(
                  'h-8 px-4 rounded-md text-sm font-medium transition-colors',
                  value.trim()
                    ? 'bg-capella-primary text-white hover:bg-capella-primary/90'
                    : 'bg-bg-subtle text-text-muted cursor-not-allowed'
                )}
              >
                Add Task
              </button>
            </div>
          </div>
        )}

        {/* Helper text */}
        {!showExtended && isAddTaskOpen && (
          <p className="mt-2 text-xs text-text-muted">
            Press <kbd className="px-1 py-0.5 rounded bg-bg-elevated text-text-secondary font-mono">Enter</kbd> to add, <kbd className="px-1 py-0.5 rounded bg-bg-elevated text-text-secondary font-mono">Tab</kbd> for more options, <kbd className="px-1 py-0.5 rounded bg-bg-elevated text-text-secondary font-mono">Esc</kbd> to cancel
          </p>
        )}
      </div>
    );
  }
);
