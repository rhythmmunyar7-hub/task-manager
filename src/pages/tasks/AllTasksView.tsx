'use client';

import { useMemo, useCallback } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { QuickAddTask } from '@/components/tasks/QuickAddTask';
import { EmptyState } from '@/components/tasks/EmptyState';
import { LaterSection } from '@/components/tasks/LaterSection';
import { MomentumMessage } from '@/components/tasks/MomentumMessage';
import { NextTaskSuggestion } from '@/components/tasks/NextTaskSuggestion';
import { OverwhelmBanner } from '@/components/tasks/OverwhelmBanner';
import { ContextGroupedList } from '@/components/tasks/ContextGroupedList';
import { TaskSection } from '@/components/tasks/TaskSection';
import { useFocusTask } from '@/hooks/useFocusTask';
import { useOverwhelmMode } from '@/hooks/useOverwhelmMode';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { sortTasksForExecution } from '@/lib/task-intelligence';

export default function AllTasksView() {
  const {
    tasks,
    selectedTask,
    completeTask,
    selectTask,
    getTodayTasks,
    getInboxTasks,
    getCompletedTasks,
    getUpcomingTasks,
    getOverdueTasks,
    getIncompleteTasks,
    showMomentumMessage,
    dismissMomentumMessage,
    suggestionDismissedThisSession,
    dismissSuggestion,
    lastCompletedTaskId,
  } = useTaskContext();

  const overdueTasks = getOverdueTasks();
  const todayTasks = getTodayTasks();
  const upcomingTasks = getUpcomingTasks();
  const inboxTasks = getInboxTasks();
  const completedTasks = getCompletedTasks();
  const incompleteTasks = getIncompleteTasks();

  // Focus Task logic
  const { focusTask, getSuggestedNextTask } = useFocusTask({
    overdueTasks,
    todayTasks,
    inboxTasks,
    allIncompleteTasks: incompleteTasks,
  });

  // Overwhelm detection
  const { isOverwhelmed, visibleCount, overwhelmMessage } = useOverwhelmMode({
    incompleteTasks,
  });

  // Combine all active tasks and SORT for execution mode
  const allActiveTasks = useMemo(() => {
    const combined = [...overdueTasks, ...todayTasks, ...upcomingTasks, ...inboxTasks];
    return sortTasksForExecution(combined);
  }, [overdueTasks, todayTasks, upcomingTasks, inboxTasks]);

  // Apply visibility limits
  const visibleTasks = useMemo(() => {
    return allActiveTasks.slice(0, visibleCount);
  }, [allActiveTasks, visibleCount]);

  const laterTasks = useMemo(() => {
    return allActiveTasks.slice(visibleCount);
  }, [allActiveTasks, visibleCount]);

  // Keyboard navigation
  const handleDismiss = useCallback(() => {
    selectTask(null);
    dismissMomentumMessage();
  }, [selectTask, dismissMomentumMessage]);

  const { selectedTaskId: keyboardSelectedId, isKeyboardActive } = useKeyboardNavigation({
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

  const hasNoTasks = tasks.length === 0;
  const showContextGrouping = visibleTasks.length > 6; // Only group when there are enough tasks

  return (
    <div className="flex h-full flex-col">
      <main className="flex-1 overflow-y-auto px-8 py-8">
        {/* Quick Add */}
        <QuickAddTask />

        {/* Overwhelm Banner */}
        <OverwhelmBanner message={overwhelmMessage || ''} show={isOverwhelmed} />

        {hasNoTasks ? (
          <EmptyState type="all" />
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

            {/* All Tasks - Context grouped when enough tasks, otherwise flat */}
            {visibleTasks.length > 0 && (
              <section className="mb-8">
                <h2 className="mb-3 text-[14px] font-medium tracking-wide text-text-secondary">
                  Tasks
                </h2>
                {showContextGrouping ? (
                  <ContextGroupedList
                    tasks={visibleTasks}
                    onTaskClick={selectTask}
                    onTaskComplete={completeTask}
                    selectedTaskId={selectedTask?.id}
                    keyboardSelectedId={isKeyboardActive ? keyboardSelectedId : null}
                    focusTaskId={focusTask?.id}
                  />
                ) : (
                  <TaskSection
                    title=""
                    tasks={visibleTasks}
                    onTaskClick={selectTask}
                    onTaskComplete={completeTask}
                    selectedTaskId={selectedTask?.id}
                    keyboardSelectedId={isKeyboardActive ? keyboardSelectedId : null}
                    focusTaskId={focusTask?.id}
                    variant="primary"
                  />
                )}
              </section>
            )}

            {/* Later Section */}
            <LaterSection
              tasks={laterTasks}
              onTaskClick={selectTask}
              onTaskComplete={completeTask}
              selectedTaskId={selectedTask?.id}
              keyboardSelectedId={isKeyboardActive ? keyboardSelectedId : null}
            />

            {/* Completed - Muted, collapsed by default */}
            {completedTasks.length > 0 && (
              <TaskSection
                title="Completed"
                tasks={completedTasks}
                onTaskClick={selectTask}
                onTaskComplete={completeTask}
                collapsible
                defaultCollapsed
                selectedTaskId={selectedTask?.id}
                keyboardSelectedId={null}
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
