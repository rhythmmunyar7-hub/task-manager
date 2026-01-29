'use client';

import { useTaskContext } from '@/context/TaskContext';
import { QuickAddTask } from '@/components/tasks/QuickAddTask';
import { TaskSection } from '@/components/tasks/TaskSection';
import { EmptyState } from '@/components/tasks/EmptyState';

export default function InboxView() {
  const {
    selectedTask,
    completeTask,
    selectTask,
    getInboxTasks,
    getCompletedTasks,
  } = useTaskContext();

  const inboxTasks = getInboxTasks();
  const completedTasks = getCompletedTasks();

  const hasNoActiveTasks = inboxTasks.length === 0;

  return (
    <div className="flex h-full flex-col">
      <main className="flex-1 overflow-y-auto px-8 py-8">
        {/* Always-visible Quick Add */}
        <QuickAddTask />

        {hasNoActiveTasks && completedTasks.length === 0 ? (
          <EmptyState type="inbox" />
        ) : (
          <>
            {/* Inbox Tasks */}
            {inboxTasks.length > 0 && (
              <TaskSection
                title="Inbox"
                tasks={inboxTasks}
                onTaskClick={selectTask}
                onTaskComplete={completeTask}
                selectedTaskId={selectedTask?.id}
                variant="primary"
              />
            )}

            {/* Show empty state if no inbox tasks but has completed */}
            {hasNoActiveTasks && completedTasks.length > 0 && (
              <EmptyState type="inbox" />
            )}

            {/* Completed - Muted, collapsible */}
            {completedTasks.length > 0 && (
              <TaskSection
                title="Completed"
                tasks={completedTasks}
                onTaskClick={selectTask}
                onTaskComplete={completeTask}
                collapsible
                defaultCollapsed
                selectedTaskId={selectedTask?.id}
                variant="muted"
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
