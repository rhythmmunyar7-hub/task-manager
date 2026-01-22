'use client';

import { useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTaskContext } from '@/context/TaskContext';
import { AddTaskInput } from '@/components/tasks/AddTaskInput';
import { TaskSection } from '@/components/tasks/TaskSection';
import { EmptyState } from '@/components/tasks/EmptyState';
import { TaskFilter } from '@/types/task';

interface OutletContext {
  activeFilter: TaskFilter;
}

export default function AllTasksView() {
  const { activeFilter } = useOutletContext<OutletContext>();
  const {
    tasks,
    selectedTask,
    completeTask,
    selectTask,
    openAddTask,
    getTodayTasks,
    getInboxTasks,
    getCompletedTasks,
    getUpcomingTasks,
    getOverdueTasks,
  } = useTaskContext();

  const inputRef = useRef<HTMLInputElement>(null);

  const todayTasks = getTodayTasks();
  const upcomingTasks = getUpcomingTasks();
  const inboxTasks = getInboxTasks();
  const completedTasks = getCompletedTasks();
  const overdueTasks = getOverdueTasks();

  const showActive = activeFilter === 'all' || activeFilter === 'active';
  const showCompleted = activeFilter === 'all' || activeFilter === 'completed';

  const hasNoTasks = tasks.length === 0;

  return (
    <div className="flex h-full flex-col">
      <main className="flex-1 overflow-y-auto px-8 py-6">
        <AddTaskInput ref={inputRef} />

        {hasNoTasks ? (
          <EmptyState type="all" onAddTask={openAddTask} />
        ) : (
          <>
            {showActive && (
              <>
                {overdueTasks.length > 0 && (
                  <TaskSection
                    title="OVERDUE"
                    tasks={overdueTasks}
                    onTaskClick={selectTask}
                    onTaskComplete={completeTask}
                    showCount
                    selectedTaskId={selectedTask?.id}
                    sectionType="overdue"
                  />
                )}

                {todayTasks.length > 0 && (
                  <TaskSection
                    title="TODAY"
                    tasks={todayTasks}
                    onTaskClick={selectTask}
                    onTaskComplete={completeTask}
                    showCount
                    selectedTaskId={selectedTask?.id}
                    sectionType="today"
                  />
                )}

                {upcomingTasks.length > 0 && (
                  <TaskSection
                    title="UPCOMING"
                    tasks={upcomingTasks}
                    onTaskClick={selectTask}
                    onTaskComplete={completeTask}
                    showCount
                    collapsible
                    selectedTaskId={selectedTask?.id}
                    sectionType="upcoming"
                  />
                )}

                {inboxTasks.length > 0 && (
                  <TaskSection
                    title="INBOX"
                    tasks={inboxTasks}
                    onTaskClick={selectTask}
                    onTaskComplete={completeTask}
                    showCount
                    collapsible
                    selectedTaskId={selectedTask?.id}
                    sectionType="inbox"
                  />
                )}
              </>
            )}

            {showCompleted && completedTasks.length > 0 && (
              <TaskSection
                title="COMPLETED"
                tasks={completedTasks}
                onTaskClick={selectTask}
                onTaskComplete={completeTask}
                collapsible
                defaultCollapsed={activeFilter === 'all'}
                showCount
                selectedTaskId={selectedTask?.id}
                sectionType="completed"
              />
            )}

            {activeFilter === 'completed' && completedTasks.length === 0 && (
              <div className="py-12 text-center text-text-muted text-sm">
                No completed tasks
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
