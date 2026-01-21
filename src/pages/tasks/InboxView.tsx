'use client';

import { useRef } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { TopBar } from '@/components/tasks/TopBar';
import { AddTaskInput } from '@/components/tasks/AddTaskInput';
import { TaskSection } from '@/components/tasks/TaskSection';
import { EmptyState } from '@/components/tasks/EmptyState';

export default function InboxView() {
  const {
    selectedTask,
    completeTask,
    selectTask,
    openAddTask,
    getInboxTasks,
  } = useTaskContext();

  const inputRef = useRef<HTMLInputElement>(null);
  const inboxTasks = getInboxTasks();

  return (
    <div className="flex h-full flex-col">
      <TopBar
        title="Inbox"
        count={inboxTasks.length}
        onAddClick={openAddTask}
      />

      <main className="flex-1 overflow-y-auto p-6">
        <AddTaskInput ref={inputRef} />

        {inboxTasks.length === 0 ? (
          <EmptyState type="inbox" />
        ) : (
          <TaskSection
            title="Inbox"
            tasks={inboxTasks}
            onTaskClick={selectTask}
            onTaskComplete={completeTask}
            emptyMessage="Inbox is empty"
            selectedTaskId={selectedTask?.id}
          />
        )}
      </main>
    </div>
  );
}
