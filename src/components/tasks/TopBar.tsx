'use client';

import { useLocation, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopBarProps {
  onAddClick: () => void;
}

const navItems = [
  { path: '/tasks', label: 'Today' },
  { path: '/tasks/inbox', label: 'Inbox' },
  { path: '/tasks/all', label: 'All' },
];

export function TopBar({ onAddClick }: TopBarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="h-12 bg-bg-main flex items-center justify-between px-8 border-b border-white/[0.04]">
      {/* Left: Calm Navigation */}
      <nav className="flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'h-8 px-4 rounded-md text-[13px] font-medium transition-colors duration-150',
                isActive
                  ? 'bg-white/[0.06] text-text-primary'
                  : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.03]'
              )}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Right: Add Task - Always visible, calm */}
      <button
        onClick={onAddClick}
        className={cn(
          'flex items-center gap-2 h-8 px-3 rounded-md text-[13px] font-medium',
          'text-text-muted hover:text-text-primary',
          'transition-colors duration-150 hover:bg-white/[0.04]'
        )}
        aria-label="Add task"
      >
        <Plus className="h-4 w-4" strokeWidth={2} />
        <span className="hidden sm:inline">Add Task</span>
      </button>
    </header>
  );
}
