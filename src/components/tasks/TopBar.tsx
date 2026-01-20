'use client';

import { Plus } from 'lucide-react';
import { TaskFilter } from '@/types/task';

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
    <header className="flex h-14 items-center justify-between border-b border-surface-border bg-background px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-foreground">
          {title}
          {count !== undefined && (
            <span className="ml-2 text-muted-foreground">· {count}</span>
          )}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {showFilters && (
          <nav className="flex items-center gap-1">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => onFilterChange?.(filter.value)}
                className={`rounded-md px-3 py-1 text-sm transition-colors duration-150 ${
                  activeFilter === filter.value
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </nav>
        )}

        <button
          onClick={onAddClick}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Task</span>
        </button>
      </div>
    </header>
  );
}
