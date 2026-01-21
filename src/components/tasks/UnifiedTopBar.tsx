'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SlidersHorizontal, Search, Plus, Settings, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskFilter } from '@/types/task';

interface UnifiedTopBarProps {
  taskCount: number;
  currentView: string;
  activeFilter?: TaskFilter;
  onFilterChange?: (filter: TaskFilter) => void;
  onAddClick: () => void;
  onSettingsClick: () => void;
}

const navItems = [
  { path: '/tasks', label: 'Today' },
  { path: '/tasks/inbox', label: 'Inbox' },
  { path: '/tasks/all', label: 'All Tasks' },
];

export function UnifiedTopBar({
  taskCount,
  currentView,
  activeFilter = 'all',
  onFilterChange,
  onAddClick,
  onSettingsClick,
}: UnifiedTopBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // Handle escape key to close search/filter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (searchOpen) {
          setSearchOpen(false);
          setSearchQuery('');
        }
        if (filterOpen) {
          setFilterOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, filterOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };

    if (filterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [filterOpen]);

  const hasActiveFilter = activeFilter !== 'all';

  return (
    <header className="h-14 border-b border-capella-border/10 bg-bg-main flex items-center px-6">
      {/* Left: Context Switcher */}
      <nav className="flex items-center gap-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'relative text-sm font-medium transition-colors duration-150',
                isActive
                  ? 'text-text-primary'
                  : 'text-text-muted hover:text-text-secondary'
              )}
            >
              {item.label}
              {/* Active indicator - thin blue underline */}
              {isActive && (
                <span className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-capella-primary" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Center: View Identity */}
      <div className="flex-1 flex justify-center">
        <span className="text-xs text-text-muted">
          {currentView} · {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {/* Right: Action Zone */}
      <div className="flex items-center gap-2">
        {/* Filter Button */}
        <div ref={filterRef} className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={cn(
              'relative flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150',
              'text-text-muted hover:text-text-secondary hover:bg-bg-elevated'
            )}
            aria-label="Filter tasks"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {/* Active filter indicator - amber dot */}
            {hasActiveFilter && (
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-capella-warning" />
            )}
          </button>

          {/* Filter Dropdown */}
          {filterOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-md border border-capella-border bg-bg-elevated shadow-lg z-50">
              <div className="p-1">
                <button
                  onClick={() => {
                    onFilterChange?.('all');
                    setFilterOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded px-3 py-2 text-sm transition-colors',
                    activeFilter === 'all'
                      ? 'bg-bg-subtle text-text-primary'
                      : 'text-text-secondary hover:bg-bg-subtle hover:text-text-primary'
                  )}
                >
                  All Tasks
                  {activeFilter === 'all' && <Check className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => {
                    onFilterChange?.('active');
                    setFilterOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded px-3 py-2 text-sm transition-colors',
                    activeFilter === 'active'
                      ? 'bg-bg-subtle text-text-primary'
                      : 'text-text-secondary hover:bg-bg-subtle hover:text-text-primary'
                  )}
                >
                  Active Only
                  {activeFilter === 'active' && <Check className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => {
                    onFilterChange?.('completed');
                    setFilterOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded px-3 py-2 text-sm transition-colors',
                    activeFilter === 'completed'
                      ? 'bg-bg-subtle text-text-primary'
                      : 'text-text-secondary hover:bg-bg-subtle hover:text-text-primary'
                  )}
                >
                  Completed
                  {activeFilter === 'completed' && <Check className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search */}
        {searchOpen ? (
          <div className="flex items-center gap-2">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className={cn(
                'h-8 w-48 rounded-md px-3 text-sm',
                'bg-bg-input border border-capella-border-subtle',
                'text-text-primary placeholder:text-text-muted',
                'focus:border-capella-primary focus:outline-none'
              )}
            />
            <button
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery('');
              }}
              className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted hover:text-text-secondary hover:bg-bg-elevated transition-colors"
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted hover:text-text-secondary hover:bg-bg-elevated transition-colors duration-150"
            aria-label="Search tasks"
          >
            <Search className="h-4 w-4" />
          </button>
        )}

        {/* Add Task Button - Green Primary Action */}
        <button
          onClick={onAddClick}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150',
            'bg-capella-success text-black hover:bg-capella-success/90'
          )}
          aria-label="Add task"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
        </button>

        {/* Settings */}
        <button
          onClick={onSettingsClick}
          className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted hover:text-text-secondary hover:bg-bg-elevated transition-colors duration-150"
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
