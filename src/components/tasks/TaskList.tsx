'use client';

import { Task } from '@/types/task';
import { TaskRow } from './TaskRow';

interface TaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskComplete: (id: string) => void;
  emptyMessage?: string;
}

export function TaskList({
  tasks,
  onTaskClick,
  onTaskComplete,
  emptyMessage = 'No tasks',
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          onClick={() => onTaskClick(task)}
          onComplete={onTaskComplete}
        />
      ))}
    </div>
  );
}
