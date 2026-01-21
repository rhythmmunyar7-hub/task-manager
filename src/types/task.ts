export interface Project {
  id: string;
  name: string;
  color: 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'yellow';
}

export type TaskPriority = 'p1' | 'p2' | 'p3' | 'none';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: TaskPriority;
  project?: Project;
  dueDate?: string; // ISO date string or 'today', 'overdue'
  notes?: string;
  subtasks?: Subtask[];
  createdAt: string;
  completedAt?: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export type TaskView = 'today' | 'inbox' | 'all';

export type TaskFilter = 'all' | 'active' | 'completed';
