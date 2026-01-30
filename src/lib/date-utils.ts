'use client';

import { format, isToday, isTomorrow, isPast, isThisWeek, addDays, parseISO, startOfDay } from 'date-fns';

export type DateStatus = 'overdue' | 'today' | 'tomorrow' | 'upcoming' | 'future' | 'none';

/**
 * Normalize any date value to ISO string format (YYYY-MM-DD)
 * Handles legacy 'today', 'overdue' strings and converts them to actual dates
 */
export function normalizeDateValue(value: string | undefined): string | undefined {
  if (!value) return undefined;
  
  const today = startOfDay(new Date());
  
  // Handle legacy string values
  if (value === 'today') {
    return format(today, 'yyyy-MM-dd');
  }
  
  if (value === 'overdue') {
    // Overdue without specific date - use yesterday as placeholder
    return format(addDays(today, -1), 'yyyy-MM-dd');
  }
  
  // Already ISO format
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  
  // Try to parse as date
  try {
    const parsed = parseISO(value);
    if (!isNaN(parsed.getTime())) {
      return format(parsed, 'yyyy-MM-dd');
    }
  } catch {
    // Invalid date
  }
  
  return undefined;
}

/**
 * Get the semantic status of a due date for styling
 */
export function getDateStatus(dueDate: string | undefined): DateStatus {
  if (!dueDate) return 'none';
  
  // Handle legacy values first
  if (dueDate === 'today') return 'today';
  if (dueDate === 'overdue') return 'overdue';
  
  try {
    const date = parseISO(dueDate);
    const today = startOfDay(new Date());
    
    if (isNaN(date.getTime())) return 'none';
    
    // Check if date is in the past (not today)
    if (isPast(date) && !isToday(date)) {
      return 'overdue';
    }
    
    if (isToday(date)) {
      return 'today';
    }
    
    if (isTomorrow(date)) {
      return 'tomorrow';
    }
    
    if (isThisWeek(date, { weekStartsOn: 1 })) {
      return 'upcoming';
    }
    
    return 'future';
  } catch {
    return 'none';
  }
}

/**
 * Get human-readable display text for a due date
 */
export function getDateDisplayText(dueDate: string | undefined): string | null {
  if (!dueDate) return null;
  
  const status = getDateStatus(dueDate);
  
  switch (status) {
    case 'overdue':
      // Show how many days overdue
      if (dueDate !== 'overdue') {
        try {
          const date = parseISO(dueDate);
          const today = startOfDay(new Date());
          const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) return 'Yesterday';
          return `${diffDays}d ago`;
        } catch {
          return 'Overdue';
        }
      }
      return 'Overdue';
      
    case 'today':
      return 'Today';
      
    case 'tomorrow':
      return 'Tomorrow';
      
    case 'upcoming':
      // Show day name for this week
      try {
        const date = parseISO(dueDate);
        return format(date, 'EEE');
      } catch {
        return null;
      }
      
    case 'future':
      // Show abbreviated date
      try {
        const date = parseISO(dueDate);
        return format(date, 'MMM d');
      } catch {
        return null;
      }
      
    default:
      return null;
  }
}

/**
 * Get today's date in ISO format
 */
export function getTodayISO(): string {
  return format(startOfDay(new Date()), 'yyyy-MM-dd');
}

/**
 * Get tomorrow's date in ISO format
 */
export function getTomorrowISO(): string {
  return format(addDays(startOfDay(new Date()), 1), 'yyyy-MM-dd');
}

/**
 * Get next week's date in ISO format (7 days from now)
 */
export function getNextWeekISO(): string {
  return format(addDays(startOfDay(new Date()), 7), 'yyyy-MM-dd');
}

/**
 * Sort comparator for dates - handles legacy values safely
 */
export function compareDates(a: string | undefined, b: string | undefined): number {
  const statusA = getDateStatus(a);
  const statusB = getDateStatus(b);
  
  // Priority order: overdue > today > tomorrow > upcoming > future > none
  const priorityOrder: Record<DateStatus, number> = {
    overdue: 0,
    today: 1,
    tomorrow: 2,
    upcoming: 3,
    future: 4,
    none: 5,
  };
  
  const priorityDiff = priorityOrder[statusA] - priorityOrder[statusB];
  if (priorityDiff !== 0) return priorityDiff;
  
  // Same priority - sort by actual date
  const normalizedA = normalizeDateValue(a);
  const normalizedB = normalizeDateValue(b);
  
  if (!normalizedA && !normalizedB) return 0;
  if (!normalizedA) return 1;
  if (!normalizedB) return -1;
  
  return normalizedA.localeCompare(normalizedB);
}
