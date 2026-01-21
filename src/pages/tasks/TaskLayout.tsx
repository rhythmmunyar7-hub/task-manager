'use client';

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TaskSidebar } from '@/components/tasks/TaskSidebar';
import { MobileBottomNav } from '@/components/tasks/MobileBottomNav';
import { KeyboardShortcutsModal } from '@/components/tasks/KeyboardShortcutsModal';
import { TaskDetailPanel } from '@/components/tasks/TaskDetailPanel';
import { useTaskContext } from '@/context/TaskContext';
import { cn } from '@/lib/utils';

export default function TaskLayout() {
  const { selectedTask, projects, selectTask, updateTask, deleteTask } = useTaskContext();
  const [showShortcuts, setShowShortcuts] = useState(false);

  return (
    <div className="flex h-screen w-full bg-bg-main">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:block shrink-0">
        <TaskSidebar onKeyboardShortcutsClick={() => setShowShortcuts(true)} />
      </div>

      {/* Main Content - Flexible width, shrinks when panel opens */}
      <main 
        className={cn(
          'flex-1 overflow-hidden transition-all duration-[250ms] ease-in-out',
          'min-w-0 md:min-w-main',
          // Add bottom padding on mobile for bottom nav
          'pb-16 md:pb-0'
        )}
      >
        <Outlet />
      </main>

      {/* Detail Panel - Pushes main content, doesn't overlay */}
      {selectedTask && (
        <div className="hidden md:block shrink-0 w-panel border-l border-capella-border bg-bg-main">
          <TaskDetailPanel
            task={selectedTask}
            projects={projects}
            onClose={() => selectTask(null)}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        </div>
      )}

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

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal 
        isOpen={showShortcuts} 
        onClose={() => setShowShortcuts(false)} 
      />
    </div>
  );
}
