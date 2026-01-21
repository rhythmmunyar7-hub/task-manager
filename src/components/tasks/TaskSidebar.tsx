'use client';

import { useState } from 'react';
import { NavLink } from '@/components/NavLink';
import { Calendar, Inbox, FolderOpen, ListTodo, Keyboard, Settings, ChevronDown, ChevronRight } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { cn } from '@/lib/utils';

interface TaskSidebarProps {
  onKeyboardShortcutsClick?: () => void;
}

export function TaskSidebar({ onKeyboardShortcutsClick }: TaskSidebarProps) {
  const { getInboxTasks, getTodayTasks, projects } = useTaskContext();
  const [projectsExpanded, setProjectsExpanded] = useState(false);
  
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
    <aside className="flex h-full w-sidebar flex-col border-r border-capella-border bg-bg-sidebar">
      {/* Brand Header */}
      <div className="flex h-20 items-center px-5">
        <h1 className="text-lg font-semibold text-text-primary">
          Capella Pro
        </h1>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 px-3 py-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={cn(
                'group flex h-10 items-center gap-3 rounded-md px-3 text-[15px] font-medium',
                'text-text-secondary transition-colors duration-200',
                'hover:bg-bg-subtle hover:text-text-primary'
              )}
              activeClassName="bg-bg-elevated text-text-primary border-l-[3px] border-l-capella-primary rounded-l-none"
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span className="text-xs text-text-muted">
                  {item.count}
                </span>
              )}
            </NavLink>
          ))}

          {/* Projects Section */}
          <button
            onClick={() => setProjectsExpanded(!projectsExpanded)}
            className={cn(
              'group flex h-10 w-full items-center gap-3 rounded-md px-3 text-[15px] font-medium',
              'text-text-secondary transition-colors duration-200',
              'hover:bg-bg-subtle hover:text-text-primary'
            )}
          >
            <FolderOpen className="h-5 w-5 shrink-0" />
            <span className="flex-1 text-left">Projects</span>
            {projectsExpanded ? (
              <ChevronDown className="h-4 w-4 text-text-muted transition-transform duration-200" />
            ) : (
              <ChevronRight className="h-4 w-4 text-text-muted transition-transform duration-200" />
            )}
          </button>

          {/* Expanded Projects */}
          {projectsExpanded && (
            <div className="ml-8 space-y-1">
              {projects.map((project) => (
                <button
                  key={project.id}
                  className={cn(
                    'flex h-9 w-full items-center gap-2 rounded-md px-3 text-sm',
                    'text-text-secondary transition-colors duration-200',
                    'hover:bg-bg-subtle hover:text-text-primary'
                  )}
                >
                  <div 
                    className={cn(
                      'h-2 w-2 rounded-full',
                      project.color === 'blue' && 'bg-capella-primary',
                      project.color === 'purple' && 'bg-capella-purple',
                      project.color === 'green' && 'bg-capella-success',
                      project.color === 'orange' && 'bg-capella-warning',
                      project.color === 'pink' && 'bg-pink-500',
                      project.color === 'yellow' && 'bg-yellow-500'
                    )}
                  />
                  <span>{project.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Bottom Utilities */}
      <div className="border-t border-capella-border px-3 py-3">
        <button
          onClick={onKeyboardShortcutsClick}
          className={cn(
            'flex h-10 w-full items-center gap-3 rounded-md px-3 text-[15px] font-medium',
            'text-text-secondary transition-colors duration-200',
            'hover:bg-bg-subtle hover:text-text-primary'
          )}
        >
          <Keyboard className="h-5 w-5 shrink-0" />
          <span>Keyboard Shortcuts</span>
        </button>
        <button
          className={cn(
            'flex h-10 w-full items-center gap-3 rounded-md px-3 text-[15px] font-medium',
            'text-text-secondary transition-colors duration-200',
            'hover:bg-bg-subtle hover:text-text-primary'
          )}
        >
          <Settings className="h-5 w-5 shrink-0" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
