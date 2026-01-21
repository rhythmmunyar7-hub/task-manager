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

export default function TodayView() {
  const { activeFilter } = useOutletContext<OutletContext>();
  const {
    selectedTask,
    completeTask,
    selectTask,
    openAddTask,
    getTodayTasks,
    getCompletedTasks,
  } = useTaskContext();

  const inputRef = useRef<HTMLInputElement>(null);
  const todayTasks = getTodayTasks();
  const completedTasks = getCompletedTasks();

  const showActive = activeFilter === 'all' || activeFilter === 'active';
  const showCompleted = activeFilter === 'all' || activeFilter === 'completed';

  return (
    <div className="flex h-full flex-col">
      <main className="flex-1 overflow-y-auto px-8 py-6">
        <AddTaskInput ref={inputRef} />

        {todayTasks.length === 0 && completedTasks.length === 0 ? (
          <EmptyState type="today" onAddTask={openAddTask} />
        ) : (
          <>
            {showActive && todayTasks.length > 0 && (
              <TaskSection
                title="TODAY"
                tasks={todayTasks}
                onTaskClick={selectTask}
                onTaskComplete={completeTask}
                emptyMessage="No tasks for today"
                selectedTaskId={selectedTask?.id}
              />
            )}

            {showCompleted && completedTasks.length > 0 && (
              <TaskSection
                title="COMPLETED"
                tasks={completedTasks}
                onTaskClick={selectTask}
                onTaskComplete={completeTask}
                collapsible
                defaultCollapsed={activeFilter !== 'completed'}
                showCount
                selectedTaskId={selectedTask?.id}
              />
            )}

            {activeFilter === 'active' && todayTasks.length === 0 && (
              <EmptyState type="today" onAddTask={openAddTask} />
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
