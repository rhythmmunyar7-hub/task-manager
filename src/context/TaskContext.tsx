'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Task, Project } from '@/types/task';

// Mock projects
const mockProjects: Project[] = [
  { id: 'work', name: 'Work', color: 'blue' },
  { id: 'personal', name: 'Personal', color: 'purple' },
  { id: 'health', name: 'Health', color: 'green' },
];

// Mock tasks
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Review Q1 financial reports',
    completed: false,
    project: mockProjects[0],
    dueDate: 'today',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Update portfolio website',
    completed: false,
    project: mockProjects[1],
    dueDate: '2026-01-22',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Call dentist for appointment',
    completed: false,
    dueDate: 'overdue',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Draft client proposal',
    completed: true,
    project: mockProjects[0],
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Research new productivity tools',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Schedule team sync meeting',
    completed: false,
    project: mockProjects[0],
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    title: 'Buy groceries',
    completed: false,
    project: mockProjects[1],
    dueDate: 'today',
    createdAt: new Date().toISOString(),
  },
];

interface TaskContextType {
  tasks: Task[];
  projects: Project[];
  selectedTask: Task | null;
  addTask: (title: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  selectTask: (task: Task | null) => void;
  getTodayTasks: () => Task[];
  getInboxTasks: () => Task[];
  getCompletedTasks: () => Task[];
  getUpcomingTasks: () => Task[];
  isRecentlyAdded: (id: string) => boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [recentlyAddedIds, setRecentlyAddedIds] = useState<Set<string>>(new Set());

  const addTask = useCallback((title: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    setRecentlyAddedIds((prev) => new Set(prev).add(newTask.id));
    setTimeout(() => setRecentlyAddedIds((prev) => { const next = new Set(prev); next.delete(newTask.id); return next; }), 250);
    setTimeout(() => document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  }, []);

  const isRecentlyAdded = useCallback((id: string) => recentlyAddedIds.has(id), [recentlyAddedIds]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
    // Also update selectedTask if it's the one being edited
    setSelectedTask((prev) =>
      prev?.id === id ? { ...prev, ...updates } : prev
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    setSelectedTask((prev) => (prev?.id === id ? null : prev));
  }, []);

  const completeTask = useCallback((id: string) => {
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
  }, []);

  const selectTask = useCallback((task: Task | null) => {
    setSelectedTask(task);
  }, []);

  const getTodayTasks = useCallback(() => {
    return tasks.filter((task) => task.dueDate === 'today' && !task.completed);
  }, [tasks]);

  const getInboxTasks = useCallback(() => {
    return tasks.filter((task) => !task.dueDate && !task.completed);
  }, [tasks]);

  const getCompletedTasks = useCallback(() => {
    return tasks.filter((task) => task.completed);
  }, [tasks]);

  const getUpcomingTasks = useCallback(() => {
    return tasks.filter(
      (task) =>
        !task.completed &&
        task.dueDate &&
        task.dueDate !== 'today' &&
        task.dueDate !== 'overdue'
    );
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        projects: mockProjects,
        selectedTask,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        selectTask,
        getTodayTasks,
        getInboxTasks,
        getCompletedTasks,
        getUpcomingTasks,
        isRecentlyAdded,
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
