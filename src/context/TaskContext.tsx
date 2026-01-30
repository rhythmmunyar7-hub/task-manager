'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Task, Project, TaskPriority } from '@/types/task';
import { getTodayISO, getDateStatus } from '@/lib/date-utils';
import { addDays, format, startOfDay } from 'date-fns';

// Mock projects
const mockProjects: Project[] = [
  { id: 'work', name: 'Work', color: 'blue' },
  { id: 'personal', name: 'Personal', color: 'purple' },
  { id: 'health', name: 'Health', color: 'green' },
];

// Helper to create dates relative to today
const today = startOfDay(new Date());
const todayISO = format(today, 'yyyy-MM-dd');
const yesterdayISO = format(addDays(today, -1), 'yyyy-MM-dd');
const twoDaysAgoISO = format(addDays(today, -2), 'yyyy-MM-dd');
const tomorrowISO = format(addDays(today, 1), 'yyyy-MM-dd');
const nextWeekISO = format(addDays(today, 7), 'yyyy-MM-dd');

// Mock tasks with proper ISO dates
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Review Q1 financial reports',
    completed: false,
    priority: 'p1',
    project: mockProjects[0],
    dueDate: todayISO,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Update portfolio website',
    completed: false,
    priority: 'p2',
    project: mockProjects[1],
    dueDate: nextWeekISO,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Call dentist for appointment',
    completed: false,
    priority: 'p1',
    dueDate: twoDaysAgoISO, // Overdue
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Draft client proposal',
    completed: true,
    priority: 'none',
    project: mockProjects[0],
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Research new productivity tools',
    completed: false,
    priority: 'p3',
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Schedule team sync meeting',
    completed: false,
    priority: 'p2',
    project: mockProjects[0],
    dueDate: tomorrowISO,
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    title: 'Buy groceries',
    completed: false,
    priority: 'none',
    project: mockProjects[1],
    dueDate: todayISO,
    createdAt: new Date().toISOString(),
  },
];

