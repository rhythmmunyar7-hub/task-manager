'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Task } from '@/types/task';
import { 
  FocusSprintState, 
  FocusSprintSummary, 
  FOCUS_SPRINT_MAX_TASKS 
} from '@/types/focus-sprint';
import { useTaskContext } from '@/context/TaskContext';

const initialState: FocusSprintState = {
  isActive: false,
  tasks: [],
  currentTaskIndex: 0,
  completedTaskIds: new Set(),
  timerEnabled: false,
  timerDuration: 25,
  timerRemaining: null,
  timerPaused: false,
  startedAt: null,
};

export function useFocusSprint() {
  const [state, setState] = useState<FocusSprintState>(initialState);
  const [exitSummary, setExitSummary] = useState<FocusSprintSummary | null>(null);
  const timerRef = useRef<number | null>(null);
  const { completeTask: contextCompleteTask } = useTaskContext();

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (state.isActive && state.timerEnabled && !state.timerPaused && state.timerRemaining !== null) {
      timerRef.current = window.setInterval(() => {
        setState(prev => {
          if (prev.timerRemaining === null || prev.timerRemaining <= 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            return { ...prev, timerRemaining: 0 };
          }
          return { ...prev, timerRemaining: prev.timerRemaining - 1 };
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [state.isActive, state.timerEnabled, state.timerPaused, state.timerRemaining]);

  // Validate tasks before starting sprint
  const canStartSprint = useCallback((tasks: Task[]): { valid: boolean; message?: string } => {
    if (tasks.length === 0) {
      return { valid: false, message: 'Select at least one task to start a sprint.' };
    }
    if (tasks.length > FOCUS_SPRINT_MAX_TASKS) {
      return { valid: false, message: `Focus works best with ${FOCUS_SPRINT_MAX_TASKS} or fewer tasks.` };
    }
    const incompleteTasks = tasks.filter(t => !t.completed);
    if (incompleteTasks.length === 0) {
      return { valid: false, message: 'All selected tasks are already completed.' };
    }
    return { valid: true };
  }, []);

  // Start a focus sprint
  const startSprint = useCallback((tasks: Task[], timerDuration: 25 | 50 | null = null) => {
    const validation = canStartSprint(tasks);
    if (!validation.valid) {
      return validation;
    }

    const incompleteTasks = tasks.filter(t => !t.completed);
    
    setState({
      isActive: true,
      tasks: incompleteTasks,
      currentTaskIndex: 0,
      completedTaskIds: new Set(),
      timerEnabled: timerDuration !== null,
      timerDuration: timerDuration || 25,
      timerRemaining: timerDuration ? timerDuration * 60 : null,
      timerPaused: false,
      startedAt: new Date(),
    });

    return { valid: true };
  }, [canStartSprint]);

  // Complete current task and advance
  const completeCurrentTask = useCallback(() => {
    setState(prev => {
      if (!prev.isActive || prev.currentTaskIndex >= prev.tasks.length) {
        return prev;
      }

      const currentTask = prev.tasks[prev.currentTaskIndex];
      const newCompletedIds = new Set(prev.completedTaskIds);
      newCompletedIds.add(currentTask.id);

      // Complete in context
      contextCompleteTask(currentTask.id);

      const nextIndex = prev.currentTaskIndex + 1;
      const allComplete = nextIndex >= prev.tasks.length;

      if (allComplete) {
        // Auto-exit on completion
        const summary: FocusSprintSummary = {
          totalTasks: prev.tasks.length,
          completedTasks: newCompletedIds.size,
          wasCompleted: true,
        };
        
        // Schedule exit summary display
        setTimeout(() => {
          setExitSummary(summary);
        }, 400);

        // Clear timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }

        return initialState;
      }

      return {
        ...prev,
        currentTaskIndex: nextIndex,
        completedTaskIds: newCompletedIds,
      };
    });
  }, [contextCompleteTask]);

  // End sprint manually
  const endSprint = useCallback(() => {
    setState(prev => {
      const summary: FocusSprintSummary = {
        totalTasks: prev.tasks.length,
        completedTasks: prev.completedTaskIds.size,
        wasCompleted: prev.completedTaskIds.size === prev.tasks.length,
      };

      setExitSummary(summary);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      return initialState;
    });
  }, []);

  // Timer controls
  const toggleTimer = useCallback(() => {
    setState(prev => ({
      ...prev,
      timerEnabled: !prev.timerEnabled,
      timerRemaining: !prev.timerEnabled ? prev.timerDuration * 60 : null,
      timerPaused: false,
    }));
  }, []);

  const setTimerDuration = useCallback((duration: 25 | 50) => {
    setState(prev => ({
      ...prev,
      timerDuration: duration,
      timerRemaining: prev.timerEnabled ? duration * 60 : null,
    }));
  }, []);

  const pauseTimer = useCallback(() => {
    setState(prev => ({ ...prev, timerPaused: true }));
  }, []);

  const resumeTimer = useCallback(() => {
    setState(prev => ({ ...prev, timerPaused: false }));
  }, []);

  const hideTimer = useCallback(() => {
    setState(prev => ({
      ...prev,
      timerEnabled: false,
      timerRemaining: null,
    }));
  }, []);

  // Dismiss exit summary
  const dismissSummary = useCallback(() => {
    setExitSummary(null);
  }, []);

  // Get current task
  const currentTask = state.isActive && state.tasks[state.currentTaskIndex] 
    ? state.tasks[state.currentTaskIndex] 
    : null;

  // Get remaining tasks
  const remainingTasks = state.isActive 
    ? state.tasks.slice(state.currentTaskIndex + 1)
    : [];

  return {
    // State
    isActive: state.isActive,
    currentTask,
    remainingTasks,
    allTasks: state.tasks,
    completedCount: state.completedTaskIds.size,
    totalCount: state.tasks.length,
    timerEnabled: state.timerEnabled,
    timerDuration: state.timerDuration,
    timerRemaining: state.timerRemaining,
    timerPaused: state.timerPaused,
    exitSummary,

    // Actions
    canStartSprint,
    startSprint,
    endSprint,
    completeCurrentTask,
    toggleTimer,
    setTimerDuration,
    pauseTimer,
    resumeTimer,
    hideTimer,
    dismissSummary,
  };
}
