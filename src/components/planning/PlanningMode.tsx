'use client';

import { useState, useCallback, useEffect } from 'react';
import { X, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { usePlanningMode } from '@/hooks/usePlanningMode';
import { KanbanColumn } from './KanbanColumn';
import { PlanningWarnings } from './PlanningWarnings';
import { PlanningExitSummary } from './PlanningExitSummary';
import { TaskDetailPanel } from '@/components/tasks/TaskDetailPanel';
import { TimeColumn, PlanningTask, COLUMN_CONFIGS } from '@/types/planning';
import { cn } from '@/lib/utils';

interface PlanningModeProps {
  onExit: () => void;
}

/**
 * Planning Mode - Temporal Load Balancing
 * 
 * Fixed 4-column time model:
 * - TODAY (hard limit: 5)
 * - NEXT 3 DAYS (soft limit: 12, warn at 10)
 * - THIS WEEK (soft limit: 20, warn at 18)
 * - LATER (infinite, collapsed by default)
 */
export function PlanningMode({ onExit }: PlanningModeProps) {
  const { 
    tasks, 
    projects, 
    updateTask, 
    deleteTask 
  } = useTaskContext();

  const {
    columns,
    moveTask,
    warnings,
    exitSummary,
    getColumnConfig,
    laterExpanded,
    setLaterExpanded,
    exitPlanningMode,
  } = usePlanningMode({ tasks, onUpdateTask: updateTask });

  const [selectedTask, setSelectedTask] = useState<PlanningTask | null>(null);
  const [draggedTask, setDraggedTask] = useState<PlanningTask | null>(null);
  const [showExitSummary, setShowExitSummary] = useState(false);

  // Handle exit with summary
  const handleExit = useCallback(() => {
    exitPlanningMode();
    setShowExitSummary(true);
  }, [exitPlanningMode]);

  // Dismiss summary and truly exit
  const handleDismissSummary = useCallback(() => {
    setShowExitSummary(false);
    onExit();
  }, [onExit]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to exit (if no task selected)
      if (e.key === 'Escape') {
        if (selectedTask) {
          setSelectedTask(null);
        } else {
          handleExit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTask, handleExit]);

  // Drag handlers
  const handleDragStart = useCallback((e: React.DragEvent, task: PlanningTask) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, columnId: TimeColumn, index: number) => {
    e.preventDefault();
    if (!draggedTask) return;

    const success = moveTask(draggedTask.id, columnId, index);
    
    if (!success) {
      // Could show a toast here, but keeping it calm
      console.log('Cannot add more tasks to this column');
    }

    setDraggedTask(null);
  }, [draggedTask, moveTask]);

  const handleDragEnd = useCallback(() => {
    setDraggedTask(null);
  }, []);

  // If showing exit summary, render only that
  if (showExitSummary && exitSummary) {
    return (
      <PlanningExitSummary 
        summary={exitSummary} 
        onDismiss={handleDismissSummary} 
      />
    );
  }

  return (
    <div className="flex h-screen w-full flex-col bg-bg-main">
      {/* Planning Mode Header */}
      <header className="h-14 bg-bg-elevated border-b border-white/[0.06] flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleExit}
            className={cn(
              'flex items-center gap-2 h-8 px-3 rounded-md',
              'text-[13px] font-medium text-text-muted',
              'hover:text-text-primary hover:bg-white/[0.04]',
              'transition-colors'
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Exit</span>
          </button>

          <div className="w-px h-5 bg-white/[0.08]" />

          <div className="flex items-center gap-2">
            <span className="text-[15px] font-medium text-text-primary">
              Planning Mode
            </span>
            <span className="px-2 py-0.5 rounded bg-capella-primary/20 text-capella-primary text-[11px] font-medium">
              BETA
            </span>
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={handleExit}
          className={cn(
            'flex items-center gap-2 h-9 px-4 rounded-lg',
            'bg-capella-primary text-white text-[13px] font-medium',
            'hover:bg-capella-primary/90 transition-colors'
          )}
        >
          Done Planning
        </button>
      </header>

      {/* Warnings Bar */}
      {warnings.length > 0 && (
        <div className="px-6 py-3 bg-bg-subtle border-b border-white/[0.04]">
          <PlanningWarnings warnings={warnings} />
        </div>
      )}

      {/* Main Kanban Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Kanban Columns */}
        <div className="flex-1 flex gap-4 p-6 overflow-x-auto">
          {COLUMN_CONFIGS.map((config) => {
            const colState = columns[config.id];
            const isLater = config.id === 'later';
            
            return (
              <KanbanColumn
                key={config.id}
                config={config}
                tasks={colState.tasks}
                count={colState.count}
                isOverLimit={colState.isOverLimit}
                isWarning={colState.isWarning}
                onTaskClick={setSelectedTask}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                draggedTask={draggedTask}
                collapsed={isLater ? !laterExpanded : false}
                onToggleCollapse={isLater ? () => setLaterExpanded(!laterExpanded) : undefined}
              />
            );
          })}
        </div>

        {/* Task Detail Slide-out (40% width) */}
        {selectedTask && (
          <div className="w-[40%] min-w-[360px] max-w-[480px] border-l border-white/[0.06] bg-bg-main">
            <TaskDetailPanel
              task={selectedTask}
              projects={projects}
              onClose={() => setSelectedTask(null)}
              onUpdate={updateTask}
              onDelete={deleteTask}
            />
          </div>
        )}
      </div>
    </div>
  );
}
