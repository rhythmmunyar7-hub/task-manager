'use client';

import { useState } from 'react';
import { Check, Clock, Archive, ChevronDown } from 'lucide-react';
import { TriageDestination, TRIAGE_DESTINATIONS } from '@/types/triage';
import { cn } from '@/lib/utils';

interface TriageDecisionsProps {
  suggestedDestination: TriageDestination;
  onKeep: (destination: TriageDestination) => void;
  onLater: () => void;
  onArchive: () => void;
}

export function TriageDecisions({
  suggestedDestination,
  onKeep,
  onLater,
  onArchive,
}: TriageDecisionsProps) {
  const [showDestinations, setShowDestinations] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<TriageDestination>(suggestedDestination);

  const handleKeep = () => {
    onKeep(selectedDestination);
  };

  const handleSelectDestination = (dest: TriageDestination) => {
    setSelectedDestination(dest);
    setShowDestinations(false);
    onKeep(dest);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-12">
      {/* Decision Buttons */}
      <div className="flex items-stretch gap-3">
        {/* Archive - Left */}
        <button
          onClick={onArchive}
          className={cn(
            'flex-1 flex flex-col items-center justify-center gap-2 py-5 px-4 rounded-xl',
            'bg-white/[0.02] border border-white/[0.04]',
            'text-text-muted hover:text-text-secondary',
            'hover:bg-white/[0.04] hover:border-white/[0.08]',
            'transition-all duration-150'
          )}
        >
          <Archive className="h-5 w-5" strokeWidth={1.5} />
          <span className="text-[13px] font-medium">Archive</span>
          <span className="text-[11px] text-text-muted opacity-50">←</span>
        </button>

        {/* Keep - Center (Primary) */}
        <div className="flex-[1.5] flex flex-col">
          <button
            onClick={handleKeep}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-2 py-5 px-4 rounded-t-xl',
              'bg-capella-primary/10 border border-capella-primary/20',
              'text-capella-primary',
              'hover:bg-capella-primary/15',
              'transition-all duration-150',
              showDestinations && 'rounded-b-none'
            )}
          >
            <Check className="h-5 w-5" strokeWidth={2} />
            <span className="text-[13px] font-medium">Keep</span>
            <span className="text-[11px] opacity-70">→</span>
          </button>
          
          {/* Destination Selector */}
          <button
            onClick={() => setShowDestinations(!showDestinations)}
            className={cn(
              'flex items-center justify-center gap-1.5 py-2 px-4 rounded-b-xl',
              'bg-capella-primary/5 border-x border-b border-capella-primary/20',
              'text-[12px] text-capella-primary/70',
              'hover:text-capella-primary',
              'transition-all duration-150'
            )}
          >
            <span>{TRIAGE_DESTINATIONS.find(d => d.value === selectedDestination)?.label}</span>
            <ChevronDown className={cn(
              'h-3 w-3 transition-transform duration-150',
              showDestinations && 'rotate-180'
            )} />
          </button>

          {/* Destination Dropdown */}
          {showDestinations && (
            <div className={cn(
              'mt-1 rounded-lg overflow-hidden',
              'bg-bg-elevated border border-white/[0.08]',
              'animate-in fade-in slide-in-from-top-2 duration-150'
            )}>
              {TRIAGE_DESTINATIONS.map(dest => (
                <button
                  key={dest.value}
                  onClick={() => handleSelectDestination(dest.value)}
                  className={cn(
                    'w-full px-4 py-2.5 text-left text-[13px]',
                    'transition-colors duration-100',
                    dest.value === selectedDestination
                      ? 'bg-capella-primary/10 text-capella-primary'
                      : 'text-text-secondary hover:bg-white/[0.04]'
                  )}
                >
                  {dest.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Later - Right */}
        <button
          onClick={onLater}
          className={cn(
            'flex-1 flex flex-col items-center justify-center gap-2 py-5 px-4 rounded-xl',
            'bg-white/[0.02] border border-white/[0.04]',
            'text-text-muted hover:text-text-secondary',
            'hover:bg-white/[0.04] hover:border-white/[0.08]',
            'transition-all duration-150'
          )}
        >
          <Clock className="h-5 w-5" strokeWidth={1.5} />
          <span className="text-[13px] font-medium">Later</span>
          <span className="text-[11px] text-text-muted opacity-50">↓</span>
        </button>
      </div>

      {/* Keyboard hints */}
      <p className="text-center mt-6 text-[12px] text-text-muted">
        Use arrow keys: <span className="opacity-70">← Archive</span> · <span className="opacity-70">→ Keep</span> · <span className="opacity-70">↓ Later</span>
      </p>
    </div>
  );
}
