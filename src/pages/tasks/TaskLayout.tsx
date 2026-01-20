'use client';

import { Outlet } from 'react-router-dom';
import { TaskNavigation } from '@/components/tasks/TaskNavigation';

export default function TaskLayout() {
  return (
    <div className="flex h-screen flex-col bg-background">
      <TaskNavigation />
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
