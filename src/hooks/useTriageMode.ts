'use client';

import { useState, useCallback, useMemo } from 'react';
import { Task } from '@/types/task';
import { TriageState, TriageDecision, TriageDestination, TriageHelperText } from '@/types/triage';
import { useTaskContext } from '@/context/TaskContext';
import { addDays, format, differenceInDays, parseISO } from 'date-fns';

const initialState: TriageState = {
  isActive: false,
  tasks: [],
  currentIndex: 0,
  reviewedCount: 0,
  decisions: [],
};

// Generate neutral, non-judgmental helper text
function generateHelperText(task: Task): TriageHelperText {
  const now = new Date();
  
  // Calculate age
  if (task.createdAt) {
    const created = parseISO(task.createdAt);
    const daysAgo = differenceInDays(now, created);
    
    if (daysAgo === 0) {
      return { primary: 'Created today' };
    } else if (daysAgo === 1) {
      return { primary: 'Created yesterday' };
    } else if (daysAgo < 7) {
      return { primary: `Created ${daysAgo} days ago` };
    } else if (daysAgo < 14) {
      return { primary: 'Created about a week ago' };
    } else if (daysAgo < 30) {
      return { primary: `Created ${Math.floor(daysAgo / 7)} weeks ago` };
    } else {
      return { primary: `Created ${Math.floor(daysAgo / 30)} month${Math.floor(daysAgo / 30) > 1 ? 's' : ''} ago` };
    }
  }
  
  // Fallback
  if (task.project) {
    return { primary: `Related to ${task.project.name}` };
  }
  
  return { primary: 'No schedule set' };
}

// Suggest a default destination based on task characteristics
function suggestDestination(task: Task): TriageDestination {
  // Quick wins default to Today
  if (task.energyType === 'quick') return 'today';
  
  // Admin tasks default to This Week
  if (task.energyType === 'admin') return 'thisweek';
  
  // Deep focus defaults to Next 3 Days
  if (task.energyType === 'deep') return 'next3days';
  
  // Default to This Week
  return 'thisweek';
}

export function useTriageMode() {
  const [state, setState] = useState<TriageState>(initialState);
  const [showExitMessage, setShowExitMessage] = useState(false);
  const { tasks, updateTask, deleteTask } = useTaskContext();

  // Get tasks eligible for triage (Later tasks without due dates or old tasks)
  const triageableTasks = useMemo(() => {
    return tasks.filter(task => {
      if (task.completed) return false;
      // Tasks without due dates (inbox/later)
      if (!task.dueDate) return true;
      // Could also include very old overdue tasks
      return false;
    });
  }, [tasks]);

  // Check if triage is available
  const canTriage = triageableTasks.length > 0;

  // Start triage mode
  const startTriage = useCallback(() => {
    if (triageableTasks.length === 0) return;
    
    setState({
      isActive: true,
      tasks: [...triageableTasks],
      currentIndex: 0,
      reviewedCount: 0,
      decisions: [],
    });
  }, [triageableTasks]);

  // Calculate due date based on destination
  const getDateForDestination = useCallback((destination: TriageDestination): string => {
    const today = new Date();
    switch (destination) {
      case 'today':
        return format(today, 'yyyy-MM-dd');
      case 'next3days':
        return format(addDays(today, 2), 'yyyy-MM-dd');
      case 'thisweek':
        return format(addDays(today, 6), 'yyyy-MM-dd');
      default:
        return format(today, 'yyyy-MM-dd');
    }
  }, []);

  // Make a decision on current task
  const makeDecision = useCallback((action: 'keep' | 'later' | 'archive', destination?: TriageDestination) => {
    setState(prev => {
      if (!prev.isActive || prev.currentIndex >= prev.tasks.length) {
        return prev;
      }

      const currentTask = prev.tasks[prev.currentIndex];
      const decision: TriageDecision = { taskId: currentTask.id, action, destination };
      
      // Apply the decision
      if (action === 'keep' && destination) {
        const dueDate = getDateForDestination(destination);
        updateTask(currentTask.id, { dueDate });
      } else if (action === 'archive') {
        // Soft delete / archive (mark as completed with special flag)
        deleteTask(currentTask.id);
      }
      // 'later' action - no change needed

      const nextIndex = prev.currentIndex + 1;
      const isComplete = nextIndex >= prev.tasks.length;

      if (isComplete) {
        // Show exit message briefly
        setShowExitMessage(true);
        setTimeout(() => {
          setShowExitMessage(false);
          setState(initialState);
        }, 2000);

        return {
          ...prev,
          currentIndex: nextIndex,
          reviewedCount: prev.reviewedCount + 1,
          decisions: [...prev.decisions, decision],
        };
      }

      return {
        ...prev,
        currentIndex: nextIndex,
        reviewedCount: prev.reviewedCount + 1,
        decisions: [...prev.decisions, decision],
      };
    });
  }, [updateTask, deleteTask, getDateForDestination]);

  // Keep task (move to destination)
  const keepTask = useCallback((destination: TriageDestination = 'thisweek') => {
    makeDecision('keep', destination);
  }, [makeDecision]);

  // Keep task in Later
  const laterTask = useCallback(() => {
    makeDecision('later');
  }, [makeDecision]);

  // Archive task
  const archiveTask = useCallback(() => {
    makeDecision('archive');
  }, [makeDecision]);

  // End triage early
  const endTriage = useCallback(() => {
    if (state.reviewedCount > 0) {
      setShowExitMessage(true);
      setTimeout(() => {
        setShowExitMessage(false);
        setState(initialState);
      }, 2000);
    } else {
      setState(initialState);
    }
  }, [state.reviewedCount]);

  // Dismiss exit message
  const dismissExitMessage = useCallback(() => {
    setShowExitMessage(false);
    setState(initialState);
  }, []);

  // Current task
  const currentTask = state.isActive && state.currentIndex < state.tasks.length
    ? state.tasks[state.currentIndex]
    : null;

  // Helper text for current task
  const helperText = currentTask ? generateHelperText(currentTask) : null;

  // Suggested destination for Keep
  const suggestedDestination = currentTask ? suggestDestination(currentTask) : 'thisweek';

  // Progress
  const totalTasks = state.tasks.length;
  const isComplete = state.currentIndex >= totalTasks && totalTasks > 0;

  return {
    // State
    isActive: state.isActive,
    currentTask,
    helperText,
    suggestedDestination,
    reviewedCount: state.reviewedCount,
    totalTasks,
    isComplete,
    canTriage,
    triageableCount: triageableTasks.length,
    showExitMessage,

    // Actions
    startTriage,
    keepTask,
    laterTask,
    archiveTask,
    endTriage,
    dismissExitMessage,
  };
}
