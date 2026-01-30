'use client';

import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, LayoutGrid, Zap, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopBarProps {
  onAddClick: () => void;
  onPlanClick: () => void;
  onSprintClick: () => void;
  onTriageClick: () => void;
  sprintTaskCount: number;
  triageCount: number;
  canTriage: boolean;
}

const navItems = [
  { path: '/tasks', label: 'Today' },
  { path: '/tasks/inbox', label: 'Inbox' },
  { path: '/tasks/all', label: 'All' },
];

export function TopBar({ 
  onAddClick, 
  onPlanClick, 
  onSprintClick, 
  onTriageClick,
  sprintTaskCount, 
  triageCount,
  canTriage,
}: TopBarProps) {
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

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        {/* Triage Button - shows when there are triageable tasks */}
        {canTriage && triageCount > 0 && (
          <button
            onClick={onTriageClick}
            className={cn(
              'flex items-center gap-2 h-8 px-3 rounded-md text-[13px] font-medium',
              'text-text-muted hover:text-text-primary',
              'transition-colors duration-150 hover:bg-white/[0.04]'
            )}
            aria-label="Start triage"
            title="Triage Later Tasks (⌘⇧T)"
          >
            <Inbox className="h-4 w-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">Triage</span>
            <span className="text-[11px] opacity-60">{triageCount}</span>
          </button>
        )}

        {/* Focus Sprint Button - shows when tasks are selected */}
        {sprintTaskCount > 0 && (
          <button
            onClick={onSprintClick}
            className={cn(
              'flex items-center gap-2 h-8 px-3 rounded-md text-[13px] font-medium',
              'bg-capella-primary/10 text-capella-primary',
              'hover:bg-capella-primary/20',
              'transition-colors duration-150'
            )}
            aria-label="Start focus sprint"
            title="Start Focus Sprint (⌘⇧F)"
          >
            <Zap className="h-4 w-4" strokeWidth={2} />
            <span className="hidden sm:inline">Sprint ({sprintTaskCount})</span>
            <span className="sm:hidden">{sprintTaskCount}</span>
          </button>
        )}

        {/* Plan Button */}
        <button
          onClick={onPlanClick}
          className={cn(
            'flex items-center gap-2 h-8 px-3 rounded-md text-[13px] font-medium',
            'text-text-muted hover:text-text-primary',
            'transition-colors duration-150 hover:bg-white/[0.04]'
          )}
          aria-label="Open planning mode"
          title="Plan (⌘P)"
        >
          <LayoutGrid className="h-4 w-4" strokeWidth={2} />
          <span className="hidden sm:inline">Plan</span>
        </button>

        {/* Add Task */}
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
      </div>
    </header>
  );
}
