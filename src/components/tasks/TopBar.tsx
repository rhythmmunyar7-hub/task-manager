'use client';

import { Plus } from 'lucide-react';
import { TaskFilter } from '@/types/task';
import { cn } from '@/lib/utils';

interface TopBarProps {
  title: string;
  count?: number;
  showFilters?: boolean;
  activeFilter?: TaskFilter;
  onFilterChange?: (filter: TaskFilter) => void;
  onAddClick?: () => void;
}

export function TopBar({
  title,
  count,
  showFilters = false,
  activeFilter = 'all',
  onFilterChange,
  onAddClick,
}: TopBarProps) {
  const filters: { value: TaskFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <header className="border-b border-capella-border bg-bg-main">
      {/* Main Header Row - 68px height */}
      <div className="flex h-[68px] items-center justify-between px-6">
        {/* Left: Title + Count */}
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            {title}
          </h1>
          {count !== undefined && count > 0 && (
            <p className="mt-0.5 text-[13px] text-text-muted">
              {count} {count === 1 ? 'task' : 'tasks'}
            </p>
          )}
        </div>

        {/* Right: Add Button */}
        <button
          onClick={onAddClick}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-md',
            'bg-bg-elevated border border-capella-border-subtle',
            'transition-colors duration-200 hover:bg-bg-subtle'
          )}
          aria-label="Add task"
        >
          <Plus className="h-5 w-5 text-text-primary" />
        </button>
      </div>

      {/* Optional Filter Bar - 44px height */}
      {showFilters && (
        <div className="flex h-11 items-center gap-2 border-t border-capella-border px-6">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => onFilterChange?.(filter.value)}
              className={cn(
                'h-8 rounded-md px-3 text-[13px] font-medium transition-colors duration-200',
                activeFilter === filter.value
                  ? 'bg-capella-primary text-white'
                  : 'bg-bg-elevated text-text-secondary hover:bg-bg-subtle hover:text-text-primary'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
