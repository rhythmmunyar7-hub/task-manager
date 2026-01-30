'use client';

import { useState, useRef } from 'react';
import { ChevronDown, AlertTriangle, Lock } from 'lucide-react';
import { TimeColumn, ColumnConfig, PlanningTask } from '@/types/planning';
import { PlanningTaskCard } from './PlanningTaskCard';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  config: ColumnConfig;
  tasks: PlanningTask[];
  count: number;
  isOverLimit: boolean;
  isWarning: boolean;
  onTaskClick: (task: PlanningTask) => void;
  onDragStart: (e: React.DragEvent, task: PlanningTask) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, columnId: TimeColumn, index: number) => void;
  onDragEnd: () => void;
  draggedTask: PlanningTask | null;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

/**
 * Kanban Column for Planning Mode
 * - Fixed header with label and count
 * - Limit indicator (hard limit shows lock, soft limit shows warning)
 * - Drag-drop zone
 * - Collapsible (for "Later" column)
 */
export function KanbanColumn({
  config,
  tasks,
  count,
  isOverLimit,
  isWarning,
  onTaskClick,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  draggedTask,
  collapsed = false,
  onToggleCollapse,
}: KanbanColumnProps) {
  const [isDropTarget, setIsDropTarget] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver(e);
    
    // Don't allow drop if hard limit reached and dragging from different column
    if (isOverLimit && draggedTask?.column !== config.id) {
      e.dataTransfer.dropEffect = 'none';
      return;
    }
    
    e.dataTransfer.dropEffect = 'move';
    setIsDropTarget(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
      setIsDropTarget(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropTarget(false);
    
    // Calculate drop index based on mouse position
    const dropZone = dropZoneRef.current;
    if (!dropZone) {
      onDrop(e, config.id, tasks.length);
      return;
    }

    const cards = dropZone.querySelectorAll('[data-task-card]');
    const mouseY = e.clientY;
    let dropIndex = tasks.length;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      const rect = card.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;

      if (mouseY < midY) {
        dropIndex = i;
        break;
      }
    }

    onDrop(e, config.id, dropIndex);
  };

  const showLimitBadge = config.limit !== Infinity;
  const limitText = config.isHardLimit 
    ? `${count}/${config.limit}` 
    : config.warnAt 
      ? `${count}/${config.limit}` 
      : count.toString();

  return (
    <div className={cn(
      'flex flex-col h-full min-w-[280px] max-w-[320px]',
      config.id === 'later' && 'min-w-[200px] max-w-[240px]'
    )}>
      {/* Column Header */}
      <div 
        className={cn(
          'flex items-center justify-between px-3 py-2.5 rounded-t-lg',
          'bg-bg-elevated border-b border-white/[0.04]',
          collapsed && 'rounded-b-lg'
        )}
        onClick={config.collapsed ? onToggleCollapse : undefined}
        role={config.collapsed ? 'button' : undefined}
      >
        <div className="flex items-center gap-2">
          {config.collapsed && (
            <ChevronDown 
              className={cn(
                'h-4 w-4 text-text-muted transition-transform',
                !collapsed && 'rotate-180'
              )}
            />
          )}
          <h3 className="text-[13px] font-medium text-text-secondary">
            {config.label}
          </h3>
        </div>

        {/* Limit Badge */}
        {showLimitBadge && (
          <div className={cn(
            'flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium',
            isOverLimit && 'bg-capella-danger/20 text-capella-danger',
            isWarning && !isOverLimit && 'bg-capella-warning/20 text-capella-warning',
            !isOverLimit && !isWarning && 'bg-white/[0.06] text-text-muted'
          )}>
            {isOverLimit && <Lock className="h-3 w-3" />}
            {isWarning && !isOverLimit && <AlertTriangle className="h-3 w-3" />}
            <span>{limitText}</span>
          </div>
        )}

        {/* Just count for Later */}
        {!showLimitBadge && count > 0 && (
          <span className="text-[12px] text-text-muted">
            {count}
          </span>
        )}
      </div>

      {/* Drop Zone */}
      {!collapsed && (
        <div
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'flex-1 overflow-y-auto p-2 space-y-2',
            'bg-bg-subtle/50 rounded-b-lg',
            'transition-colors duration-150',
            isDropTarget && !isOverLimit && 'bg-capella-primary/5 ring-2 ring-inset ring-capella-primary/20',
            isDropTarget && isOverLimit && draggedTask?.column !== config.id && 'bg-capella-danger/5 ring-2 ring-inset ring-capella-danger/20'
          )}
        >
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center h-20 text-[13px] text-text-muted/50 border border-dashed border-white/[0.08] rounded-lg">
              {config.id === 'today' ? 'Focus on what matters' : 'Drop tasks here'}
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                data-task-card
                draggable
                onDragStart={(e) => onDragStart(e, task)}
                onDragEnd={onDragEnd}
              >
                <PlanningTaskCard
                  task={task}
                  onClick={() => onTaskClick(task)}
                  isDragging={draggedTask?.id === task.id}
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
