import { useMemo, useState, useEffect } from 'react';
import { Task } from '@/types/task';

interface UseOverwhelmModeOptions {
  incompleteTasks: Task[];
}

interface UseOverwhelmModeReturn {
  isOverwhelmed: boolean;
  visibleCount: number;
  hiddenCount: number;
  overwhelmMessage: string | null;
  isTransitioning: boolean;
}

const OVERWHELM_THRESHOLD = 15;
const EXIT_THRESHOLD = 10;
const OVERWHELM_VISIBLE_COUNT = 3;
const DEFAULT_VISIBLE_COUNT = 5;

/**
 * Detect overwhelm state and manage visibility limits
 * Trigger: >15 incomplete tasks
 * Exit: <10 incomplete tasks
 * Includes transition state for smooth exit animation
 */
export function useOverwhelmMode({
  incompleteTasks,
}: UseOverwhelmModeOptions): UseOverwhelmModeReturn {
  const taskCount = incompleteTasks.length;
  const [wasOverwhelmed, setWasOverwhelmed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isOverwhelmed = useMemo(() => {
    // Hysteresis: trigger at >15, exit at <10
    if (taskCount > OVERWHELM_THRESHOLD) {
      return true;
    }
    if (taskCount < EXIT_THRESHOLD) {
      return false;
    }
    // In the hysteresis zone, maintain previous state
    return wasOverwhelmed;
  }, [taskCount, wasOverwhelmed]);

  // Track overwhelm state changes for transition animation
  useEffect(() => {
    if (wasOverwhelmed && !isOverwhelmed) {
      // Exiting overwhelm mode - trigger transition
      setIsTransitioning(true);
      const timer = setTimeout(() => setIsTransitioning(false), 400);
      return () => clearTimeout(timer);
    }
    setWasOverwhelmed(isOverwhelmed);
  }, [isOverwhelmed, wasOverwhelmed]);

  const visibleCount = useMemo(() => {
    return isOverwhelmed ? OVERWHELM_VISIBLE_COUNT : DEFAULT_VISIBLE_COUNT;
  }, [isOverwhelmed]);

  const hiddenCount = useMemo(() => {
    return Math.max(0, taskCount - visibleCount);
  }, [taskCount, visibleCount]);

  const overwhelmMessage = useMemo(() => {
    if (isOverwhelmed) {
      return "You're tracking a lot. Let's focus on these three.";
    }
    return null;
  }, [isOverwhelmed]);

  return {
    isOverwhelmed,
    visibleCount,
    hiddenCount,
    overwhelmMessage,
    isTransitioning,
  };
}
