'use client';

import { useState, useRef } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { TopBar } from '@/components/tasks/TopBar';
import { AddTaskInput } from '@/components/tasks/AddTaskInput';
import { TaskSection } from '@/components/tasks/TaskSection';
import { TaskDetailPanel } from '@/components/tasks/TaskDetailPanel';
import { TaskFilter } from '@/types/task';

export default function AllTasksView() {
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
    getInboxTasks,
    getCompletedTasks,
    getUpcomingTasks,
  } = useTaskContext();

  const [filter, setFilter] = useState<TaskFilter>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  const todayTasks = getTodayTasks();
  const upcomingTasks = getUpcomingTasks();
  const inboxTasks = getInboxTasks();
  const completedTasks = getCompletedTasks();

  // Get overdue tasks
  const overdueTasks = tasks.filter(
    (task) => !task.completed && task.dueDate === 'overdue'
  );

  const handleAddClick = () => {
    inputRef.current?.focus();
  };

  // Filter tasks based on active filter
  const showActive = filter === 'all' || filter === 'active';
  const showCompleted = filter === 'all' || filter === 'completed';

  return (
    <div className="flex h-full flex-col">
      <TopBar
        title="All Tasks"
        showFilters
        activeFilter={filter}
        onFilterChange={setFilter}
        onAddClick={handleAddClick}
      />

      <main className="flex-1 overflow-y-auto p-6">
        <AddTaskInput onAdd={addTask} />

        {showActive && (
          <>
            {overdueTasks.length > 0 && (
              <TaskSection
                title="Overdue"
                tasks={overdueTasks}
                onTaskClick={selectTask}
                onTaskComplete={completeTask}
                showCount
              />
            )}

            <TaskSection
              title="Today"
              tasks={todayTasks}
              onTaskClick={selectTask}
              onTaskComplete={completeTask}
              showCount
            />

            <TaskSection
              title="Upcoming"
              tasks={upcomingTasks}
              onTaskClick={selectTask}
              onTaskComplete={completeTask}
              showCount
              collapsible
            />

            <TaskSection
              title="Inbox"
              tasks={inboxTasks}
              onTaskClick={selectTask}
              onTaskComplete={completeTask}
              showCount
              collapsible
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
          />
        )}

        {filter === 'completed' && completedTasks.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No completed tasks
          </div>
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
