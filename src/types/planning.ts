/**
 * Capella Pro Planning Mode Types
 * 
 * Planning Mode is for temporal load balancing under constraint.
 * Fixed 4-column time model — no customization.
 */

import { Task } from './task';

// Fixed time columns - no exceptions
export type TimeColumn = 'today' | 'next3days' | 'thisWeek' | 'later';

// Column configuration with hard/soft limits
export interface ColumnConfig {
  id: TimeColumn;
  label: string;
  limit: number;
  warnAt?: number; // Soft warning threshold
  isHardLimit: boolean;
  collapsed?: boolean; // For "Later" column
}

// Task positioned in planning view
export interface PlanningTask extends Task {
  column: TimeColumn;
  orderInColumn: number;
}

// Column state
export interface ColumnState {
  tasks: PlanningTask[];
  isOverLimit: boolean;
  isWarning: boolean;
  count: number;
}

// Planning mode state
export interface PlanningState {
  isActive: boolean;
  columns: Record<TimeColumn, ColumnState>;
  enteredAt: Date | null;
  hasUnsavedChanges: boolean;
}

// AI warnings during planning
export interface PlanningWarning {
  type: 'overload' | 'energy-imbalance' | 'dependency-conflict' | 'deadline-risk';
  message: string;
  columnId?: TimeColumn;
  taskIds?: string[];
}

// Planning session summary (shown on exit)
export interface PlanningExitSummary {
  todayCount: number;
  thisWeekCount: number;
  deferredCount: number;
  changesFromAI: number;
}

// Column definitions - fixed, no customization
export const COLUMN_CONFIGS: ColumnConfig[] = [
  {
    id: 'today',
    label: 'Today',
    limit: 5,
    isHardLimit: true,
  },
  {
    id: 'next3days',
    label: 'Next 3 Days',
    limit: 12,
    warnAt: 10,
    isHardLimit: false,
  },
  {
    id: 'thisWeek',
    label: 'This Week',
    limit: 20,
    warnAt: 18,
    isHardLimit: false,
  },
  {
    id: 'later',
    label: 'Later',
    limit: Infinity,
    isHardLimit: false,
    collapsed: true,
  },
];
