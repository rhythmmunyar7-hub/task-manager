'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Trash2, Plus, Check } from 'lucide-react';
import { Task, Project, Subtask } from '@/types/task';
import { cn } from '@/lib/utils';

interface TaskDetailPanelProps {
  task: Task | null;
  projects: Project[];
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

const projectColors: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-300' },
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-300' },
  green: { bg: 'bg-green-500/20', text: 'text-green-300' },
  orange: { bg: 'bg-orange-500/20', text: 'text-orange-300' },
  pink: { bg: 'bg-pink-500/20', text: 'text-pink-300' },
  yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-300' },
};

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
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [showSubtasks, setShowSubtasks] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setNotes(task.notes || '');
      setSubtasks(task.subtasks || []);
      setShowDeleteConfirm(false);
      // Focus title on open
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [task]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
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
  }, [task, onClose]);

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
      onClose();
    }
  };

  const addSubtask = () => {
    if (!newSubtaskTitle.trim() || !task) return;
    const newSubtask: Subtask = {
      id: crypto.randomUUID(),
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    const updatedSubtasks = [...subtasks, newSubtask];
    setSubtasks(updatedSubtasks);
    onUpdate(task.id, { subtasks: updatedSubtasks });
    setNewSubtaskTitle('');
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
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/20" />

      {/* Panel */}
      <div
        ref={panelRef}
        className="panel-slide-in fixed right-0 top-0 z-50 flex h-full w-96 flex-col border-l border-surface-border bg-card shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-border px-6 py-4">
          <span className="text-sm text-muted-foreground">Task Details</span>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
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
            className="mb-6 w-full bg-transparent text-xl font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none"
            placeholder="Task title..."
          />

          {/* Project */}
          <div className="mb-6">
            <label className="mb-2 block text-xs text-muted-foreground">
              Project
            </label>
            <select
              value={task.project?.id || 'none'}
              onChange={(e) => handleProjectChange(e.target.value)}
              className="w-full rounded-md border border-surface-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
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
            <label className="mb-2 block text-xs text-muted-foreground">
              Due Date
            </label>
            <input
              type="date"
              value={
                task.dueDate && task.dueDate !== 'today' && task.dueDate !== 'overdue'
                  ? task.dueDate
                  : ''
              }
              onChange={(e) => handleDueDateChange(e.target.value)}
              className="mb-2 w-full rounded-md border border-surface-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleQuickDate('today')}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs transition-colors',
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
                className="rounded-md bg-secondary px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Tomorrow
              </button>
              <button
                onClick={() => {
                  const nextWeek = new Date();
                  nextWeek.setDate(nextWeek.getDate() + 7);
                  handleDueDateChange(nextWeek.toISOString().split('T')[0]);
                }}
                className="rounded-md bg-secondary px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Next Week
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="mb-2 block text-xs text-muted-foreground">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNotesBlur}
              placeholder="Add notes..."
              className="min-h-[120px] w-full resize-none rounded-md border border-surface-border bg-secondary px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          {/* Subtasks */}
          <div className="mb-6">
            <button
              onClick={() => setShowSubtasks(!showSubtasks)}
              className="mb-2 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <span>Subtasks</span>
              {subtasks.length > 0 && (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px]">
                  {subtasks.filter((s) => s.completed).length}/{subtasks.length}
                </span>
              )}
            </button>

            {showSubtasks && (
              <div className="space-y-2">
                {subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-3 rounded-md bg-secondary px-3 py-2"
                  >
                    <button
                      onClick={() => toggleSubtask(subtask.id)}
                      className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all',
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
                    onKeyDown={(e) => e.key === 'Enter' && addSubtask()}
                    placeholder="Add subtask..."
                    className="flex-1 rounded-md border border-surface-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                  <button
                    onClick={addSubtask}
                    disabled={!newSubtaskTitle.trim()}
                    className="rounded-md bg-secondary p-2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-surface-border p-6">
          {showDeleteConfirm ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Delete this task?</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 text-sm font-medium text-destructive transition-colors hover:underline"
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
