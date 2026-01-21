'use client';

import { useState, useRef } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { TopBar } from '@/components/tasks/TopBar';
import { AddTaskInput } from '@/components/tasks/AddTaskInput';
import { TaskSection } from '@/components/tasks/TaskSection';
import { EmptyState } from '@/components/tasks/EmptyState';
import { TaskFilter } from '@/types/task';

export default function AllTasksView() {
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

  const [filter, setFilter] = useState<TaskFilter>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  const todayTasks = getTodayTasks();
  const upcomingTasks = getUpcomingTasks();
  const inboxTasks = getInboxTasks();
  const completedTasks = getCompletedTasks();
  const overdueTasks = getOverdueTasks();

  const showActive = filter === 'all' || filter === 'active';
  const showCompleted = filter === 'all' || filter === 'completed';

  const hasNoTasks = tasks.length === 0;

  return (
    <div className="flex h-full flex-col">
      <TopBar
        title="All Tasks"
        showFilters
        activeFilter={filter}
        onFilterChange={setFilter}
        onAddClick={openAddTask}
      />

      <main className="flex-1 overflow-y-auto p-6">
        <AddTaskInput ref={inputRef} />

        {hasNoTasks ? (
          <EmptyState type="all" onAddTask={openAddTask} />
        ) : (
          <>
            {showActive && (
              <>
                {overdueTasks.length > 0 && (
                  <TaskSection
                    title="Overdue"
                    tasks={overdueTasks}
                    onTaskClick={selectTask}
                    onTaskComplete={completeTask}
                    showCount
                    selectedTaskId={selectedTask?.id}
                  />
                )}

                <TaskSection
                  title="Today"
                  tasks={todayTasks}
                  onTaskClick={selectTask}
                  onTaskComplete={completeTask}
                  showCount
                  selectedTaskId={selectedTask?.id}
                />

                <TaskSection
                  title="Upcoming"
                  tasks={upcomingTasks}
                  onTaskClick={selectTask}
                  onTaskComplete={completeTask}
                  showCount
                  collapsible
                  selectedTaskId={selectedTask?.id}
                />

                <TaskSection
                  title="Inbox"
                  tasks={inboxTasks}
                  onTaskClick={selectTask}
                  onTaskComplete={completeTask}
                  showCount
                  collapsible
                  selectedTaskId={selectedTask?.id}
                />
              </>
            )}

            {showCompleted && completedTasks.length > 0 && (
              <TaskSection
                title="Completed"
                tasks={completedTasks}
                onTaskClick={selectTask}
                onTaskComplete={completeTask}
                collapsible
                defaultCollapsed={filter === 'all'}
                showCount
                selectedTaskId={selectedTask?.id}
              />
            )}

            {filter === 'completed' && completedTasks.length === 0 && (
              <div className="py-12 text-center text-text-muted">
                No completed tasks
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
