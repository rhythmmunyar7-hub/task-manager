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

export default function InboxView() {
  const { activeFilter } = useOutletContext<OutletContext>();
  const {
    selectedTask,
    completeTask,
    selectTask,
    openAddTask,
    getInboxTasks,
    getCompletedTasks,
  } = useTaskContext();

  const inputRef = useRef<HTMLInputElement>(null);
  const inboxTasks = getInboxTasks();
  const completedTasks = getCompletedTasks();

  const showActive = activeFilter === 'all' || activeFilter === 'active';
  const showCompleted = activeFilter === 'all' || activeFilter === 'completed';

  return (
    <div className="flex h-full flex-col">
      <main className="flex-1 overflow-y-auto px-8 py-6">
        <AddTaskInput ref={inputRef} />

        {inboxTasks.length === 0 && completedTasks.length === 0 ? (
          <EmptyState type="inbox" onAddTask={openAddTask} />
        ) : (
          <>
            {showActive && inboxTasks.length > 0 && (
              <TaskSection
                title="INBOX"
                tasks={inboxTasks}
                onTaskClick={selectTask}
                onTaskComplete={completeTask}
                emptyMessage="Inbox is empty"
                selectedTaskId={selectedTask?.id}
                sectionType="inbox"
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
                sectionType="completed"
              />
            )}

            {activeFilter === 'active' && inboxTasks.length === 0 && (
              <EmptyState type="inbox" onAddTask={openAddTask} />
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
