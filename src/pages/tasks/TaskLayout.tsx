'use client';

import { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from '@/components/tasks/TopBar';
import { KeyboardShortcutsModal } from '@/components/tasks/KeyboardShortcutsModal';
import { TaskDetailPanel } from '@/components/tasks/TaskDetailPanel';
import { PlanningMode } from '@/components/planning/PlanningMode';
import { FocusSprintMode, FocusSprintEntry, FocusExitSummary } from '@/components/focus';
import { useTaskContext } from '@/context/TaskContext';
import { useFocusSprint } from '@/hooks/useFocusSprint';
import { cn } from '@/lib/utils';

export default function TaskLayout() {
  const { 
    selectedTask, 
    projects, 
    selectTask, 
    updateTask, 
    deleteTask,
    openAddTask,
    sprintSelectedTasks,
    clearSprintTasks,
    removeSprintTask,
  } = useTaskContext();
  
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isPlanningMode, setIsPlanningMode] = useState(false);
  const [showSprintEntry, setShowSprintEntry] = useState(false);
  const [sprintValidationError, setSprintValidationError] = useState<string>('');

  // Focus Sprint hook
  const {
    isActive: isFocusSprint,
    currentTask: focusCurrentTask,
    remainingTasks: focusRemainingTasks,
    completedCount,
    totalCount,
    timerEnabled,
    timerDuration,
    timerRemaining,
    timerPaused,
    exitSummary,
    canStartSprint,
    startSprint,
    endSprint,
    completeCurrentTask,
    toggleTimer,
    setTimerDuration,
    pauseTimer,
    resumeTimer,
    hideTimer,
    dismissSummary,
  } = useFocusSprint();

  // Enter planning mode
  const enterPlanningMode = useCallback(() => {
    setIsPlanningMode(true);
    selectTask(null);
  }, [selectTask]);

  // Exit planning mode
  const exitPlanningMode = useCallback(() => {
    setIsPlanningMode(false);
  }, []);

  // Open sprint entry dialog
  const openSprintEntry = useCallback(() => {
    setSprintValidationError('');
    setShowSprintEntry(true);
  }, []);

  // Close sprint entry dialog
  const closeSprintEntry = useCallback(() => {
    setShowSprintEntry(false);
    setSprintValidationError('');
  }, []);

  // Handle starting sprint
  const handleStartSprint = useCallback((timerDuration: 25 | 50 | null) => {
    const result = startSprint(sprintSelectedTasks, timerDuration);
    if (!result.valid && result.message) {
      setSprintValidationError(result.message);
      return;
    }
    setShowSprintEntry(false);
    clearSprintTasks();
  }, [sprintSelectedTasks, startSprint, clearSprintTasks]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + P -> planning mode
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        if (isPlanningMode) {
          exitPlanningMode();
        } else {
          enterPlanningMode();
        }
        return;
      }

      // Cmd/Ctrl + Shift + F -> Focus Sprint
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        if (!isFocusSprint && sprintSelectedTasks.length > 0) {
          openSprintEntry();
        }
        return;
      }

      // ? -> show shortcuts (not in inputs)
      if (e.key === '?' && !isFocusSprint && !isPlanningMode) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setShowShortcuts(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlanningMode, isFocusSprint, enterPlanningMode, exitPlanningMode, openSprintEntry, sprintSelectedTasks]);

  // Render Focus Sprint Mode (full screen)
  if (isFocusSprint) {
    return (
      <>
        <FocusSprintMode
          currentTask={focusCurrentTask}
          remainingTasks={focusRemainingTasks}
          completedCount={completedCount}
          totalCount={totalCount}
          timerEnabled={timerEnabled}
          timerDuration={timerDuration}
          timerRemaining={timerRemaining}
          timerPaused={timerPaused}
          onComplete={completeCurrentTask}
          onEnd={endSprint}
          onToggleTimer={toggleTimer}
          onSetTimerDuration={setTimerDuration}
          onPauseTimer={pauseTimer}
          onResumeTimer={resumeTimer}
          onHideTimer={hideTimer}
        />
        <FocusExitSummary summary={exitSummary} onDismiss={dismissSummary} />
      </>
    );
  }

  // Render Planning Mode
  if (isPlanningMode) {
    return <PlanningMode onExit={exitPlanningMode} />;
  }

  return (
    <div className="flex h-screen w-full flex-col bg-bg-main">
      {/* Lightweight Top Bar */}
      <TopBar 
        onAddClick={openAddTask} 
        onPlanClick={enterPlanningMode}
        onSprintClick={openSprintEntry}
        sprintTaskCount={sprintSelectedTasks.length}
      />

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

      {/* Sprint Entry Dialog */}
      {showSprintEntry && (
        <FocusSprintEntry
          selectedTasks={sprintSelectedTasks}
          onRemoveTask={removeSprintTask}
          onStart={handleStartSprint}
          onCancel={closeSprintEntry}
          validationError={sprintValidationError}
        />
      )}

      {/* Exit Summary (after sprint ends) */}
      <FocusExitSummary summary={exitSummary} onDismiss={dismissSummary} />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal 
        isOpen={showShortcuts} 
        onClose={() => setShowShortcuts(false)} 
      />
    </div>
  );
}
