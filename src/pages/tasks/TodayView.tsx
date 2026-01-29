'use client';

import { useMemo, useCallback } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { QuickAddTask } from '@/components/tasks/QuickAddTask';
import { TaskSection } from '@/components/tasks/TaskSection';
import { EmptyState } from '@/components/tasks/EmptyState';
import { LaterSection } from '@/components/tasks/LaterSection';
import { MomentumMessage } from '@/components/tasks/MomentumMessage';
import { NextTaskSuggestion } from '@/components/tasks/NextTaskSuggestion';
import { OverwhelmBanner } from '@/components/tasks/OverwhelmBanner';
import { useFocusTask } from '@/hooks/useFocusTask';
import { useOverwhelmMode } from '@/hooks/useOverwhelmMode';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';

export default function TodayView() {
  const {
    selectedTask,
    completeTask,
    selectTask,
    getTodayTasks,
    getOverdueTasks,
    getCompletedTasks,
    getInboxTasks,
    getIncompleteTasks,
    showMomentumMessage,
    dismissMomentumMessage,
    suggestionDismissedThisSession,
    dismissSuggestion,
    lastCompletedTaskId,
  } = useTaskContext();

  const todayTasks = getTodayTasks();
  const overdueTasks = getOverdueTasks();
  const completedTasks = getCompletedTasks();
  const inboxTasks = getInboxTasks();
  const incompleteTasks = getIncompleteTasks();

  // Focus Task logic
  const { focusTask, getSuggestedNextTask } = useFocusTask({
    overdueTasks,
    todayTasks,
    inboxTasks,
    allIncompleteTasks: incompleteTasks,
  });

  // Overwhelm detection
  const { isOverwhelmed, visibleCount, hiddenCount, overwhelmMessage } = useOverwhelmMode({
    incompleteTasks,
  });

  // Combine active tasks for this view (overdue + today)
  const activeTasks = useMemo(() => {
    return [...overdueTasks, ...todayTasks];
  }, [overdueTasks, todayTasks]);

  // Apply visibility limits
  const visibleTasks = useMemo(() => {
    return activeTasks.slice(0, visibleCount);
  }, [activeTasks, visibleCount]);

  const laterTasks = useMemo(() => {
    return activeTasks.slice(visibleCount);
  }, [activeTasks, visibleCount]);

  // Keyboard navigation
  const handleDismiss = useCallback(() => {
    selectTask(null);
    dismissMomentumMessage();
  }, [selectTask, dismissMomentumMessage]);

  const { selectedTaskId: keyboardSelectedId } = useKeyboardNavigation({
    tasks: visibleTasks,
    onTaskSelect: selectTask,
    onTaskComplete: completeTask,
    onDismiss: handleDismiss,
  });

  // Get suggested next task after completion
  const suggestedTask = useMemo(() => {
    if (!lastCompletedTaskId || suggestionDismissedThisSession) return null;
    const lastCompleted = { id: lastCompletedTaskId } as any;
    return getSuggestedNextTask(lastCompleted);
  }, [lastCompletedTaskId, suggestionDismissedThisSession, getSuggestedNextTask]);

  const handleAcceptSuggestion = useCallback((task: any) => {
    selectTask(task);
    dismissMomentumMessage();
  }, [selectTask, dismissMomentumMessage]);

  const hasNoActiveTasks = activeTasks.length === 0;

  return (
    <div className="flex h-full flex-col">
      <main className="flex-1 overflow-y-auto px-8 py-8">
        {/* Quick Add */}
        <QuickAddTask />

        {/* Overwhelm Banner */}
        <OverwhelmBanner message={overwhelmMessage || ''} show={isOverwhelmed} />

        {hasNoActiveTasks && completedTasks.length === 0 ? (
          <EmptyState type="today" />
        ) : (
          <>
            {/* Momentum Message */}
            <MomentumMessage
              show={showMomentumMessage && !suggestedTask}
              onDismiss={dismissMomentumMessage}
            />

            {/* Next Task Suggestion */}
            {suggestedTask && (
              <div className="mb-4">
                <NextTaskSuggestion
                  suggestedTask={suggestedTask}
                  onAccept={handleAcceptSuggestion}
                  onDismiss={dismissSuggestion}
                  show={showMomentumMessage}
                />
              </div>
            )}

            {/* Active Tasks - Overdue first, then Today */}
            {visibleTasks.length > 0 && (
              <TaskSection
                title={overdueTasks.length > 0 ? 'Overdue' : 'Today'}
                tasks={visibleTasks}
                onTaskClick={selectTask}
                onTaskComplete={completeTask}
                selectedTaskId={selectedTask?.id}
                keyboardSelectedId={keyboardSelectedId}
                focusTaskId={focusTask?.id}
                variant="primary"
              />
            )}

            {/* Later Section */}
            <LaterSection
              tasks={laterTasks}
              onTaskClick={selectTask}
              onTaskComplete={completeTask}
              selectedTaskId={selectedTask?.id}
              keyboardSelectedId={keyboardSelectedId}
            />

            {/* Empty state when no active tasks */}
            {hasNoActiveTasks && completedTasks.length > 0 && (
              <EmptyState type="today" />
            )}

            {/* Completed - Muted, collapsed */}
            {completedTasks.length > 0 && (
              <TaskSection
                title="Completed"
                tasks={completedTasks}
                onTaskClick={selectTask}
                onTaskComplete={completeTask}
                collapsible
                defaultCollapsed
                selectedTaskId={selectedTask?.id}
                keyboardSelectedId={keyboardSelectedId}
                focusTaskId={null}
                variant="muted"
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
