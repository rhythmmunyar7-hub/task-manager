'use client';

import { useState, useRef, KeyboardEvent } from 'react';

interface AddTaskInputProps {
  onAdd: (title: string) => void;
  autoFocus?: boolean;
}

export function AddTaskInput({ onAdd, autoFocus = false }: AddTaskInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      onAdd(value.trim());
      setValue('');
      // Keep focus for batch capture mode
      inputRef.current?.focus();
    }
  };

  return (
    <div className="mb-6">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add task..."
        autoFocus={autoFocus}
        className="h-12 w-full rounded-lg border border-surface-border bg-card px-4 text-foreground placeholder:text-muted-foreground transition-colors duration-150 focus:border-primary focus:outline-none"
      />
    </div>
  );
}
