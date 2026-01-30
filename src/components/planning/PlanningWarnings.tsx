'use client';

import { AlertTriangle, Zap, GitBranch, Clock } from 'lucide-react';
import { PlanningWarning } from '@/types/planning';
import { cn } from '@/lib/utils';

interface PlanningWarningsProps {
  warnings: PlanningWarning[];
}

const warningIcons = {
  'overload': Clock,
  'energy-imbalance': Zap,
  'dependency-conflict': GitBranch,
  'deadline-risk': AlertTriangle,
};

/**
 * AI warnings display for Planning Mode
 * Protective, not corrective — suggestive, not prescriptive
 */
export function PlanningWarnings({ warnings }: PlanningWarningsProps) {
  if (warnings.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {warnings.map((warning, index) => {
        const Icon = warningIcons[warning.type];
        
        return (
          <div
            key={`${warning.type}-${index}`}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg',
              'bg-capella-warning/10 text-capella-warning',
              'text-[12px]'
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span>{warning.message}</span>
          </div>
        );
      })}
    </div>
  );
}
