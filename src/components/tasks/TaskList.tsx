'use client';

import { Task } from '@/types/task';
import { TaskRow } from './TaskRow';

interface TaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskComplete: (id: string) => void;
  emptyMessage?: string;
  selectedTaskId?: string | null;
}

export function TaskList({
  tasks,
  onTaskClick,
  onTaskComplete,
  emptyMessage = 'No tasks',
  selectedTaskId,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="py-8 text-center text-text-muted text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          onClick={() => onTaskClick(task)}
          onComplete={onTaskComplete}
          isSelected={selectedTaskId === task.id}
        />
      ))}
    </div>
  );
}
