'use client';

import { Task } from './task';

export interface FocusSprintState {
  isActive: boolean;
  tasks: Task[];
  currentTaskIndex: number;
  completedTaskIds: Set<string>;
  timerEnabled: boolean;
  timerDuration: 25 | 50; // minutes
  timerRemaining: number | null; // seconds
  timerPaused: boolean;
  startedAt: Date | null;
}

export interface FocusSprintActions {
  startSprint: (tasks: Task[], timerDuration?: 25 | 50 | null) => void;
  endSprint: () => void;
  completeCurrentTask: () => void;
  toggleTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  hideTimer: () => void;
}

export interface FocusSprintSummary {
  totalTasks: number;
  completedTasks: number;
  wasCompleted: boolean;
}

export const FOCUS_SPRINT_MAX_TASKS = 3;
export const FOCUS_SPRINT_TIMER_OPTIONS = [25, 50] as const;
