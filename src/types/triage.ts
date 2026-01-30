'use client';

import { Task } from './task';

export type TriageDestination = 'today' | 'next3days' | 'thisweek';

export interface TriageDecision {
  taskId: string;
  action: 'keep' | 'later' | 'archive';
  destination?: TriageDestination;
}

export interface TriageState {
  isActive: boolean;
  tasks: Task[];
  currentIndex: number;
  reviewedCount: number;
  decisions: TriageDecision[];
}

export interface TriageHelperText {
  primary: string;
  secondary?: string;
}

export const TRIAGE_DESTINATIONS: { value: TriageDestination; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'next3days', label: 'Next 3 Days' },
  { value: 'thisweek', label: 'This Week' },
];
