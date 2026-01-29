'use client';

import { useTaskContext } from '@/context/TaskContext';
import { QuickAddTask } from '@/components/tasks/QuickAddTask';
import { TaskSection } from '@/components/tasks/TaskSection';
import { EmptyState } from '@/components/tasks/EmptyState';

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
  } = useTaskContext();

  const overdueTasks = getOverdueTasks();
  const todayTasks = getTodayTasks();
  const upcomingTasks = getUpcomingTasks();
  const inboxTasks = getInboxTasks();
  const completedTasks = getCompletedTasks();

  const hasNoTasks = tasks.length === 0;
  const hasActiveTasks = overdueTasks.length > 0 || todayTasks.length > 0 || upcomingTasks.length > 0 || inboxTasks.length > 0;

  return (
    <div className="flex h-full flex-col">
      <main className="flex-1 overflow-y-auto px-8 py-8">
        {/* Always-visible Quick Add */}
        <QuickAddTask />

        {hasNoTasks ? (
          <EmptyState type="all" />
        ) : (
          <>
            {/* Overdue - Urgent, but calm */}
            {overdueTasks.length > 0 && (
              <TaskSection
                title="Overdue"
                tasks={overdueTasks}
                onTaskClick={selectTask}
                onTaskComplete={completeTask}
                selectedTaskId={selectedTask?.id}
                variant="primary"
              />
            )}

            {/* Today */}
            {todayTasks.length > 0 && (
              <TaskSection
                title="Today"
                tasks={todayTasks}
                onTaskClick={selectTask}
                onTaskComplete={completeTask}
                selectedTaskId={selectedTask?.id}
                variant={overdueTasks.length > 0 ? 'secondary' : 'primary'}
              />
            )}

            {/* Upcoming - Secondary */}
            {upcomingTasks.length > 0 && (
              <TaskSection
                title="Upcoming"
                tasks={upcomingTasks}
                onTaskClick={selectTask}
                onTaskComplete={completeTask}
                collapsible
                selectedTaskId={selectedTask?.id}
                variant="secondary"
              />
            )}

            {/* No Due Date (Inbox) */}
            {inboxTasks.length > 0 && (
              <TaskSection
                title="No Due Date"
                tasks={inboxTasks}
                onTaskClick={selectTask}
                onTaskComplete={completeTask}
                collapsible
                selectedTaskId={selectedTask?.id}
                variant="secondary"
              />
            )}

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
                variant="muted"
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
