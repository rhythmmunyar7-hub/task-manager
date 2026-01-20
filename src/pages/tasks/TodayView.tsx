'use client';

import { useRef } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { TopBar } from '@/components/tasks/TopBar';
import { AddTaskInput } from '@/components/tasks/AddTaskInput';
import { TaskSection } from '@/components/tasks/TaskSection';
import { TaskDetailPanel } from '@/components/tasks/TaskDetailPanel';

export default function TodayView() {
  const {
    tasks,
    projects,
    selectedTask,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    selectTask,
    getTodayTasks,
    getCompletedTasks,
  } = useTaskContext();

  const inputRef = useRef<HTMLInputElement>(null);

  const todayTasks = getTodayTasks();
  const completedTasks = getCompletedTasks();

  const handleAddClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="flex h-full flex-col">
      <TopBar title="Today" onAddClick={handleAddClick} />

      <main className="flex-1 overflow-y-auto p-6">
        <AddTaskInput onAdd={addTask} />

        <TaskSection
          title="Today"
          tasks={todayTasks}
          onTaskClick={selectTask}
          onTaskComplete={completeTask}
          emptyMessage="No tasks for today"
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
          />
        )}
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
