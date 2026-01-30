'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Task } from '@/types/task';
import { 
  TimeColumn, 
  PlanningTask, 
  ColumnState, 
  PlanningWarning,
  PlanningExitSummary,
  COLUMN_CONFIGS,
} from '@/types/planning';
import { getDateStatus, DateStatus } from '@/lib/date-utils';
import { classifyEnergyType } from '@/lib/task-intelligence';
import { addDays, format, startOfDay } from 'date-fns';

// Auto-exit timeout (20 minutes)
const AUTO_EXIT_TIMEOUT = 20 * 60 * 1000;

// Map date status to initial column
function getInitialColumn(task: Task): TimeColumn {
  if (!task.dueDate) return 'later';
  
  const status = getDateStatus(task.dueDate);
  
  switch (status) {
    case 'overdue':
    case 'today':
      return 'today';
    case 'tomorrow':
      return 'next3days';
    case 'upcoming':
      return 'thisWeek';
    case 'future':
    default:
      return 'later';
  }
}

// Get target date for a column
function getColumnTargetDate(column: TimeColumn): string | undefined {
  const today = startOfDay(new Date());
  
  switch (column) {
    case 'today':
      return format(today, 'yyyy-MM-dd');
    case 'next3days':
      return format(addDays(today, 2), 'yyyy-MM-dd');
    case 'thisWeek':
      return format(addDays(today, 6), 'yyyy-MM-dd');
    case 'later':
      return undefined; // Clear due date for "Later"
  }
}

interface UsePlanningModeProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
}

interface UsePlanningModeReturn {
  isActive: boolean;
  enterPlanningMode: () => void;
  exitPlanningMode: () => void;
  columns: Record<TimeColumn, ColumnState>;
  moveTask: (taskId: string, targetColumn: TimeColumn, targetIndex: number) => boolean;
  reorderInColumn: (taskId: string, newIndex: number) => void;
  warnings: PlanningWarning[];
  exitSummary: PlanningExitSummary | null;
  canAddToColumn: (column: TimeColumn) => boolean;
  getColumnConfig: (column: TimeColumn) => typeof COLUMN_CONFIGS[0];
  laterExpanded: boolean;
  setLaterExpanded: (expanded: boolean) => void;
}

