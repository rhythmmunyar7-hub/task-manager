'use client';

import { useTaskContext } from '@/context/TaskContext';
import { QuickAddTask } from '@/components/tasks/QuickAddTask';
import { TaskSection } from '@/components/tasks/TaskSection';
import { EmptyState } from '@/components/tasks/EmptyState';

export default function TodayView() {
  const {
    selectedTask,
    completeTask,
    selectTask,
    getTodayTasks,
    getCompletedTasks,
  } = useTaskContext();

  const todayTasks = getTodayTasks();
  const completedTasks = getCompletedTasks();

  const hasNoActiveTasks = todayTasks.length === 0;

  return (
    <div className="flex h-full flex-col">
      <main className="flex-1 overflow-y-auto px-8 py-8">
        {/* Always-visible Quick Add */}
        <QuickAddTask />

        {hasNoActiveTasks && completedTasks.length === 0 ? (
          <EmptyState type="today" />
        ) : (
          <>
            {/* Today Tasks - Primary focus */}
            {todayTasks.length > 0 && (
              <TaskSection
                title="Today"
                tasks={todayTasks}
                onTaskClick={selectTask}
                onTaskComplete={completeTask}
                selectedTaskId={selectedTask?.id}
                variant="primary"
              />
            )}

            {/* Show empty state if no active tasks but has completed */}
            {hasNoActiveTasks && completedTasks.length > 0 && (
              <EmptyState type="today" />
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
