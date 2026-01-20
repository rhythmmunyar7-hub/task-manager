'use client';

import { useRef } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { TopBar } from '@/components/tasks/TopBar';
import { AddTaskInput } from '@/components/tasks/AddTaskInput';
import { TaskSection } from '@/components/tasks/TaskSection';
import { TaskDetailPanel } from '@/components/tasks/TaskDetailPanel';

export default function InboxView() {
  const {
    projects,
    selectedTask,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    selectTask,
    getInboxTasks,
  } = useTaskContext();

  const inputRef = useRef<HTMLInputElement>(null);

  const inboxTasks = getInboxTasks();

  const handleAddClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="flex h-full flex-col">
      <TopBar
        title="Inbox"
        count={inboxTasks.length}
        onAddClick={handleAddClick}
      />

      <main className="flex-1 overflow-y-auto p-6">
        <AddTaskInput onAdd={addTask} />

        <TaskSection
          title="Inbox"
          tasks={inboxTasks}
          onTaskClick={selectTask}
          onTaskComplete={completeTask}
          emptyMessage="Inbox is empty"
        />
      </main>

      <TaskDetailPanel
        task={selectedTask}
        projects={projects}
        onClose={() => selectTask(null)}
        onUpdate={updateTask}
        onDelete={deleteTask}
      />
    </div>
  );
}
