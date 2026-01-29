'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTaskContext } from '@/context/TaskContext';

interface QuickAddTaskProps {
  autoFocus?: boolean;
}

export function QuickAddTask({ autoFocus = false }: QuickAddTaskProps) {
  const { addTask } = useTaskContext();
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = () => {
    if (value.trim()) {
      addTask(value.trim());
      setValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setValue('');
      inputRef.current?.blur();
    }
  };

  return (
    <div 
      className={cn(
        'relative flex items-center gap-3 rounded-lg transition-all duration-200',
        'h-12 px-4 mb-6',
        isFocused 
          ? 'bg-white/[0.04] ring-1 ring-white/[0.08]' 
          : 'bg-transparent hover:bg-white/[0.02]'
      )}
    >
      {/* Icon */}
      <Plus 
        className={cn(
          'h-5 w-5 shrink-0 transition-colors duration-150',
          isFocused ? 'text-text-secondary' : 'text-text-muted/60'
        )} 
        strokeWidth={1.5}
      />

      {/* Input - Document-like, no heavy borders */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Add a task..."
        className={cn(
          'flex-1 bg-transparent text-[15px]',
          'text-text-primary placeholder:text-text-muted/50',
          'focus:outline-none'
        )}
      />

      {/* Submit hint - only when focused with content */}
      {isFocused && value.trim() && (
        <span className="text-[11px] text-text-muted/50 animate-fade-in">
          Press Enter
        </span>
      )}
    </div>
  );
}
