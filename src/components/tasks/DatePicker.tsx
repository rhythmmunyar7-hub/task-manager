'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, Sun, Sunrise, CalendarDays, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { getTodayISO, getTomorrowISO, getNextWeekISO, getDateStatus, getDateDisplayText } from '@/lib/date-utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

interface DatePickerProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  className?: string;
}

export function DatePicker({ value, onChange, className }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const status = getDateStatus(value);
  const displayText = getDateDisplayText(value);
  
  const handleQuickSelect = (newValue: string) => {
    onChange(newValue);
    setIsOpen(false);
  };
  
  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      onChange(format(date, 'yyyy-MM-dd'));
      setIsOpen(false);
    }
  };
  
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
    setIsOpen(false);
  };
  
  // Parse current value for calendar
  const selectedDate = value && value !== 'today' && value !== 'overdue' 
    ? (() => {
        try {
          const d = parseISO(value);
          return isNaN(d.getTime()) ? undefined : d;
        } catch {
          return undefined;
        }
      })()
    : value === 'today' 
      ? new Date()
      : undefined;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'group flex items-center gap-2 h-10 px-3 rounded-md text-[15px]',
            'bg-bg-input border border-capella-border-subtle',
            'transition-colors duration-150',
            'focus:border-capella-primary focus:outline-none focus:ring-2 focus:ring-capella-primary/20',
            'hover:border-capella-border',
            !value && 'text-text-muted',
            value && 'text-text-primary',
            className
          )}
        >
          <CalendarIcon className="h-4 w-4 text-text-muted shrink-0" />
          <span className="flex-1 text-left truncate">
            {displayText || 'Set due date'}
          </span>
          {value && (
            <button
              onClick={handleClear}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-bg-elevated transition-opacity"
              aria-label="Clear date"
            >
              <X className="h-3.5 w-3.5 text-text-muted" />
            </button>
          )}
        </button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-auto p-0 bg-bg-elevated border-capella-border shadow-xl" 
        align="start"
        sideOffset={4}
      >
        {/* Quick select options */}
        <div className="p-2 border-b border-capella-border-subtle">
          <QuickOption
            icon={Sun}
            label="Today"
            shortcut="t"
            isActive={status === 'today'}
            onClick={() => handleQuickSelect(getTodayISO())}
          />
          <QuickOption
            icon={Sunrise}
            label="Tomorrow"
            shortcut="m"
            isActive={status === 'tomorrow'}
            onClick={() => handleQuickSelect(getTomorrowISO())}
          />
          <QuickOption
            icon={CalendarDays}
            label="Next week"
            shortcut="w"
            isActive={false}
            onClick={() => handleQuickSelect(getNextWeekISO())}
          />
        </div>
        
        {/* Calendar */}
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleCalendarSelect}
          className="p-3 pointer-events-auto"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center text-text-primary",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: cn(
              "h-7 w-7 bg-transparent p-0 text-text-muted hover:text-text-primary",
              "hover:bg-bg-subtle rounded-md transition-colors"
            ),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-text-muted rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: cn(
              "h-9 w-9 text-center text-sm p-0 relative",
              "[&:has([aria-selected])]:bg-capella-primary/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
              "focus-within:relative focus-within:z-20"
            ),
            day: cn(
              "h-9 w-9 p-0 font-normal rounded-md transition-colors",
              "text-text-primary hover:bg-bg-subtle",
              "focus:outline-none focus:ring-2 focus:ring-capella-primary/30",
              "aria-selected:opacity-100"
            ),
            day_selected: "bg-capella-primary text-white hover:bg-capella-primary hover:text-white",
            day_today: "bg-bg-subtle text-text-primary",
            day_outside: "text-text-muted/50 opacity-50",
            day_disabled: "text-text-muted/30",
            day_hidden: "invisible",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

interface QuickOptionProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  shortcut: string;
  isActive: boolean;
  onClick: () => void;
}

function QuickOption({ icon: Icon, label, shortcut, isActive, onClick }: QuickOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 px-3 py-2 rounded-md text-[14px]',
        'transition-colors duration-100',
        isActive 
          ? 'bg-capella-primary/10 text-capella-primary' 
          : 'text-text-secondary hover:bg-bg-subtle hover:text-text-primary'
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1 text-left">{label}</span>
      <kbd className="text-[11px] text-text-muted/60 font-mono">{shortcut}</kbd>
    </button>
  );
}
