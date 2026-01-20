'use client';

import { useState, forwardRef, KeyboardEvent } from 'react';

interface AddTaskInputProps {
  onAdd: (title: string) => void;
}

export const AddTaskInput = forwardRef<HTMLInputElement, AddTaskInputProps>(
  function AddTaskInput({ onAdd }, ref) {
    const [value, setValue] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && value.trim()) {
        onAdd(value.trim());
        setValue('');
      }
    };

    return (
      <div className="mb-6">
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add task..."
          className="h-12 w-full rounded-lg border border-surface-border bg-card px-4 text-foreground placeholder:text-muted-foreground/60 transition-colors duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background"
        />
      </div>
    );
  }
);