export function usePlanningMode({ 
  tasks, 
  onUpdateTask 
}: UsePlanningModeProps): UsePlanningModeReturn {
  const [isActive, setIsActive] = useState(false);
  const [planningTasks, setPlanningTasks] = useState<PlanningTask[]>([]);
  const [enteredAt, setEnteredAt] = useState<Date | null>(null);
  const [exitSummary, setExitSummary] = useState<PlanningExitSummary | null>(null);
  const [laterExpanded, setLaterExpanded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitialized = useRef(false);

  // Distribute tasks to columns on entry
  const distributeTasks = useCallback((sourceTasks: Task[]): PlanningTask[] => {
    const columnCounts: Record<TimeColumn, number> = {
      today: 0,
      next3days: 0,
      thisWeek: 0,
      later: 0,
    };

    const distributed: PlanningTask[] = [];

    // First pass: respect existing dates and limits
    const incompleteTasks = sourceTasks.filter(t => !t.completed);
    
    for (const task of incompleteTasks) {
      let column = getInitialColumn(task);
      
      // Enforce TODAY hard limit during initial distribution
      if (column === 'today' && columnCounts.today >= 5) {
        column = 'next3days';
      }
      
      distributed.push({
        ...task,
        column,
        orderInColumn: columnCounts[column],
      });
      
      columnCounts[column]++;
    }

    return distributed;
  }, []);

  // Enter planning mode
  const enterPlanningMode = useCallback(() => {
    const distributed = distributeTasks(tasks);
    setPlanningTasks(distributed);
    setEnteredAt(new Date());
    setExitSummary(null);
    setLaterExpanded(false);
    setIsActive(true);

    // Set auto-exit timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsActive(false);
    }, AUTO_EXIT_TIMEOUT);
  }, [tasks, distributeTasks]);

  // Auto-enter on mount
  useEffect(() => {
    if (!hasInitialized.current && tasks.length > 0) {
      hasInitialized.current = true;
      enterPlanningMode();
    }
  }, [tasks, enterPlanningMode]);

  // Exit planning mode and sync changes
  const exitPlanningMode = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Calculate summary
    const todayCount = planningTasks.filter(t => t.column === 'today').length;
    const thisWeekCount = planningTasks.filter(t => 
      t.column === 'today' || t.column === 'next3days' || t.column === 'thisWeek'
    ).length;
    const deferredCount = planningTasks.filter(t => t.column === 'later').length;

    setExitSummary({
      todayCount,
      thisWeekCount,
      deferredCount,
      changesFromAI: 0, // Would track AI-initiated changes
    });

    // Sync due dates back to tasks
    for (const pTask of planningTasks) {
      const originalTask = tasks.find(t => t.id === pTask.id);
      const targetDate = getColumnTargetDate(pTask.column);
      
      if (originalTask && originalTask.dueDate !== targetDate) {
        onUpdateTask(pTask.id, { dueDate: targetDate });
      }
    }

    setIsActive(false);
  }, [planningTasks, tasks, onUpdateTask]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Build column states
  const columns = useMemo((): Record<TimeColumn, ColumnState> => {
    const result: Record<TimeColumn, ColumnState> = {
      today: { tasks: [], isOverLimit: false, isWarning: false, count: 0 },
      next3days: { tasks: [], isOverLimit: false, isWarning: false, count: 0 },
      thisWeek: { tasks: [], isOverLimit: false, isWarning: false, count: 0 },
      later: { tasks: [], isOverLimit: false, isWarning: false, count: 0 },
    };

    for (const task of planningTasks) {
      result[task.column].tasks.push(task);
    }

    // Sort by order and apply limits/warnings
    for (const config of COLUMN_CONFIGS) {
      const col = result[config.id];
      col.tasks.sort((a, b) => a.orderInColumn - b.orderInColumn);
      col.count = col.tasks.length;
      col.isOverLimit = config.isHardLimit && col.count >= config.limit;
      col.isWarning = !config.isHardLimit && config.warnAt && col.count >= config.warnAt;
    }

    return result;
  }, [planningTasks]);

  // Check if we can add to a column
  const canAddToColumn = useCallback((column: TimeColumn): boolean => {
    const config = COLUMN_CONFIGS.find(c => c.id === column);
    if (!config) return false;
    if (!config.isHardLimit) return true;
    return columns[column].count < config.limit;
  }, [columns]);

  // Move task between columns
  const moveTask = useCallback((
    taskId: string, 
    targetColumn: TimeColumn, 
    targetIndex: number
  ): boolean => {
    // Check hard limit
    if (!canAddToColumn(targetColumn)) {
      return false;
    }

    setPlanningTasks(prev => {
      const taskIndex = prev.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return prev;

      const task = prev[taskIndex];
      const sourceColumn = task.column;

      // If same column, just reorder
      if (sourceColumn === targetColumn) {
        const newTasks = [...prev];
        
        // Get tasks in the column
        const columnTasks = newTasks.filter(t => t.column === targetColumn);
        const otherTasks = newTasks.filter(t => t.column !== targetColumn);
        
        // Remove and reinsert at new position
        const taskInColumn = columnTasks.findIndex(t => t.id === taskId);
        if (taskInColumn !== -1) {
          const [removed] = columnTasks.splice(taskInColumn, 1);
          columnTasks.splice(targetIndex, 0, removed);
          
          // Update order indices
          columnTasks.forEach((t, i) => {
            t.orderInColumn = i;
          });
        }

        return [...otherTasks, ...columnTasks];
      }

      // Moving to different column
      const newTasks = prev.map(t => {
        if (t.id === taskId) {
          return { ...t, column: targetColumn, orderInColumn: targetIndex };
        }
        // Adjust order in target column for tasks after insertion point
        if (t.column === targetColumn && t.orderInColumn >= targetIndex) {
          return { ...t, orderInColumn: t.orderInColumn + 1 };
        }
        // Adjust order in source column for tasks after removed task
        if (t.column === sourceColumn && t.orderInColumn > task.orderInColumn) {
          return { ...t, orderInColumn: t.orderInColumn - 1 };
        }
        return t;
      });

      return newTasks;
    });

    return true;
  }, [canAddToColumn]);

  // Reorder within same column
  const reorderInColumn = useCallback((taskId: string, newIndex: number) => {
    setPlanningTasks(prev => {
      const task = prev.find(t => t.id === taskId);
      if (!task) return prev;

      const columnTasks = prev
        .filter(t => t.column === task.column)
        .sort((a, b) => a.orderInColumn - b.orderInColumn);
      
      const currentIndex = columnTasks.findIndex(t => t.id === taskId);
      if (currentIndex === -1 || currentIndex === newIndex) return prev;

      // Reorder
      const [removed] = columnTasks.splice(currentIndex, 1);
      columnTasks.splice(newIndex, 0, removed);

      // Update indices
      const updated = new Map(columnTasks.map((t, i) => [t.id, i]));

      return prev.map(t => {
        if (t.column === task.column && updated.has(t.id)) {
          return { ...t, orderInColumn: updated.get(t.id)! };
        }
        return t;
      });
    });
  }, []);

  // Generate warnings
  const warnings = useMemo((): PlanningWarning[] => {
    const result: PlanningWarning[] = [];

    // Check for energy imbalance in TODAY
    const todayTasks = columns.today.tasks;
    const deepFocusCount = todayTasks.filter(t => {
      const energy = t.energyType || classifyEnergyType(t.title);
      return energy === 'deep';
    }).length;

    if (deepFocusCount > 3) {
      result.push({
        type: 'energy-imbalance',
        message: `${deepFocusCount} deep focus tasks in Today — consider balancing with lighter work`,
        columnId: 'today',
      });
    }

    // Soft limit warnings
    for (const config of COLUMN_CONFIGS) {
      if (config.warnAt && columns[config.id].count >= config.warnAt) {
        result.push({
          type: 'overload',
          message: `${config.label} is approaching capacity (${columns[config.id].count}/${config.limit})`,
          columnId: config.id,
        });
      }
    }

    return result;
  }, [columns]);

  const getColumnConfig = useCallback((column: TimeColumn) => {
    return COLUMN_CONFIGS.find(c => c.id === column)!;
  }, []);

  return {
    isActive,
    enterPlanningMode,
    exitPlanningMode,
    columns,
    moveTask,
    reorderInColumn,
    warnings,
    exitSummary,
    canAddToColumn,
    getColumnConfig,
    laterExpanded,
    setLaterExpanded,
  };
}
