'use client';

import { NavLink } from '@/components/NavLink';
import { Calendar, Inbox, FolderOpen, ListTodo, Settings } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { cn } from '@/lib/utils';

export function MobileBottomNav() {
  const { getInboxTasks, getTodayTasks } = useTaskContext();
  const inboxCount = getInboxTasks().length;
  const todayCount = getTodayTasks().length;

  const navItems = [
    { to: '/tasks', label: 'Today', icon: Calendar, count: todayCount, end: true },
    { to: '/tasks/inbox', label: 'Inbox', icon: Inbox, count: inboxCount, end: false },
    { to: '/tasks/projects', label: 'Projects', icon: FolderOpen, end: false },
    { to: '/tasks/all', label: 'All', icon: ListTodo, end: false },
    { to: '/tasks/settings', label: 'More', icon: Settings, end: false },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-capella-border bg-bg-sidebar md:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={cn(
            'relative flex h-12 w-12 flex-col items-center justify-center gap-0.5',
            'text-text-secondary transition-colors duration-200'
          )}
          activeClassName="text-capella-primary"
        >
          <item.icon className="h-6 w-6" />
          <span className="text-[11px]">{item.label}</span>
          {item.count !== undefined && item.count > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-capella-primary text-[10px] font-medium text-white">
              {item.count > 9 ? '9+' : item.count}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
