'use client';

import { NavLink } from '@/components/NavLink';
import { Calendar, Inbox, ListTodo } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';

export function TaskNavigation() {
  const { getInboxTasks, getTodayTasks } = useTaskContext();
  const inboxCount = getInboxTasks().length;
  const todayCount = getTodayTasks().length;

  const navItems = [
    {
      to: '/tasks',
      label: 'Today',
      icon: Calendar,
      count: todayCount,
      end: true,
    },
    {
      to: '/tasks/inbox',
      label: 'Inbox',
      icon: Inbox,
      count: inboxCount,
      end: false,
    },
    {
      to: '/tasks/all',
      label: 'All Tasks',
      icon: ListTodo,
      end: false,
    },
  ];

  return (
    <nav className="flex items-center gap-1 border-b border-surface-border bg-background px-6 py-2">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
          activeClassName="bg-secondary text-foreground"
        >
          <item.icon className="h-4 w-4" />
          <span>{item.label}</span>
          {item.count !== undefined && item.count > 0 && (
            <span className="ml-1 rounded-full bg-surface-hover px-2 py-0.5 text-[10px] font-medium">
              {item.count}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
