export interface Project {
  id: string;
  name: string;
  color: 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'yellow';
}

export type TaskPriority = 'p1' | 'p2' | 'p3' | 'none';

// Energy type for execution mode (auto-classified or user override)
export type EnergyType = 'deep' | 'quick' | 'admin';

// Work context for grouping (auto-classified)
export type WorkContext = 'client' | 'product' | 'admin' | 'personal' | 'general';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: TaskPriority;
  project?: Project;
  dueDate?: string; // ISO date string
  notes?: string;
  subtasks?: Subtask[];
  createdAt: string;
  completedAt?: string;
  // Execution mode fields (Phase 1)
  energyType?: EnergyType;  // Auto-classified or user override
  workContext?: WorkContext; // Auto-classified
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export type TaskView = 'today' | 'inbox' | 'all';

export type TaskFilter = 'all' | 'active' | 'completed';
