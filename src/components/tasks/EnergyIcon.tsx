'use client';

import { Zap, Check, Settings } from 'lucide-react';
import { EnergyType } from '@/types/task';
import { cn } from '@/lib/utils';

interface EnergyIconProps {
  type: EnergyType;
  className?: string;
}

/**
 * Energy type indicator - icon only, neutral color
 * ⚡ Deep Focus - Zap icon
 * ✓ Quick Win - Check icon
 * ⚙ Admin - Settings icon
 */
export function EnergyIcon({ type, className }: EnergyIconProps) {
  const iconClass = cn(
    'h-3.5 w-3.5 text-text-muted/50',
    className
  );

  switch (type) {
    case 'deep':
      return <Zap className={iconClass} strokeWidth={1.5} />;
    case 'quick':
      return <Check className={iconClass} strokeWidth={2} />;
    case 'admin':
      return <Settings className={iconClass} strokeWidth={1.5} />;
    default:
      return null;
  }
}

/**
 * Get aria label for energy type
 */
export function getEnergyAriaLabel(type: EnergyType): string {
  const labels: Record<EnergyType, string> = {
    deep: 'Deep focus task',
    quick: 'Quick win task',
    admin: 'Admin task',
  };
  return labels[type];
}
