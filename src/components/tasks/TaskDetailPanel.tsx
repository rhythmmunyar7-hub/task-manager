'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Task, Project, Subtask, TaskPriority } from '@/types/task';
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

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 250);
  }, [onClose]);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setNotes(task.notes || '');
      setSubtasks(task.subtasks || []);
      setShowDeleteConfirm(false);
      setIsClosing(false);
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [task]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (task) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
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

  const handlePriorityChange = (priority: TaskPriority) => {
    if (!task) return;
    onUpdate(task.id, { priority });
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

  // Mobile: Bottom sheet, Desktop: Inline panel (no overlay needed for desktop push layout)
  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          'fixed inset-0 z-40 bg-black/50 transition-opacity duration-250 md:hidden',
          isClosing ? 'opacity-0' : 'opacity-100'
        )}
        onClick={handleClose}
      />

      {/* Panel Content */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-detail-title"
        className={cn(
          // Mobile: Bottom sheet
          'fixed inset-x-0 bottom-0 z-50 flex flex-col bg-bg-main md:relative md:inset-auto md:z-auto',
          'h-[85vh] rounded-t-2xl border-t border-capella-border md:h-full md:rounded-none md:border-t-0',
          // Animation
          'transition-transform duration-250 ease-in-out',
          isClosing 
            ? 'translate-y-full md:translate-y-0' 
            : 'translate-y-0'
        )}
      >
        {/* Mobile drag handle */}
        <div className="flex justify-center py-3 md:hidden">
          <div className="h-1 w-12 rounded-full bg-text-muted/30" />
        </div>

        {/* Header - 60px */}
        <div className="flex h-[60px] items-center justify-between border-b border-capella-border px-6">
          <span id="task-detail-title" className="text-sm text-text-secondary">
            Task Details
          </span>
          <button
            onClick={handleClose}
            aria-label="Close task details"
            className="rounded-md p-1.5 text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content (scrollable) */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Editable Title */}
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            aria-label="Task title"
            className="mb-6 w-full bg-transparent text-xl font-semibold text-text-primary placeholder:text-text-muted focus:outline-none"
            placeholder="Task title..."
          />

          {/* Metadata Grid */}
          <div className="space-y-5 mb-6">
            {/* Project */}
            <div>
              <label htmlFor="project-select" className="mb-2 block text-[13px] text-text-muted">
                Project
              </label>
              <select
                id="project-select"
                value={task.project?.id || 'none'}
                onChange={(e) => handleProjectChange(e.target.value)}
                className={cn(
                  'w-full h-10 rounded-md px-3 text-[15px]',
                  'bg-bg-input border border-capella-border-subtle',
                  'text-text-primary',
                  'focus:border-capella-primary focus:outline-none focus:ring-2 focus:ring-capella-primary/20'
                )}
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
            <div>
              <label htmlFor="due-date" className="mb-2 block text-[13px] text-text-muted">
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
                className={cn(
                  'w-full h-10 rounded-md px-3 text-[15px]',
                  'bg-bg-input border border-capella-border-subtle',
                  'text-text-primary',
                  'focus:border-capella-primary focus:outline-none focus:ring-2 focus:ring-capella-primary/20',
                  'mb-2'
                )}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleQuickDate('today')}
                  className={cn(
                    'h-8 rounded-md px-3 text-xs font-medium transition-colors',
                    task.dueDate === 'today'
                      ? 'bg-capella-primary text-white'
                      : 'bg-bg-elevated text-text-secondary hover:bg-bg-subtle'
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
                  className="h-8 rounded-md px-3 text-xs font-medium bg-bg-elevated text-text-secondary hover:bg-bg-subtle transition-colors"
                >
                  Tomorrow
                </button>
                <button
                  onClick={() => {
                    const nextWeek = new Date();
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    handleDueDateChange(nextWeek.toISOString().split('T')[0]);
                  }}
                  className="h-8 rounded-md px-3 text-xs font-medium bg-bg-elevated text-text-secondary hover:bg-bg-subtle transition-colors"
                >
                  Next Week
                </button>
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="mb-2 block text-[13px] text-text-muted">
                Priority
              </label>
              <div className="flex gap-2">
                {(['p1', 'p2', 'p3', 'none'] as TaskPriority[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePriorityChange(p)}
                    className={cn(
                      'h-9 flex-1 rounded-md text-sm font-medium transition-colors',
                      task.priority === p
                        ? p === 'p1'
                          ? 'bg-capella-warning text-black'
                          : p === 'p2'
                          ? 'bg-capella-primary text-white'
                          : 'bg-bg-subtle text-text-primary border border-capella-border'
                        : 'bg-bg-elevated text-text-secondary hover:bg-bg-subtle'
                    )}
                  >
                    {p === 'none' ? 'None' : p.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="notes" className="mb-2 block text-[13px] text-text-muted">
              Description
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNotesBlur}
              placeholder="Add details..."
              className={cn(
                'min-h-[120px] w-full resize-none rounded-md px-3 py-3 text-[15px]',
                'bg-bg-input border border-capella-border-subtle',
                'text-text-primary placeholder:text-text-muted',
                'focus:border-capella-primary focus:outline-none focus:ring-2 focus:ring-capella-primary/20'
              )}
            />
          </div>

          {/* Subtasks */}
          <SubtasksList
            subtasks={subtasks}
            onToggle={toggleSubtask}
            onAdd={addSubtask}
          />
        </div>

        {/* Footer - Delete */}
        <div className="border-t border-capella-border p-6">
          {showDeleteConfirm ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Delete this task?</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="h-8 px-3 rounded-md text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="h-8 px-3 rounded-md text-sm font-medium bg-capella-danger text-white hover:bg-capella-danger/90 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 text-sm font-medium text-capella-danger transition-colors hover:underline"
            >
              <Trash2 className="h-4 w-4" />
              Delete task
            </button>
          )}
        </div>
      </div>
    </>
  );
}
