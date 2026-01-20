'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Trash2 } from 'lucide-react';
import FocusTrap from 'focus-trap-react';
import { Task, Project, Subtask } from '@/types/task';
import { cn } from '@/lib/utils';
import { SubtasksList } from './SubtasksList';

interface TaskDetailPanelProps {
  task: Task | null;
  projects: Project[];
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export function TaskDetailPanel({
  task,
  projects,
  onClose,
  onUpdate,
  onDelete,
}: TaskDetailPanelProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [notes, setNotes] = useState(task?.notes || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [subtasks, setSubtasks] = useState<Subtask[]>(task?.subtasks || []);
  const [isClosing, setIsClosing] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Animated close handler
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setNotes(task.notes || '');
      setSubtasks(task.subtasks || []);
      setShowDeleteConfirm(false);
      setIsClosing(false);
      // Focus title on open
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [task]);

  // Handle click outside and escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (task) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [task, handleClose]);

  const handleTitleBlur = () => {
    if (task && title !== task.title) {
      onUpdate(task.id, { title });
    }
  };

  const handleNotesBlur = () => {
    if (task && notes !== task.notes) {
      onUpdate(task.id, { notes });
    }
  };

  const handleProjectChange = (projectId: string) => {
    if (!task) return;
    const project = projectId === 'none' ? undefined : projects.find((p) => p.id === projectId);
    onUpdate(task.id, { project });
  };

  const handleDueDateChange = (value: string) => {
    if (!task) return;
    onUpdate(task.id, { dueDate: value || undefined });
  };

  const handleQuickDate = (value: string) => {
    if (!task) return;
    onUpdate(task.id, { dueDate: value });
  };

  const handleDelete = () => {
    if (task) {
      onDelete(task.id);
      handleClose();
    }
  };

  const addSubtask = (subtaskTitle: string) => {
    if (!task) return;
    const newSubtask: Subtask = {
      id: crypto.randomUUID(),
      title: subtaskTitle,
      completed: false,
    };
    const updatedSubtasks = [...subtasks, newSubtask];
    setSubtasks(updatedSubtasks);
    onUpdate(task.id, { subtasks: updatedSubtasks });
  };

  const toggleSubtask = (subtaskId: string) => {
    if (!task) return;
    const updatedSubtasks = subtasks.map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    setSubtasks(updatedSubtasks);
    onUpdate(task.id, { subtasks: updatedSubtasks });
  };

  if (!task) return null;

  return (
    <FocusTrap active={!!task && !isClosing}>
      <div>
        {/* Overlay */}
        <div 
          className={cn(
            'fixed inset-0 z-40 bg-black/20 transition-opacity duration-300',
            isClosing ? 'opacity-0' : 'opacity-100'
          )} 
        />

        {/* Panel */}
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="task-detail-title"
          className={cn(
            // Base styles
            'fixed z-50 flex flex-col border-surface-border bg-card transition-transform duration-300 ease-out',
            // Premium shadow
            'shadow-[0_0_60px_rgba(0,0,0,0.5)]',
            // Desktop: right slide-in panel
            'md:right-0 md:top-0 md:h-full md:w-96 md:border-l md:rounded-none',
            // Mobile: bottom sheet
            'inset-x-0 bottom-0 h-[85vh] rounded-t-2xl border-t md:inset-auto',
            // Animation states
            isClosing
              ? 'translate-y-full md:translate-y-0 md:translate-x-full'
              : 'translate-y-0 md:translate-x-0'
          )}
        >
          {/* Mobile drag handle */}
          <div className="flex justify-center py-3 md:hidden">
            <div className="h-1 w-12 rounded-full bg-muted-foreground/30" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between border-b border-surface-border px-6 py-4">
            <span id="task-detail-title" className="text-sm text-muted-foreground">
              Task Details
            </span>
            <button
              onClick={handleClose}
              aria-label="Close task details"
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground focus:outline-none focus:ring-2 focus:ring-muted-foreground focus:ring-offset-2 focus:ring-offset-card"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Title */}
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              aria-label="Task title"
              className="mb-6 w-full bg-transparent text-xl font-semibold text-foreground placeholder:text-text-tertiary focus:outline-none"
              placeholder="Task title..."
            />

            {/* Project */}
            <div className="mb-6">
              <label htmlFor="project-select" className="mb-2 block text-xs text-muted-foreground">
                Project
              </label>
              <select
                id="project-select"
                value={task.project?.id || 'none'}
                onChange={(e) => handleProjectChange(e.target.value)}
                className="w-full rounded-md border border-surface-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-card"
              >
                <option value="none">No project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div className="mb-6">
              <label htmlFor="due-date" className="mb-2 block text-xs text-muted-foreground">
                Due Date
              </label>
              <input
                id="due-date"
                type="date"
                value={
                  task.dueDate && task.dueDate !== 'today' && task.dueDate !== 'overdue'
                    ? task.dueDate
                    : ''
                }
                onChange={(e) => handleDueDateChange(e.target.value)}
                className="mb-2 w-full rounded-md border border-surface-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-card"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleQuickDate('today')}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-xs transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-card',
                    task.dueDate === 'today'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground hover:text-foreground'
                  )}
                >
                  Today
                </button>
                <button
                  onClick={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    handleDueDateChange(tomorrow.toISOString().split('T')[0]);
                  }}
                  className="rounded-md bg-secondary px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-card"
                >
                  Tomorrow
                </button>
                <button
                  onClick={() => {
                    const nextWeek = new Date();
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    handleDueDateChange(nextWeek.toISOString().split('T')[0]);
                  }}
                  className="rounded-md bg-secondary px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-card"
                >
                  Next Week
                </button>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label htmlFor="notes" className="mb-2 block text-xs text-muted-foreground">
                Notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={handleNotesBlur}
                placeholder="Add notes..."
                className="min-h-[120px] w-full resize-none rounded-md border border-surface-border bg-secondary px-3 py-3 text-sm text-foreground placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-card"
              />
            </div>

            {/* Subtasks */}
            <SubtasksList
              subtasks={subtasks}
              onToggle={toggleSubtask}
              onAdd={addSubtask}
            />
          </div>

          {/* Footer */}
          <div className="border-t border-surface-border p-6">
            {showDeleteConfirm ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Delete this task?</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-muted-foreground focus:ring-offset-1 focus:ring-offset-card"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-1 focus:ring-offset-card"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 text-sm font-medium text-destructive transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-1 focus:ring-offset-card rounded"
              >
                <Trash2 className="h-4 w-4" />
                Delete task
              </button>
            )}
          </div>
        </div>
      </div>
    </FocusTrap>
  );
}
