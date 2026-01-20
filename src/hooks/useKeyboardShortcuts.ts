import { useEffect, RefObject } from 'react';

interface UseKeyboardShortcutsOptions {
  inputRef?: RefObject<HTMLInputElement>;
  onFocusInput?: () => void;
}

export function useKeyboardShortcuts({ inputRef, onFocusInput }: UseKeyboardShortcutsOptions = {}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + N -> focus add task input
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        if (inputRef?.current) {
          inputRef.current.focus();
        }
        onFocusInput?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [inputRef, onFocusInput]);
}
