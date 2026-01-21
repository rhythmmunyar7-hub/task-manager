'use client';

import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { UnifiedTopBar } from '@/components/tasks/UnifiedTopBar';
import { KeyboardShortcutsModal } from '@/components/tasks/KeyboardShortcutsModal';
import { TaskDetailPanel } from '@/components/tasks/TaskDetailPanel';
import { useTaskContext } from '@/context/TaskContext';
import { cn } from '@/lib/utils';
import { TaskFilter } from '@/types/task';

export default function TaskLayout() {
  const location = useLocation();
  const { 
    selectedTask, 
    projects, 
    selectTask, 
    updateTask, 
    deleteTask,
    openAddTask,
    getTodayTasks,
    getInboxTasks,
    tasks,
  } = useTaskContext();
  
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('all');

  // Determine current view name and task count
  const getCurrentViewInfo = () => {
    switch (location.pathname) {
      case '/tasks':
        return { name: 'Today', count: getTodayTasks().length };
      case '/tasks/inbox':
        return { name: 'Inbox', count: getInboxTasks().length };
      case '/tasks/all':
        return { name: 'All Tasks', count: tasks.length };
      default:
        return { name: 'Tasks', count: tasks.length };
    }
  };

  const viewInfo = getCurrentViewInfo();

  return (
    <div className="flex h-screen w-full flex-col bg-bg-main">
      {/* Unified Top Bar */}
      <UnifiedTopBar
        taskCount={viewInfo.count}
        currentView={viewInfo.name}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onAddClick={openAddTask}
        onSettingsClick={() => setShowShortcuts(true)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Task List Area - Flexible width */}
        <main 
          className={cn(
            'flex-1 overflow-hidden transition-all duration-200 ease-in-out',
            'min-w-0'
          )}
        >
          <Outlet context={{ activeFilter }} />
        </main>

        {/* Detail Panel - Pushes content, doesn't overlay (Desktop only) */}
        {selectedTask && (
          <div className="hidden md:block shrink-0 w-[380px] border-l border-capella-border bg-bg-main">
            <TaskDetailPanel
              task={selectedTask}
              projects={projects}
              onClose={() => selectTask(null)}
              onUpdate={updateTask}
              onDelete={deleteTask}
            />
          </div>
        )}
      </div>

      {/* Mobile Detail Panel - Bottom sheet */}
      <div className="md:hidden">
        <TaskDetailPanel
          task={selectedTask}
          projects={projects}
          onClose={() => selectTask(null)}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      </div>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal 
        isOpen={showShortcuts} 
        onClose={() => setShowShortcuts(false)} 
      />
    </div>
  );
}