interface TaskContextType {
  tasks: Task[];
  projects: Project[];
  selectedTask: Task | null;
  selectedTaskIndex: number;
  isAddTaskOpen: boolean;
  showMomentumMessage: boolean;
  lastCompletedTaskId: string | null;
  suggestionDismissedThisSession: boolean;
  sprintSelectedTasks: Task[];
  addTask: (title: string, priority?: TaskPriority, projectId?: string, dueDate?: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  selectTask: (task: Task | null) => void;
  setSelectedTaskIndex: (index: number) => void;
  openAddTask: () => void;
  closeAddTask: () => void;
  dismissMomentumMessage: () => void;
  dismissSuggestion: () => void;
  toggleSprintTask: (task: Task) => void;
  clearSprintTasks: () => void;
  removeSprintTask: (taskId: string) => void;
  getTodayTasks: () => Task[];
  getInboxTasks: () => Task[];
  getCompletedTasks: () => Task[];
  getUpcomingTasks: () => Task[];
  getOverdueTasks: () => Task[];
  getIncompleteTasks: () => Task[];
  isRecentlyAdded: (id: string) => boolean;
  isSprintSelected: (id: string) => boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number>(-1);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [recentlyAddedIds, setRecentlyAddedIds] = useState<Set<string>>(new Set());
  
  // Momentum state
  const [showMomentumMessage, setShowMomentumMessage] = useState(false);
  const [lastCompletedTaskId, setLastCompletedTaskId] = useState<string | null>(null);
  const [suggestionDismissedThisSession, setSuggestionDismissedThisSession] = useState(false);
  
  // Focus Sprint selection state
  const [sprintSelectedTasks, setSprintSelectedTasks] = useState<Task[]>([]);

  const addTask = useCallback((
    title: string, 
    priority: TaskPriority = 'none',
    projectId?: string,
    dueDate?: string
  ) => {
    const project = projectId ? mockProjects.find(p => p.id === projectId) : undefined;
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      priority,
      project,
      dueDate,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    setRecentlyAddedIds((prev) => new Set(prev).add(newTask.id));
    setTimeout(() => setRecentlyAddedIds((prev) => { 
      const next = new Set(prev); 
      next.delete(newTask.id); 
      return next; 
    }), 250);
    setTimeout(() => document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  }, []);

  const isRecentlyAdded = useCallback((id: string) => recentlyAddedIds.has(id), [recentlyAddedIds]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
    setSelectedTask((prev) =>
      prev?.id === id ? { ...prev, ...updates } : prev
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    setSelectedTask((prev) => (prev?.id === id ? null : prev));
  }, []);

  const completeTask = useCallback((id: string) => {
    const task = tasks.find(t => t.id === id);
    const wasIncomplete = task && !task.completed;
    
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : undefined,
            }
          : task
      )
    );
    
    // Trigger momentum message after completing a task
    if (wasIncomplete) {
      setLastCompletedTaskId(id);
      // Delay momentum message to allow completion animation
      setTimeout(() => {
        setShowMomentumMessage(true);
      }, 600);
    }
  }, [tasks]);

  const selectTask = useCallback((task: Task | null) => {
    setSelectedTask(task);
  }, []);

  const dismissMomentumMessage = useCallback(() => {
    setShowMomentumMessage(false);
  }, []);

  const dismissSuggestion = useCallback(() => {
    setSuggestionDismissedThisSession(true);
    setShowMomentumMessage(false);
  }, []);

  // Sprint task selection
  const toggleSprintTask = useCallback((task: Task) => {
    setSprintSelectedTasks(prev => {
      const exists = prev.find(t => t.id === task.id);
      if (exists) {
        return prev.filter(t => t.id !== task.id);
      }
      // Max 3 tasks
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, task];
    });
  }, []);

  const clearSprintTasks = useCallback(() => {
    setSprintSelectedTasks([]);
  }, []);

  const removeSprintTask = useCallback((taskId: string) => {
    setSprintSelectedTasks(prev => prev.filter(t => t.id !== taskId));
  }, []);

  const isSprintSelected = useCallback((id: string) => {
    return sprintSelectedTasks.some(t => t.id === id);
    setShowMomentumMessage(false);
  }, []);

  const openAddTask = useCallback(() => {
    setIsAddTaskOpen(true);
  }, []);

  const closeAddTask = useCallback(() => {
    setIsAddTaskOpen(false);
  }, []);

  // Use date-utils for proper status detection
  const getTodayTasks = useCallback(() => {
    return tasks.filter((task) => !task.completed && getDateStatus(task.dueDate) === 'today');
  }, [tasks]);

  const getInboxTasks = useCallback(() => {
    return tasks.filter((task) => !task.dueDate && !task.completed);
  }, [tasks]);

  const getCompletedTasks = useCallback(() => {
    return tasks.filter((task) => task.completed);
  }, [tasks]);

  const getUpcomingTasks = useCallback(() => {
    return tasks.filter((task) => {
      if (task.completed || !task.dueDate) return false;
      const status = getDateStatus(task.dueDate);
      return status === 'tomorrow' || status === 'upcoming' || status === 'future';
    });
  }, [tasks]);

  const getOverdueTasks = useCallback(() => {
    return tasks.filter((task) => !task.completed && getDateStatus(task.dueDate) === 'overdue');
  }, [tasks]);

  const getIncompleteTasks = useCallback(() => {
    return tasks.filter((task) => !task.completed);
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        projects: mockProjects,
        selectedTask,
        selectedTaskIndex,
        isAddTaskOpen,
        showMomentumMessage,
        lastCompletedTaskId,
        suggestionDismissedThisSession,
        sprintSelectedTasks,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        selectTask,
        setSelectedTaskIndex,
        openAddTask,
        closeAddTask,
        dismissMomentumMessage,
        dismissSuggestion,
        toggleSprintTask,
        clearSprintTasks,
        removeSprintTask,
        getTodayTasks,
        getInboxTasks,
        getCompletedTasks,
        getUpcomingTasks,
        getOverdueTasks,
        getIncompleteTasks,
        isRecentlyAdded,
        isSprintSelected,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}
