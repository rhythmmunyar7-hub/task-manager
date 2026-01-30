import { useState, useEffect, useCallback, useRef } from 'react';
import { Task } from '@/types/task';

interface UseKeyboardNavigationOptions {
  tasks: Task[];
  onTaskSelect: (task: Task) => void;
  onTaskComplete: (taskId: string) => void;
  onDismiss: () => void;
  isEnabled?: boolean;
}

interface UseKeyboardNavigationReturn {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  selectedTaskId: string | null;
  isKeyboardActive: boolean;
}

/**
 * Full keyboard navigation for task execution:
 * - J/K: Move selection up/down
 * - Enter: Open task detail
 * - Space or X: Complete task
 * - Escape: Dismiss/collapse
 */
export function useKeyboardNavigation({
  tasks,
  onTaskSelect,
  onTaskComplete,
  onDismiss,
  isEnabled = true,
}: UseKeyboardNavigationOptions): UseKeyboardNavigationReturn {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const lastInteractionRef = useRef<'keyboard' | 'mouse'>('mouse');

  // Reset selection when tasks change
  useEffect(() => {
    if (selectedIndex >= tasks.length) {
      setSelectedIndex(Math.max(0, tasks.length - 1));
    }
  }, [tasks.length, selectedIndex]);

  const selectedTaskId = tasks[selectedIndex]?.id || null;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isEnabled) return;

      // Don't interfere with input fields
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Only allow Escape in inputs
        if (e.key === 'Escape') {
          target.blur();
          e.preventDefault();
        }
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'j':
          // Move down
          e.preventDefault();
          setIsKeyboardActive(true);
          lastInteractionRef.current = 'keyboard';
          setSelectedIndex((prev) => Math.min(prev + 1, tasks.length - 1));
          break;

        case 'k':
          // Move up
          e.preventDefault();
          setIsKeyboardActive(true);
          lastInteractionRef.current = 'keyboard';
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;

        case 'enter':
          // Open task detail
          e.preventDefault();
          if (tasks[selectedIndex]) {
            onTaskSelect(tasks[selectedIndex]);
          }
          break;

        case ' ':
        case 'x':
          // Complete task (Space or X)
          e.preventDefault();
          if (tasks[selectedIndex] && isKeyboardActive) {
            onTaskComplete(tasks[selectedIndex].id);
          }
          break;

        case 'escape':
          // Dismiss/collapse
          e.preventDefault();
          setIsKeyboardActive(false);
          onDismiss();
          break;

        default:
          break;
      }
    },
    [isEnabled, tasks, selectedIndex, onTaskSelect, onTaskComplete, onDismiss, isKeyboardActive]
  );

  // Deactivate keyboard mode on mouse click
  const handleMouseDown = useCallback(() => {
    if (lastInteractionRef.current === 'keyboard') {
      lastInteractionRef.current = 'mouse';
      setIsKeyboardActive(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [handleKeyDown, handleMouseDown]);

  return {
    selectedIndex,
    setSelectedIndex,
    selectedTaskId,
    isKeyboardActive,
  };
}
