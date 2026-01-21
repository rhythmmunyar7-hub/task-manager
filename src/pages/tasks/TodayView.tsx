'use client';

import { useRef } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { TopBar } from '@/components/tasks/TopBar';
import { AddTaskInput } from '@/components/tasks/AddTaskInput';
import { TaskSection } from '@/components/tasks/TaskSection';
import { EmptyState } from '@/components/tasks/EmptyState';

export default function TodayView() {
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

  return (
    <div className="flex h-full flex-col">
      <TopBar 
        title="Today" 
        count={todayTasks.length}
        onAddClick={openAddTask} 
      />

      <main className="flex-1 overflow-y-auto p-6">
        <AddTaskInput ref={inputRef} />

        {todayTasks.length === 0 && completedTasks.length === 0 ? (
          <EmptyState type="today" onAddTask={openAddTask} />
        ) : (
          <>
            <TaskSection
              title="Today"
              tasks={todayTasks}
              onTaskClick={selectTask}
              onTaskComplete={completeTask}
              emptyMessage="No tasks for today"
              selectedTaskId={selectedTask?.id}
            />

            {completedTasks.length > 0 && (
              <TaskSection
                title="Completed"
                tasks={completedTasks}
                onTaskClick={selectTask}
                onTaskComplete={completeTask}
                collapsible
                defaultCollapsed
                showCount
                selectedTaskId={selectedTask?.id}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
