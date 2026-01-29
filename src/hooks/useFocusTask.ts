import { useMemo, useCallback, useRef, useEffect } from 'react';
import { Task } from '@/types/task';

interface UseFocusTaskOptions {
  overdueTasks: Task[];
  todayTasks: Task[];
  inboxTasks: Task[];
  allIncompleteTasks: Task[];
}

interface UseFocusTaskReturn {
  focusTask: Task | null;
  focusTaskSection: 'overdue' | 'today' | 'inbox' | null;
  getNextFocusTask: (excludeId?: string) => Task | null;
  getSuggestedNextTask: (currentTask: Task) => Task | null;
}

/**
 * Deterministic Focus Task selection:
 * 1. Overdue task (if exists)
 * 2. Today task (earliest added)
 * 3. Inbox task (first uncompleted)
 */
export function useFocusTask({
  overdueTasks,
  todayTasks,
  inboxTasks,
  allIncompleteTasks,
}: UseFocusTaskOptions): UseFocusTaskReturn {
  const previousFocusIdRef = useRef<string | null>(null);

  const focusTask = useMemo(() => {
    // Priority 1: Overdue
    if (overdueTasks.length > 0) {
      return overdueTasks[0];
    }
    // Priority 2: Today (earliest added)
    if (todayTasks.length > 0) {
      const sorted = [...todayTasks].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      return sorted[0];
    }
    // Priority 3: Inbox (first uncompleted)
    if (inboxTasks.length > 0) {
      return inboxTasks[0];
    }
    return null;
  }, [overdueTasks, todayTasks, inboxTasks]);

  const focusTaskSection = useMemo(() => {
    if (!focusTask) return null;
    if (overdueTasks.some((t) => t.id === focusTask.id)) return 'overdue';
    if (todayTasks.some((t) => t.id === focusTask.id)) return 'today';
    if (inboxTasks.some((t) => t.id === focusTask.id)) return 'inbox';
    return null;
  }, [focusTask, overdueTasks, todayTasks, inboxTasks]);

  // Track focus task changes for momentum
  useEffect(() => {
    if (focusTask) {
      previousFocusIdRef.current = focusTask.id;
    }
  }, [focusTask]);

  const getNextFocusTask = useCallback(
    (excludeId?: string): Task | null => {
      const candidates = allIncompleteTasks.filter((t) => t.id !== excludeId);
      
      // Same priority order
      const overdue = candidates.filter((t) => t.dueDate === 'overdue');
      if (overdue.length > 0) return overdue[0];

      const today = candidates.filter((t) => t.dueDate === 'today');
      if (today.length > 0) {
        const sorted = [...today].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        return sorted[0];
      }

      const inbox = candidates.filter((t) => !t.dueDate);
      if (inbox.length > 0) return inbox[0];

      return candidates[0] || null;
    },
    [allIncompleteTasks]
  );

  // Get a related task from the same section for suggestion
  const getSuggestedNextTask = useCallback(
    (currentTask: Task): Task | null => {
      let sectionTasks: Task[] = [];

      if (currentTask.dueDate === 'overdue') {
        sectionTasks = overdueTasks;
      } else if (currentTask.dueDate === 'today') {
        sectionTasks = todayTasks;
      } else if (!currentTask.dueDate) {
        sectionTasks = inboxTasks;
      }

      // Find next task in same section, excluding current
      const remaining = sectionTasks.filter(
        (t) => t.id !== currentTask.id && !t.completed
      );
      
      return remaining[0] || null;
    },
    [overdueTasks, todayTasks, inboxTasks]
  );

  return {
    focusTask,
    focusTaskSection,
    getNextFocusTask,
    getSuggestedNextTask,
  };
}
