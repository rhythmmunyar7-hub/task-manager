'use client';

import { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from '@/components/tasks/TopBar';
import { KeyboardShortcutsModal } from '@/components/tasks/KeyboardShortcutsModal';
import { TaskDetailPanel } from '@/components/tasks/TaskDetailPanel';
import { PlanningMode } from '@/components/planning/PlanningMode';
import { useTaskContext } from '@/context/TaskContext';
import { cn } from '@/lib/utils';

export default function TaskLayout() {
  const { 
    selectedTask, 
    projects, 
    selectTask, 
    updateTask, 
    deleteTask,
    openAddTask,
  } = useTaskContext();
  
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isPlanningMode, setIsPlanningMode] = useState(false);

  // Enter planning mode
  const enterPlanningMode = useCallback(() => {
    setIsPlanningMode(true);
    selectTask(null); // Clear selection when entering planning
  }, [selectTask]);

  // Exit planning mode
  const exitPlanningMode = useCallback(() => {
    setIsPlanningMode(false);
  }, []);

  // Keyboard shortcut for planning mode (Cmd/Ctrl + P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        if (isPlanningMode) {
          exitPlanningMode();
        } else {
          enterPlanningMode();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlanningMode, enterPlanningMode, exitPlanningMode]);

  // Render Planning Mode
  if (isPlanningMode) {
    return <PlanningMode onExit={exitPlanningMode} />;
  }

  return (
    <div className="flex h-screen w-full flex-col bg-bg-main">
      {/* Lightweight Top Bar */}
      <TopBar onAddClick={openAddTask} onPlanClick={enterPlanningMode} />

      {/* Main Content Area - Task List dominates */}
      <div className="flex flex-1 overflow-hidden">
        {/* Task List Area - Primary focus, centered content */}
        <main 
          className={cn(
            'flex-1 overflow-hidden transition-all duration-200 ease-in-out',
            'flex justify-center',
            'min-w-0'
          )}
        >
          <div className="w-full max-w-2xl">
            <Outlet />
          </div>
        </main>

        {/* Detail Panel - De-emphasized, secondary (Desktop only) */}
        {selectedTask && (
          <div className="hidden md:block shrink-0 w-[360px] border-l border-white/[0.04] bg-bg-main">
            <TaskDetailPanel
              task={selectedTask}
              projects={projects}
              onClose={() => selectTask(null)}
              onUpdate={updateTask}
              onDelete={deleteTask}
            />
          </div>
        )}
      </div>

      {/* Mobile Detail Panel - Bottom sheet */}
      <div className="md:hidden">
        <TaskDetailPanel
          task={selectedTask}
          projects={projects}
          onClose={() => selectTask(null)}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      </div>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal 
        isOpen={showShortcuts} 
        onClose={() => setShowShortcuts(false)} 
      />
    </div>
  );
}
